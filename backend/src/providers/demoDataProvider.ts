import { LocationInfo, PollutantValues, WeatherObservation } from '../types/index.js';
import { AirQualityProvider, ObservationRecord, WeatherProvider } from './baseProvider.js';

export const INDIAN_MONITORING_STATIONS: LocationInfo[] = [
  {
    id: 'delhi-anand-vihar',
    name: 'Anand Vihar CAAQMS',
    city: 'Delhi',
    state: 'Delhi',
    country: 'IN',
    latitude: 28.6476,
    longitude: 77.3158,
    elevation: 216.0,
    stationType: 'CAAQMS_URBAN'
  },
  {
    id: 'delhi-ito',
    name: 'ITO Cross Road',
    city: 'Delhi',
    state: 'Delhi',
    country: 'IN',
    latitude: 28.6289,
    longitude: 77.2405,
    elevation: 218.0,
    stationType: 'CAAQMS_TRAFFIC'
  },
  {
    id: 'mumbai-bandra',
    name: 'Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'IN',
    latitude: 19.0657,
    longitude: 72.8683,
    elevation: 14.0,
    stationType: 'CAAQMS_URBAN'
  },
  {
    id: 'mumbai-worli',
    name: 'Worli Sea Face',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'IN',
    latitude: 19.0178,
    longitude: 72.8178,
    elevation: 8.0,
    stationType: 'CAAQMS_COASTAL'
  },
  {
    id: 'bengaluru-btm',
    name: 'BTM Layout CAAQMS',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'IN',
    latitude: 12.9166,
    longitude: 77.6101,
    elevation: 920.0,
    stationType: 'CAAQMS_RESIDENTIAL'
  },
  {
    id: 'bengaluru-silk-board',
    name: 'Central Silk Board',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'IN',
    latitude: 12.9174,
    longitude: 77.6229,
    elevation: 915.0,
    stationType: 'CAAQMS_TRAFFIC'
  },
  {
    id: 'kolkata-victoria',
    name: 'Victoria Memorial Hall',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'IN',
    latitude: 22.5448,
    longitude: 88.3426,
    elevation: 9.0,
    stationType: 'CAAQMS_URBAN'
  },
  {
    id: 'kolkata-jadavpur',
    name: 'Jadavpur University',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'IN',
    latitude: 22.4988,
    longitude: 88.3712,
    elevation: 11.0,
    stationType: 'CAAQMS_SUBURBAN'
  },
  {
    id: 'chennai-alagappa',
    name: 'Alagappa Nagar CAAQMS',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'IN',
    latitude: 13.0827,
    longitude: 80.2707,
    elevation: 6.0,
    stationType: 'CAAQMS_URBAN'
  },
  {
    id: 'hyderabad-sanathnagar',
    name: 'Sanathnagar Industrial Area',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'IN',
    latitude: 17.4578,
    longitude: 78.4398,
    elevation: 536.0,
    stationType: 'CAAQMS_INDUSTRIAL'
  },
  {
    id: 'ahmedabad-maninagar',
    name: 'Maninagar Station',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'IN',
    latitude: 22.9978,
    longitude: 72.6033,
    elevation: 53.0,
    stationType: 'CAAQMS_URBAN'
  },
  {
    id: 'pune-shivajinagar',
    name: 'Shivajinagar Station',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'IN',
    latitude: 18.5314,
    longitude: 73.8446,
    elevation: 560.0,
    stationType: 'CAAQMS_URBAN'
  },
  {
    id: 'lucknow-lalbagh',
    name: 'Lalbagh Municipal Office',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'IN',
    latitude: 26.8467,
    longitude: 80.9462,
    elevation: 123.0,
    stationType: 'CAAQMS_URBAN'
  },
  {
    id: 'patna-muradpur',
    name: 'Muradpur CAAQMS',
    city: 'Patna',
    state: 'Bihar',
    country: 'IN',
    latitude: 25.6127,
    longitude: 85.1588,
    elevation: 53.0,
    stationType: 'CAAQMS_URBAN'
  },
  {
    id: 'jaipur-shastri-nagar',
    name: 'Shastri Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'IN',
    latitude: 26.9388,
    longitude: 75.8012,
    elevation: 431.0,
    stationType: 'CAAQMS_URBAN'
  },
  {
    id: 'chandigarh-sector-22',
    name: 'Sector 22 CAAQMS',
    city: 'Chandigarh',
    state: 'Chandigarh',
    country: 'IN',
    latitude: 30.7298,
    longitude: 76.7767,
    elevation: 321.0,
    stationType: 'CAAQMS_URBAN'
  }
];

// Baseline regional pollutant characteristics (µg/m³)
interface CityProfile {
  basePm25: number;
  basePm10: number;
  baseNo2: number;
  baseSo2: number;
  baseCo: number; // mg/m³
  baseO3: number;
  baseNh3: number;
  baseTemp: number; // °C
  baseHumidity: number; // %
}

