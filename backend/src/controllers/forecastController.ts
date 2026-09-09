import { Request, Response } from 'express';
import { AirQualityService } from '../services/airQualityService.js';
import { MlClientService } from '../services/mlClientService.js';
import { getDistrictInfo, getStationsForDistrict } from '../data/indiaAdminData.js';
import { LocationInfo } from '../types/index.js';

export class ForecastController {
  private mlClientService: MlClientService;
  private airQualityService: AirQualityService;

  constructor(mlClientService: MlClientService, airQualityService: AirQualityService) {
    this.mlClientService = mlClientService;
    this.airQualityService = airQualityService;
  }

  getForecast = async (req: Request, res: Response): Promise<void> => {
    try {
      const locationId = req.query.locationId as string | undefined;
      const state = req.query.state as string | undefined;
      const district = req.query.district as string | undefined;

      let location: LocationInfo | undefined;

      // 1. If state and district are provided, respect the district context
      if (state && district) {
        const districtStations = getStationsForDistrict(state, district);
        if (districtStations.length > 0) {
          if (locationId) {
            location = districtStations.find(s => s.id === locationId);
          }
          if (!location) {
            location = districtStations[0];
          }
        } else {
          // District has no direct monitoring station in list, resolve centroid
          const districtInfo = getDistrictInfo(state, district);
          if (districtInfo) {
            location = {
              id: `dist-${state.toLowerCase().replace(/\s+/g, '-')}-${district.toLowerCase().replace(/\s+/g, '-')}`,
              name: `${districtInfo.name} District Center`,
              city: districtInfo.name,
              state: state,
              country: 'India',
              district: districtInfo.name,
              latitude: districtInfo.centroid[0],
              longitude: districtInfo.centroid[1]
            };
          }
        }
      }

      // 2. If not resolved yet and locationId is provided
      if (!location && locationId) {
        location = await this.airQualityService.getStationById(locationId);
      }

      // 3. Fallback to default only if no params were passed at all
      if (!location && !state && !district && !locationId) {
        location = await this.airQualityService.getStationById('delhi-anand-vihar');
      }

      if (!location) {
        res.status(404).json({ error: 'Location not found', available: false });
        return;
      }

      const forecast = await this.mlClientService.get24HourForecast(location);
      if (!forecast) {
        res.status(404).json({ error: 'Forecast data unavailable for this location', available: false });
        return;
      }

      res.json(forecast);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to generate 24-hour ML forecast', available: false });
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
