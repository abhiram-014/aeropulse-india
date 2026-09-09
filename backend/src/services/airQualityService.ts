import { calculateIndianAQI } from '../aqi/indianAQI.js';
import { AirQualityProvider } from '../providers/baseProvider.js';
import { DemoDataProvider, INDIAN_MONITORING_STATIONS } from '../providers/demoDataProvider.js';
import { OpenAqAdapter } from '../providers/openAqAdapter.js';
import { 
  AirQualityStationSummary, 
  AqiCalculationResult, 
  LocationInfo, 
  OpenAqStationMetadata,
  PollutantType,
  PollutantValues 
} from '../types/index.js';
import { MosdacService } from './mosdacService.js';
import { WeatherService } from './weatherService.js';

export class AirQualityService {
  private primaryProvider: AirQualityProvider;
  private demoProvider: DemoDataProvider;
  private openAqAdapter: OpenAqAdapter;
  private weatherService: WeatherService;
  private mosdacService: MosdacService;

  constructor(weatherService: WeatherService) {
    this.demoProvider = new DemoDataProvider();
    this.openAqAdapter = new OpenAqAdapter();
    const dataMode = process.env.DATA_MODE || 'demo';
    this.primaryProvider = dataMode === 'live' ? this.openAqAdapter : this.demoProvider;
    this.weatherService = weatherService;
    this.mosdacService = new MosdacService();
  }

  async getStations(): Promise<LocationInfo[]> {
    return INDIAN_MONITORING_STATIONS;
  }

  async getOpenAqStations(options?: { state?: string; limit?: number }): Promise<OpenAqStationMetadata[]> {
    return this.openAqAdapter.getStationHierarchy(options);
  }

  /**
   * Pipeline: REAL OPENAQ MEASUREMENTS -> pollutant normalization -> existing CPCB AQI engine -> AQI + category + dominant pollutant
   *
   * Constraints:
   * 1. Uses ONLY real OpenAQ measurements.
   * 2. Preserves CPCB validity rules (minimum 3 pollutants + at least 1 particulate PM2.5 or PM10).
   * 3. If validity requirements are not satisfied, returns AQI as unavailable / insufficient data.
   * 4. Missing pollutants remain null/undefined; never replaced with 0 or synthetic values.
   */
  async getLiveRealAqi(locationId: string): Promise<{
    aqi: number | null;
    category: string;
    dominantPollutant: PollutantType | null;
    isValid: boolean;
    validationMessage?: string;
    pollutantValues: PollutantValues;
    timestamp: string;
    station: string;
    state: string;
    district: string | null;
    city: string;
    source: string;
    isDemo: false;
  } | null> {
    const obs = await this.openAqAdapter.getCurrentObservation(locationId);
    if (!obs) return null;

    const aqiResult = calculateIndianAQI(obs.pollutants);

    return {
      aqi: aqiResult.isValid ? aqiResult.aqi : null,
      category: aqiResult.isValid ? aqiResult.category : 'Insufficient Data',
      dominantPollutant: aqiResult.isValid ? aqiResult.dominantPollutant : null,
      isValid: aqiResult.isValid,
      validationMessage: aqiResult.validationMessage,
      pollutantValues: obs.pollutants,
      timestamp: obs.timestamp,
      station: obs.location.name,
      state: obs.location.state,
      district: obs.location.district || null,
      city: obs.location.city,
      source: 'OpenAQ v3 Live Telemetry',
      isDemo: false
    };
  }

  // Historical AQI retrieval for a specific date
  async getHistoricalAqi(locationId: string, date: string): Promise<{
    aqi: number | null;
    category: string;
    dominantPollutant: PollutantType | null;
    isValid: boolean;
    validationMessage?: string;
    pollutantValues: PollutantValues;
    timestamp: string;
    station: string;
    state: string;
    district: string | null;
    city: string;
    source: string;
    isDemo: false;
  } | null> {
    // Use OpenAQ Adapter to fetch historical measurements for the given date
    const measurements = await this.openAqAdapter.getHistoricalMeasurements(locationId, date);
    if (!measurements) return null;

    const aqiResult = calculateIndianAQI(measurements);
    // Retrieve location metadata similar to current observation (reuse getCurrentObservation for location info)
    const obs = await this.openAqAdapter.getCurrentObservation(locationId);
    const location = obs ? obs.location : { name: '', city: '', state: '', district: null, country: 'India', latitude: 0, longitude: 0, id: locationId };

    return {
      aqi: aqiResult.isValid ? aqiResult.aqi : null,
      category: aqiResult.isValid ? aqiResult.category : 'Insufficient Data',
      dominantPollutant: aqiResult.isValid ? aqiResult.dominantPollutant : null,
      isValid: aqiResult.isValid,
      validationMessage: aqiResult.validationMessage,
      pollutantValues: measurements,
      timestamp: new Date().toISOString(),
      station: location.name,
      state: location.state,
      district: location.district || null,
      city: location.city,
      source: 'OpenAQ v3 Historical Measurements',
      isDemo: false
    };
  }

  async getStationById(id: string): Promise<LocationInfo | undefined> {
    return INDIAN_MONITORING_STATIONS.find(s => s.id === id);
  }

  async getCurrentStationSummary(locationId: string): Promise<AirQualityStationSummary | null> {
    const isNumeric = /^\d+$/.test(locationId);
    const provider = (isNumeric || process.env.DATA_MODE === 'live') ? this.openAqAdapter : this.primaryProvider;
    const obs = await provider.getCurrentObservation(locationId);
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
