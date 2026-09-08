/**
 * AirQualityTicker
 *
 * Seamless left-to-right scrolling status strip for AeroPulse.
 *
 * Design decisions:
 * - Pure CSS animation (ticker-scroll keyframe in index.css) — no setInterval,
 *   no JS requestAnimationFrame, no re-render on each frame.
 * - Two identical copies of the item list rendered side-by-side inside a
 *   max-content container. The keyframe translates -50% (= one copy width),
 *   creating a perfectly seamless infinite loop.
 * - Hover pauses via CSS animation-play-state; touch devices keep scrolling.
 * - prefers-reduced-motion disables animation entirely (handled in index.css).
 * - All text comes from the i18n system — no hard-coded strings in any language.
 * - AQI severity colours use the project's CPCB palette, NOT blue.
 * - Data-mode label (LIVE / HISTORICAL / FORECAST / UNAVAILABLE) is derived
 *   from the actual selected date vs today — no fake "LIVE" on past dates.
 */

import React, { useMemo } from 'react';
import { DistrictAirQualitySummary, ForecastResponse } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';

// ─── CPCB AQI category → colour mapping ──────────────────────────────────────
const AQI_COLOURS: Record<string, string> = {
  Good:         '#10B981',
  Satisfactory: '#84CC16',
  Moderate:     '#F59E0B',
  Poor:         '#F97316',
  'Very Poor':  '#EF4444',
  Severe:       '#9333EA',
};

function aqiColour(category: string | undefined): string {
  return category ? (AQI_COLOURS[category] ?? '#94A3B8') : '#94A3B8';
}

// ─── Helper: format pollutant label ─────────────────────────────────────────
const POLLUTANT_LABELS: Record<string, string> = {
  pm25: 'PM2.5',
  pm10: 'PM10',
  no2:  'NO₂',
  so2:  'SO₂',
  co:   'CO',
  o3:   'O₃',
  nh3:  'NH₃',
  pb:   'Pb',
};

function pollutantLabel(key: string | null | undefined): string {
  if (!key) return '—';
  return POLLUTANT_LABELS[key] ?? key.toUpperCase();
}

// ─── Helper: derive data mode ────────────────────────────────────────────────
type DataMode = 'live' | 'historical' | 'forecast' | 'unavailable';

function deriveDataMode(
  selectedDate: string,
  hasData: boolean,
): DataMode {
  if (!hasData) return 'unavailable';
  const today = new Date().toISOString().slice(0, 10);
  if (selectedDate > today) return 'forecast';
  if (selectedDate < today) return 'historical';
  return 'live';
}

// ─── Single ticker item ───────────────────────────────────────────────────────
interface TickerItem {
  text: string;
  colour?: string;   // optional semantic colour override
  separator?: boolean; // renders a separator bullet instead
}

// ─── Separator ───────────────────────────────────────────────────────────────
const Sep: React.FC = () => (
  <span
    className="mx-3 text-slate-400 dark:text-slate-600 select-none"
    aria-hidden="true"
  >
    •
  </span>
);

