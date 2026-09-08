import { Request, Response } from 'express';
import { AirQualityService } from '../services/airQualityService.js';
import { WeatherService } from '../services/weatherService.js';

export class ObservationController {
  private airQualityService: AirQualityService;
  private weatherService: WeatherService;

  constructor(airQualityService: AirQualityService, weatherService: WeatherService) {
    this.airQualityService = airQualityService;
    this.weatherService = weatherService;
  }

  getLocations = async (_req: Request, res: Response): Promise<void> => {
    try {
      const locations = await this.airQualityService.getStations();
      res.json(locations);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to retrieve monitoring locations' });
    }
  };

  getCurrentAirQuality = async (req: Request, res: Response): Promise<void> => {
    try {
      const locationId = (req.query.locationId as string) || 'delhi-anand-vihar';
      const summary = await this.airQualityService.getCurrentStationSummary(locationId);

      if (!summary) {
        res.status(404).json({ error: `Location '${locationId}' not found` });
        return;
      }

      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to retrieve current air quality observation' });
    }
  };

  getAllStationMapData = async (_req: Request, res: Response): Promise<void> => {
    try {
      const summaries = await this.airQualityService.getAllStationSummaries();
      res.json(summaries);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to retrieve station map observations' });
    }
  };

  getHistoricalTrend = async (req: Request, res: Response): Promise<void> => {
    try {
      const locationId = (req.query.locationId as string) || 'delhi-anand-vihar';
      const hours = parseInt(req.query.hours as string, 10) || 24;

      const history = await this.airQualityService.getHistoricalTrend(locationId, hours);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to retrieve historical air quality trend' });
    }
  };

  getCurrentWeather = async (req: Request, res: Response): Promise<void> => {
    try {
      const lat = parseFloat(req.query.lat as string) || 28.6476;
      const lon = parseFloat(req.query.lon as string) || 77.3158;

      const weather = await this.weatherService.getCurrentWeather(lat, lon);
      res.json(weather);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to retrieve meteorological observation' });
    }
  };
}
