import React from 'react';
import { 
  Area, 
  CartesianGrid, 
  ComposedChart, 
  Line, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { 
  ArrowDownRight, 
  ArrowRight, 
  ArrowUpRight, 
  Calendar, 
  Info, 
  Sparkles 
} from 'lucide-react';
import { ForecastResponse } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTheme } from '../../context/ThemeContext.js';

interface SimpleForecastTimelineProps {
  forecastData?: ForecastResponse | null;
  currentAqi?: number;
  currentCategory?: string;
  loading?: boolean;
}

// Convert PM2.5 concentration to CPCB AQI sub-index for bounds
function pm25ToAqi(pm25: number): number {
  if (pm25 <= 0 || isNaN(pm25)) return 0;
  if (pm25 <= 30) return Math.round((pm25 / 30) * 50);
  if (pm25 <= 60) return Math.round(51 + ((pm25 - 31) / 29) * 49);
  if (pm25 <= 90) return Math.round(101 + ((pm25 - 61) / 29) * 99);
  if (pm25 <= 120) return Math.round(201 + ((pm25 - 91) / 29) * 99);
  if (pm25 <= 250) return Math.round(301 + ((pm25 - 121) / 129) * 99);
  return Math.min(500, Math.round(401 + ((pm25 - 250) / 150) * 99));
}

