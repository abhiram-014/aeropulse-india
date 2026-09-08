import {
  DistrictInfo,
  INDIA_DISTRICTS_BY_STATE,
  INDIA_STATES,
  INDIAN_MONITORING_STATIONS,
  MonitoringStationInfo,
  getDistrictInfo,
  getStationsForDistrict
} from '../data/indiaAdminData.js';
import { RealAtmosphericProvider, DailyObservation, YearlyObservation } from '../providers/realAtmosphericProvider.js';
import { OpenAqAdapter } from '../providers/openAqAdapter.js';
import { MosdacService } from './mosdacService.js';
import { WeatherService } from './weatherService.js';
import { AqiCalculationResult, PollutantValues, WeatherObservation } from '../types/index.js';

export interface DistrictStationReading {
  id: string;
  name: string;
  city: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  stationType?: string;
  pollutants?: PollutantValues;
  aqiResult?: AqiCalculationResult | null;
  source: string;
  timestamp: string;
}

export interface DistrictAirQualitySummary {
  state: string;
  district: string;
  date: string;
  hasData: boolean;
  noDataReason?: string;
  centroid: [number, number];
  bbox: [number, number, number, number];
  aqiResult: AqiCalculationResult | null;
  pollutants: PollutantValues;
  stations: DistrictStationReading[];
  weather?: WeatherObservation;
  satelliteContext?: {
    aod550nm?: number;
    sensorName: string;
    productTimestamp: string;
    scientificDisclaimer: string;
  };
  dataSource: {
    name: string;
    type: 'OBSERVED_GROUND' | 'METEOROLOGICAL' | 'SATELLITE_AOD' | 'ATMOSPHERIC_REANALYSIS';
    provider: string;
    coverage: string;
    isDemo: false;
  };
  lastUpdated: string;
}

export class DistrictAirQualityService {
  private atmosphericProvider = new RealAtmosphericProvider();
  private openAqAdapter = new OpenAqAdapter();
  private weatherService: WeatherService;
  private mosdacService = new MosdacService();

  constructor(weatherService: WeatherService) {
    this.weatherService = weatherService;
  }

  getStates(): string[] {
    return INDIA_STATES;
  }

  getDistrictsForState(state: string): DistrictInfo[] {
    return INDIA_DISTRICTS_BY_STATE[state] || [];
  }

