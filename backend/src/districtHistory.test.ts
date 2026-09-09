import { describe, it, expect, vi } from 'vitest';
import { DistrictAirQualityService } from './services/districtAirQualityService.js';
import { WeatherService } from './services/weatherService.js';
import { OpenAqAdapter } from './providers/openAqAdapter.js';
import { RealAtmosphericProvider } from './providers/realAtmosphericProvider.js';
import { calculateIndianAQI } from './aqi/indianAQI.js';
import { getStationsForDistrict } from './data/indiaAdminData.js';

describe('District history uses OpenAQ adapter and CPCB AQI', () => {
  it('calls OpenAqAdapter.getHistoricalTrendSeries, computes CPCB AQI, and avoids Open-Meteo', async () => {
    // Prepare a deterministic mock OpenAQ historical series (two dates)
    const mockSeries = [
      {
        date: '2026-09-08',
        pollutants: { pm25: 100, pm10: 150, no2: 50 },
        aqiResult: calculateIndianAQI({ pm25: 100, pm10: 150, no2: 50 }),
        isValidAqi: true,
        dominantPollutant: 'pm25',
        source: 'OpenAQ v3 Historical Measurements'
      },
      {
        date: '2026-09-09',
        pollutants: { pm25: 80, pm10: 120, no2: 40 },
        aqiResult: calculateIndianAQI({ pm25: 80, pm10: 120, no2: 40 }),
        isValidAqi: true,
        dominantPollutant: 'pm25',
        source: 'OpenAQ v3 Historical Measurements'
      }
    ];

    // Spy & mock OpenAqAdapter method
    const openSpy = vi.spyOn(OpenAqAdapter.prototype, 'getHistoricalTrendSeries').mockResolvedValue(mockSeries as any);
    // Spy on RealAtmosphericProvider to ensure atmospheric reanalysis is not used
    const atmSpy = vi.spyOn(RealAtmosphericProvider.prototype, 'getDailyMeasurements');

    const svc = new DistrictAirQualityService(new WeatherService());

    // Ensure we call the service for a district that has stations (Delhi / East Delhi)
    const stations = getStationsForDistrict('Delhi', 'East Delhi');
    const stationId = stations.length > 0 ? stations[0].id : null;

    const history = await svc.getHistoricalTrend('Delhi', 'East Delhi', '7d');

    // OpenAqAdapter must have been invoked
    expect(openSpy).toHaveBeenCalled();
    if (stationId) {
      expect(openSpy).toHaveBeenCalledWith(stationId, expect.any(String), expect.any(String));
    }

    // Response should reflect the mock series exactly (no added synthetic dates)
    expect(history.available).toBe(true);
    expect(history.records.length).toBe(mockSeries.length);

    for (let i = 0; i < mockSeries.length; i++) {
      const got = history.records[i];
      const expected = mockSeries[i] as any;
      expect(got.date).toBe(expected.date);
      // Must explicitly state OpenAQ as source
      expect(got.source).toBe('OpenAQ v3 Historical Measurements');

      // CPCB AQI must be computed from pollutant measurements
      const calc = calculateIndianAQI(expected.pollutants as any);
      expect(got.aqiResult.aqi).toBe(calc.aqi);
      expect(got.aqiResult.dominantPollutant).toBe(calc.dominantPollutant);
    }

    // Ensure atmospheric provider was not consulted for historical trend
    expect(atmSpy).not.toHaveBeenCalled();

    openSpy.mockRestore();
    atmSpy.mockRestore();
  });
});
