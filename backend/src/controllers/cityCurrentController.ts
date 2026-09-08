import { Request, Response } from 'express';
import { AirQualityService } from '../services/airQualityService.js';

export class CityCurrentController {
  constructor(private airQualityService: AirQualityService) {}

  /**
   * GET /api/cities/current
   * Returns the latest AQI for each major city that has a real station.
   */
  getCurrentCityAqi = async (req: Request, res: Response): Promise<void> => {
    try {
      const summaries = await this.airQualityService.getAllStationSummaries();
      const cityMap: Record<string, any> = {};
      for (const s of summaries) {
        const cityKey = s.location.city.toLowerCase();
        if (!cityMap[cityKey] && s.aqiResult?.aqi !== undefined) {
          const category = s.aqiResult.category;
          const color =
            category === 'Good' ? '#10B981' :
            category === 'Satisfactory' ? '#84CC16' :
            category === 'Moderate' ? '#F59E0B' :
            category === 'Poor' ? '#F97316' :
            category === 'Very Poor' ? '#EF4444' :
            '#6B7280';
          cityMap[cityKey] = {
            id: cityKey,
            city: s.location.city,
            aqi: s.aqiResult.aqi,
            category,
            color,
          };
        }
      }
      res.json({ data: Object.values(cityMap) });
    } catch (err) {
      console.error('CityCurrentController error', err);
      res.status(500).json({ error: 'Failed to fetch city AQI' });
    }
  };
}
