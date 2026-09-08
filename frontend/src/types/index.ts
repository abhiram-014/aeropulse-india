export type PollutantType = 'pm25' | 'pm10' | 'no2' | 'so2' | 'co' | 'o3' | 'nh3' | 'pb';

export type AqiCategory = 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';

export interface LocationInfo {
  id: string;
  name: string;
  city: string;
  district?: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  stationType?: string;
}

export interface DistrictInfo {
  id: string;
  name: string;
  state: string;
  centroid: [number, number];
  bbox: [number, number, number, number];
}

export interface SubIndexDetail {
  pollutant: PollutantType;
  concentration: number;
  subIndex: number;
  category: AqiCategory;
  unit: string;
  averagingPeriod: string;
  isDominant: boolean;
}

export interface AqiCalculationResult {
  aqi: number;
  category: AqiCategory;
  dominantPollutant: PollutantType | null;
  subIndices: Record<PollutantType, number | null>;
  subIndexDetails: SubIndexDetail[];
  pollutantCount: number;
  isValid: boolean;
  validationMessage?: string;
  methodology: string;
  color: string;
  textColor: string;
  description: string;
}

export interface WeatherObservation {
  temperature: number;
  relativeHumidity: number;
  surfacePressure?: number;
  windSpeed: number;
  windDirection: number;
  rainfall?: number;
  cloudCover?: number;
  boundaryLayerHeight?: number;
  source: string;
  timestamp: string;
}

export interface PollutantValues {
  pm25?: number | null;
  pm10?: number | null;
  no2?: number | null;
  so2?: number | null;
  co?: number | null;
  o3?: number | null;
  nh3?: number | null;
  pb?: number | null;
}

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
    type: string;
    provider: string;
    coverage: string;
    isDemo: boolean;
  };
  lastUpdated: string;
}

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

export interface DistrictComparisonResult {
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
}

export interface MajorCityComparisonResult {
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
}

export interface AirQualityStationSummary {
  location: LocationInfo;
  aqiResult: AqiCalculationResult;
  pollutants: PollutantValues;
  weather: WeatherObservation;
  satelliteContext?: {
    aod550nm?: number;
    sensorName: string;
    productTimestamp: string;
    scientificDisclaimer: string;
  };
  lastUpdated: string;
  dataQualityScore: number;
  dataSource: {
    name: string;
    type: string;
    isDemo: boolean;
    provider: string;
  };
}

export interface HealthRecommendation {
  category: AqiCategory;
  generalAdvisory: string;
  sensitiveGroupAdvisory: string;
  outdoorActivityAdvice: string;
  maskRecommendation: string;
  airPurifierAdvice: string;
  ventilateHomeAdvice: string;
  dominantPollutantSpecificAdvice?: string;
}

export interface ForecastPoint {
  targetTimestamp: string;
  hoursAhead: number;
  predictedPm25: number;
  predictedAqi: number;
  predictedCategory: AqiCategory;
  lowerBoundPm25: number;
  upperBoundPm25: number;
  dominantPollutant: PollutantType;
  uncertaintyMethod: string;
}

export interface ForecastResponse {
  location: LocationInfo;
  generatedAt: string;
  modelVersion: string;
  modelType: string;
  trend: 'Improving' | 'Stable' | 'Deteriorating';
  trendDescription: string;
  isDemo: boolean;
  forecast: ForecastPoint[];
}

export interface ModelPerformanceMetadata {
  modelVersion: string;
  modelType: string;
  targetVariable: string;
  predictionHorizonHours: number;
  trainingDataset: string;
  trainingPeriod: string;
  sampleCount: number;
  lastTrainedDate: string;
  isProductionModel: boolean;
  evaluationSplitMethod: string;
  metrics: {
    mae: number;
    rmse: number;
    r2: number;
    mape: number;
    aqiCategoryAccuracyPct: number;
  };
  featureImportance: {
    feature: string;
    importance: number;
    category: 'Lags' | 'Weather' | 'Temporal' | 'Spatial' | 'Satellite';
  }[];
}

export interface AiResponse {
  answer: string;
  disclaimer: string;
  generatedBy: 'RULE_BASED_SAFETY_ENGINE' | 'EXTERNAL_LLM';
}
