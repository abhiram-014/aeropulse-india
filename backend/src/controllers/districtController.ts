import { Request, Response } from 'express';
import { DistrictAirQualityService } from '../services/districtAirQualityService.js';
import { BoundaryService } from '../services/boundaryService.js';
import { AiAssistantService } from '../services/aiAssistantService.js';

export class DistrictController {
  private districtService: DistrictAirQualityService;
  private boundaryService: BoundaryService;
  private aiService: AiAssistantService;

  constructor(
    districtService: DistrictAirQualityService,
    boundaryService: BoundaryService,
    aiService: AiAssistantService
  ) {
    this.districtService = districtService;
    this.boundaryService = boundaryService;
    this.aiService = aiService;
  }

  getStates = async (_req: Request, res: Response): Promise<void> => {
    try {
      const states = this.districtService.getStates();
      res.json(states);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve states list' });
    }
  };

  getDistricts = async (req: Request, res: Response): Promise<void> => {
    try {
      const state = (req.query.state as string) || 'Telangana';
      const districts = this.districtService.getDistrictsForState(state);
      res.json(districts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve districts' });
    }
  };

  getDistrictAirQuality = async (req: Request, res: Response): Promise<void> => {
    try {
      const state = (req.query.state as string) || 'Telangana';
      const district = (req.query.district as string) || 'Hyderabad';
      const todayStr = new Date().toISOString().substring(0, 10);
      const date = (req.query.date as string) || todayStr;

      const summary = await this.districtService.getDistrictAirQuality(state, district, date);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve district air quality' });
    }
  };

  getHistoricalTrend = async (req: Request, res: Response): Promise<void> => {
    try {
      const state = (req.query.state as string) || 'Telangana';
      const district = (req.query.district as string) || 'Hyderabad';
      const period = (req.query.period as any) || '30d';

      const history = await this.districtService.getHistoricalTrend(state, district, period);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve historical trend' });
    }
  };

  getYearlyChange = async (req: Request, res: Response): Promise<void> => {
    try {
      const state = (req.query.state as string) || 'Telangana';
      const district = (req.query.district as string) || 'Hyderabad';

      const yearly = await this.districtService.getYearlyChange(state, district);
      res.json(yearly);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve yearly change' });
    }
  };

  compareDistricts = async (req: Request, res: Response): Promise<void> => {
    try {
      const state = (req.query.state as string) || 'Telangana';
      const todayStr = new Date().toISOString().substring(0, 10);
      const date = (req.query.date as string) || todayStr;
      const order = ((req.query.order as string) || 'best') as 'best' | 'worst';

      const result = await this.districtService.compareDistrictsInState(state, date, order);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to compare districts' });
    }
  };

  compareMajorCities = async (req: Request, res: Response): Promise<void> => {
    try {
      const todayStr = new Date().toISOString().substring(0, 10);
      const date = (req.query.date as string) || todayStr;

      const result = await this.districtService.compareMajorCities(date);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to compare major cities' });
    }
  };

  getDistrictBoundary = async (req: Request, res: Response): Promise<void> => {
    try {
      const state = (req.query.state as string) || 'Telangana';
      const district = (req.query.district as string) || 'Hyderabad';

      const feature = this.boundaryService.getDistrictBoundary(state, district);
      if (!feature) {
        res.status(404).json({ error: `Boundary not found for ${district}, ${state}` });
        return;
      }
      res.json(feature);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve district boundary' });
    }
  };

  askAi = async (req: Request, res: Response): Promise<void> => {
    try {
      const { question, context } = req.body;
      if (!question || !context) {
        res.status(400).json({ error: 'question and context are required' });
        return;
      }

      const response = await this.aiService.generateResponse(question, context);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate AI guidance' });
    }
  };
}
