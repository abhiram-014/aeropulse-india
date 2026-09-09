import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ForecastResponse } from '../types/index.js';
import { ForecastTimelineChart } from '../components/forecast/ForecastTimelineChart.js';
import { useLanguage } from '../context/LanguageContext.js';

interface ForecastPageProps {
  forecastData: ForecastResponse | null;
  loading: boolean;
  selectedState?: string;
  selectedDistrict?: string;
}

export const ForecastPage: React.FC<ForecastPageProps> = ({
  forecastData,
  loading,
  selectedDistrict
}) => {
  const { t } = useLanguage();
  const tf = t.forecast;
  const tk = t.ticker;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t.common.loading}
        </span>
      </div>
    );
  }

  if (!forecastData || !forecastData.forecast || forecastData.forecast.length === 0) {
    return (
      <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            {tk.forecastUnavailable}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-2">
            {t.home.forecastUnavailable}
            {selectedDistrict ? ` — ${selectedDistrict}` : ''}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto pt-1">
            {tf.whyExplanation}
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-500 border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
          AeroPulse India • Strict No-Fabrication Policy
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner clearly distinguishing FORECAST mode */}
      <div className="rounded-2xl px-4 py-2.5 bg-sky-500/10 border border-sky-500/25 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded font-mono font-black text-[11px] bg-sky-500 text-white tracking-wider">
            {tk.forecastData}
          </span>
          <span className="font-semibold text-sky-900 dark:text-sky-200">
            {tf.title} ({selectedDistrict || forecastData.location.city})
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          24H ML MODEL PREDICTION • NOT LIVE GROUND TELEMETRY
        </span>
      </div>

      <ForecastTimelineChart forecastData={forecastData} />
    </div>
  );
};
