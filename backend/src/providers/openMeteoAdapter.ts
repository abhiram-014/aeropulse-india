import axios from 'axios';
import { WeatherObservation } from '../types/index.js';
import { WeatherProvider } from './baseProvider.js';

export class OpenMeteoAdapter implements WeatherProvider {
  name = 'OPEN_METEO_REALTIME_API';
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';

  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherObservation> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,precipitation,cloud_cover',
          timezone: 'auto'
        },
        timeout: 4000
      });

      const current = response.data?.current;
      if (!current) throw new Error('Invalid Open-Meteo current response payload');

      return {
        temperature: current.temperature_2m,
        relativeHumidity: current.relative_humidity_2m,
        surfacePressure: current.surface_pressure,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        rainfall: current.precipitation ?? 0,
        cloudCover: current.cloud_cover ?? 0,
        boundaryLayerHeight: 650, // default estimate if not requested
        source: 'OPEN_METEO_REALTIME_API',
        timestamp: current.time ? new Date(current.time).toISOString() : new Date().toISOString()
      };
    } catch (error) {
      // Return realistic fallback on network failure
      const now = new Date();
      return {
        temperature: 29.5,
        relativeHumidity: 60,
        surfacePressure: 1011.8,
        windSpeed: 3.2,
        windDirection: 280,
        rainfall: 0,
        cloudCover: 20,
        boundaryLayerHeight: 800,
        source: 'OPEN_METEO_FALLBACK',
        timestamp: now.toISOString()
      };
    }
  }

  async getHourlyForecastWeather(latitude: number, longitude: number, hours: number = 24): Promise<WeatherObservation[]> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          latitude,
          longitude,
          hourly: 'temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,precipitation,cloud_cover',
          forecast_hours: hours,
          timezone: 'auto'
        },
        timeout: 4000
      });

      const hourly = response.data?.hourly;
      if (!hourly || !hourly.time) throw new Error('Invalid Open-Meteo hourly response');

      const results: WeatherObservation[] = [];
      const count = Math.min(hours, hourly.time.length);

      for (let i = 0; i < count; i++) {
        results.push({
          temperature: hourly.temperature_2m[i],
          relativeHumidity: hourly.relative_humidity_2m[i],
          surfacePressure: hourly.surface_pressure[i],
          windSpeed: hourly.wind_speed_10m[i],
          windDirection: hourly.wind_direction_10m[i],
          rainfall: hourly.precipitation[i] ?? 0,
          cloudCover: hourly.cloud_cover[i] ?? 0,
          boundaryLayerHeight: 500 + 400 * (1 - Math.abs(12 - (i % 24)) / 12),
          source: 'OPEN_METEO_REALTIME_API',
          timestamp: new Date(hourly.time[i]).toISOString()
        });
      }

      return results;
    } catch (error) {
      // Generate standard hourly projection fallback
      const now = new Date();
      const results: WeatherObservation[] = [];
      for (let i = 1; i <= hours; i++) {
        const future = new Date(now.getTime() + i * 3600 * 1000);
        results.push({
          temperature: 28 + 4 * Math.sin(((future.getHours() - 8) / 24) * 2 * Math.PI),
          relativeHumidity: 60 - 10 * Math.sin(((future.getHours() - 8) / 24) * 2 * Math.PI),
          surfacePressure: 1012,
          windSpeed: 3.0,
          windDirection: 270,
          rainfall: 0,
          cloudCover: 10,
          source: 'OPEN_METEO_FALLBACK',
          timestamp: future.toISOString()
        });
      }
      return results;
    }
  }
}
