import { WeatherProvider } from '../providers/baseProvider.js';
import { DemoDataProvider } from '../providers/demoDataProvider.js';
import { OpenMeteoAdapter } from '../providers/openMeteoAdapter.js';
import { WeatherObservation } from '../types/index.js';

export class WeatherService {
  private primaryProvider: WeatherProvider;
  private demoProvider: DemoDataProvider;

  constructor() {
    this.demoProvider = new DemoDataProvider();
    const dataMode = process.env.DATA_MODE || 'demo';
    this.primaryProvider = dataMode === 'live' ? new OpenMeteoAdapter() : this.demoProvider;
  }

  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherObservation> {
    return this.primaryProvider.getCurrentWeather(latitude, longitude);
  }

  async getForecastWeather(latitude: number, longitude: number, hours: number = 24): Promise<WeatherObservation[]> {
    return this.primaryProvider.getHourlyForecastWeather(latitude, longitude, hours);
  }
}
