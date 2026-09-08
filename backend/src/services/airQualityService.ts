import { calculateIndianAQI } from '../aqi/indianAQI.js';
import { AirQualityProvider } from '../providers/baseProvider.js';
import { DemoDataProvider, INDIAN_MONITORING_STATIONS } from '../providers/demoDataProvider.js';
import { OpenAqAdapter } from '../providers/openAqAdapter.js';
import { 
  AirQualityStationSummary, 
  AqiCalculationResult, 
  LocationInfo, 
  PollutantValues 
} from '../types/index.js';
import { MosdacService } from './mosdacService.js';
import { WeatherService } from './weatherService.js';

export class AirQualityService {
  private primaryProvider: AirQualityProvider;
  private demoProvider: DemoDataProvider;
  private weatherService: WeatherService;
  private mosdacService: MosdacService;

  constructor(weatherService: WeatherService) {
    this.demoProvider = new DemoDataProvider();
    const dataMode = process.env.DATA_MODE || 'demo';
    this.primaryProvider = dataMode === 'live' ? new OpenAqAdapter() : this.demoProvider;
    this.weatherService = weatherService;
    this.mosdacService = new MosdacService();
  }

  async getStations(): Promise<LocationInfo[]> {
    return INDIAN_MONITORING_STATIONS;
  }

  async getStationById(id: string): Promise<LocationInfo | undefined> {
    return INDIAN_MONITORING_STATIONS.find(s => s.id === id);
  }

  async getCurrentStationSummary(locationId: string): Promise<AirQualityStationSummary | null> {
    const obs = await this.primaryProvider.getCurrentObservation(locationId);
    if (!obs) return null;

    const aqiResult = calculateIndianAQI(obs.pollutants);
    const weather = await this.weatherService.getCurrentWeather(obs.location.latitude, obs.location.longitude);
    const satelliteContext = await this.mosdacService.getSatelliteContext(obs.location.latitude, obs.location.longitude);

    return {
      location: obs.location,
      aqiResult,
      pollutants: obs.pollutants,
      weather,
      satelliteContext,
      lastUpdated: obs.timestamp,
      dataQualityScore: obs.dataQualityScore,
      dataSource: {
        name: obs.source,
        type: 'OBSERVED_GROUND',
        isDemo: obs.isDemo,
        provider: this.primaryProvider.name
      }
    };
  }

  async getAllStationSummaries(): Promise<AirQualityStationSummary[]> {
    const stationObs = await this.primaryProvider.getAllStations();
    const summaries: AirQualityStationSummary[] = [];

    for (const obs of stationObs) {
      const aqiResult = calculateIndianAQI(obs.pollutants);
      const weather = await this.weatherService.getCurrentWeather(obs.location.latitude, obs.location.longitude);

      summaries.push({
        location: obs.location,
        aqiResult,
        pollutants: obs.pollutants,
        weather,
        lastUpdated: obs.timestamp,
        dataQualityScore: obs.dataQualityScore,
        dataSource: {
          name: obs.source,
          type: 'OBSERVED_GROUND',
          isDemo: obs.isDemo,
          provider: this.primaryProvider.name
        }
      });
    }

    return summaries;
  }

  async getHistoricalTrend(locationId: string, hours: number = 24): Promise<{
    timestamp: string;
    aqi: number;
    category: string;
    pm25: number;
    pm10: number;
    no2: number;
    dominantPollutant: string;
  }[]> {
    const history = await this.primaryProvider.getHistoricalObservations(locationId, hours);
    return history.map(h => {
      const aqiRes = calculateIndianAQI(h.pollutants);
      return {
        timestamp: h.timestamp,
        aqi: aqiRes.aqi,
        category: aqiRes.category,
        pm25: h.pollutants.pm25 ?? 0,
        pm10: h.pollutants.pm10 ?? 0,
        no2: h.pollutants.no2 ?? 0,
        dominantPollutant: aqiRes.dominantPollutant ?? 'pm25'
      };
    });
  }

  calculateAqiCustom(pollutants: PollutantValues): AqiCalculationResult {
    return calculateIndianAQI(pollutants);
  }
}
