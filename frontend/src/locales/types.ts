export type Language = 'en' | 'te' | 'hi';

export interface NavTranslations {
  home: string;
  map: string;
  history: string;
  cities: string;
  settings: string;
  selectLocation: string;
  live: string;
  demo: string;
  liveFeed: string;
  demoData: string;
  useMyLocation: string;
  myLocationNotSupported: string;
  myLocationError: string;
  switchToLight: string;
  switchToDark: string;
  languageSelector: string;
}

export interface DistrictBarTranslations {
  selectState: string;
  searchState: string;
  selectDistrict: string;
  searchDistrictIn: string;
  noDistrictsFound: string;
  selectDate: string;
  previousDay: string;
  nextDay: string;
  jumpToToday: string;
  today: string;
  districtSuffix: string;
}

export interface HeroTranslations {
  statusGood: string;
  statusSatisfactory: string;
  statusModerate: string;
  statusPoor: string;
  statusVeryPoor: string;
  statusSevere: string;
  monitoringStation: string;
  refreshTelemetry: string;
  noDataTitle: string;
  noDataDefault: string;
  cpcbAqi: string;
  measured: string;
  index: string;
  pm25Unit: string;
  provisionalMeasurements: string;
  mainPollutant: string;
  cannotCalculateAqi: string;
  cannotCalculateDesc: string;
  lastObservation: string;
  districtSuffix: string;
}

export interface HealthTabAdvisories {
  general: string;
  sensitive: string;
  outdoor: string;
  mask: string;
  airPurifier: string;
  ventilateHome: string;
}

export interface PrecautionCategoryItem {
  title: string;
  good: string;
  moderate: string;
  poor: string;
}

export interface HealthTranslations {
  title: string;
  whatShouldIDo: string;
  viewPrecautions: string;
  hidePrecautions: string;
  generalPublic: string;
  sensitiveGroups: string;
  outdoorActivities: string;
  masksPpe: string;
  indoorAir: string;
  safeOutside: string;
  maskAdviceShort: string;
  sensitiveAdviceShort: string;
  indoorAdviceShort: string;
  shortMessages: {
    good: string;
    satisfactory: string;
    moderate: string;
    poor: string;
    veryPoor: string;
    severe: string;
    provisional: string;
  };
  aiBannerTitle: string;
  aiBannerSafeGuidance: string;
  aiBannerSubtitle: string;
  aiBannerButton: string;
  dominantGuidanceTitle: string;
  dominantPm25: string;
  dominantPm10: string;
  dominantNo2: string;
  dominantO3: string;
  medicalDisclaimer: string;
  // Category-tailored tabs for HealthAdvisoryCard
  advisories: {
    good: HealthTabAdvisories;
    satisfactory: HealthTabAdvisories;
    moderate: HealthTabAdvisories;
    poor: HealthTabAdvisories;
    veryPoor: HealthTabAdvisories;
    severe: HealthTabAdvisories;
  };
  // 8 accordion precaution groups
  precautions: {
    general: PrecautionCategoryItem;
    children: PrecautionCategoryItem;
    elderly: PrecautionCategoryItem;
    sensitive: PrecautionCategoryItem;
    workers: PrecautionCategoryItem;
    exercise: PrecautionCategoryItem;
    indoor: PrecautionCategoryItem;
    travel: PrecautionCategoryItem;
  };
}

export interface AiModalTranslations {
  title: string;
  subtitle: string;
  closeModal: string;
  welcomeMessage: string;
  welcomeDisclaimer: string;
  quickQuestionsTitle: string;
  quickQuestions: {
    q1: string; // What should I do today?
    q2: string; // Can I exercise outside?
    q3: string; // Is it safe for children?
    q4: string; // How was the air on this date?
    q5: string; // What is the main pollutant?
    q6: string; // Give me more precautions.
  };
  analyzingTelemetry: string;
  inputPlaceholder: string;
  sendMessage: string;
  errorConnecting: string;
  errorDisclaimer: string;
  safeGuidance: string;
}

