import React, { useState } from 'react';
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { Activity, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTheme } from '../../context/ThemeContext.js';

interface TrendPoint {
  timestamp: string;
  aqi: number;
  category: string;
  pm25: number;
  pm10: number;
  no2: number;
  dominantPollutant: string;
}

interface DiurnalTrendChartProps {
  data: TrendPoint[];
}

export const DiurnalTrendChart: React.FC<DiurnalTrendChartProps> = ({ data }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [selectedMetric, setSelectedMetric] = useState<'aqi' | 'pm25' | 'pm10' | 'no2'>('aqi');

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

  const metricConfig = {
    aqi: { label: t.hero.cpcbAqi, color: '#F59E0B', unit: t.hero.index },
    pm25: { label: 'PM2.5', color: '#EF4444', unit: 'µg/m³' },
    pm10: { label: 'PM10', color: '#3B82F6', unit: 'µg/m³' },
    no2: { label: 'NO2', color: '#10B981', unit: 'µg/m³' },
  };

  const chartData = data.map((d) => {
    const time = new Date(d.timestamp);
    return {
      ...d,
      formattedTime: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      localizedCategory: getCategoryLabel(d.category)
    };
  });

  const activeConf = metricConfig[selectedMetric];
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const axisColor = theme === 'dark' ? '#64748b' : '#64748b';

  return (
    <div className="rounded-3xl glass-panel p-5 sm:p-6 space-y-4 border border-slate-200 dark:border-slate-800 transition-colors">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            <span>📊 {t.forecast.hourlyTrajectory}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t.forecast.subtitle}
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          {(['aqi', 'pm25', 'pm10', 'no2'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedMetric(key)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors min-h-[36px] ${
                selectedMetric === key
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              style={{
                color: selectedMetric === key ? metricConfig[key].color : undefined
              }}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeConf.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={activeConf.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey="formattedTime" 
              stroke={axisColor} 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke={axisColor} 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 shadow-2xl text-xs space-y-1 backdrop-blur-xl">
                      <div className="font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {p.formattedTime}
                      </div>
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {activeConf.label}: <span style={{ color: activeConf.color }}>{p[selectedMetric]} {activeConf.unit}</span>
                      </div>
                      <div className="text-[11px] text-slate-700 dark:text-slate-300">
                        {t.comparison.categoryLabel} <strong className="text-emerald-500">{p.localizedCategory}</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={activeConf.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#grad-${selectedMetric})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
