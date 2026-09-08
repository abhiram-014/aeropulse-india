import React, { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Database, 
  Layers, 
  Radio, 
  Thermometer, 
  Wind 
} from 'lucide-react';
import { 
  DailyObservation,
  DistrictAirQualitySummary, 
  DistrictComparisonResult, 
  ForecastResponse, 
  MajorCityComparisonResult, 
  YearlyObservation 
} from '../types/index.js';
import { DistrictDateSelectorBar } from '../components/dashboard/DistrictDateSelectorBar.js';
import { AqiHeroGauge } from '../components/dashboard/AqiHeroGauge.js';
import { HealthPrecautionsAccordion } from '../components/dashboard/HealthPrecautionsAccordion.js';
import { SimpleForecastTimeline } from '../components/dashboard/SimpleForecastTimeline.js';
import { PollutantCard } from '../components/dashboard/PollutantCard.js';
import { WeatherCard } from '../components/dashboard/WeatherCard.js';
import { IndiaAirMap } from '../components/map/IndiaAirMap.js';
import { HistoricalAirQualitySection } from '../components/dashboard/HistoricalAirQualitySection.js';
import { YearlyChangeSection } from '../components/dashboard/YearlyChangeSection.js';
import { DistrictComparisonSection } from '../components/dashboard/DistrictComparisonSection.js';
import { CpcbBreakdownTable } from '../components/aqi-guide/CpcbBreakdownTable.js';
import { AeroPulseAiModal } from '../components/dashboard/AeroPulseAiModal.js';
import { useLanguage } from '../context/LanguageContext.js';

