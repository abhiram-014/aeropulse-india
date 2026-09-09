import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Info, TrendingUp, BarChart2, ChevronLeft, ChevronRight, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { api } from '../services/api.js';
import { INDIAN_MONITORING_STATIONS } from '../data/indiaAdminData.js';

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────
interface HistoricalAqiResult {
  aqi: number | null;
  category: string;
  dominantPollutant: string | null;
  isValid: boolean;
  validationMessage?: string;
  pollutantValues: Record<string, number | undefined>;
  timestamp: string;
  station: string;
  state: string;
  district: string | null;
  city: string;
  source: string;
  isDemo: false;
}

// ──────────────────────────────────────────────────────────────
// Props
// ──────────────────────────────────────────────────────────────
interface HistoryPageProps {
  selectedState: string;
  selectedDistrict: string;
  selectedDate: string;        // YYYY-MM-DD – set by parent App
  onSelectDate: (d: string) => void;
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().substring(0, 10);

/** Add/subtract days to a YYYY-MM-DD string – stays at or before today */
function offsetDate(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  const today = new Date();
  if (d > today) return todayStr();
  return d.toISOString().substring(0, 10);
}

/** Return AQI colour following CPCB scale */
function aqiColor(aqi: number | null): string {
  if (aqi === null) return '#64748b';
  if (aqi <= 50)  return '#22c55e';
  if (aqi <= 100) return '#84cc16';
  if (aqi <= 200) return '#f59e0b';
  if (aqi <= 300) return '#f97316';
  if (aqi <= 400) return '#ef4444';
  return '#7c3aed';
}

/** Pretty-print pollutant key */
function pollutantLabel(key: string): string {
  const map: Record<string, string> = {
    pm25: 'PM2.5', pm10: 'PM10', no2: 'NO₂',
    so2: 'SO₂',  co: 'CO',   o3: 'O₃',
    nh3: 'NH₃',  pb: 'Pb'
  };
  return map[key] ?? key.toUpperCase();
}

/** Unit for each pollutant */
function pollutantUnit(key: string): string {
  return key === 'co' ? 'mg/m³' : 'µg/m³';
}

// Static chart arrays – kept empty per original; charts show "no verified data"
const HISTORICAL_CITY_ANNUAL_DATA: any[] = [];
const CITY_COMPARISON_DATA: any[] = [];

// ──────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────
export const HistoryPage: React.FC<HistoryPageProps> = ({
  selectedState,
  selectedDistrict,
  selectedDate,
  onSelectDate
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)';
  const textColor = isDark ? '#94a3b8' : '#475569';

  // ── Date state (mirrors parent but also locally editable) ──
  const [pickerDate, setPickerDate] = useState<string>(selectedDate);
  // Sync if parent changes
  useEffect(() => { setPickerDate(selectedDate); }, [selectedDate]);

  // ── Historical fetch state ──
  const [result, setResult] = useState<HistoricalAqiResult | null | 'loading' | 'error'>(null);

  // Resolve station ID for selected district
  const resolveLocationId = useCallback((): string | null => {
    const stations = INDIAN_MONITORING_STATIONS.filter(s =>
      s.state.toLowerCase() === selectedState.toLowerCase() &&
      (s.district.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
       selectedDistrict.toLowerCase().includes(s.district.toLowerCase()))
    );
    return stations.length > 0 ? stations[0].id : null;
  }, [selectedState, selectedDistrict]);

  // Fetch whenever date or district changes
  useEffect(() => {
    const locationId = resolveLocationId();
    if (!locationId) {
      setResult(null);
      return;
    }

    let cancelled = false;
    setResult('loading');

    (async () => {
      try {
        const data = await api.getHistoricalDateAqi(locationId, pickerDate);
        if (cancelled) return;

        // OpenAQ adapter or network may return null when no usable data is available.
        // Convert null into an explicit unavailable result so the UI shows the "No measurements available" message.
        if (data === null) {
          // Find station metadata if possible
          const stationMeta = INDIAN_MONITORING_STATIONS.find(s => s.id === locationId);
          setResult({
            aqi: null,
            category: 'Insufficient Data',
            dominantPollutant: null,
            isValid: false,
            validationMessage: t.history.noDataForDate,
            pollutantValues: {},
            timestamp: new Date().toISOString(),
            station: stationMeta?.name || locationId,
            state: stationMeta?.state || selectedState,
            district: stationMeta?.district || selectedDistrict,
            city: stationMeta?.city || '',
            source: 'OpenAQ v3 Historical Measurements',
            isDemo: false
          });
          return;
        }

        setResult(data);
      } catch {
        if (!cancelled) setResult('error');
      }
    })();

    return () => { cancelled = true; };
  }, [pickerDate, resolveLocationId]);

  // ── Derived display values ──
  const locationId = resolveLocationId();
  const isLoading  = result === 'loading';
  const isError    = result === 'error';
  const hasResult  = result !== null && result !== 'loading' && result !== 'error';
  const dataAvailable = hasResult && (result as HistoricalAqiResult).isValid;
  const aqi = hasResult ? (result as HistoricalAqiResult).aqi : null;
  const stationName = hasResult ? (result as HistoricalAqiResult).station : locationId ?? '';
  const pollutants = hasResult
    ? Object.entries((result as HistoricalAqiResult).pollutantValues)
        .filter(([, v]) => typeof v === 'number' && !isNaN(v as number))
        .map(([k, v]) => ({ key: k, value: v as number, label: pollutantLabel(k), unit: pollutantUnit(k) }))
    : [];

  // ── Date helpers ──
  const goToPrev  = () => { const d = offsetDate(pickerDate, -1); setPickerDate(d); onSelectDate(d); };
  const goToNext  = () => { const d = offsetDate(pickerDate, +1); setPickerDate(d); onSelectDate(d); };
  const goToToday = () => { const d = todayStr(); setPickerDate(d); onSelectDate(d); };
  const isToday   = pickerDate === todayStr();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* ── Header ── */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>📊 {t.history.title}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.history.subtitle}</p>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-5 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <strong>{t.history.dataAvailabilityNotice}</strong>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {t.history.continuousArchivingNotice}
            </div>
          </div>
        </div>
      </div>

