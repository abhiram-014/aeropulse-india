import React from 'react';
import { 
  CartesianGrid, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { AlertCircle, History, MousePointerClick } from 'lucide-react';
import { DailyObservation } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface HistoricalAirQualitySectionProps {
  district: string;
  state: string;
  records: DailyObservation[];
  available: boolean;
  unavailableMessage?: string;
  selectedPeriod: string;
  selectedDate: string;
  onPeriodChange: (period: string) => void;
  onSelectDate: (date: string) => void;
  loading?: boolean;
}

export const HistoricalAirQualitySection: React.FC<HistoricalAirQualitySectionProps> = ({
  district,
  state,
  records,
  available,
  unavailableMessage,
  selectedPeriod,
  selectedDate,
  onPeriodChange,
  onSelectDate,
  loading = false
}) => {
  const { t } = useLanguage();
  const th = t.history;

  const periods = [
    { key: '7d', label: th.filter7D },
    { key: '30d', label: th.filter30D },
    { key: '3m', label: th.filter3M },
    { key: '6m', label: th.filter6M },
    { key: '1y', label: th.filter1Y },
    { key: '5y', label: th.filter5Y },
    { key: '10y', label: th.filter10Y },
    { key: '20y', label: th.filter20Y },
    { key: '50y', label: th.filter50Y }
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

  // Determine whether we're charting AQI or PM2.5 concentration
  const hasAqiData = records.some((r) => r.aqiResult?.isValid && r.aqiResult.aqi > 0);
  const metricName = hasAqiData ? t.hero.cpcbAqi : `${t.pollutants.fineParticles} (${t.hero.pm25Unit})`;

  const chartData = records.map((r) => {
    const val = hasAqiData ? (r.aqiResult?.isValid ? r.aqiResult.aqi : null) : r.pollutants.pm25;
    const cat = r.aqiResult?.category || (val && val > 120 ? 'Poor' : 'Moderate');
    return {
      date: r.date,
      displayDate: r.date.substring(5), // MM-DD
      value: val,
      category: cat,
      localizedCategory: getCategoryLabel(cat),
      dominant: r.dominantPollutant || 'pm25'
    };
  });

  return (
    <section
      aria-label={th.title}
      className="rounded-3xl glass-panel p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5"
    >
      {/* Header & Period Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{th.trendChartTitle} &mdash; {district} {t.districtBar.districtSuffix}, {state}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
            <MousePointerClick className="w-3.5 h-3.5 text-blue-500" />
            <span>{th.clickDateAdvice}</span>
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {periods.map((p) => {
            const isSelected = selectedPeriod === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onPeriodChange(p.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body: Chart or Clean Unsupported Notice */}
      {!available ? (
        <div className="min-h-[220px] flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-amber-500" />
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {unavailableMessage || `${selectedPeriod} ${th.noRecordsForDuration}`}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            {th.continuousArchivingNotice}
          </p>
        </div>
      ) : loading ? (
        <div className="h-[260px] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-6 text-center text-xs text-slate-500">
          {th.noRecordsForDuration}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {th.metricLabel} {metricName}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {th.selectedDayLabel} <span className="font-bold text-blue-600 dark:text-blue-400">{selectedDate}</span>
            </span>
          </div>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    const d = e.activePayload[0].payload;
                    if (d.date) onSelectDate(d.date);
                  }
                }}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="displayDate" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 'auto']} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-700 text-xs space-y-1">
                          <div className="font-bold text-blue-400">{d.date}</div>
                          <div className="text-sm font-black">
                            {d.value != null ? `${d.value} ${hasAqiData ? t.hero.index : t.hero.pm25Unit}` : 'N/A'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {t.comparison.categoryLabel} {d.localizedCategory}
                          </div>
                          <div className="text-[9px] text-blue-300 font-bold pt-1 border-t border-slate-800">
                            {th.clickDateAdvice}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#2563EB' }}
                  activeDot={{ r: 6, fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
};