export const SimpleForecastTimeline: React.FC<SimpleForecastTimelineProps> = ({
  forecastData,
  currentAqi,
  loading = false
}) => {
  const { t } = useLanguage();
  const tf = t.forecast;
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const points = forecastData?.forecast || [];
  const hasForecast = points.length > 0;

  // Extract Tomorrow's prediction
  const tomorrowPoint = points.length >= 24 ? points[23] : points[points.length - 1];
  const tomorrowAqi = tomorrowPoint ? Math.round(tomorrowPoint.predictedAqi) : null;
  const tomorrowCategory = tomorrowPoint ? tomorrowPoint.predictedCategory : null;

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

  const getTomorrowStatement = () => {
    if (!tomorrowAqi || currentAqi === undefined || currentAqi === null) {
      return null;
    }
    const diff = tomorrowAqi - currentAqi;
    if (diff <= -10) {
      return {
        text: tf.tomorrowMayBeBetter,
        icon: ArrowDownRight,
        colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      };
    }
    if (diff >= 10) {
      return {
        text: tf.tomorrowMayBeWorse,
        icon: ArrowUpRight,
        colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30'
      };
    }
    return {
      text: tf.tomorrowStable,
      icon: ArrowRight,
      colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30'
    };
  };

  const tomorrowStatement = getTomorrowStatement();

  const getCategoryTheme = (cat?: string | null) => {
    switch (cat?.toLowerCase()) {
      case 'good':
        return { color: '#10B981', bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300', emoji: '🟢' };
      case 'satisfactory':
        return { color: '#84CC16', bg: 'bg-lime-500/15 border-lime-500/30 text-lime-700 dark:text-lime-300', emoji: '🟢' };
      case 'moderate':
        return { color: '#F59E0B', bg: 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300', emoji: '🟡' };
      case 'poor':
        return { color: '#F97316', bg: 'bg-orange-500/15 border-orange-500/30 text-orange-700 dark:text-orange-300', emoji: '🟠' };
      case 'very poor':
      case 'verypoor':
        return { color: '#EF4444', bg: 'bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-300', emoji: '🔴' };
      case 'severe':
      default:
        return { color: '#9333EA', bg: 'bg-purple-500/15 border-purple-500/30 text-purple-700 dark:text-purple-300', emoji: '🟣' };
    }
  };

  const tomorrowTheme = getCategoryTheme(tomorrowCategory);

  const getTrendText = (trendStr?: string) => {
    if (trendStr === 'Improving') return tf.trendImproving;
    if (trendStr === 'Deteriorating') return tf.trendDeteriorating;
    return tf.trendStable;
  };

  // Prepare chart dataset (24 hours) with real lower and upper bounds
  const chartData = points.slice(0, 24).map((item) => {
    const d = new Date(item.targetTimestamp);
    const lowerAqi = item.lowerBoundPm25 ? Math.max(0, pm25ToAqi(item.lowerBoundPm25)) : Math.max(0, Math.round(item.predictedAqi * 0.85));
    const upperAqi = item.upperBoundPm25 ? Math.max(lowerAqi, pm25ToAqi(item.upperBoundPm25)) : Math.round(item.predictedAqi * 1.15);

    return {
      hoursAhead: item.hoursAhead,
      timeLabel: d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      predictedAqi: Math.round(item.predictedAqi),
      category: item.predictedCategory,
      localizedCategory: getCategoryLabel(item.predictedCategory),
      lowerAqi,
      upperAqi,
      rangeBand: [lowerAqi, upperAqi]
    };
  });

  return (
    <section 
      aria-label={tf.title} 
      className="rounded-3xl glass-panel p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 transition-colors space-y-6 shadow-sm"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>{tf.title}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {tf.subtitle}
          </p>
        </div>

        {forecastData?.trend && (
          <div className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>{getTrendText(forecastData.trend)} {tf.trendTitle}</span>
          </div>
        )}
      </div>

      {!hasForecast ? (
        <div className="py-8 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {loading ? t.common.loading : t.home.forecastUnavailable}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {tf.whyExplanation}
          </p>
        </div>
      ) : (
        <>
          {/* Tomorrow Summary Card */}
          {tomorrowPoint && tomorrowAqi !== null && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div 
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black flex-shrink-0 border ${tomorrowTheme.bg}`}
                >
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">AQI</span>
                  <span className="text-xl leading-tight">{tomorrowAqi}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {t.home.tomorrow}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded-full text-[11px] font-bold border"
                      style={{ borderColor: tomorrowTheme.color, color: tomorrowTheme.color }}
                    >
                      {getCategoryLabel(tomorrowCategory)}
                    </span>
                  </div>
                  {tomorrowStatement && (
                    <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                      {React.createElement(tomorrowStatement.icon, { className: 'w-4 h-4 flex-shrink-0' })}
                      <span>{tomorrowStatement.text}</span>
                    </p>
                  )}
                </div>
              </div>

              {tomorrowPoint.lowerBoundPm25 && tomorrowPoint.upperBoundPm25 && (
                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start md:self-auto font-medium">
                  {tf.likelyRange}: <strong className="font-mono text-slate-800 dark:text-slate-200">{pm25ToAqi(tomorrowPoint.lowerBoundPm25)}–{pm25ToAqi(tomorrowPoint.upperBoundPm25)}</strong>
                </div>
              )}
            </div>
          )}

          {/* 24-Hour Forecast Line Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
              <span>{tf.title} ({tf.trajectory})</span>
              <span className="flex items-center gap-2 text-[11px]">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" /> {tf.predictedAqi}
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500/20 border border-blue-500/40" /> {tf.likelyRange}
              </span>
            </div>

            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="forecastAqiFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke={isDark ? '#334155' : '#E2E8F0'} 
                  />

                  <XAxis 
                    dataKey="timeLabel" 
                    tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B' }} 
                    axisLine={{ stroke: isDark ? '#334155' : '#CBD5E1' }}
                    tickLine={false}
                  />

                  <YAxis 
                    domain={[0, (dataMax: number) => Math.max(100, Math.ceil(dataMax * 1.15))]}
                    tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B' }} 
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      const catTheme = getCategoryTheme(d.category);

                      return (
                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-1.5 text-xs">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between gap-4">
                            <span>+{d.hoursAhead}h ({d.timeLabel})</span>
                            <span 
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                              style={{ borderColor: catTheme.color, color: catTheme.color }}
                            >
                              {d.localizedCategory}
                            </span>
                          </div>
                          <div className="text-base font-black" style={{ color: catTheme.color }}>
                            AQI {d.predictedAqi}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                            {tf.likelyRange}: [{d.lowerAqi} – {d.upperAqi}]
                          </div>
                        </div>
                      );
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="upperAqi"
                    stroke="none"
                    fill="#3B82F6"
                    fillOpacity={0.15}
                    name={tf.likelyRange}
                    isAnimationActive={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="predictedAqi"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#2563EB', stroke: isDark ? '#0F172A' : '#FFFFFF', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#1D4ED8' }}
                    name={tf.predictedAqi}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Helpful context footnote */}
      <div className="flex items-start gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        <Info className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 mt-0.5" />
        <span>{tf.whyExplanation}</span>
      </div>
    </section>
  );
};
