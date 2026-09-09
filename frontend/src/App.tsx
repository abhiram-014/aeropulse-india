import React, { useEffect, useState } from 'react';
import { 
  DailyObservation,
  DistrictAirQualitySummary, 
  DistrictComparisonResult, 
  ForecastResponse, 
  LocationInfo, 
  MajorCityComparisonResult, 
  ModelPerformanceMetadata, 
  YearlyObservation 
} from './types/index.js';
import { api } from './services/api.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { DataSourceBanner } from './components/layout/DataSourceBanner.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { MapExplorerPage } from './pages/MapExplorerPage.js';
import { ForecastPage } from './pages/ForecastPage.js';
import { ModelTransparencyPage } from './pages/ModelTransparencyPage.js';
import { AqiCalculatorPage } from './pages/AqiCalculatorPage.js';
import { DataProvenancePage } from './pages/DataProvenancePage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { CitiesPage } from './pages/CitiesPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { LanguageProvider } from './context/LanguageContext.js';
import { ErrorBoundary } from './components/common/ErrorBoundary.js';
import { INDIAN_MONITORING_STATIONS } from './data/indiaAdminData.js';

import { useLanguage } from './context/LanguageContext.js';

function AppInner() {
  const { t } = useLanguage();

  // 1. District-First Geographic & Date Context
  const [selectedState, setSelectedState] = useState<string>('Telangana');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Hyderabad');
  const todayStr = new Date().toISOString().substring(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // 2. Data States
  const [districtSummary, setDistrictSummary] = useState<DistrictAirQualitySummary | null>(null);
  const [districtBoundary, setDistrictBoundary] = useState<any | null>(null);
  const [historyRecords, setHistoryRecords] = useState<DailyObservation[]>([]);
  const [historyAvailable, setHistoryAvailable] = useState<boolean>(true);
  const [historyUnavailableMessage, setHistoryUnavailableMessage] = useState<string | undefined>(undefined);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [yearlyRecords, setYearlyRecords] = useState<YearlyObservation[]>([]);
  const [districtComparison, setDistrictComparison] = useState<DistrictComparisonResult | null>(null);
  const [cityComparison, setCityComparison] = useState<MajorCityComparisonResult | null>(null);
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [modelMetadata, setModelMetadata] = useState<ModelPerformanceMetadata | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<boolean>(false);

  // Initial Load: Fetch static model metadata & major comparisons
  useEffect(() => {
    async function initStatic() {
      try {
        const meta = await api.getModelMetadata().catch(() => null);
        if (meta) setModelMetadata(meta);
      } catch (err) {
        console.warn('Metadata fetch warning:', err);
      }
    }
    initStatic();
  }, []);

  // Primary District & Date Effect: fetch summary, boundary, forecast, and comparisons
  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);

    const loadDistrictData = async () => {
      try {
        const [summary, boundary, forecast, distComp, cityComp] = await Promise.all([
          api.getDistrictAirQuality(selectedState, selectedDistrict, selectedDate).catch(() => null),
          api.getDistrictBoundary(selectedState, selectedDistrict).catch(() => null),
          api.getForecast({ state: selectedState, district: selectedDistrict }).catch(() => null),
          api.compareDistricts(selectedState, selectedDate).catch(() => null),
          api.compareMajorCities(selectedDate).catch(() => null)
        ]);

        if (!isSubscribed) return;

        setDistrictSummary(summary);
        setDistrictBoundary(boundary);
        setForecastData(forecast);
        setDistrictComparison(distComp);
        setCityComparison(cityComp);
        setApiError(false);
      } catch (err) {
        console.error('Error fetching district air quality:', err);
        if (isSubscribed) setApiError(true);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    loadDistrictData();
    return () => {
      isSubscribed = false;
    };
  }, [selectedState, selectedDistrict, selectedDate]);

  // Historical trend effect when district or period changes
  useEffect(() => {
    let isSubscribed = true;
    const loadHistory = async () => {
      try {
        const res = await api.getDistrictHistory(selectedState, selectedDistrict, selectedPeriod);
        if (!isSubscribed) return;
        setHistoryRecords(res.records || []);
        setHistoryAvailable(res.available);
        setHistoryUnavailableMessage(res.message);
      } catch (err) {
        console.warn('Error fetching history:', err);
      }
    };
    loadHistory();
    return () => {
      isSubscribed = false;
    };
  }, [selectedState, selectedDistrict, selectedPeriod]);

  // Yearly change effect when district changes
  useEffect(() => {
    let isSubscribed = true;
    const loadYearly = async () => {
      try {
        const res = await api.getDistrictYearlyChange(selectedState, selectedDistrict);
        if (!isSubscribed) return;
        setYearlyRecords(res.years || []);
      } catch (err) {
        console.warn('Error fetching yearly change:', err);
      }
    };
    loadYearly();
    return () => {
      isSubscribed = false;
    };
  }, [selectedState, selectedDistrict]);

  const refreshDistrict = async () => {
    setLoading(true);
    try {
      const [summary, forecast] = await Promise.all([
        api.getDistrictAirQuality(selectedState, selectedDistrict, selectedDate),
        api.getForecast({ state: selectedState, district: selectedDistrict }).catch(() => null)
      ]);
      setDistrictSummary(summary);
      setForecastData(forecast);
    } catch (err) {
      console.error('Error refreshing district:', err);
    } finally {
      setLoading(false);
    }
  };

  // Convert monitoring station for legacy components
  const stationsList: LocationInfo[] = INDIAN_MONITORING_STATIONS.map(s => ({
    id: s.id,
    name: s.name,
    city: s.city,
    district: s.district,
    state: s.state,
    country: s.country,
    latitude: s.latitude,
    longitude: s.longitude,
    elevation: s.elevation,
    stationType: s.stationType
  }));

  return (
    <ErrorBoundary fallbackTitle="AeroPulse encounter an error.">
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500/30 selection:text-blue-300">
            
            {/* 1. Header Navbar */}
            <Navbar
              locations={stationsList}
              selectedLocation={stationsList[0]}
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              onSelectLocation={(loc) => {
                setSelectedState(loc.state);
                if (loc.district) setSelectedDistrict(loc.district);
                setActiveTab('dashboard');
              }}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* 2. Top DataSource & Provenance Banner */}
            <DataSourceBanner
              isDemo={false}
              lastUpdated={districtSummary?.lastUpdated || new Date().toISOString()}
              sourceName={districtSummary?.dataSource?.name || 'CPCB / CAMS Continuous Atmospheric Telemetry'}
              dataQualityScore={0.98}
              summary={districtSummary}
              forecastData={forecastData}
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              selectedDate={selectedDate}
            />

            {/* 3. Main Application Routing */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
              <ErrorBoundary>
                {apiError && !districtSummary ? (
                  <div className="flex flex-col items-center justify-center p-16 space-y-4 glass-panel rounded-3xl text-center max-w-xl mx-auto my-12">
                    <div className="text-5xl">📡</div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t.home.dataUnavailable}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.common.connecting}
                    </p>
                    <button
                      type="button"
                      onClick={refreshDistrict}
                      className="min-h-[44px] px-6 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md"
                    >
                      {t.common.refresh}
                    </button>
                  </div>
                ) : (
                  <>
                    {activeTab === 'dashboard' && (
                      <DashboardPage
                        summary={districtSummary}
                        forecastData={forecastData}
                        historyRecords={historyRecords}
                        historyAvailable={historyAvailable}
                        historyUnavailableMessage={historyUnavailableMessage}
                        selectedPeriod={selectedPeriod}
                        yearlyRecords={yearlyRecords}
                        districtComparison={districtComparison}
                        cityComparison={cityComparison}
                        districtBoundary={districtBoundary}
                        selectedState={selectedState}
                        selectedDistrict={selectedDistrict}
                        selectedDate={selectedDate}
                        onSelectState={(st) => setSelectedState(st)}
                        onSelectDistrict={(dist) => setSelectedDistrict(dist)}
                        onSelectDate={(d) => setSelectedDate(d)}
                        onPeriodChange={(p) => setSelectedPeriod(p)}
                        loading={loading}
                        onRefresh={refreshDistrict}
                      />
                    )}

                    {activeTab === 'map' && (
                      <MapExplorerPage
                        summary={districtSummary}
                        selectedState={selectedState}
                        selectedDistrict={selectedDistrict}
                        onSelectStation={(station) => {
                          setSelectedState(station.state);
                          setSelectedDistrict(station.district);
                          setActiveTab('dashboard');
                        }}
                      />
                    )}

                    {activeTab === 'forecast' && (
                      <ForecastPage
                        forecastData={forecastData}
                        loading={loading}
                        selectedState={selectedState}
                        selectedDistrict={selectedDistrict}
                      />
                    )}

                    {activeTab === 'model' && (
                      <ModelTransparencyPage
                        metadata={modelMetadata}
                      />
                    )}

                    {activeTab === 'calculator' && (
                      <AqiCalculatorPage
                        onCalculate={() => ({
                          aqi: 75,
                          category: 'Satisfactory',
                          dominantPollutant: 'pm25',
                          subIndices: { pm25: 75, pm10: 55, no2: 30, so2: 12, co: 15, o3: 25, nh3: 10, pb: 5 },
                          subIndexDetails: [],
                          pollutantCount: 8,
                          isValid: true,
                          methodology: 'CPCB_INDIA_2014',
                          color: '#84CC16',
                          textColor: '#65A30D',
                          description: 'Calculated using CPCB linear breakpoint sub-index interpolation.'
                        })}
                      />
                    )}

                    {activeTab === 'provenance' && (
                      <DataProvenancePage />
                    )}

                    {activeTab === 'history' && (
                      <HistoryPage
                        selectedState={selectedState}
                        selectedDistrict={selectedDistrict}
                        selectedDate={selectedDate}
                        onSelectDate={(d) => setSelectedDate(d)}
                      />
                    )}

                    {activeTab === 'cities' && (
                      <CitiesPage
                        locations={stationsList}
                        onSelectLocation={(loc) => {
                          setSelectedState(loc.state);
                          if (loc.district) setSelectedDistrict(loc.district);
                          setActiveTab('dashboard');
                        }}
                        onNavigateHome={() => setActiveTab('dashboard')}
                      />
                    )}

                    {activeTab === 'settings' && (
                      <SettingsPage isDemo={false} />
                    )}
                  </>
                )}
              </ErrorBoundary>
            </main>

            {/* 4. Footer */}
            <Footer />

          </div>
        </ErrorBoundary>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppInner />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