// ─── One chunk of ticker items ────────────────────────────────────────────────
const TickerChunk: React.FC<{ items: TickerItem[] }> = ({ items }) => (
  <span className="inline-flex items-center whitespace-nowrap">
    {items.map((item, i) =>
      item.separator ? (
        <Sep key={i} />
      ) : (
        <span
          key={i}
          className="text-[11px] font-bold tracking-tight"
          style={{
            color: item.colour ?? undefined,
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          {item.text}
        </span>
      )
    )}
  </span>
);

// ─── Props ────────────────────────────────────────────────────────────────────
export interface AirQualityTickerProps {
  summary: DistrictAirQualitySummary | null;
  forecastData: ForecastResponse | null;
  selectedState: string;
  selectedDistrict: string;
  selectedDate: string;
}

// ─── Main component ───────────────────────────────────────────────────────────
export const AirQualityTicker: React.FC<AirQualityTickerProps> = ({
  summary,
  forecastData,
  selectedState,
  selectedDistrict,
  selectedDate,
}) => {
  const { t } = useLanguage();
  const tk = t.ticker;

  // Derive data mode
  const mode: DataMode = useMemo(
    () => deriveDataMode(selectedDate, !!(summary?.hasData)),
    [selectedDate, summary?.hasData],
  );

  // Build ticker items list
  const items: TickerItem[] = useMemo(() => {
    const sep = (): TickerItem => ({ text: '', separator: true });

    if (mode === 'unavailable') {
      return [
        { text: tk.dataUnavailable, colour: '#94A3B8' },
        sep(),
        { text: `${selectedDistrict.toUpperCase()} ${tk.district.toUpperCase()}` },
        sep(),
        { text: tk.selectAnotherDate, colour: '#94A3B8' },
        sep(),
        { text: tk.aeroPulseIndia, colour: '#3B82F6' },
        sep(),
        { text: tk.cpcbMethodology },
        sep(),
      ];
    }

    const aqiResult  = summary?.aqiResult;
    const hasAqi     = aqiResult?.isValid && aqiResult.aqi != null;
    const category   = aqiResult?.category;
    const dominant   = aqiResult?.dominantPollutant;
    const catColour  = aqiColour(category);

    // Status label
    let statusLabel: string;
    let statusColour: string;
    if (mode === 'historical') {
      const d = new Date(selectedDate + 'T00:00:00');
      const formatted = d.toLocaleDateString(undefined, {
        day: 'numeric', month: 'long', year: 'numeric',
      });
      statusLabel  = `${tk.historicalData} · ${formatted}`;
      statusColour = '#A78BFA';
    } else if (mode === 'forecast') {
      statusLabel  = tk.forecastData;
      statusColour = '#38BDF8';
    } else {
      statusLabel  = tk.liveAirQuality;
      statusColour = '#10B981';
    }

    const list: TickerItem[] = [
      { text: statusLabel, colour: statusColour },
      sep(),
      { text: `${selectedDistrict.toUpperCase()} ${tk.district.toUpperCase()}` },
      sep(),
      { text: `${selectedState.toUpperCase()}` },
      sep(),
    ];

    const getCategoryLabel = (cat?: string | null) => {
      switch (cat?.toLowerCase()) {
        case 'good': return t.aqi.good;
        case 'satisfactory': return t.aqi.satisfactory;
        case 'moderate': return t.aqi.moderate;
        case 'poor': return t.aqi.poor;
        case 'very poor':
        case 'verypoor': return t.aqi.veryPoor;
        case 'severe': return t.aqi.severe;
        default: return cat || '';
      }
    };

    if (hasAqi && aqiResult) {
      list.push(
        { text: `${tk.aqi} ${aqiResult.aqi}`, colour: catColour },
        sep(),
        { text: getCategoryLabel(category).toUpperCase(), colour: catColour },
        sep(),
      );
    } else if (summary?.pollutants?.pm25 != null) {
      // No valid AQI but PM2.5 available — do not call it AQI
      list.push(
        { text: `PM2.5 ${summary.pollutants.pm25.toFixed(1)} µg/m³` },
        sep(),
      );
    }

    if (dominant) {
      list.push(
        { text: `${tk.mainPollutant}: ${pollutantLabel(dominant)}` },
        sep(),
      );
    }

    // Weather snippet
    if (summary?.weather) {
      const wx = summary.weather;
      list.push(
        { text: `${wx.temperature.toFixed(1)}°C  💨 ${wx.windSpeed.toFixed(1)} m/s` },
        sep(),
      );
    }

    // Monitoring / forecast status
    if (mode === 'live') {
      list.push({ text: tk.liveMonitoring, colour: '#10B981' }, sep());
    } else if (mode === 'historical') {
      list.push({ text: tk.monitoringActive }, sep());
    }

    if (forecastData) {
      list.push({ text: tk.forecastAvailable, colour: '#38BDF8' }, sep());
    } else {
      list.push({ text: tk.forecastUnavailable, colour: '#64748B' }, sep());
    }

    list.push(
      { text: tk.aeroPulseIndia, colour: '#3B82F6' },
      sep(),
      { text: tk.cpcbMethodology },
      sep(),
    );

    return list;
  }, [mode, summary, forecastData, selectedState, selectedDistrict, selectedDate, tk]);

  return (
    /**
     * Outer viewport — overflow hidden, only ticker content scrolls.
     * Do NOT apply overflow-hidden to the page; only to this div.
     */
    <div
      className="flex-1 min-w-0 overflow-hidden"
      aria-label="Air quality status ticker"
      aria-live="polite"
      aria-atomic="false"
    >
      {/*
        ticker-track: defined in index.css
        Two identical chunks side-by-side → translateX(-50%) = one chunk width.
        Hover pauses via CSS .ticker-track:hover { animation-play-state: paused }
        touch devices never hover so they keep scrolling.
      */}
      <div className="ticker-track">
        <TickerChunk items={items} />
        {/* Duplicate for seamless loop */}
        <TickerChunk items={items} />
      </div>
    </div>
  );
};