export interface ForecastTranslations {
  title: string;
  subtitle: string;
  likelyRange: string;
  trendTitle: string;
  trajectory: string;
  hourlyTrajectory: string;
  why: string;
  whyExplanation: string;
  cardTitle: string;
  trendImproving: string;
  trendDeteriorating: string;
  trendStable: string;
  favorableTrend: string;
  unfavorableTrend: string;
  steadyTrend: string;
  tomorrowMayBeBetter: string;
  tomorrowMayBeWorse: string;
  tomorrowStable: string;
  scientificUncertaintyTitle: string;
  scientificUncertaintyDesc: string;
  milestonesTitle: string;
  modelLabel: string;
  projectedFor: string;
  targetPm25: string;
  derivedAqi: string;
  confidenceInterval: string;
  predictedAqi: string;
  hoursAhead: string;
}

export interface HistoryTranslations {
  title: string;
  subtitle: string;
  filter7D: string;
  filter30D: string;
  filter3M: string;
  filter6M: string;
  filter1Y: string;
  filter5Y: string;
  filter10Y: string;
  filter20Y: string;
  filter50Y: string;
  clickDateAdvice: string;
  metricLabel: string;
  selectedDayLabel: string;
  noRecordsForDuration: string;
  dataAvailabilityNotice: string;
  continuousArchivingNotice: string;
  trendChartTitle: string;
  cityComparisonTitle: string;
  annualAverage: string;
  bestPeriod: string;
  worstPeriod: string;
  aqiTrendLabel: string;
  cityComparisonSubtitle: string;
}

export interface YearlyTranslations {
  title: string;
  subtitle: string;
  noYearlyData: string;
  annualAverageSuffix: string;
  basedOnDays: string;
  annualPm25Name: string;
}

export interface ComparisonTranslations {
  districtsTab: string;
  citiesTab: string;
  sortCleanest: string;
  sortPolluted: string;
  comparingFor: string;
  majorMetroResolving: string;
  noDistrictData: string;
  noCityData: string;
  categoryLabel: string;
  clickToViewDistrict: string;
  clickToViewCity: string;
}

export interface CitiesTranslations {
  title: string;
  subtitle: string;
  allIndiaRanking: string;
  districtExplorer: string;
  districtSubtitle: string;
  selectState: string;
  selectDistrict: string;
  districtDataNotAvailable: string;
  currentAqi: string;
  monitoredStation: string;
  liveAqiRankings: string;
  clickBarAdvice: string;
  searchCityPlaceholder: string;
  allIndiaCitiesCount: string;
}

export interface DashboardSectionsTranslations {
  mainPollutantMeasurements: string;
  continuous24hAverage: string;
  surfaceConcentration: string;
  activeStationsInDistrict: string;
  coordinates: string;
  stationType: string;
  source: string;
  pm25Value: string;
  moreDetailsBtn: string;
  hideMoreDetailsBtn: string;
  technicalDetailsBtn: string;
  hideTechnicalDetailsBtn: string;
  subIndexBreakdownTitle: string;
  meteorologicalConditionsTitle: string;
  cpcbFormulaTitle: string;
  dataProvenanceTitle: string;
  primaryProvider: string;
  groundStationsLabel: string;
  aodCovariate: string;
  boundarySource: string;
  fabricatedPolicy: string;
}

export interface SettingsTranslations {
  title: string;
  subtitle: string;
  appearance: string;
  theme: string;
  themeDesc: string;
  lightMode: string;
  darkMode: string;
  language: string;
  languageDesc: string;
  dataSource: string;
  dataSourceDesc: string;
  cpcbMethodology: string;
  cpcbMethodologyDesc: string;
  aboutTitle: string;
  aboutDesc: string;
  version: string;
}

export interface AqiStatusTranslations {
  good: string;
  satisfactory: string;
  moderate: string;
  poor: string;
  veryPoor: string;
  severe: string;
  goodShort: string;
  satisfactoryShort: string;
  moderateShort: string;
  poorShort: string;
  veryPoorShort: string;
  severeShort: string;
  whatShouldIDo: string;
  lessDetails: string;
  moreDetails: string;
  moderateDesc: string;
  poorDesc: string;
  severeDesc: string;
}

export interface CommonTranslations {
  loading: string;
  connecting: string;
  error: string;
  refresh: string;
  close: string;
  dataFreshness: string;
  qualityScore: string;
  source: string;
  updated: string;
  quality: string;
  justNow: string;
}

export interface PollutantsTranslations {
  title: string;
  subTitle: string;
  fineParticles: string;
  coarseParticles: string;
  nitrogenDioxide: string;
  sulfurDioxide: string;
  carbonMonoxide: string;
  ozone: string;
  ammonia: string;
  lead: string;
  primaryDriver: string;
  subIndexLabel: string;
}