      {/* ── Date Picker Panel ── */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-200/80 dark:border-slate-800 space-y-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span>{t.districtBar.selectDate}</span>
        </h2>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Prev */}
          <button
            id="history-prev-date"
            type="button"
            onClick={goToPrev}
            aria-label={t.districtBar.previousDay}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-400 dark:hover:border-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Native date input */}
          <input
            id="history-date-input"
            type="date"
            value={pickerDate}
            max={todayStr()}
            onChange={(e) => {
              if (!e.target.value) return;
              setPickerDate(e.target.value);
              onSelectDate(e.target.value);
            }}
            className="min-h-[44px] px-4 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />

          {/* Next */}
          <button
            id="history-next-date"
            type="button"
            onClick={goToNext}
            disabled={isToday}
            aria-label={t.districtBar.nextDay}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-400 dark:hover:border-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Today */}
          {!isToday && (
            <button
              id="history-today-btn"
              type="button"
              onClick={goToToday}
              className="min-h-[44px] px-4 py-2 rounded-2xl border border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-950/70 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              {t.districtBar.jumpToToday}
            </button>
          )}
        </div>

        {/* Station context */}
        {locationId && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.history.stationLabel}&nbsp;
            <span className="font-semibold text-slate-700 dark:text-slate-300">{stationName || locationId}</span>
            &nbsp;·&nbsp;{selectedDistrict},&nbsp;{selectedState}
          </p>
        )}
        {!locationId && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            No OpenAQ-mapped monitoring station found for {selectedDistrict}, {selectedState}.
          </p>
        )}

        {/* ── Result area ── */}
        <div className="min-h-[120px]">

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm py-6">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span>{t.history.fetchingData}</span>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 dark:text-red-400">{t.common.error}</p>
            </div>
          )}

          {/* No data / insufficient data */}
          {hasResult && !dataAvailable && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <AlertCircle className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.hero.noDataTitle}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.history.noDataForDate}
                </p>
                {hasResult && (result as HistoricalAqiResult).validationMessage && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    {(result as HistoricalAqiResult).validationMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Valid AQI result */}
          {hasResult && dataAvailable && (
            <div className="space-y-4 pt-2">
              {/* AQI pill */}
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl shadow-md"
                  style={{ backgroundColor: aqiColor(aqi) + '22', border: `2px solid ${aqiColor(aqi)}` }}
                >
                  <span className="text-3xl font-black" style={{ color: aqiColor(aqi) }}>
                    {aqi ?? '—'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    {t.hero.cpcbAqi}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-black text-slate-900 dark:text-white">
                    {(result as HistoricalAqiResult).category}
                  </p>
                  {(result as HistoricalAqiResult).dominantPollutant && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.hero.mainPollutant}&nbsp;
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {pollutantLabel((result as HistoricalAqiResult).dominantPollutant!)}
                      </span>
                    </p>
                  )}
                  <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    {t.common.source}&nbsp;{(result as HistoricalAqiResult).source}
                  </p>
                </div>
              </div>

              {/* Pollutant grid */}
              {pollutants.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {t.pollutants.title}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {pollutants.map(p => (
                      <div
                        key={p.key}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                      >
                        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{p.label}</p>
                        <p className="text-base font-black text-slate-900 dark:text-white">{p.value.toFixed(1)}</p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500">{p.unit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Line Chart: Annual AQI Progression (static empty, no fabricated data) ── */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>{t.history.trendChartTitle}</span>
          </h2>
        </div>
        <div className="h-64 sm:h-72 w-full pt-2">
          {HISTORICAL_CITY_ANNUAL_DATA.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
              <Info className="w-6 h-6 text-slate-400" />
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.history.dataAvailabilityNotice}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_CITY_ANNUAL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="year" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} domain={[0, 250]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    borderRadius: '0.75rem',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="Delhi"     stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Mumbai"    stroke="#84CC16" strokeWidth={2}   dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Hyderabad" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Bar Chart: Multi-City Comparison (static empty) ── */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>{t.history.cityComparisonTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.history.cityComparisonSubtitle}</p>
        </div>
        <div className="h-60 sm:h-64 w-full pt-2">
          {CITY_COMPARISON_DATA.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
              <Info className="w-6 h-6 text-slate-400" />
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.history.continuousArchivingNotice}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CITY_COMPARISON_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="city" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} domain={[0, 200]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    borderRadius: '0.75rem',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="aqi" radius={[8, 8, 0, 0]}>
                  {CITY_COMPARISON_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
};