const CITY_PROFILES: Record<string, CityProfile> = {
  'Delhi': { basePm25: 145, basePm10: 240, baseNo2: 68, baseSo2: 24, baseCo: 2.4, baseO3: 42, baseNh3: 38, baseTemp: 28, baseHumidity: 55 },
  'Lucknow': { basePm25: 130, basePm10: 215, baseNo2: 52, baseSo2: 18, baseCo: 1.9, baseO3: 38, baseNh3: 32, baseTemp: 29, baseHumidity: 58 },
  'Patna': { basePm25: 155, basePm10: 250, baseNo2: 58, baseSo2: 22, baseCo: 2.2, baseO3: 35, baseNh3: 44, baseTemp: 30, baseHumidity: 62 },
  'Kolkata': { basePm25: 85, basePm10: 155, baseNo2: 46, baseSo2: 16, baseCo: 1.4, baseO3: 34, baseNh3: 26, baseTemp: 31, baseHumidity: 75 },
  'Mumbai': { basePm25: 65, basePm10: 120, baseNo2: 44, baseSo2: 19, baseCo: 1.2, baseO3: 48, baseNh3: 18, baseTemp: 32, baseHumidity: 78 },
  'Bengaluru': { basePm25: 38, basePm10: 68, baseNo2: 32, baseSo2: 11, baseCo: 0.8, baseO3: 36, baseNh3: 15, baseTemp: 24, baseHumidity: 65 },
  'Chennai': { basePm25: 42, basePm10: 76, baseNo2: 28, baseSo2: 14, baseCo: 0.9, baseO3: 44, baseNh3: 16, baseTemp: 33, baseHumidity: 76 },
  'Hyderabad': { basePm25: 58, basePm10: 105, baseNo2: 36, baseSo2: 15, baseCo: 1.1, baseO3: 45, baseNh3: 20, baseTemp: 29, baseHumidity: 60 },
  'Ahmedabad': { basePm25: 78, basePm10: 140, baseNo2: 42, baseSo2: 21, baseCo: 1.5, baseO3: 52, baseNh3: 24, baseTemp: 34, baseHumidity: 48 },
  'Pune': { basePm25: 48, basePm10: 88, baseNo2: 34, baseSo2: 13, baseCo: 1.0, baseO3: 40, baseNh3: 17, baseTemp: 27, baseHumidity: 62 },
  'Jaipur': { basePm25: 92, basePm10: 168, baseNo2: 40, baseSo2: 17, baseCo: 1.3, baseO3: 49, baseNh3: 22, baseTemp: 33, baseHumidity: 42 },
  'Chandigarh': { basePm25: 62, basePm10: 112, baseNo2: 30, baseSo2: 12, baseCo: 1.0, baseO3: 38, baseNh3: 19, baseTemp: 27, baseHumidity: 56 }
};

export class DemoDataProvider implements AirQualityProvider, WeatherProvider {
  name = 'CPCB_SYNTHETIC_DEMO_ENGINE';

  private getProfile(city: string): CityProfile {
    return CITY_PROFILES[city] || CITY_PROFILES['Delhi'];
  }

  /**
   * Generates realistic diurnal atmospheric variations:
   * - Particulates (PM2.5, PM10) peak in morning (07:00-09:00) and late evening (20:00-23:00) due to traffic + boundary layer compression
   * - Ozone (O3) peaks mid-afternoon (13:00-16:00) via solar photochemical reactions
   * - NO2 peaks during rush hours
   */
  private generatePollutants(city: string, date: Date): PollutantValues {
    const profile = this.getProfile(city);
    const hour = date.getHours() + date.getMinutes() / 60;

    // Diurnal atmospheric boundary layer curve (lowest at night/morning -> highest concentration, highest in afternoon -> dilution)
    const boundaryLayerEffect = Math.cos(((hour - 5) / 24) * 2 * Math.PI); // max at 5 AM (+1), min at 5 PM (-1)
    
    // Traffic Rush Hour Peaks (8-10 AM and 7-9 PM)
    const morningRush = Math.exp(-Math.pow((hour - 8.5) / 1.8, 2));
    const eveningRush = Math.exp(-Math.pow((hour - 20) / 2.2, 2));
    const trafficFactor = 0.3 * morningRush + 0.35 * eveningRush;

    // Photochemical solar factor for Ozone
    const solarFactor = Math.max(0, Math.sin(((hour - 7) / 12) * Math.PI));

    const pm25Mult = 1.0 + 0.35 * boundaryLayerEffect + trafficFactor;
    const pm10Mult = 1.0 + 0.30 * boundaryLayerEffect + 1.2 * trafficFactor;
    const no2Mult = 0.8 + 0.6 * trafficFactor + 0.15 * boundaryLayerEffect;
    const o3Mult = 0.4 + 1.2 * Math.pow(solarFactor, 1.4);

    return {
      pm25: Number((profile.basePm25 * pm25Mult).toFixed(1)),
      pm10: Number((profile.basePm10 * pm10Mult).toFixed(1)),
      no2: Number((profile.baseNo2 * no2Mult).toFixed(1)),
      so2: Number((profile.baseSo2 * (0.9 + 0.2 * boundaryLayerEffect)).toFixed(1)),
      co: Number((profile.baseCo * (0.85 + 0.4 * trafficFactor)).toFixed(2)),
      o3: Number((profile.baseO3 * o3Mult).toFixed(1)),
      nh3: Number((profile.baseNh3 * (0.9 + 0.15 * boundaryLayerEffect)).toFixed(1)),
      pb: Number((0.4 + 0.3 * trafficFactor).toFixed(2))
    };
  }