export interface WeatherTranslations {
  title: string;
  subtitle: string;
  temp: string;
  humidity: string;
  wind: string;
  pressure: string;
  mixingLayer: string;
  satelliteAod: string;
  surfaceAmbient: string;
  relativeMoisture: string;
  barometricField: string;
  pblHeight: string;
  opticalDepth550: string;
  windImpact: string;
}

export interface MapTranslations {
  title: string;
  subtitle: string;
  stationsActive: string;
  clickMarkerAdvice: string;
  legendGood: string;
  legendSatisfactory: string;
  legendModerate: string;
  legendPoor: string;
  legendVeryPoor: string;
  legendSevere: string;
  stationDetails: string;
  viewDashboard: string;
  layerSuffix: string;
  cpcbScale: string;
  popupSource: string;
  popupUpdated: string;
  popupMeasured: string;
}

export interface CpcbBreakdownTranslations {
  title: string;
  subtitle: string;
  thAqiCategory: string;
  thHealthImpact: string;
  impactGood: string;
  impactSatisfactory: string;
  impactModerate: string;
  impactPoor: string;
  impactVeryPoor: string;
  impactSevere: string;
}

export interface CalculatorTranslations {
  interactiveEngine: string;
  cpcbFormulaNotice: string;
  whatIfTitle: string;
  presetCleanDay: string;
  presetTypicalUrban: string;
  presetWinterSmog: string;
  airQualitySuffix: string;
  dominantPollutantLabel: string;
  subIndexLabel: string;
  formulaLabel: string;
  validityLabel: string;
  valid: string;
  incomplete: string;
  monitoredCount: string;
}

export interface FooterTranslations {
  engineNotice: string;
  telemetryTransparency: string;
}

export interface TickerTranslations {
  liveAirQuality: string;
  historicalData: string;
  forecastData: string;
  dataUnavailable: string;
  selectAnotherDate: string;
  monitoringActive: string;
  district: string;
  aqi: string;
  mainPollutant: string;
  liveMonitoring: string;
  forecastAvailable: string;
  forecastUnavailable: string;
  aeroPulseIndia: string;
  cpcbMethodology: string;
}

export interface HomeTranslations {
  airQuality: string;
  todayStatus: string;
  whatToDo: string;
  tomorrow: string;
  tomorrowMayBeWorse: string;
  tomorrowMayBeBetter: string;
  tomorrowStable: string;
  moreDetails: string;
  hideDetails: string;
  technicalDetails: string;
  hideTechnical: string;
  quickAdviceGood: string;
  quickAdviceSatisfactory: string;
  quickAdviceModerate: string;
  quickAdvicePoor: string;
  quickAdviceVeryPoor: string;
  quickAdviceSevere: string;
  dominantPollutant: string;
  lastUpdated: string;
  weatherOverview: string;
  temperature: string;
  humidity: string;
  windSpeed: string;
  satelliteAod: string;
  pollutantBreakdown: string;
  cpcbBreakdownTitle: string;
  mlForecastTitle: string;
  mlConfidence: string;
  scientificDisclaimer: string;
  changeLocation: string;
  statusGood: string;
  statusSatisfactory: string;
  statusModerate: string;
  statusPoor: string;
  statusVeryPoor: string;
  statusSevere: string;
  forecast24hTitle: string;
  likelyRange: string;
  hoursAhead: string;
  predictedAqi: string;
  mainPollutants: string;
  locationUnavailable: string;
  dataUnavailable: string;
  forecastUnavailable: string;
  pleaseSelectCity: string;
  apiError: string;
}

export interface Translations {
  nav: NavTranslations;
  home: HomeTranslations;
  districtBar: DistrictBarTranslations;
  hero: HeroTranslations;
  health: HealthTranslations;
  ai: AiModalTranslations;
  forecast: ForecastTranslations;
  history: HistoryTranslations;
  yearly: YearlyTranslations;
  comparison: ComparisonTranslations;
  cities: CitiesTranslations;
  dashboardSections: DashboardSectionsTranslations;
  settings: SettingsTranslations;
  aqi: AqiStatusTranslations;
  common: CommonTranslations;
  pollutants: PollutantsTranslations;
  weather: WeatherTranslations;
  map: MapTranslations;
  cpcbBreakdown: CpcbBreakdownTranslations;
  calculator: CalculatorTranslations;
  footer: FooterTranslations;
  ticker: TickerTranslations;
}

export type TranslationSchema = Translations;
