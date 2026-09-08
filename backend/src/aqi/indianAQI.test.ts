import { describe, expect, it } from 'vitest';
import { calculateIndianAQI, calculateSubIndex } from './indianAQI.js';

describe('Indian AQI Engine (CPCB Standard)', () => {
  describe('calculateSubIndex for PM2.5', () => {
    it('calculates Good sub-index (0-30 µg/m³ -> 0-50 AQI)', () => {
      expect(calculateSubIndex('pm25', 0)).toBe(0);
      expect(calculateSubIndex('pm25', 15)).toBe(25);
      expect(calculateSubIndex('pm25', 30)).toBe(50);
    });

    it('calculates Satisfactory sub-index (31-60 µg/m³ -> 51-100 AQI)', () => {
      expect(calculateSubIndex('pm25', 45)).toBe(75);
      expect(calculateSubIndex('pm25', 60)).toBe(100);
    });

    it('calculates Moderate sub-index (61-90 µg/m³ -> 101-200 AQI)', () => {
      expect(calculateSubIndex('pm25', 75)).toBe(149);
      expect(calculateSubIndex('pm25', 90)).toBe(200);
    });

    it('calculates Poor sub-index (91-120 µg/m³ -> 201-300 AQI)', () => {
      expect(calculateSubIndex('pm25', 105)).toBe(249);
      expect(calculateSubIndex('pm25', 120)).toBe(300);
    });

    it('calculates Very Poor sub-index (121-250 µg/m³ -> 301-400 AQI)', () => {
      expect(calculateSubIndex('pm25', 185)).toBe(350);
      expect(calculateSubIndex('pm25', 250)).toBe(400);
    });

    it('calculates Severe sub-index (251-380 µg/m³ -> 401-500 AQI)', () => {
      expect(calculateSubIndex('pm25', 315)).toBe(450);
      expect(calculateSubIndex('pm25', 380)).toBe(500);
      expect(calculateSubIndex('pm25', 450)).toBe(500); // capped max
    });

    it('handles negative or invalid values safely', () => {
      expect(calculateSubIndex('pm25', -10)).toBeNull();
      expect(calculateSubIndex('pm25', null)).toBeNull();
      expect(calculateSubIndex('pm25', undefined)).toBeNull();
    });
  });

  describe('calculateIndianAQI Multi-Pollutant Aggregation', () => {
    it('determines dominant pollutant based on maximum sub-index', () => {
      const pollutants = {
        pm25: 85,  // sub-index: ~183 (Moderate)
        pm10: 140, // sub-index: ~127 (Moderate)
        no2: 45,   // sub-index: ~56  (Satisfactory)
        so2: 15,   // sub-index: ~19  (Good)
        co: 1.2    // sub-index: ~56  (Satisfactory)
      };

      const result = calculateIndianAQI(pollutants);
      expect(result.dominantPollutant).toBe('pm25');
      expect(result.category).toBe('Moderate');
      expect(result.isValid).toBe(true);
      expect(result.aqi).toBeGreaterThanOrEqual(180);
      expect(result.aqi).toBeLessThanOrEqual(186);
    });

    it('correctly flags invalid AQI when fewer than 3 pollutants are provided', () => {
      const pollutants = {
        pm25: 45,
        no2: 25
      };

      const result = calculateIndianAQI(pollutants);
      expect(result.pollutantCount).toBe(2);
      expect(result.isValid).toBe(false);
      expect(result.validationMessage).toContain('requires minimum 3 monitored pollutants');
    });

    it('correctly flags invalid AQI when PM2.5 and PM10 are missing', () => {
      const pollutants = {
        no2: 45,
        so2: 20,
        co: 1.0,
        o3: 30
      };

      const result = calculateIndianAQI(pollutants);
      expect(result.isValid).toBe(false);
      expect(result.validationMessage).toContain('requires at least PM2.5 or PM10');
    });
  });
});
