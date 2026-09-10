import axios from 'axios';
import { calculateIndianAQI } from '../aqi/indianAQI.js';
import { LocationInfo, OpenAqStationMetadata, PollutantValues } from '../types/index.js';
import { AirQualityProvider, ObservationRecord } from './baseProvider.js';
import { INDIA_STATES, INDIAN_MONITORING_STATIONS, MonitoringStationInfo } from '../data/indiaAdminData.js';
import { DailyObservation } from './realAtmosphericProvider.js';

export class OpenAqAdapter implements AirQualityProvider {
  name = 'OPENAQ_v3_API';
  private baseUrl = process.env.OPENAQ_BASE_URL || 'https://api.openaq.org/v3';
  private apiKey = process.env.OPENAQ_API_KEY;
  // Concurrency + rate limiting controls for OpenAQ HTTP requests
  private openAqConcurrency: number;
  private openAqRateLimitPerMin: number;
  private openAqMinIntervalMs: number;
  private openAqTimestamps: number[];
  private openAqInflight: number;

  constructor() {
    this.openAqConcurrency = parseInt(process.env.OPENAQ_CONCURRENCY || '4', 10);
    this.openAqRateLimitPerMin = parseInt(process.env.OPENAQ_RATE_LIMIT_PER_MIN || '60', 10);
    this.openAqMinIntervalMs = Math.floor(60000 / Math.max(1, this.openAqRateLimitPerMin));
    this.openAqTimestamps = [];
    this.openAqInflight = 0;
  }

