import { Router } from 'express';
import { AqiController } from '../controllers/aqiController.js';
import { ForecastController } from '../controllers/forecastController.js';
import { MetadataController } from '../controllers/metadataController.js';
import { CityCurrentController } from '../controllers/cityCurrentController.js';
import { ObservationController } from '../controllers/observationController.js';
import { DistrictController } from '../controllers/districtController.js';
import { AirQualityService } from '../services/airQualityService.js';
import { DistrictAirQualityService } from '../services/districtAirQualityService.js';
import { BoundaryService } from '../services/boundaryService.js';
import { AiAssistantService } from '../services/aiAssistantService.js';
import { MlClientService } from '../services/mlClientService.js';
import { WeatherService } from '../services/weatherService.js';

export function createApiRouter(): Router {
  const router = Router();

  // Instantiate core services
  const weatherService = new WeatherService();
  const airQualityService = new AirQualityService(weatherService);
  const districtService = new DistrictAirQualityService(weatherService);
  const boundaryService = new BoundaryService();
  const aiService = new AiAssistantService();
  const mlClientService = new MlClientService(airQualityService, weatherService);

  // Controllers
  const aqiController = new AqiController(airQualityService);
  const observationController = new ObservationController(airQualityService, weatherService);
  const districtController = new DistrictController(districtService, boundaryService, aiService);
  const forecastController = new ForecastController(mlClientService, airQualityService);
  const metadataController = new MetadataController();
  const cityCurrentController = new CityCurrentController(airQualityService);

  // 1. District-First Hierarchy & Air Quality Routes
  router.get('/districts/states', districtController.getStates);
  router.get('/districts', districtController.getDistricts);
  router.get('/districts/summary', districtController.getDistrictAirQuality);
  router.get('/districts/history', districtController.getHistoricalTrend);
  router.get('/districts/yearly', districtController.getYearlyChange);
  router.get('/districts/compare', districtController.compareDistricts);
  router.get('/districts/boundary', districtController.getDistrictBoundary);
  router.post('/ai/ask', districtController.askAi);

  // 2. Locations & Legacy Station Observations
  router.get('/locations', observationController.getLocations);
  router.get('/air-quality/current', observationController.getCurrentAirQuality);
  router.get('/air-quality/history', observationController.getHistoricalTrend);
  router.get('/map', observationController.getAllStationMapData);
  router.get('/weather/current', observationController.getCurrentWeather);

  // 3. AQI Calculation & Health Recommendations
  router.post('/aqi/calculate', aqiController.calculateAqi);
  router.get('/health-recommendation', aqiController.getHealthAdvisory);

  // 4. ML Forecasting & Model Metrics
  router.get('/forecast', forecastController.getForecast);
  router.get('/model/info', forecastController.getModelMetadata);

  // 5. Data Sources & Transparency
  router.get('/data-sources', metadataController.getDataSources);
  router.get('/aqi/methodology', metadataController.getAqiMethodology);

  // 6. Cities Comparison
  router.get('/cities/current', cityCurrentController.getCurrentCityAqi);
  router.get('/cities/major', districtController.compareMajorCities);

  return router;
}