  async getCurrentObservation(locationId: string): Promise<ObservationRecord | null> {
    const station = INDIAN_MONITORING_STATIONS.find(s => s.id === locationId);
    if (!station) return null;

    const now = new Date();
    return {
      location: station,
      pollutants: this.generatePollutants(station.city, now),
      timestamp: now.toISOString(),
      source: 'CPCB_SIMULATED_DEMO',
      isDemo: true,
      dataQualityScore: 0.98
    };
  }

  async getHistoricalObservations(locationId: string, hours: number = 24): Promise<ObservationRecord[]> {
    const station = INDIAN_MONITORING_STATIONS.find(s => s.id === locationId);
    if (!station) return [];

    const now = new Date();
    const records: ObservationRecord[] = [];

    for (let i = hours; i >= 0; i--) {
      const pastTime = new Date(now.getTime() - i * 60 * 60 * 1000);
      records.push({
        location: station,
        pollutants: this.generatePollutants(station.city, pastTime),
        timestamp: pastTime.toISOString(),
        source: 'CPCB_SIMULATED_DEMO',
        isDemo: true,
        dataQualityScore: 0.98
      });
    }

    return records;
  }

  async getAllStations(): Promise<ObservationRecord[]> {
    const now = new Date();
    return INDIAN_MONITORING_STATIONS.map(station => ({
      location: station,
      pollutants: this.generatePollutants(station.city, now),
      timestamp: now.toISOString(),
      source: 'CPCB_SIMULATED_DEMO',
      isDemo: true,
      dataQualityScore: 0.98
    }));
  }

  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherObservation> {
    const now = new Date();
    const hour = now.getHours();
    
    // Find closest city profile
    let closestStation = INDIAN_MONITORING_STATIONS[0];
    let minDistance = Number.MAX_VALUE;
    for (const s of INDIAN_MONITORING_STATIONS) {
      const d = Math.hypot(s.latitude - latitude, s.longitude - longitude);
      if (d < minDistance) {
        minDistance = d;
        closestStation = s;
      }
    }
    const profile = this.getProfile(closestStation.city);

    // Diurnal temperature cycle: peak around 14:00, minimum around 05:00
    const tempOffset = 6 * Math.sin(((hour - 8) / 24) * 2 * Math.PI);
    const humidityOffset = -15 * Math.sin(((hour - 8) / 24) * 2 * Math.PI);

    return {
      temperature: Number((profile.baseTemp + tempOffset).toFixed(1)),
      relativeHumidity: Math.min(98, Math.max(20, Number((profile.baseHumidity + humidityOffset).toFixed(1)))),
      surfacePressure: 1012.5,
      windSpeed: Number((2.8 + 1.8 * Math.sin((hour / 24) * 2 * Math.PI)).toFixed(1)), // m/s
      windDirection: 290, // North-Westerly
      rainfall: 0.0,
      cloudCover: 15,
      boundaryLayerHeight: Math.round(400 + 1200 * Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI))),
      source: 'OPEN_METEO_SYNTHETIC',
      timestamp: now.toISOString()
    };
  }

  async getHourlyForecastWeather(latitude: number, longitude: number, hours: number = 24): Promise<WeatherObservation[]> {
    const observations: WeatherObservation[] = [];
    const now = new Date();

    for (let i = 1; i <= hours; i++) {
      const futureTime = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hour = futureTime.getHours();
      const tempOffset = 6 * Math.sin(((hour - 8) / 24) * 2 * Math.PI);
      const humidityOffset = -15 * Math.sin(((hour - 8) / 24) * 2 * Math.PI);

      observations.push({
        temperature: Number((28 + tempOffset).toFixed(1)),
        relativeHumidity: Math.min(95, Math.max(25, Number((55 + humidityOffset).toFixed(1)))),
        surfacePressure: 1012.0,
        windSpeed: Number((2.5 + 1.5 * Math.sin((hour / 24) * 2 * Math.PI)).toFixed(1)),
        windDirection: 285,
        rainfall: 0.0,
        cloudCover: 20,
        boundaryLayerHeight: Math.round(400 + 1200 * Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI))),
        source: 'OPEN_METEO_SYNTHETIC',
        timestamp: futureTime.toISOString()
      });
    }

    return observations;
  }
}
