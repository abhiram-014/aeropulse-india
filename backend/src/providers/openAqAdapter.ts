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
    if (!station) return null;

    if (!this.apiKey) {
      // OpenAQ v3 strictly requires an API key. If not provided, report null rather than fabricating
      return null;
    }

    try {
      // 1. Find nearby location in OpenAQ v3
      const locResponse = await axios.get(`${this.baseUrl}/locations`, {
        params: {
          coordinates: `${station.latitude},${station.longitude}`,
          radius: 10000, // 10 km
          limit: 1
        },
        headers: {
          'X-API-Key': this.apiKey
        },
        timeout: 4000
      });

      const locations = locResponse.data?.results;
      if (!locations || locations.length === 0) {
        return null;
      }

      const openAqLocationId = locations[0].id;

      // 2. Query latest sensor measurements for this location in v3
      const latestResponse = await axios.get(`${this.baseUrl}/locations/${openAqLocationId}/latest`, {
        headers: {
          'X-API-Key': this.apiKey
        },
        timeout: 4000
      });

      const results = latestResponse.data?.results || [];
      if (results.length === 0) {
        return null;
      }

      const pollutants: PollutantValues = {};
      let latestTimestamp = new Date().toISOString();

      for (const item of results) {
        const param = item.parameter?.name?.toLowerCase();
        let val = item.value;
        if (typeof val === 'number' && val >= 0) {
          if (param === 'pm25') pollutants.pm25 = val;
          else if (param === 'pm10') pollutants.pm10 = val;
          else if (param === 'no2') pollutants.no2 = val;
          else if (param === 'so2') pollutants.so2 = val;
          else if (param === 'co') {
            if (item.unit === 'ppm') val = val * 1.145;
            else if (item.unit === 'µg/m³') val = val / 1000;
            pollutants.co = Number(val.toFixed(2));
          } else if (param === 'o3') pollutants.o3 = val;
          if (item.datetime) latestTimestamp = item.datetime;
        }
      }

      const hasData = Object.values(pollutants).some(v => v !== null && v !== undefined);
      if (!hasData) return null;

      return {
        location: station,
        pollutants,
        timestamp: latestTimestamp,
        source: 'OPENAQ_v3_TELEMETRY',
        isDemo: false,
        dataQualityScore: 0.95
      };
    } catch (error) {
      // In case of network failure or 401 unauthorized, return null cleanly without fabricating
      return null;
    }
  }

  async getHistoricalObservations(locationId: string, _hours: number = 24): Promise<ObservationRecord[]> {
    // OpenAQ v3 historical retrieval per sensor
    return [];
  }

  async getAllStations(): Promise<ObservationRecord[]> {
    return [];
  }
}
