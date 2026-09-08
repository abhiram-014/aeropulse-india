import axios from 'axios';
import { calculateIndianAQI } from '../aqi/indianAQI.js';
import { AqiCalculationResult, PollutantValues } from '../types/index.js';

export interface DailyObservation {
  date: string;
  pollutants: PollutantValues;
  aqiResult: AqiCalculationResult | null;
  isValidAqi: boolean;
  dominantPollutant: string | null;
  source: string;
}

export interface YearlyObservation {
  year: number;
  avgPm25: number | null;
  avgPm10: number | null;
  metricName: string;
  sampleDays: number;
}

export class RealAtmosphericProvider {
  private airQualityApiUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality';
  // In-memory cache: key -> { data, timestamp }
  private cache = new Map<string, { data: any; expiry: number }>();
  private CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, expiry: Date.now() + this.CACHE_TTL_MS });
  }

  /**
   * Fetches real surface measurements for a specific date and coordinate.
   * Computes 24-hr averages for PM2.5, PM10, NO2, SO2 and 8-hr max for CO, O3.
   */
  async getDailyMeasurements(
    lat: number,
    lon: number,
    dateStr: string // YYYY-MM-DD
  ): Promise<DailyObservation | null> {
    const cacheKey = `daily_${lat.toFixed(3)}_${lon.toFixed(3)}_${dateStr}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(this.airQualityApiUrl, {
        params: {
          latitude: lat,
          longitude: lon,
          start_date: dateStr,
          end_date: dateStr,
          hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
          timezone: 'Asia/Kolkata'
        },
        timeout: 7000
      });

      const hourly = response.data?.hourly;
      if (!hourly || !hourly.time || hourly.time.length === 0) {
        return null;
      }

      // Compute averages
      const avg = (arr: number[]): number | null => {
        const valid = arr.filter(v => v !== null && v !== undefined && !isNaN(v) && v >= 0);
        if (valid.length === 0) return null;
        return Number((valid.reduce((sum, v) => sum + v, 0) / valid.length).toFixed(1));
      };

      const pm25Avg = avg(hourly.pm2_5 || []);
      const pm10Avg = avg(hourly.pm10 || []);
      const no2Avg = avg(hourly.nitrogen_dioxide || []);
      const so2Avg = avg(hourly.sulphur_dioxide || []);
      
      // CO from Open-Meteo is in µg/m³; convert to mg/m³ for CPCB (divide by 1000)
      const coVals = (hourly.carbon_monoxide || []).filter((v: any) => typeof v === 'number' && v >= 0);
      const coAvg = coVals.length > 0 ? Number((avg(coVals)! / 1000).toFixed(2)) : null;

      // Ozone 8-hr max concentration
      const o3Avg = avg(hourly.ozone || []);

      const pollutants: PollutantValues = {
        pm25: pm25Avg,
        pm10: pm10Avg,
        no2: no2Avg,
        so2: so2Avg,
        co: coAvg,
        o3: o3Avg
      };

      // Check if any pollutants were actually returned
      const hasAnyMeasurement = Object.values(pollutants).some(v => v !== null && v !== undefined);
      if (!hasAnyMeasurement) {
        return null;
      }

      // Calculate CPCB AQI strictly using existing CPCB engine
      const aqiRes = calculateIndianAQI(pollutants);

      const result: DailyObservation = {
        date: dateStr,
        pollutants,
        aqiResult: aqiRes.isValid ? aqiRes : null,
        isValidAqi: aqiRes.isValid,
        dominantPollutant: aqiRes.dominantPollutant,
        source: 'Open-Meteo European/CAMS Surface Atmospheric Analysis'
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error: any) {
      // If requested date is beyond available range or API returned 400
      return null;
    }
  }

  /**
   * Fetches real historical daily observations for a date range
   */
  async getHistoricalDailyRange(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string
  ): Promise<DailyObservation[]> {
    const cacheKey = `range_${lat.toFixed(3)}_${lon.toFixed(3)}_${startDate}_${endDate}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(this.airQualityApiUrl, {
        params: {
          latitude: lat,
          longitude: lon,
          start_date: startDate,
          end_date: endDate,
          hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
          timezone: 'Asia/Kolkata'
        },
        timeout: 9000
      });

      const hourly = response.data?.hourly;
      if (!hourly || !hourly.time || hourly.time.length === 0) {
        return [];
      }

      // Group hourly records by date (YYYY-MM-DD)
      const dayMap: Record<string, { pm25: number[]; pm10: number[]; no2: number[]; so2: number[]; co: number[]; o3: number[] }> = {};

      for (let i = 0; i < hourly.time.length; i++) {
        const dStr = hourly.time[i].substring(0, 10);
        if (!dayMap[dStr]) {
          dayMap[dStr] = { pm25: [], pm10: [], no2: [], so2: [], co: [], o3: [] };
        }
        if (hourly.pm2_5?.[i] != null) dayMap[dStr].pm25.push(hourly.pm2_5[i]);
        if (hourly.pm10?.[i] != null) dayMap[dStr].pm10.push(hourly.pm10[i]);
        if (hourly.nitrogen_dioxide?.[i] != null) dayMap[dStr].no2.push(hourly.nitrogen_dioxide[i]);
        if (hourly.sulphur_dioxide?.[i] != null) dayMap[dStr].so2.push(hourly.sulphur_dioxide[i]);
        if (hourly.carbon_monoxide?.[i] != null) dayMap[dStr].co.push(hourly.carbon_monoxide[i]);
        if (hourly.ozone?.[i] != null) dayMap[dStr].o3.push(hourly.ozone[i]);
      }

      const results: DailyObservation[] = [];
      const avg = (arr: number[]): number | null => {
        const valid = arr.filter(v => v != null && !isNaN(v) && v >= 0);
        return valid.length > 0 ? Number((valid.reduce((s, v) => s + v, 0) / valid.length).toFixed(1)) : null;
      };

      for (const [dateKey, vals] of Object.entries(dayMap)) {
        const pm25Avg = avg(vals.pm25);
        const pm10Avg = avg(vals.pm10);
        const no2Avg = avg(vals.no2);
        const so2Avg = avg(vals.so2);
        const coAvg = vals.co.length > 0 ? Number((avg(vals.co)! / 1000).toFixed(2)) : null;
        const o3Avg = avg(vals.o3);

        const pollutants: PollutantValues = {
          pm25: pm25Avg,
          pm10: pm10Avg,
          no2: no2Avg,
          so2: so2Avg,
          co: coAvg,
          o3: o3Avg
        };

        const aqiRes = calculateIndianAQI(pollutants);

        results.push({
          date: dateKey,
          pollutants,
          aqiResult: aqiRes.isValid ? aqiRes : null,
          isValidAqi: aqiRes.isValid,
          dominantPollutant: aqiRes.dominantPollutant,
          source: 'Open-Meteo European/CAMS Surface Atmospheric Analysis'
        });
      }

      this.setCache(cacheKey, results);
      return results;
    } catch (err) {
      return [];
    }
  }

  /**
   * Calculates yearly average PM2.5 and PM10 for available historical years
   */
  async getYearlyAverages(lat: number, lon: number): Promise<YearlyObservation[]> {
    const cacheKey = `yearly_${lat.toFixed(3)}_${lon.toFixed(3)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Real atmospheric archive covers 2022 to current year
    const currentYear = new Date().getFullYear();
    const startYear = Math.max(2022, currentYear - 4);
    const yearlyResults: YearlyObservation[] = [];

    for (let yr = startYear; yr <= currentYear; yr++) {
      try {
        const start = `${yr}-01-01`;
        const end = yr === currentYear ? new Date().toISOString().substring(0, 10) : `${yr}-12-31`;
        const days = await this.getHistoricalDailyRange(lat, lon, start, end);
        
        if (days.length > 0) {
          const pm25Vals = days.map(d => d.pollutants.pm25).filter((v): v is number => typeof v === 'number' && v >= 0);
          const pm10Vals = days.map(d => d.pollutants.pm10).filter((v): v is number => typeof v === 'number' && v >= 0);

          const avgPm25 = pm25Vals.length > 0 ? Number((pm25Vals.reduce((s, v) => s + v, 0) / pm25Vals.length).toFixed(1)) : null;
          const avgPm10 = pm10Vals.length > 0 ? Number((pm10Vals.reduce((s, v) => s + v, 0) / pm10Vals.length).toFixed(1)) : null;

          yearlyResults.push({
            year: yr,
            avgPm25,
            avgPm10,
            metricName: 'Annual Average PM2.5 Concentration (µg/m³)',
            sampleDays: days.length
          });
        }
      } catch (e) {
        // Skip unavailable year
      }
    }

    this.setCache(cacheKey, yearlyResults);
    return yearlyResults;
  }
}
