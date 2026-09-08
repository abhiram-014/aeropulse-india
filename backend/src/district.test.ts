import { describe, it, expect } from 'vitest';
import { DistrictAirQualityService } from './services/districtAirQualityService.js';
import { BoundaryService } from './services/boundaryService.js';
import { AiAssistantService } from './services/aiAssistantService.js';
import { WeatherService } from './services/weatherService.js';

describe('District-First Air Quality Architecture & AI Services', () => {
  const weatherService = new WeatherService();
  const districtService = new DistrictAirQualityService(weatherService);
  const boundaryService = new BoundaryService();
  const aiService = new AiAssistantService();

  it('provides all 36 Indian states and union territories', () => {
    const states = districtService.getStates();
    expect(Array.isArray(states)).toBe(true);
    expect(states).toContain('Telangana');
    expect(states).toContain('Maharashtra');
    expect(states).toContain('Delhi');
    expect(states).toContain('Karnataka');
    expect(states.length).toBeGreaterThanOrEqual(35);
  });

  it('retrieves real districts for Telangana including Hyderabad and Rangareddy', () => {
    const districts = districtService.getDistrictsForState('Telangana');
    expect(Array.isArray(districts)).toBe(true);
    const names = districts.map(d => d.name);
    expect(names).toContain('Hyderabad');
    expect(names).toContain('Rangareddy');
  });

  it('retrieves real GeoJSON boundary polygon for Hyderabad', () => {
    const feature = boundaryService.getDistrictBoundary('Telangana', 'Hyderabad');
    expect(feature).not.toBeNull();
    expect(feature?.type).toBe('Feature');
    expect(feature?.properties.district).toBe('Hyderabad');
    expect(feature?.geometry.coordinates.length).toBeGreaterThan(0);
  });

  it('50 years of data is cleanly reported as unavailable without fabrication', async () => {
    const history = await districtService.getHistoricalTrend('Telangana', 'Hyderabad', '50y');
    expect(history.available).toBe(false);
    expect(history.message).toContain('50 years of data is not available');
    expect(history.records).toEqual([]);
  });

  it('AeroPulse AI provides rule-based guidance without external API dependency', async () => {
    const res = await aiService.generateResponse('What should I do today?', {
      state: 'Telangana',
      district: 'Hyderabad',
      selectedDate: '2026-09-08',
      aqi: 55,
      category: 'Satisfactory',
      dominantPollutant: 'pm25',
      hasData: true,
      language: 'en'
    });
    expect(res.answer).toContain('Satisfactory');
    expect(res.generatedBy).toBe('RULE_BASED_SAFETY_ENGINE');
    expect(res.disclaimer).toContain('AeroPulse advisory only');
  });

  it('AeroPulse AI refuses to fabricate when data is unavailable', async () => {
    const res = await aiService.generateResponse('What should I do today?', {
      state: 'Telangana',
      district: 'Hyderabad',
      selectedDate: '1970-01-01',
      hasData: false,
      language: 'en'
    });
    expect(res.answer).toContain('not available');
  });
});
