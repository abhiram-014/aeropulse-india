import axios from 'axios';
import { 
  AirQualityStationSummary, 
  AiResponse,
  AqiCalculationResult, 
  DailyObservation,
  DistrictAirQualitySummary,
  DistrictComparisonResult,
  DistrictInfo,
  ForecastResponse, 
  HealthRecommendation, 
  LocationInfo, 
  MajorCityComparisonResult,
  ModelPerformanceMetadata,
  YearlyObservation
} from '../types/index.js';

const API_BASE = '/api';

export const api = {
  // District-First Architecture API
  getStates: async (): Promise<string[]> => {
    const res = await axios.get(`${API_BASE}/districts/states`);
    return res.data;
  },

  getDistricts: async (state: string): Promise<DistrictInfo[]> => {
    const res = await axios.get(`${API_BASE}/districts`, { params: { state } });
    return res.data;
  },

  getDistrictAirQuality: async (
    state: string,
    district: string,
    date?: string
  ): Promise<DistrictAirQualitySummary> => {
    const res = await axios.get(`${API_BASE}/districts/summary`, {
      params: { state, district, date }
    });
    return res.data;
  },

  getDistrictHistory: async (
    state: string,
    district: string,
    period: string = '30d'
  ): Promise<{
    available: boolean;
    period: string;
    message?: string;
    records: DailyObservation[];
  }> => {
    const res = await axios.get(`${API_BASE}/districts/history`, {
      params: { state, district, period }
    });
    return res.data;
  },

  getDistrictYearlyChange: async (
    state: string,
    district: string
  ): Promise<{
    district: string;
    state: string;
    metricName: string;
    years: YearlyObservation[];
  }> => {
    const res = await axios.get(`${API_BASE}/districts/yearly`, {
      params: { state, district }
    });
    return res.data;
  },

  compareDistricts: async (
    state: string,
    date?: string,
    order: 'best' | 'worst' = 'best'
  ): Promise<DistrictComparisonResult> => {
    const res = await axios.get(`${API_BASE}/districts/compare`, {
      params: { state, date, order }
    });
    return res.data;
  },

  compareMajorCities: async (date?: string): Promise<MajorCityComparisonResult> => {
    const res = await axios.get(`${API_BASE}/cities/major`, {
      params: { date }
    });
    return res.data;
  },

  getDistrictBoundary: async (state: string, district: string): Promise<any> => {
    const res = await axios.get(`${API_BASE}/districts/boundary`, {
      params: { state, district }
    });
    return res.data;
  },

  askAi: async (question: string, context: any): Promise<AiResponse> => {
    const res = await axios.post(`${API_BASE}/ai/ask`, { question, context });
    return res.data;
  },

  // Legacy Station Observations & Compatibility
  getLocations: async (): Promise<LocationInfo[]> => {
    const res = await axios.get(`${API_BASE}/locations`);
    return res.data;
  },

  getCurrentAirQuality: async (locationId: string): Promise<AirQualityStationSummary> => {
    const res = await axios.get(`${API_BASE}/air-quality/current`, { params: { locationId } });
    return res.data;
  },

  getAllStationMapData: async (): Promise<AirQualityStationSummary[]> => {
    const res = await axios.get(`${API_BASE}/map`);
    return res.data;
  },

  getCurrentCitiesAqi: async (): Promise<any> => {
    const res = await axios.get(`${API_BASE}/cities/current`);
    return res.data;
  },

  getHistoricalTrend: async (locationId: string, hours: number = 24) => {
    const res = await axios.get(`${API_BASE}/air-quality/history`, { params: { locationId, hours } });
    return res.data;
  },

  getForecast: async (locationId: string): Promise<ForecastResponse> => {
    const res = await axios.get(`${API_BASE}/forecast`, { params: { locationId } });
    return res.data;
  },

  getModelMetadata: async (): Promise<ModelPerformanceMetadata> => {
    const res = await axios.get(`${API_BASE}/model/info`);
    return res.data;
  },

  calculateCustomAqi: async (pollutants: any): Promise<{
    aqiResult: AqiCalculationResult;
    healthRecommendation: HealthRecommendation;
  }> => {
    const res = await axios.post(`${API_BASE}/aqi/calculate`, pollutants);
    return res.data;
  },

  getDataSources: async () => {
    const res = await axios.get(`${API_BASE}/data-sources`);
    return res.data;
  },

  getAqiMethodology: async () => {
    const res = await axios.get(`${API_BASE}/aqi/methodology`);
    return res.data;
  }
};