  // Token-bucket style limiter: allow up to `openAqRateLimitPerMin` requests per sliding 60s window
  // and up to `openAqConcurrency` concurrent requests. This permits short bursts while staying
  // within OpenAQ's per-minute limit.
  private async scheduledGet(url: string, config?: any) {
    while (true) {
      const now = Date.now();
      // purge timestamps older than 60s
      while (this.openAqTimestamps.length > 0 && now - this.openAqTimestamps[0] >= 60000) {
        this.openAqTimestamps.shift();
      }

      if (this.openAqInflight < this.openAqConcurrency && this.openAqTimestamps.length < this.openAqRateLimitPerMin) {
        // allowed to send request
        this.openAqInflight += 1;
        this.openAqTimestamps.push(now);
        try {
          return await axios.get(url, config);
        } finally {
          this.openAqInflight = Math.max(0, this.openAqInflight - 1);
        }
      }

      // compute wait: if timestamps full, wait until oldest is outside 60s window; otherwise short backoff
      const wait = this.openAqTimestamps.length === 0 ? 50 : Math.max(50, 60000 - (now - this.openAqTimestamps[0]));
      await new Promise(r => setTimeout(r, wait));
    }
  }

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
        const locResponse = await this.scheduledGet(`${this.baseUrl}/locations/${openAqLocationId}`, {
          headers: { 'X-API-Key': apiKey },
          timeout: 5000
        });
        targetLocation = locResponse.data?.results?.[0];
      } else {
        if (!station) return null;
        // 1. Find nearby locations in OpenAQ v3 sorted by proximity
        const locResponse = await this.scheduledGet(`${this.baseUrl}/locations`, {
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
      const latestResponse = await this.scheduledGet(`${this.baseUrl}/locations/${openAqLocationId}/latest`, {
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
            // CPCB standard is µg/m³. Incompatible units (e.g. ppm, count) are ignored.
            if (paramUnit === 'µg/m³' || paramUnit === 'ug/m3' || paramUnit === 'µg/m3' || paramUnit === '') {
              pollutants.pm25 = Number(val.toFixed(2));
            }
            break;
          case 'pm10':
            // CPCB standard is µg/m³. Incompatible units are ignored.
            if (paramUnit === 'µg/m³' || paramUnit === 'ug/m3' || paramUnit === 'µg/m3' || paramUnit === '') {
              pollutants.pm10 = Number(val.toFixed(2));
            }
            break;
          case 'no2':
            // CPCB standard is µg/m³. Prefer mass concentration; convert ppb/ppm only if not already set.
            if (paramUnit === 'µg/m³' || paramUnit === 'ug/m3' || paramUnit === 'µg/m3') {
              pollutants.no2 = Number(val.toFixed(2));
            } else if (paramUnit === 'ppb' && pollutants.no2 === undefined) {
              pollutants.no2 = Number((val * 1.88).toFixed(2)); // 1 ppb NO2 ≈ 1.88 µg/m³ at NTP
            } else if (paramUnit === 'ppm' && pollutants.no2 === undefined) {
              pollutants.no2 = Number((val * 1880).toFixed(2));
            }
            break;
          case 'so2':
            // CPCB standard is µg/m³. Prefer mass concentration.
            if (paramUnit === 'µg/m³' || paramUnit === 'ug/m3' || paramUnit === 'µg/m3') {
              pollutants.so2 = Number(val.toFixed(2));
            } else if (paramUnit === 'ppb' && pollutants.so2 === undefined) {
              pollutants.so2 = Number((val * 2.62).toFixed(2)); // 1 ppb SO2 ≈ 2.62 µg/m³ at NTP
            } else if (paramUnit === 'ppm' && pollutants.so2 === undefined) {
              pollutants.so2 = Number((val * 2620).toFixed(2));
            }
            break;
          case 'co':
            // CPCB standard is mg/m³
            if (paramUnit === 'mg/m³' || paramUnit === 'mg/m3') {
              pollutants.co = Number(val.toFixed(2));
            } else if (paramUnit === 'ppm') {
              pollutants.co = Number((val * 1.145).toFixed(2)); // 1 ppm CO ≈ 1.145 mg/m³ at NTP
            } else if (paramUnit === 'ppb') {
              pollutants.co = Number(((val * 1.145) / 1000).toFixed(2));
            } else if (paramUnit === 'µg/m³' || paramUnit === 'ug/m3' || paramUnit === 'µg/m3') {
              pollutants.co = Number((val / 1000).toFixed(2));
            }
            break;
          case 'o3':
            // CPCB standard is µg/m³. Prefer mass concentration.
            if (paramUnit === 'µg/m³' || paramUnit === 'ug/m3' || paramUnit === 'µg/m3') {
              pollutants.o3 = Number(val.toFixed(2));
            } else if (paramUnit === 'ppb' && pollutants.o3 === undefined) {
              pollutants.o3 = Number((val * 1.96).toFixed(2)); // 1 ppb O3 ≈ 1.96 µg/m³ at NTP
            } else if (paramUnit === 'ppm' && pollutants.o3 === undefined) {
              pollutants.o3 = Number((val * 1960).toFixed(2));
            }
            break;
          case 'nh3':
            // CPCB standard is µg/m³
            if (paramUnit === 'µg/m³' || paramUnit === 'ug/m3' || paramUnit === 'µg/m3') {
              pollutants.nh3 = Number(val.toFixed(2));
            }
            break;
          case 'pb':
            // CPCB standard is µg/m³
            if (paramUnit === 'µg/m³' || paramUnit === 'ug/m3' || paramUnit === 'µg/m3') {
              pollutants.pb = Number(val.toFixed(2));
            }
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

      const lat = targetLocation.coordinates?.latitude ?? station?.latitude ?? 0;
      const lon = targetLocation.coordinates?.longitude ?? station?.longitude ?? 0;
      const matchingVerified = station || this.findMatchingVerifiedStation(lat, lon, targetLocation.name);

      const locationRecord: LocationInfo = {
        id: String(openAqLocationId),
        name: targetLocation.name || matchingVerified?.name || `OpenAQ Station ${openAqLocationId}`,
        city: targetLocation.locality || matchingVerified?.city || this.resolveCity(targetLocation.locality, targetLocation.name) || 'India',
        state: matchingVerified?.state || this.resolveState(targetLocation.name, targetLocation.owner?.name, targetLocation.locality) || 'India',
        district: matchingVerified?.district || null,
        country: targetLocation.country?.name || 'India',
        latitude: lat,
        longitude: lon
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

  // Retrieve historical measurements for a location and specific date (YYYY-MM-DD)
  // Retrieve historical measurements for a location and specific date (YYYY-MM-DD)
  // Implements real OpenAQ v3 sensor measurements endpoint. Aggregates measurements across all sensors belonging to the location.
  async getHistoricalMeasurements(locationId: string, date: string): Promise<PollutantValues | null> {
    const apiKey = this.apiKey || process.env.OPENAQ_API_KEY;
    if (!apiKey) return null;
    try {
      let targetLocation: any = null;
      let openAqLocationId: number | string | null = null;

      if (/^\d+$/.test(locationId)) {
        openAqLocationId = locationId;
        const locResponse = await this.scheduledGet(`${this.baseUrl}/locations/${openAqLocationId}`, {
          headers: { 'X-API-Key': apiKey },
          timeout: 5000
        });
        targetLocation = locResponse.data?.results?.[0];
      } else {
        const station = INDIAN_MONITORING_STATIONS.find(s => s.id === locationId);
        if (!station) return null;
        const locResponse = await this.scheduledGet(`${this.baseUrl}/locations`, {
          params: {
            coordinates: `${station.latitude},${station.longitude}`,
            radius: 10000,
            limit: 5
          },
          headers: { 'X-API-Key': apiKey },
          timeout: 5000
        });
        const locations = locResponse.data?.results;
        if (!locations || !Array.isArray(locations) || locations.length === 0) return null;
        const sorted = [...locations].sort(
          (a, b) => (typeof a.distance === 'number' ? a.distance : 999999) - (typeof b.distance === 'number' ? b.distance : 999999)
        );
        targetLocation = sorted[0];
        openAqLocationId = targetLocation.id;
      }

      if (!targetLocation || !openAqLocationId) return null;

      const from = new Date(`${date}T00:00:00+05:30`).toISOString();
      const to = new Date(`${date}T23:59:59+05:30`).toISOString();
      const pollutantsAgg: Record<string, { sum: number; count: number }> = {};

      const sensorIds: (number | string)[] = [];
      if (Array.isArray(targetLocation.sensors)) {
        for (const sensor of targetLocation.sensors) {
          if (sensor && sensor.id != null) sensorIds.push(sensor.id);
        }
      }
      if (sensorIds.length === 0) return null;

      for (const sensorId of sensorIds) {
        let page = 1;
        while (true) {
          const resp = await this.scheduledGet(`${this.baseUrl}/sensors/${sensorId}/measurements`, {
            params: {
              date_from: from,
              date_to: to,
              limit: 1000,
              page,
              sort: 'desc'
            },
            headers: { 'X-API-Key': apiKey },
            timeout: 8000
          });

          const results = resp.data?.results;
          if (!results || !Array.isArray(results) || results.length === 0) break;

          for (const item of results) {
            if (!item || typeof item.value !== 'number' || isNaN(item.value)) continue;
            const rawName = (item.parameter?.name || item.parameter || '').toString().toLowerCase().trim();
            const paramName = rawName.replace(/\./g, '').replace(/\s+/g, '');
            const paramUnit = (item.parameter?.units || item.unit || '').toString().toLowerCase().trim();
            let value = item.value;

            switch (paramName) {
              case 'pm25':
                if (!['µg/m³', 'ug/m3', 'µg/m3', ''].includes(paramUnit)) continue;
                break;
              case 'pm10':
                if (!['µg/m³', 'ug/m3', 'µg/m3', ''].includes(paramUnit)) continue;
                break;
              case 'no2':
                if (['µg/m³', 'ug/m3', 'µg/m3'].includes(paramUnit)) {
                } else if (paramUnit === 'ppb') {
                  value = value * 1.88;
                } else if (paramUnit === 'ppm') {
                  value = value * 1880;
                } else continue;
                break;
              case 'so2':
                if (['µg/m³', 'ug/m3', 'µg/m3'].includes(paramUnit)) {
                } else if (paramUnit === 'ppb') {
                  value = value * 2.62;
                } else if (paramUnit === 'ppm') {
                  value = value * 2620;
                } else continue;
                break;
              case 'co':
                if (['mg/m³', 'mg/m3'].includes(paramUnit)) {
                } else if (paramUnit === 'ppm') {
                  value = value * 1.145;
                } else if (paramUnit === 'ppb') {
                  value = (value * 1.145) / 1000;
                } else if (['µg/m³', 'ug/m3', 'µg/m3'].includes(paramUnit)) {
                  value = value / 1000;
                } else continue;
                break;
              case 'o3':
                if (['µg/m³', 'ug/m3', 'µg/m3'].includes(paramUnit)) {
                } else if (paramUnit === 'ppb') {
                  value = value * 1.96;
                } else if (paramUnit === 'ppm') {
                  value = value * 1960;
                } else continue;
                break;
              case 'nh3':
              case 'pb':
                if (!['µg/m³', 'ug/m3', 'µg/m3'].includes(paramUnit)) continue;
                break;
              default:
                continue;
            }

            if (!pollutantsAgg[paramName]) pollutantsAgg[paramName] = { sum: 0, count: 0 };
            pollutantsAgg[paramName].sum += Number(value);
            pollutantsAgg[paramName].count += 1;
          }

          const meta = resp.data?.meta;
          if (!meta || !meta.found || results.length < 1000) break;
          const totalFound = meta.found || 0;
          const fetchedSoFar = page * 1000;
          if (fetchedSoFar >= totalFound) break;
          page += 1;
          if (page > 50) break;
        }
      }

      const pollutants: PollutantValues = {};
      for (const [paramName, v] of Object.entries(pollutantsAgg)) {
        if (v.count > 0) {
          const mean = v.sum / v.count;
          switch (paramName) {
            case 'pm25': pollutants.pm25 = Number(mean.toFixed(2)); break;
            case 'pm10': pollutants.pm10 = Number(mean.toFixed(2)); break;
            case 'no2': pollutants.no2 = Number(mean.toFixed(2)); break;
            case 'so2': pollutants.so2 = Number(mean.toFixed(2)); break;
            case 'co': pollutants.co = Number(mean.toFixed(2)); break;
            case 'o3': pollutants.o3 = Number(mean.toFixed(2)); break;
            case 'nh3': pollutants.nh3 = Number(mean.toFixed(2)); break;
            case 'pb': pollutants.pb = Number(mean.toFixed(2)); break;
            default: break;
          }
        }
      }

      return Object.keys(pollutants).length > 0 ? pollutants : null;
    } catch (error) {
      return null;
    }
  }

  private buildDateRange(startDate: string, endDate: string): string[] {
    const start = new Date(`${startDate}T00:00:00+05:30`);
    const end = new Date(`${endDate}T00:00:00+05:30`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
      return [];
    }

    const dates: string[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      dates.push(cursor.toISOString().substring(0, 10));
      cursor.setDate(cursor.getDate() + 1);
    }

    return dates;
  }

  async getHistoricalTrendSeries(locationId: string, startDate: string, endDate: string): Promise<DailyObservation[] | null> {
    const dates = this.buildDateRange(startDate, endDate);
    if (dates.length === 0) {
      return [];
    }


    // Parallelize per-date historical measurement requests with controlled concurrency
    // to reduce overall latency while avoiding flooding OpenAQ with unlimited requests.
    const concurrency = parseInt(process.env.OPENAQ_CONCURRENCY || '4', 10);
    const seriesResults: Array<DailyObservation | null> = [];

    // helper to process one date
    const fetchForDate = async (date: string): Promise<DailyObservation | null> => {
      const pollutants = await this.getHistoricalMeasurements(locationId, date);
      if (!pollutants) return null;
      const aqiRes = calculateIndianAQI(pollutants);
      if (!aqiRes.isValid) return null;
      return {
        date,
        pollutants,
        aqiResult: aqiRes,
        isValidAqi: true,
        dominantPollutant: aqiRes.dominantPollutant,
        source: 'OpenAQ v3 Historical Measurements'
      };
    };

    // Process dates in chunks of size `concurrency` to limit parallel requests
    for (let i = 0; i < dates.length; i += concurrency) {
      const chunk = dates.slice(i, i + concurrency);
      const promises = chunk.map(d => fetchForDate(d));
      // Wait for the chunk to complete; failures within fetchForDate resolve to null
      const results = await Promise.all(promises);
      seriesResults.push(...results);
    }

    // Preserve date ordering and filter out nulls (failed/absent measurements)
    const series = seriesResults.filter((s): s is DailyObservation => s !== null);
    return series.length > 0 ? series : [];
  }

  async getHistoricalObservations(locationId: string, hours: number): Promise<ObservationRecord[]> {
    // Historical observation retrieval is not needed for current features.
    // Return empty array to satisfy interface.
    return [];
  }

  async getAllStations(): Promise<ObservationRecord[]> {
    const apiKey = this.apiKey || process.env.OPENAQ_API_KEY;
    if (!apiKey) return [];

    try {
      // Fetch OpenAQ station metadata (limit to a reasonable number)
      const stations = await this.getStationHierarchy({ limit: 50 });
      const observations: ObservationRecord[] = [];

      for (const s of stations) {
        try {
          const obs = await this.getCurrentObservation(String(s.openAqLocationId));
          if (obs) observations.push(obs);
        } catch (e) {
          // ignore individual station failures
        }
      }

      return observations;
    } catch (e) {
      return [];
    }
  }

  /**
   * Retrieves verified OpenAQ station-to-location hierarchy:
   * INDIA -> STATE -> DISTRICT -> CITY/TOWN -> MONITORING STATION
   *
   * Integrity constraints:
   * - Uses actual OpenAQ location metadata.
   * - Does NOT fabricate district names or guess city == district.
   * - If district cannot be reliably determined, returns district as null (unavailable).
   * - Preserves actual OpenAQ station name and location ID.
   */
  async getStationHierarchy(options?: { state?: string; limit?: number }): Promise<OpenAqStationMetadata[]> {
    const apiKey = this.apiKey || process.env.OPENAQ_API_KEY;
    if (!apiKey) {
      return [];
    }

    try {
      const response = await this.scheduledGet(`${this.baseUrl}/locations`, {
        params: {
          countries_id: 9, // India country ID in OpenAQ v3
          limit: options?.limit || 50
        },
        headers: {
          'X-API-Key': apiKey
        },
        timeout: 10000
      });

      const locations = response.data?.results;
      if (!locations || !Array.isArray(locations)) {
        return [];
      }

      const stations: OpenAqStationMetadata[] = [];

      for (const loc of locations) {
        if (!loc || !loc.id) continue;

        const lat = loc.coordinates?.latitude ?? null;
        const lon = loc.coordinates?.longitude ?? null;
        const matchingVerified = (lat != null && lon != null)
          ? this.findMatchingVerifiedStation(lat, lon, loc.name)
          : undefined;

        const country = loc.country?.name || 'India';
        const state = matchingVerified?.state || this.resolveState(loc.name, loc.owner?.name, loc.locality);
        const city = loc.locality || matchingVerified?.city || this.resolveCity(loc.locality, loc.name);
        
        // District: only assign if station matches a verified station registry with verified boundaries.
        // Never infer from coordinates without verified boundaries, never guess city == district, never fabricate.
        const district = matchingVerified?.district || null;

        const stationMeta: OpenAqStationMetadata = {
          country,
          state,
          district,
          city,
          name: loc.name || `OpenAQ Station ${loc.id}`,
          openAqLocationId: loc.id,
          id: loc.id,
          latitude: lat,
          longitude: lon,
          source: 'OpenAQ'
        };

        if (options?.state) {
          const target = options.state.toLowerCase().trim();
          if (stationMeta.state && stationMeta.state.toLowerCase().trim() === target) {
            stations.push(stationMeta);
          }
        } else {
          stations.push(stationMeta);
        }
      }

      return stations;
    } catch (error) {
      return [];
    }
  }

  private findMatchingVerifiedStation(lat: number, lon: number, name?: string): MonitoringStationInfo | undefined {
    const lowerName = (name || '').toLowerCase();
    for (const s of INDIAN_MONITORING_STATIONS) {
      const dLat = Math.abs(s.latitude - lat);
      const dLon = Math.abs(s.longitude - lon);
      // Coordinate proximity (~3 km) or exact name similarity
      if (dLat < 0.03 && dLon < 0.03) {
        return s;
      }
      if (lowerName.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lowerName)) {
        return s;
      }
    }
    return undefined;
  }

  private resolveState(name?: string, owner?: string, locality?: string): string | null {
    const text = `${name || ''} ${owner || ''} ${locality || ''}`.toLowerCase();

    if (text.includes('delhi') || text.includes('dpcc')) return 'Delhi';
    if (text.includes('bihar') || text.includes('bspcb')) return 'Bihar';
    if (text.includes('telangana') || text.includes('tspcb')) return 'Telangana';
    if (text.includes('maharashtra') || text.includes('mpcb')) return 'Maharashtra';
    if (text.includes('karnataka') || text.includes('kspcb')) return 'Karnataka';
    if (text.includes('tamil nadu') || text.includes('tnpcb')) return 'Tamil Nadu';
    if (text.includes('uttar pradesh') || text.includes('uppcb')) return 'Uttar Pradesh';
    if (text.includes('west bengal') || text.includes('wbpcb')) return 'West Bengal';
    if (text.includes('rajasthan') || text.includes('rpcb')) return 'Rajasthan';
    if (text.includes('gujarat') || text.includes('gpcb')) return 'Gujarat';
    if (text.includes('chandigarh')) return 'Chandigarh';
    if (text.includes('madhya pradesh') || text.includes('mppcb')) return 'Madhya Pradesh';

    for (const st of INDIA_STATES) {
      if (text.includes(st.toLowerCase())) {
        return st;
      }
    }
    return null;
  }

  private resolveCity(locality?: string | null, name?: string): string | null {
    if (locality && locality.trim() !== '' && locality.trim().toLowerCase() !== 'null') {
      return locality.trim();
    }
    if (!name) return null;
    const commonCities = [
      'New Delhi', 'Delhi', 'Gaya', 'Kanpur', 'Mumbai', 'Kolkata', 'Bengaluru', 'Bangalore',
      'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Patna', 'Lucknow', 'Jaipur', 'Chandigarh',
      'Bhopal', 'Nagpur', 'Faridabad', 'Gurugram', 'Noida', 'Ghaziabad'
    ];
    for (const city of commonCities) {
      if (new RegExp(`\\b${city}\\b`, 'i').test(name)) {
        return city === 'New Delhi' ? 'Delhi' : city;
      }
    }
    return null;
  }
}
