import { Request, Response } from 'express';
import { AirQualityService } from '../services/airQualityService.js';
import { MlClientService } from '../services/mlClientService.js';

export class ForecastController {
  private mlClientService: MlClientService;
  private airQualityService: AirQualityService;

  constructor(mlClientService: MlClientService, airQualityService: AirQualityService) {
    this.mlClientService = mlClientService;
    this.airQualityService = airQualityService;
  }

  getForecast = async (req: Request, res: Response): Promise<void> => {
    try {
      const locationId = (req.query.locationId as string) || 'delhi-anand-vihar';
      const location = await this.airQualityService.getStationById(locationId);

      if (!location) {
        res.status(404).json({ error: `Station '${locationId}' not found` });
        return;
      }

      const forecast = await this.mlClientService.get24HourForecast(location);
      res.json(forecast);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to generate 24-hour ML forecast' });
    }
  };

  getModelMetadata = async (_req: Request, res: Response): Promise<void> => {
    try {
      const metadata = this.mlClientService.getModelPerformanceMetadata();
      res.json(metadata);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to retrieve model performance metadata' });
    }
  };
}
