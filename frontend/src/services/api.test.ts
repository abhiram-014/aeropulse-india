import { describe, expect, it } from 'vitest';
import { api } from './api.js';

describe('Frontend API Client & Interface Validation', () => {
  it('exposes essential API query methods', () => {
    expect(typeof api.getLocations).toBe('function');
    expect(typeof api.getCurrentAirQuality).toBe('function');
    expect(typeof api.getAllStationMapData).toBe('function');
    expect(typeof api.getHistoricalTrend).toBe('function');
    expect(typeof api.getForecast).toBe('function');
    expect(typeof api.getModelMetadata).toBe('function');
    expect(typeof api.calculateCustomAqi).toBe('function');
    expect(typeof api.getDataSources).toBe('function');
    expect(typeof api.getAqiMethodology).toBe('function');
  });
});
