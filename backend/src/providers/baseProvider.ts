import { LocationInfo, PollutantValues, WeatherObservation } from '../types/index.js';

export interface ObservationRecord {
  location: LocationInfo;
  pollutants: PollutantValues;
  timestamp: string;
  source: string;
  isDemo: boolean;
  dataQualityScore: number;
}

export interface AirQualityProvider {
  name: string;
  getCurrentObservation(locationId: string): Promise<ObservationRecord | null>;
  getHistoricalObservations(locationId: string, hours: number): Promise<ObservationRecord[]>;
  getAllStations(): Promise<ObservationRecord[]>;
}

export interface WeatherProvider {
  name: string;
  getCurrentWeather(latitude: number, longitude: number): Promise<WeatherObservation>;
  getHourlyForecastWeather(latitude: number, longitude: number, hours: number): Promise<WeatherObservation[]>;
}
