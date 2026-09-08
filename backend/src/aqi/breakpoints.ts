import { BreakpointRange, PollutantType } from '../types/index.js';

/**
 * CPCB (Central Pollution Control Board, India) National Air Quality Index Breakpoints
 * Reference: CPCB Guidelines for Calculation of AQI (2014)
 */
export const CPCB_BREAKPOINTS: Record<PollutantType, BreakpointRange[]> = {
  pm25: [
    { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },
    { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100 },
    { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200 },
    { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300 },
    { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 },
    { cLow: 251, cHigh: 380, iLow: 401, iHigh: 500 }
  ],
  pm10: [
    { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
    { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
    { cLow: 101, cHigh: 250, iLow: 101, iHigh: 200 },
    { cLow: 251, cHigh: 350, iLow: 201, iHigh: 300 },
    { cLow: 351, cHigh: 430, iLow: 301, iHigh: 400 },
    { cLow: 431, cHigh: 510, iLow: 401, iHigh: 500 }
  ],
  no2: [
    { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
    { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100 },
    { cLow: 81, cHigh: 180, iLow: 101, iHigh: 200 },
    { cLow: 181, cHigh: 280, iLow: 201, iHigh: 300 },
    { cLow: 281, cHigh: 400, iLow: 301, iHigh: 400 },
    { cLow: 401, cHigh: 520, iLow: 401, iHigh: 500 }
  ],
  so2: [
    { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
    { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100 },
    { cLow: 81, cHigh: 380, iLow: 101, iHigh: 200 },
    { cLow: 381, cHigh: 800, iLow: 201, iHigh: 300 },
    { cLow: 801, cHigh: 1600, iLow: 301, iHigh: 400 },
    { cLow: 1601, cHigh: 2400, iLow: 401, iHigh: 500 }
  ],
  co: [
    { cLow: 0.0, cHigh: 1.0, iLow: 0, iHigh: 50 },
    { cLow: 1.1, cHigh: 2.0, iLow: 51, iHigh: 100 },
    { cLow: 2.1, cHigh: 10.0, iLow: 101, iHigh: 200 },
    { cLow: 10.1, cHigh: 17.0, iLow: 201, iHigh: 300 },
    { cLow: 17.1, cHigh: 34.0, iLow: 301, iHigh: 400 },
    { cLow: 34.1, cHigh: 50.0, iLow: 401, iHigh: 500 }
  ],
  o3: [
    { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
    { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
    { cLow: 101, cHigh: 168, iLow: 101, iHigh: 200 },
    { cLow: 169, cHigh: 208, iLow: 201, iHigh: 300 },
    { cLow: 209, cHigh: 748, iLow: 301, iHigh: 400 },
    { cLow: 749, cHigh: 1000, iLow: 401, iHigh: 500 }
  ],
  nh3: [
    { cLow: 0, cHigh: 200, iLow: 0, iHigh: 50 },
    { cLow: 201, cHigh: 400, iLow: 51, iHigh: 100 },
    { cLow: 401, cHigh: 800, iLow: 101, iHigh: 200 },
    { cLow: 801, cHigh: 1200, iLow: 201, iHigh: 300 },
    { cLow: 1201, cHigh: 1800, iLow: 301, iHigh: 400 },
    { cLow: 1801, cHigh: 2400, iLow: 401, iHigh: 500 }
  ],
  pb: [
    { cLow: 0.0, cHigh: 0.5, iLow: 0, iHigh: 50 },
    { cLow: 0.6, cHigh: 1.0, iLow: 51, iHigh: 100 },
    { cLow: 1.1, cHigh: 2.0, iLow: 101, iHigh: 200 },
    { cLow: 2.1, cHigh: 3.0, iLow: 201, iHigh: 300 },
    { cLow: 3.1, cHigh: 3.5, iLow: 301, iHigh: 400 },
    { cLow: 3.6, cHigh: 5.0, iLow: 401, iHigh: 500 }
  ]
};

export const POLLUTANT_METADATA: Record<PollutantType, {
  name: string;
  unit: string;
  averagingPeriod: string;
  description: string;
}> = {
  pm25: {
    name: 'Fine Particulate Matter (PM2.5)',
    unit: 'µg/m³',
    averagingPeriod: '24-Hour Average',
    description: 'Inhalable particles with diameters 2.5 micrometers or smaller. Can penetrate deep into the lungs and enter the bloodstream.'
  },
  pm10: {
    name: 'Coarse Particulate Matter (PM10)',
    unit: 'µg/m³',
    averagingPeriod: '24-Hour Average',
    description: 'Inhalable particles with diameters 10 micrometers or smaller, irritating the eyes, nose, and throat.'
  },
  no2: {
    name: 'Nitrogen Dioxide (NO2)',
    unit: 'µg/m³',
    averagingPeriod: '24-Hour Average',
    description: 'Gaseous pollutant formed from vehicle emissions and industrial combustion, triggering airway inflammation.'
  },
  so2: {
    name: 'Sulfur Dioxide (SO2)',
    unit: 'µg/m³',
    averagingPeriod: '24-Hour Average',
    description: 'Produced from coal and oil burning at thermal power plants and refineries, affecting respiratory function.'
  },
  co: {
    name: 'Carbon Monoxide (CO)',
    unit: 'mg/m³',
    averagingPeriod: '8-Hour Average',
    description: 'Colorless, odorless gas from incomplete fossil fuel combustion, reducing oxygen delivery to vital organs.'
  },
  o3: {
    name: 'Ground-Level Ozone (O3)',
    unit: 'µg/m³',
    averagingPeriod: '8-Hour Average',
    description: 'Secondary photochemical pollutant formed by sunlight reacting with NOx and VOCs, aggravating asthma.'
  },
  nh3: {
    name: 'Ammonia (NH3)',
    unit: 'µg/m³',
    averagingPeriod: '24-Hour Average',
    description: 'Emitted from agricultural fertilizers and livestock waste, reacting to form secondary particulate matter.'
  },
  pb: {
    name: 'Lead (Pb)',
    unit: 'µg/m³',
    averagingPeriod: '24-Hour Average',
    description: 'Toxic heavy metal accumulating in bones and soft tissues, affecting the neurological system.'
  }
};