interface DashboardPageProps {
  summary: DistrictAirQualitySummary | null;
  forecastData?: ForecastResponse | null;
  historyRecords: DailyObservation[];
  historyAvailable: boolean;
  historyUnavailableMessage?: string;
  selectedPeriod: string;
  yearlyRecords: YearlyObservation[];
  districtComparison: DistrictComparisonResult | null;
  cityComparison: MajorCityComparisonResult | null;
  districtBoundary?: any | null;
  selectedState: string;
  selectedDistrict: string;
  selectedDate: string;
  onSelectState: (state: string) => void;
  onSelectDistrict: (district: string) => void;
  onSelectDate: (date: string) => void;
  onPeriodChange: (period: string) => void;
  loading?: boolean;
  onRefresh?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  summary,
  forecastData = null,
  historyRecords,
  historyAvailable,
  historyUnavailableMessage,
  selectedPeriod,
  yearlyRecords,
  districtComparison,
  cityComparison,
  districtBoundary,
  selectedState,
  selectedDistrict,
  selectedDate,
  onSelectState,
  onSelectDistrict,
  onSelectDate,
  onPeriodChange,
  loading = false,
  onRefresh
}) => {
  const { t } = useLanguage();
  const tds = t.dashboardSections;
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const subIndexDetails = summary?.aqiResult?.subIndexDetails || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* 1. LOCATION & DATE CONTROLS */}
      <DistrictDateSelectorBar
        selectedState={selectedState}
        selectedDistrict={selectedDistrict}
        selectedDate={selectedDate}
        onSelectState={onSelectState}
        onSelectDistrict={onSelectDistrict}
        onSelectDate={onSelectDate}
      />

      {/* 2. CURRENT AIR QUALITY MAIN CARD */}
      <AqiHeroGauge
        aqiResult={summary?.aqiResult}
        pollutants={summary?.pollutants}
        district={selectedDistrict}
        state={selectedState}
        stationName={summary?.stations?.[0]?.name}
        selectedDate={selectedDate}
        hasData={summary?.hasData ?? false}
        noDataReason={summary?.noDataReason}
        lastUpdated={summary?.lastUpdated}
        loading={loading}
        onRefresh={onRefresh}
      />

      {/* 3. HEALTH PRECAUTIONS ACCORDION ("What should I do?") */}
      <HealthPrecautionsAccordion
        aqiResult={summary?.aqiResult || null}
        pollutants={summary?.pollutants}
        district={selectedDistrict}
        onOpenAiModal={() => setIsAiModalOpen(true)}
      />

      {/* 4. FORECAST SECTION (Today, Tomorrow, Day After, 24-Hour Timeline) */}
      <SimpleForecastTimeline
        forecastData={forecastData}
        currentAqi={summary?.aqiResult?.aqi}
        currentCategory={summary?.aqiResult?.category}
        loading={loading}
      />

      {/* 5. MAIN POLLUTANTS SECTION */}
      {summary?.hasData && summary?.pollutants && (
        <section 
          aria-label={tds.mainPollutantMeasurements}
          className="rounded-3xl glass-panel p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{tds.mainPollutantMeasurements}</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {tds.continuous24hAverage}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(summary.pollutants).map(([key, val]) => {
              if (val == null || isNaN(val)) return null;
              const unit = key === 'co' ? 'mg/m³' : 'µg/m³';
              return (
                <div
                  key={key}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5 transition-all hover:border-blue-500/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-200 tracking-wider">
                      {key.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">{unit}</span>
                  </div>
                  <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                    {val}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {tds.surfaceConcentration}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. MONITORING STATIONS IN THIS DISTRICT */}
      {summary?.stations && summary.stations.length > 0 && (
        <section
          aria-label={`${tds.activeStationsInDistrict} ${selectedDistrict}`}
          className="rounded-3xl glass-panel p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{tds.activeStationsInDistrict} {selectedDistrict} ({summary.stations.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summary.stations.map((st) => (
              <div
                key={st.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5 shadow-2xs"
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {st.name}
                </div>
                <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  {tds.coordinates} {st.latitude.toFixed(4)}°N, {st.longitude.toFixed(4)}°E
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  {tds.stationType} {st.stationType || 'Urban Ambient CAAQMS'} &bull; {tds.source} {st.source}
                </div>
                {st.pollutants?.pm25 != null && (
                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-bold">
                    <span className="text-slate-500">{tds.pm25Value}</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{st.pollutants.pm25} µg/m³</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. DISTRICT MAP */}
      <IndiaAirMap
        stations={summary?.stations || []}
        selectedDistrict={selectedDistrict}
        selectedState={selectedState}
        districtBoundary={districtBoundary}
        centroid={summary?.centroid}
        bbox={summary?.bbox}
      />

      {/* 8. DATE-WISE HISTORICAL DATA */}
      <HistoricalAirQualitySection
        district={selectedDistrict}
        state={selectedState}
        records={historyRecords}
        available={historyAvailable}
        unavailableMessage={historyUnavailableMessage}
        selectedPeriod={selectedPeriod}
        selectedDate={selectedDate}
        onPeriodChange={onPeriodChange}
        onSelectDate={onSelectDate}
        loading={loading}
      />

      {/* 9. YEARLY CHANGE SECTION */}
      <YearlyChangeSection
        district={selectedDistrict}
        state={selectedState}
        years={yearlyRecords}
        loading={loading}
      />

      {/* 10. DISTRICT COMPARISON & MAJOR CITIES COMPARISON */}
      <DistrictComparisonSection
        districtComparison={districtComparison}
        cityComparison={cityComparison}
        selectedState={selectedState}
        selectedDate={selectedDate}
        onSelectDistrict={(d) => onSelectDistrict(d)}
        onSelectCity={(st, d) => {
          onSelectState(st);
          onSelectDistrict(d);
        }}
        loading={loading}
      />

      {/* 11. PROGRESSIVE DISCLOSURE: MORE DETAILS & TECHNICAL DETAILS */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setShowMoreDetails(!showMoreDetails)}
          aria-expanded={showMoreDetails}
          className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300 transition-all flex items-center gap-2 shadow-sm"
        >
          <Layers className="w-4 h-4" />
          <span>{showMoreDetails ? tds.hideMoreDetailsBtn : tds.moreDetailsBtn}</span>
          {showMoreDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          aria-expanded={showTechnicalDetails}
          className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-2 shadow-sm"
        >
          <Cpu className="w-4 h-4 text-blue-500" />
          <span>{showTechnicalDetails ? tds.hideTechnicalDetailsBtn : tds.technicalDetailsBtn}</span>
          {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* More Details Drawer */}
      {showMoreDetails && (
        <div className="space-y-6 pt-2 animate-in fade-in duration-200">
          {subIndexDetails.length > 0 && (
            <div className="rounded-3xl glass-panel p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-500" />
                <span>{tds.subIndexBreakdownTitle}</span>
              </h3>
              <PollutantCard details={subIndexDetails} />
            </div>
          )}

          {summary?.weather && (
            <div className="rounded-3xl glass-panel p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-blue-500" />
                <span>{tds.meteorologicalConditionsTitle}</span>
              </h3>
              <WeatherCard
                weather={summary.weather}
                satelliteContext={summary.satelliteContext}
              />
            </div>
          )}
        </div>
      )}

      {/* Technical Details Drawer */}
      {showTechnicalDetails && (
        <div className="space-y-6 pt-2 animate-in fade-in duration-200">
          <div className="rounded-3xl glass-panel p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span>📐 {tds.cpcbFormulaTitle}</span>
            </h3>
            <CpcbBreakdownTable />
          </div>

          <div className="rounded-3xl glass-panel p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" />
              <span>{tds.dataProvenanceTitle}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div>{t.ticker.district}: {selectedDistrict} ({selectedState})</div>
              <div>{tds.primaryProvider} {summary?.dataSource?.provider || 'CPCB / Open-Meteo'}</div>
              <div>{tds.groundStationsLabel} {summary?.stations?.length || 0} {t.map.stationsActive}</div>
              <div>{tds.aodCovariate}</div>
              <div>{tds.boundarySource}</div>
              <div>{tds.fabricatedPolicy}</div>
            </div>
          </div>
        </div>
      )}

      {/* 12. ASK AEROPULSE AI MODAL */}
      <AeroPulseAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        summary={summary}
        selectedDate={selectedDate}
      />

    </div>
  );
};