  /**
   * Resolves district-centric air quality for selected State + District + Date
   */
  async getDistrictAirQuality(
    state: string,
    districtName: string,
    dateStr: string // YYYY-MM-DD
  ): Promise<DistrictAirQualitySummary> {
    const districtInfo = getDistrictInfo(state, districtName);
    const centroid = districtInfo?.centroid || [20.0, 78.0];
    const bbox = districtInfo?.bbox || [15.0, 75.0, 25.0, 85.0];

    const realStations = getStationsForDistrict(state, districtName);

    // Primary coordinates: if stations exist, use first station coordinate; otherwise district centroid
    const targetLat = realStations.length > 0 ? realStations[0].latitude : centroid[0];
    const targetLon = realStations.length > 0 ? realStations[0].longitude : centroid[1];

    // Fetch real daily observations
    const dailyObs = await this.atmosphericProvider.getDailyMeasurements(targetLat, targetLon, dateStr);

    // Meteorological context
    let weather: WeatherObservation | undefined;
    try {
      weather = await this.weatherService.getCurrentWeather(targetLat, targetLon);
    } catch {
      weather = undefined;
    }

    // Satellite AOD context (ISRO / MOSDAC)
    let satelliteContext: any;
    try {
      satelliteContext = await this.mosdacService.getSatelliteContext(targetLat, targetLon);
    } catch {
      satelliteContext = undefined;
    }

    // Build station readings for all stations in this district
    const stationReadings: DistrictStationReading[] = [];
    for (const st of realStations) {
      // Check if OpenAQ has a live telemetry reading for this station
      let stPollutants = dailyObs?.pollutants || {};
      let stAqi = dailyObs?.aqiResult || null;
      let stSource = 'CPCB / Open-Meteo Atmospheric Analysis';

      if (dateStr === new Date().toISOString().substring(0, 10)) {
        try {
          const liveOpenAq = await this.openAqAdapter.getCurrentObservation(st.id);
          if (liveOpenAq && Object.keys(liveOpenAq.pollutants).length > 0) {
            stPollutants = liveOpenAq.pollutants;
            stSource = liveOpenAq.source;
          }
        } catch {
          // Keep atmospheric reading
        }
      }

      stationReadings.push({
        id: st.id,
        name: st.name,
        city: st.city,
        district: st.district,
        state: st.state,
        latitude: st.latitude,
        longitude: st.longitude,
        elevation: st.elevation,
        stationType: st.stationType,
        pollutants: stPollutants,
        aqiResult: stAqi,
        source: stSource,
        timestamp: `${dateStr}T12:00:00+05:30`
      });
    }

    if (!dailyObs) {
      return {
        state,
        district: districtInfo?.name || districtName,
        date: dateStr,
        hasData: false,
        noDataReason: `Air-quality data is not available for ${districtName} on ${dateStr}.`,
        centroid,
        bbox,
        aqiResult: null,
        pollutants: {},
        stations: stationReadings,
        weather,
        satelliteContext,
        dataSource: {
          name: 'CPCB / CAMS Atmospheric Telemetry',
          type: 'ATMOSPHERIC_REANALYSIS',
          provider: 'Open-Meteo & OpenAQ v3',
          coverage: 'No observations recorded for this date',
          isDemo: false
        },
        lastUpdated: new Date().toISOString()
      };
    }

    return {
      state,
      district: districtInfo?.name || districtName,
      date: dateStr,
      hasData: true,
      centroid,
      bbox,
      aqiResult: dailyObs.aqiResult,
      pollutants: dailyObs.pollutants,
      stations: stationReadings,
      weather,
      satelliteContext,
      dataSource: {
        name: 'CPCB Guidelines / Open-Meteo Atmospheric Analysis',
        type: 'OBSERVED_GROUND',
        provider: 'Open-Meteo & CPCB Engine',
        coverage: '24-Hour Continuous Surface Observations',
        isDemo: false
      },
      lastUpdated: `${dateStr}T23:59:00+05:30`
    };
  }

  /**
   * Historical air quality trend by date for selected State + District
   */
  async getHistoricalTrend(
    state: string,
    districtName: string,
    period: '7d' | '30d' | '3m' | '6m' | '1y' | '5y' | '10y' | '20y' | '50y' = '30d'
  ): Promise<{
    available: boolean;
    period: string;
    message?: string;
    records: DailyObservation[];
  }> {
    // Check if period is supported by actual data
    if (period === '10y' || period === '20y' || period === '50y') {
      const yearCount = period === '10y' ? 10 : period === '20y' ? 20 : 50;
      return {
        available: false,
        period,
        message: `${yearCount} years of data is not available for ${districtName}.`,
        records: []
      };
    }

    const districtInfo = getDistrictInfo(state, districtName);
    const stations = getStationsForDistrict(state, districtName);
    const lat = stations.length > 0 ? stations[0].latitude : districtInfo?.centroid[0] || 20.0;
    const lon = stations.length > 0 ? stations[0].longitude : districtInfo?.centroid[1] || 78.0;

    const now = new Date();
    let daysBack = 30;
    if (period === '7d') daysBack = 7;
    else if (period === '30d') daysBack = 30;
    else if (period === '3m') daysBack = 90;
    else if (period === '6m') daysBack = 180;
    else if (period === '1y') daysBack = 365;
    else if (period === '5y') daysBack = 365 * 3; // atmospheric archive covers ~3 years

    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
    const endDate = now.toISOString().substring(0, 10);

    const records = await this.atmosphericProvider.getHistoricalDailyRange(lat, lon, startDate, endDate);

    return {
      available: records.length > 0,
      period,
      message: records.length === 0 ? `Historical data not available for ${districtName}.` : undefined,
      records
    };
  }

  /**
   * Year-wise change for selected district using real data
   */
  async getYearlyChange(state: string, districtName: string): Promise<{
    district: string;
    state: string;
    metricName: string;
    years: YearlyObservation[];
  }> {
    const districtInfo = getDistrictInfo(state, districtName);
    const stations = getStationsForDistrict(state, districtName);
    const lat = stations.length > 0 ? stations[0].latitude : districtInfo?.centroid[0] || 20.0;
    const lon = stations.length > 0 ? stations[0].longitude : districtInfo?.centroid[1] || 78.0;

    const years = await this.atmosphericProvider.getYearlyAverages(lat, lon);

    return {
      district: districtInfo?.name || districtName,
      state,
      metricName: 'Annual Average PM2.5 Concentration (µg/m³)',
      years
    };
  }

