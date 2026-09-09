export type PollutantType = 'pm25' | 'pm10' | 'no2' | 'so2' | 'co' | 'o3' | 'nh3' | 'pb';

export type AqiCategory = 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';

export interface BreakpointRange {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
}

export interface PollutantValues {
  pm25?: number | null; // µg/m³ (24-hr avg)
  pm10?: number | null; // µg/m³ (24-hr avg)
  no2?: number | null;  // µg/m³ (24-hr avg)
  so2?: number | null;  // µg/m³ (24-hr avg)
  co?: number | null;   // mg/m³ (8-hr avg)
  o3?: number | null;   // µg/m³ (8-hr avg)
  nh3?: number | null;  // µg/m³ (24-hr avg)
  pb?: number | null;   // µg/m³ (24-hr avg)
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
  methodology: string; // 'CPCB_INDIA_2014'
  color: string;
  textColor: string;
  description: string;
}

export interface LocationInfo {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  district?: string | null;
  latitude: number;
  longitude: number;
  elevation?: number;
  stationType?: string;
}

export interface OpenAqStationMetadata {
  country: string;
  state: string | null;
  district: string | null;
  city: string | null;
  name: string;
  openAqLocationId: number;
  id: number | string;
  latitude: number | null;
  longitude: number | null;
  source: 'OpenAQ';
}

export interface WeatherObservation {
  temperature: number; // °C
  relativeHumidity: number; // %
  surfacePressure?: number; // hPa
  windSpeed: number; // m/s or km/h
  windDirection: number; // degrees
  rainfall?: number; // mm
  cloudCover?: number; // %
  boundaryLayerHeight?: number; // m
  source: string;
  timestamp: string;
}

export interface SatelliteObservation {
  latitude: number;
  longitude: number;
  product: string; // e.g. 'INSAT_3D_L2_AOD'
  variableName: string;
  value: number;
  qualityFlag: number;
  timestamp: string;
  sourceFile?: string;
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
    type: 'OBSERVED_GROUND' | 'METEOROLOGICAL' | 'SATELLITE_AOD' | 'ML_FORECAST';
    isDemo: boolean;
    provider: string;
  };
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
  evaluationSplitMethod: 'Strict Chronological Out-of-Time Split (No Shuffling)';
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
