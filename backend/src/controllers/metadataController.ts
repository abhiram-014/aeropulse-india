import { Request, Response } from 'express';
import { CPCB_BREAKPOINTS, POLLUTANT_METADATA } from '../aqi/breakpoints.js';
import { CPCB_CATEGORIES } from '../aqi/classification.js';

export class MetadataController {
  getDataSources = async (_req: Request, res: Response): Promise<void> => {
    res.json({
      activeMode: process.env.DATA_MODE || 'demo',
      sources: [
        {
          name: 'Central Pollution Control Board (CPCB) / CAAQMS',
          type: 'Ground-Based Monitoring',
          role: 'Primary Air Quality Station Observations',
          coverage: 'Major Indian Metropolitan & Tier-2 Urban Centers',
          parameters: ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3', 'NH3', 'Pb'],
          status: 'Active',
          updateFrequency: 'Hourly'
        },
        {
          name: 'Open-Meteo Weather API',
          type: 'Numerical Weather Prediction (NWP)',
          role: 'Meteorological Covariates for Dispersion Modeling',
          coverage: 'Global High-Resolution (1-11 km)',
          parameters: ['Temperature', 'Relative Humidity', 'Surface Pressure', 'Wind Speed/Direction', 'Precipitation', 'Boundary Layer Height'],
          status: 'Active',
          updateFrequency: 'Hourly'
        },
        {
          name: 'MOSDAC / ISRO INSAT-3DR L2B AOD',
          type: 'Geostationary Satellite Remote Sensing',
          role: 'Columnar Aerosol Optical Depth Context (Non-AQI Direct)',
          coverage: 'Indian Subcontinent & Oceanic Region',
          parameters: ['Aerosol Optical Depth (550nm)', 'Cloud Mask', 'Brightness Temperature'],
          status: 'Integrated (xarray NetCDF-4 Ingestion Pipeline)',
          scientificDisclaimer: 'INSAT AOD is a columnar optical measurement and is NOT ground-level AQI. Used strictly as a regional contextual covariate.'
        },
        {
          name: 'OpenAQ Community Platform',
          type: 'Global Open Sensor Aggregator',
          role: 'Public REST API Ingestion Endpoint',
          coverage: 'Global & Indian Open CAAQMS Stations',
          parameters: ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3'],
          status: 'Available'
        }
      ],
      systemInfo: {
        engine: 'CPCB 2014 Indian National AQI Multi-Pollutant Engine',
        mlModel: 'XGBoost Multistep Autoregressive Regressor v1.4',
        uncertaintyMethod: 'Time-Series Chronological Residual Quantiles (90% CI)',
        version: '1.0.0-prod'
      }
    });
  };

  getAqiMethodology = async (_req: Request, res: Response): Promise<void> => {
    res.json({
      standard: 'CPCB National Air Quality Index (NAQI) Standard (2014)',
      aggregationMethod: 'Maximum Sub-Index (AQI = max(I_1, I_2, ..., I_n))',
      validityRequirement: 'Minimum 3 pollutants must be monitored, of which at least one MUST be PM2.5 or PM10.',
      categories: CPCB_CATEGORIES,
      breakpoints: CPCB_BREAKPOINTS,
      pollutants: POLLUTANT_METADATA
    });
  };
}
