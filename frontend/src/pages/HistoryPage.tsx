import React, { useState } from 'react';
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
import { Info, TrendingUp, BarChart2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useTheme } from '../context/ThemeContext.js';

type HistoryFilter = '1Y' | '5Y' | '10Y' | '20Y' | '50Y';

// Placeholder arrays; real data should be fetched from backend.
// Currently no verified historical data source is available.
const HISTORICAL_CITY_ANNUAL_DATA: any[] = [];
const CITY_COMPARISON_DATA: any[] = [];

export const HistoryPage: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>('5Y');

  // Filter historical timeline
  const getFilteredData = () => {
    switch (activeFilter) {
      case '1Y':
        return HISTORICAL_CITY_ANNUAL_DATA.slice(-2);
      case '5Y':
        return HISTORICAL_CITY_ANNUAL_DATA.slice(-5);
      case '10Y':
      case '20Y':
      case '50Y':
      default:
        return HISTORICAL_CITY_ANNUAL_DATA;
    }
  };

  const filteredData = getFilteredData();
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)';
  const textColor = isDark ? '#94a3b8' : '#475569';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>📊 {t.history.title}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.history.subtitle}
            </p>
          </div>

          {/* Time Filter Pills (AeroPulse Blue) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60" role="group" aria-label="Time Filter">
            {(['1Y', '5Y', '10Y', '20Y', '50Y'] as HistoryFilter[]).map((f) => {
              const labelMap: Record<HistoryFilter, string> = {
                '1Y': t.history.filter1Y,
                '5Y': t.history.filter5Y,
                '10Y': t.history.filter10Y,
                '20Y': t.history.filter20Y,
                '50Y': t.history.filter50Y,
              };
              const isSelected = activeFilter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  aria-pressed={isSelected}
                  className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {labelMap[f]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Real Historical Data Availability Disclosure Notice */}
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

      {/* 1. Line Chart: Annual AQI Progression Over Time */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>{t.history.trendChartTitle}</span>
          </h2>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {activeFilter} View ({filteredData[0]?.year} – {filteredData[filteredData.length - 1]?.year})
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <Line type="monotone" dataKey="Delhi" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Mumbai" stroke="#84CC16" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Hyderabad" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Bengaluru" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Kolkata" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Chennai" stroke="#14B8A6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold pt-2">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Delhi</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Kolkata</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-lime-500" /> Mumbai</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Hyderabad</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Chennai</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-700" /> Bengaluru</div>
        </div>
      </div>

      {/* 2. Bar Chart: Multi-City Average Comparison */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>{t.history.cityComparisonTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.history.cityComparisonSubtitle}
          </p>
        </div>

        <div className="h-60 sm:h-64 w-full pt-2">
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
        </div>
      </div>

    </div>
  );
};
