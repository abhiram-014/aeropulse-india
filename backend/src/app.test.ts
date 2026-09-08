import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { calculateIndianAQI } from './aqi/indianAQI.js';
import { getHealthRecommendation } from './health/healthEngine.js';

describe('Backend Express API & Engine Tests', () => {
  const app = createApp();

  it('calculates CPCB AQI correctly for multi-pollutant dataset', () => {
    const result = calculateIndianAQI({
      pm25: 145,
      pm10: 220,
      no2: 60,
      so2: 25,
      co: 1.5
    });

    expect(result.isValid).toBe(true);
    expect(result.dominantPollutant).toBe('pm25');
    expect(result.category).toBe('Very Poor');
    expect(result.aqi).toBeGreaterThanOrEqual(300);
  });

  it('generates clinical health recommendations for Moderate AQI', () => {
    const recommendation = getHealthRecommendation('Moderate', 'pm25');
    expect(recommendation.category).toBe('Moderate');
    expect(recommendation.maskRecommendation).toContain('N95');
    expect(recommendation.generalAdvisory.length).toBeGreaterThan(0);
    expect(recommendation.dominantPollutantSpecificAdvice).toContain('PM2.5');
  });

  it('generates emergency health recommendations for Severe AQI', () => {
    const recommendation = getHealthRecommendation('Severe', 'pm25');
    expect(recommendation.category).toBe('Severe');
    expect(recommendation.maskRecommendation).toContain('N95');
    expect(recommendation.outdoorActivityAdvice).toContain('Cancel all outdoor physical activities');
  });
});
