import axios from 'axios';
import { LocationInfo, PollutantValues } from '../types/index.js';
import { AirQualityProvider, ObservationRecord } from './baseProvider.js';
import { INDIAN_MONITORING_STATIONS } from '../data/indiaAdminData.js';

export class OpenAqAdapter implements AirQualityProvider {
  name = 'OPENAQ_v3_API';
  private baseUrl = process.env.OPENAQ_BASE_URL || 'https://api.openaq.org/v3';
  private apiKey = process.env.OPENAQ_API_KEY;

  async getCurrentObservation(locationId: string): Promise<ObservationRecord | null> {
    const station = INDIAN_MONITORING_STATIONS.find(s => s.id === locationId);
    const isNumericId = /^\d+$/.test(locationId);
    if (!station && !isNumericId) return null;

    const apiKey = this.apiKey || process.env.OPENAQ_API_KEY;
    if (!apiKey) {
      // OpenAQ v3 strictly requires an API key. Return null cleanly rather than fabricating demo data.
      return null;
    }

    try {
      let targetLocation: any = null;
      let openAqLocationId: number | string | null = null;

      // If locationId is directly a numeric OpenAQ location ID (or station.id is numeric)
      if (/^\d+$/.test(locationId)) {
        openAqLocationId = locationId;
        const locResponse = await axios.get(`${this.baseUrl}/locations/${openAqLocationId}`, {
          headers: { 'X-API-Key': apiKey },
          timeout: 5000
        });
        targetLocation = locResponse.data?.results?.[0];
      } else {
        if (!station) return null;
        // 1. Find nearby locations in OpenAQ v3 sorted by proximity
        const locResponse = await axios.get(`${this.baseUrl}/locations`, {
          params: {
            coordinates: `${station.latitude},${station.longitude}`,
            radius: 10000, // 10 km radius
            limit: 5
          },
          headers: {
            'X-API-Key': apiKey
          },
          timeout: 5000
        });

        const locations = locResponse.data?.results;
        if (!locations || !Array.isArray(locations) || locations.length === 0) {
          return null;
        }

        // Sort by distance ascending to select nearest physical location
        const sorted = [...locations].sort(
          (a, b) => (typeof a.distance === 'number' ? a.distance : 999999) - (typeof b.distance === 'number' ? b.distance : 999999)
        );

        targetLocation = sorted[0];
        openAqLocationId = targetLocation.id;
      }

      if (!targetLocation || !openAqLocationId) {
        return null;
      }

      // Build a lookup map of sensorId -> sensor info (parameter, units)
      const sensorMap = new Map<number, { name: string; units?: string }>();
      if (Array.isArray(targetLocation.sensors)) {
        for (const s of targetLocation.sensors) {
          if (s && s.id != null) {
            sensorMap.set(s.id, {
              name: s.parameter?.name?.toLowerCase() || '',
              units: s.parameter?.units?.toLowerCase()
            });
          }
        }
      }

      // 2. Query latest sensor measurements for this location in OpenAQ v3: GET /v3/locations/{location_id}/latest
      const latestResponse = await axios.get(`${this.baseUrl}/locations/${openAqLocationId}/latest`, {
        headers: {
          'X-API-Key': apiKey
        },
        timeout: 5000
      });

      const results = latestResponse.data?.results;
      if (!results || !Array.isArray(results) || results.length === 0) {
        return null;
      }

      // 3. Map OpenAQ parameters to AeroPulse pollutant fields ONLY when real measurement exists.
      // Missing pollutants MUST remain missing (undefined/null). Never substitute zero or demo values.
      const pollutants: PollutantValues = {};
      let latestIsoTimestamp: string | null = null;
      let latestEpoch = 0;

      for (const item of results) {
        if (!item || typeof item.value !== 'number' || isNaN(item.value) || item.value < 0) {
          continue;
        }

        // Determine parameter name and units either from item or from location sensor metadata
        const sensorInfo = item.sensorsId ? sensorMap.get(item.sensorsId) : undefined;
        const paramName = (item.parameter?.name || sensorInfo?.name || '').toLowerCase().trim();
        const paramUnit = (item.parameter?.units || item.unit || sensorInfo?.units || '').toLowerCase().trim();
        let val = item.value;

        // Extract measurement timestamp
        const itemDateStr = typeof item.datetime === 'object' && item.datetime !== null
          ? (item.datetime.utc || item.datetime.local)
          : (typeof item.datetime === 'string' ? item.datetime : null);

        if (itemDateStr) {
          const itemTime = new Date(itemDateStr).getTime();
          if (itemTime > latestEpoch) {
            latestEpoch = itemTime;
            latestIsoTimestamp = new Date(itemTime).toISOString();
          }
        }

        switch (paramName) {
          case 'pm25':
            pollutants.pm25 = Number(val.toFixed(2));
            break;
          case 'pm10':
            pollutants.pm10 = Number(val.toFixed(2));
            break;
          case 'no2':
            pollutants.no2 = Number(val.toFixed(2));
            break;
          case 'so2':
            pollutants.so2 = Number(val.toFixed(2));
            break;
          case 'co':
            // Indian standard for CO in CPCB is mg/m³
            if (paramUnit === 'ppm') {
              val = val * 1.145; // 1 ppm CO ≈ 1.145 mg/m³ at NTP
            } else if (paramUnit === 'ppb') {
              val = (val * 1.145) / 1000;
            } else if (paramUnit === 'µg/m³' || paramUnit === 'ug/m3') {
              val = val / 1000;
            }
            pollutants.co = Number(val.toFixed(2));
            break;
          case 'o3':
            pollutants.o3 = Number(val.toFixed(2));
            break;
          case 'nh3':
            pollutants.nh3 = Number(val.toFixed(2));
            break;
          case 'pb':
            pollutants.pb = Number(val.toFixed(2));
            break;
          default:
            // Other non-criteria parameters (relativehumidity, temperature, etc.) ignored
            break;
        }
      }

      // If no valid criteria pollutants were retrieved, return null
      const validValues = Object.values(pollutants).filter(
        (v): v is number => typeof v === 'number' && !isNaN(v) && v >= 0
      );
      if (validValues.length === 0) {
        return null;
      }

      const locationRecord: LocationInfo = station || {
        id: String(openAqLocationId),
        name: targetLocation.name || `OpenAQ Station ${openAqLocationId}`,
        city: targetLocation.locality || 'India',
        state: 'India',
        country: targetLocation.country?.code || 'IN',
        latitude: targetLocation.coordinates?.latitude || 0,
        longitude: targetLocation.coordinates?.longitude || 0
      };

      return {
        location: locationRecord,
        pollutants,
        timestamp: latestIsoTimestamp || new Date().toISOString(),
        source: 'OPENAQ_v3_TELEMETRY',
        isDemo: false,
        dataQualityScore: 0.95
      };
    } catch (error) {
      // In case of network failure, 401 unauthorized, or API errors, return null cleanly without fabricating demo data
      return null;
    }
  }

  async getHistoricalObservations(locationId: string, _hours: number = 24): Promise<ObservationRecord[]> {
    return [];
  }

  async getAllStations(): Promise<ObservationRecord[]> {
    return [];
  }
}