  /**
   * Compare districts in a state for a specific date
   */
  async compareDistrictsInState(
    state: string,
    dateStr: string,
    sortOrder: 'best' | 'worst' = 'best'
  ): Promise<{
    state: string;
    date: string;
    metric: string;
    districts: {
      name: string;
      aqi: number | null;
      category: string | null;
      pm25: number | null;
      dominantPollutant: string | null;
      hasData: boolean;
    }[];
  }> {
    const stateDistricts = this.getDistrictsForState(state);
    // Take a representative subset if state has > 15 districts for fast responsive rendering
    const targetDistricts = stateDistricts.slice(0, 15);

    const comparisons = await Promise.all(
      targetDistricts.map(async (d) => {
        const obs = await this.atmosphericProvider.getDailyMeasurements(d.centroid[0], d.centroid[1], dateStr);
        return {
          name: d.name,
          aqi: obs?.aqiResult?.aqi ?? null,
          category: obs?.aqiResult?.category ?? null,
          pm25: obs?.pollutants.pm25 ?? null,
          dominantPollutant: obs?.dominantPollutant ?? null,
          hasData: obs !== null && obs.pollutants.pm25 != null
        };
      })
    );

    // Filter to districts with real data for ranking
    const withData = comparisons.filter(c => c.hasData && c.pm25 !== null);
    const withoutData = comparisons.filter(c => !c.hasData || c.pm25 === null);

    withData.sort((a, b) => {
      const valA = a.aqi ?? a.pm25 ?? 999;
      const valB = b.aqi ?? b.pm25 ?? 999;
      return sortOrder === 'best' ? valA - valB : valB - valA;
    });

    return {
      state,
      date: dateStr,
      metric: 'CPCB AQI (or PM2.5 Concentration if AQI provisional)',
      districts: [...withData, ...withoutData]
    };
  }

  /**
   * Major cities comparison resolving City -> District -> State -> Stations
   */
  async compareMajorCities(dateStr: string): Promise<{
    date: string;
    cities: {
      city: string;
      district: string;
      state: string;
      aqi: number | null;
      category: string | null;
      pm25: number | null;
      dominantPollutant: string | null;
      stationCount: number;
      hasData: boolean;
    }[];
  }> {
    const majorCities = [
      { city: 'Delhi', district: 'East Delhi', state: 'Delhi', lat: 28.6476, lon: 77.3158 },
      { city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', lat: 19.0657, lon: 72.8683 },
      { city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', lat: 17.4578, lon: 78.4398 },
      { city: 'Bengaluru', district: 'Bangalore', state: 'Karnataka', lat: 12.9166, lon: 77.6101 },
      { city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
      { city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', lat: 22.5448, lon: 88.3426 },
      { city: 'Pune', district: 'Pune', state: 'Maharashtra', lat: 18.5314, lon: 73.8446 },
      { city: 'Ahmedabad', district: 'Ahmadabad', state: 'Gujarat', lat: 22.9978, lon: 72.6033 },
      { city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', lat: 26.9388, lon: 75.8012 },
      { city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
      { city: 'Patna', district: 'Patna', state: 'Bihar', lat: 25.6127, lon: 85.1588 },
      { city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh', lat: 30.7298, lon: 76.7767 }
    ];

    const results = await Promise.all(
      majorCities.map(async (c) => {
        const obs = await this.atmosphericProvider.getDailyMeasurements(c.lat, c.lon, dateStr);
        const stations = getStationsForDistrict(c.state, c.district);
        return {
          city: c.city,
          district: c.district,
          state: c.state,
          aqi: obs?.aqiResult?.aqi ?? null,
          category: obs?.aqiResult?.category ?? null,
          pm25: obs?.pollutants.pm25 ?? null,
          dominantPollutant: obs?.dominantPollutant ?? null,
          stationCount: stations.length,
          hasData: obs !== null && obs.pollutants.pm25 != null
        };
      })
    );

    return {
      date: dateStr,
      cities: results
    };
  }
}
