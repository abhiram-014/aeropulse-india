/**
 * DataSourceBanner
 *
 * Thin status strip between Navbar and main content.
 * Left side  : Live/Demo badge  |  Source name
 * Centre     : AirQualityTicker (seamless scrolling ticker)
 * Right side : Quality score  |  Last updated
 */

import React from 'react';
import { CheckCircle2, Database, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { AirQualityTicker } from './AirQualityTicker.js';
import { DistrictAirQualitySummary, ForecastResponse } from '../../types/index.js';

interface DataSourceBannerProps {
  isDemo: boolean;
  lastUpdated: string;
  sourceName: string;
  dataQualityScore: number;
  summary: DistrictAirQualitySummary | null;
  forecastData: ForecastResponse | null;
  selectedState: string;
  selectedDistrict: string;
  selectedDate: string;
}

export const DataSourceBanner: React.FC<DataSourceBannerProps> = ({
  isDemo,
  lastUpdated,
  sourceName,
  dataQualityScore,
  summary,
  forecastData,
  selectedState,
  selectedDistrict,
  selectedDate,
}) => {
  const { t } = useLanguage();

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return t.common.justNow;
    }
  };

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 transition-colors">

      {/* ── Row 1: status meta ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pt-1.5 pb-1 flex flex-wrap items-center justify-between gap-2 text-xs">

        {/* Left: Live/Demo badge + Source */}
        <div className="flex items-center gap-2 shrink-0">
          {isDemo ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold text-[11px] border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {t.nav.demoData}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {t.nav.liveFeed}
            </span>
          )}

          <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-600 dark:text-slate-400 truncate text-[11px] hidden sm:inline">
            {t.common.source}{' '}
            <strong className="text-slate-900 dark:text-slate-200 font-mono">
              {sourceName}
            </strong>
          </span>
        </div>

        {/* Right: Quality + Updated */}
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 text-[11px] shrink-0">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              {t.common.quality}{' '}
              <strong className="text-slate-900 dark:text-slate-200">
                {Math.round(dataQualityScore * 100)}%
              </strong>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-sky-500" />
            <span>
              {t.common.updated}{' '}
              <strong className="text-slate-900 dark:text-slate-200 font-mono">
                {formatTime(lastUpdated)}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 2: scrolling ticker ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pb-1.5 flex items-center gap-2">
        {/* Pulsing dot indicator */}
        <span className="shrink-0 relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>

        {/* Ticker viewport */}
        <AirQualityTicker
          summary={summary}
          forecastData={forecastData}
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          selectedDate={selectedDate}
        />
      </div>

    </div>
  );
};
