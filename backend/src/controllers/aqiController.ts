import { Request, Response } from 'express';
import { z } from 'zod';
import { calculateIndianAQI } from '../aqi/indianAQI.js';
import { getHealthRecommendation } from '../health/healthEngine.js';
import { AirQualityService } from '../services/airQualityService.js';

const calculateAqiSchema = z.object({
  pm25: z.number().nullable().optional(),
  pm10: z.number().nullable().optional(),
  no2: z.number().nullable().optional(),
  so2: z.number().nullable().optional(),
  co: z.number().nullable().optional(),
  o3: z.number().nullable().optional(),
  nh3: z.number().nullable().optional(),
  pb: z.number().nullable().optional()
});

export class AqiController {
  private airQualityService: AirQualityService;

  constructor(airQualityService: AirQualityService) {
    this.airQualityService = airQualityService;
  }

  calculateAqi = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = calculateAqiSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'Invalid pollutant payload', details: parsed.error.issues });
        return;
      }

      const result = calculateIndianAQI(parsed.data);
      const health = getHealthRecommendation(result.category, result.dominantPollutant);

      res.json({
        aqiResult: result,
        healthRecommendation: health
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error calculating AQI' });
    }
  };

  getHealthAdvisory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = (req.query.category as string) || 'Moderate';
      const dominant = req.query.dominant as any;
      const health = getHealthRecommendation(category as any, dominant);
      res.json(health);
    } catch (error: any) {
      res.status(500).json({ error: 'Error generating health advisory' });
    }
  };
}
