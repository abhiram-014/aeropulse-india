import React from 'react';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { YearlyObservation } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface YearlyChangeSectionProps {
  district: string;
  state: string;
  years: YearlyObservation[];
  loading?: boolean;
}

export const YearlyChangeSection: React.FC<YearlyChangeSectionProps> = ({
  district,
  state,
  years,
  loading = false
}) => {
  const { t } = useLanguage();
  const ty = t.yearly;

  return (
    <section
      aria-label={ty.title}
      className="rounded-3xl glass-panel p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{ty.title} &mdash; {district} {t.districtBar.districtSuffix}, {state}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {ty.subtitle}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-[200px] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      ) : years.length === 0 ? (
        <div className="min-h-[160px] flex items-center justify-center text-xs text-slate-500">
          {ty.noYearlyData}
        </div>
      ) : (
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={years} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 'auto']} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-lg border border-slate-700 text-xs space-y-0.5">
                        <div className="font-bold text-blue-400">{d.year} {ty.annualAverageSuffix}</div>
                        <div className="text-sm font-black">
                          {d.avgPm25 ?? 'N/A'} µg/m³ PM2.5
                        </div>
                        {d.avgPm10 && (
                          <div className="text-[11px] text-slate-300">
                            PM10: {d.avgPm10} µg/m³
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400">
                          {ty.basedOnDays} ({d.sampleDays})
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="avgPm25" fill="#2563EB" radius={[8, 8, 0, 0]} name={ty.annualPm25Name} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};
