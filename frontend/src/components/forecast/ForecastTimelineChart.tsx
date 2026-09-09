import React from 'react';
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  Line, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { 
  ArrowRight, 
  Clock, 
  Cpu, 
  Info, 
  TrendingDown, 
  TrendingUp 
} from 'lucide-react';
import { ForecastResponse } from '../../types/index.js';
import { useTheme } from '../../context/ThemeContext.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface ForecastTimelineChartProps {
  forecastData: ForecastResponse;
}

export const ForecastTimelineChart: React.FC<ForecastTimelineChartProps> = ({ forecastData }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const tf = t.forecast;
  const { forecast, trend, trendDescription, modelVersion, location } = forecastData;

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

  const chartData = forecast.map((f) => {
    const d = new Date(f.targetTimestamp);
    return {
      ...f,
      timeLabel: `+${f.hoursAhead}h (${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      intervalRange: [f.lowerBoundPm25, f.upperBoundPm25],
      localizedCategory: getCategoryLabel(f.predictedCategory)
    };
  });

  const getTrendBadge = () => {
    if (trend === 'Improving') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
          <TrendingDown className="w-4 h-4 text-emerald-500" />
          <span>{tf.favorableTrend}</span>
        </div>
      );
    }
    if (trend === 'Deteriorating') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300 font-semibold text-xs">
          <TrendingUp className="w-4 h-4 text-red-500" />
          <span>{tf.unfavorableTrend}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold text-xs">
        <ArrowRight className="w-4 h-4 text-amber-500" />
        <span>{tf.steadyTrend}</span>
      </div>
    );
  };

  const getCategoryColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'good': return '#10B981';
      case 'satisfactory': return '#84CC16';
      case 'moderate': return '#F59E0B';
      case 'poor': return '#F97316';
      case 'very poor':
      case 'verypoor': return '#EF4444';
      case 'severe': return '#9333EA';
      default: return '#64748B';
    }
  };

  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const axisColor = theme === 'dark' ? '#64748b' : '#64748b';
  const chartFillBase = theme === 'dark' ? '#080c14' : '#f8fafc';

  return (
    <div className="space-y-6">
      
      {/* Header & Trend Summary */}
      <div className="rounded-3xl glass-panel-glow p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-500/15 px-2.5 py-1 rounded-md border border-sky-500/30 font-black">
                {t.ticker.forecastData}
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-bold">
                {tf.hourlyTrajectory}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {tf.modelLabel} {modelVersion}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
              {tf.projectedFor} {location.district ? `${location.district} (${location.city})` : location.city}
            </h2>
          </div>

          <div>{getTrendBadge()}</div>
        </div>

        <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl font-medium">
          {trendDescription}
        </p>

        {/* Transparent Uncertainty Methodology Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
          <Info className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 dark:text-slate-200">{tf.scientificUncertaintyTitle}</strong> {tf.scientificUncertaintyDesc}
          </div>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <div className="rounded-3xl glass-panel p-5 sm:p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span>{tf.hourlyTrajectory}</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">{tf.targetPm25}</span>
        </div>

        <div className="h-72 sm:h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastUncertaintyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="timeLabel" stroke={axisColor} fontSize={10} tickLine={false} />
              <YAxis stroke={axisColor} fontSize={11} tickLine={false} />
              
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const p = payload[0].payload;
                    return (
                      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 shadow-2xl text-xs space-y-1.5 backdrop-blur-xl">
                        <div className="font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {p.timeLabel}
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {tf.targetPm25}: <span className="text-emerald-600 dark:text-emerald-400 font-mono">{p.predictedPm25} µg/m³</span>
                        </div>
                        <div className="text-xs font-semibold" style={{ color: getCategoryColor(p.predictedCategory) }}>
                          {tf.derivedAqi}: {p.predictedAqi} ({p.localizedCategory})
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1 font-mono">
                          {tf.confidenceInterval}: [{p.lowerBoundPm25}, {p.upperBoundPm25}] µg/m³
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey="upperBoundPm25"
                stroke="transparent"
                fill="#10B981"
                fillOpacity={0.15}
              />
              <Area
                type="monotone"
                dataKey="lowerBoundPm25"
                stroke="transparent"
                fill={chartFillBase}
                fillOpacity={1}
              />
              
              <Line
                type="monotone"
                dataKey="predictedPm25"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 3 }}
                activeDot={{ r: 6, fill: '#34D399' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Forecast Timeline Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
          {tf.milestonesTitle}
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {forecast.filter((_, idx) => idx === 2 || idx === 5 || idx === 11 || idx === 17 || idx === 23).map((item) => {
            const time = new Date(item.targetTimestamp);
            const catColor = getCategoryColor(item.predictedCategory);
            
            return (
              <div 
                key={item.hoursAhead} 
                className="p-3.5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2 hover:border-emerald-500/50 transition-colors shadow-sm"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">+{item.hoursAhead}h</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div>
                  <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                    {item.predictedPm25}
                    <span className="text-[10px] font-sans font-normal text-slate-500 dark:text-slate-400 ml-1">µg/m³</span>
                  </div>
                  <div className="text-xs font-bold mt-0.5" style={{ color: catColor }}>
                    AQI {item.predictedAqi} • {getCategoryLabel(item.predictedCategory)}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1">
                  CI: [{item.lowerBoundPm25}, {item.upperBoundPm25}]
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
