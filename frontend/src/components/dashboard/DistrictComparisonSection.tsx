import React, { useState } from 'react';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { ArrowDownUp, Building2, MapPin } from 'lucide-react';
import { DistrictComparisonResult, MajorCityComparisonResult } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface DistrictComparisonSectionProps {
  districtComparison: DistrictComparisonResult | null;
  cityComparison: MajorCityComparisonResult | null;
  selectedState: string;
  selectedDate: string;
  onSelectDistrict?: (distName: string) => void;
  onSelectCity?: (state: string, dist: string) => void;
  loading?: boolean;
}

export const DistrictComparisonSection: React.FC<DistrictComparisonSectionProps> = ({
  districtComparison,
  cityComparison,
  selectedState,
  selectedDate,
  onSelectDistrict,
  onSelectCity,
  loading = false
}) => {
  const { t } = useLanguage();
  const tc = t.comparison;

  const [tab, setTab] = useState<'districts' | 'cities'>('districts');
  const [sortOrder, setSortOrder] = useState<'best' | 'worst'>('best');

  const getCategoryLabel = (cat?: string | null) => {
    switch (cat?.toLowerCase()) {
      case 'good': return t.aqi.good;
      case 'satisfactory': return t.aqi.satisfactory;
      case 'moderate': return t.aqi.moderate;
      case 'poor': return t.aqi.poor;
      case 'very poor':
      case 'verypoor': return t.aqi.veryPoor;
      case 'severe': return t.aqi.severe;
      default: return cat || t.hero.measured;
    }
  };

  const districtData = (districtComparison?.districts || [])
    .filter(d => d.hasData && d.pm25 !== null)
    .map(d => ({
      name: d.name,
      value: d.aqi ?? d.pm25,
      aqi: d.aqi,
      pm25: d.pm25,
      category: d.category || 'Measured',
      localizedCategory: getCategoryLabel(d.category)
    }))
    .sort((a, b) => sortOrder === 'best' ? (a.value ?? 0) - (b.value ?? 0) : (b.value ?? 0) - (a.value ?? 0));

  const cityData = (cityComparison?.cities || [])
    .filter(c => c.hasData && c.pm25 !== null)
    .map(c => ({
      name: c.city,
      district: c.district,
      state: c.state,
      value: c.aqi ?? c.pm25,
      aqi: c.aqi,
      pm25: c.pm25,
      category: c.category || 'Measured',
      localizedCategory: getCategoryLabel(c.category),
      stationCount: c.stationCount
    }))
    .sort((a, b) => sortOrder === 'best' ? (a.value ?? 0) - (b.value ?? 0) : (b.value ?? 0) - (a.value ?? 0));

  return (
    <section
      aria-label={`${selectedState} ${tc.districtsTab}`}
      className="rounded-3xl glass-panel p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
    >
      {/* Tab Switcher & Order Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setTab('districts')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              tab === 'districts'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{selectedState} {tc.districtsTab}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('cities')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              tab === 'cities'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{tc.citiesTab}</span>
          </button>
        </div>

        {/* Best / Worst Sort Toggle */}
        <button
          type="button"
          onClick={() => setSortOrder(sortOrder === 'best' ? 'worst' : 'best')}
          className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-all shadow-xs"
        >
          <ArrowDownUp className="w-3.5 h-3.5" />
          <span>{sortOrder === 'best' ? tc.sortCleanest : tc.sortPolluted}</span>
        </button>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400">
        {tc.comparingFor} <span className="font-bold text-slate-700 dark:text-slate-200">{selectedDate}</span> &bull; {tab === 'districts' ? `${selectedState} ${tc.districtsTab}` : tc.majorMetroResolving}
      </div>

      {/* Bar Chart Container */}
      {loading ? (
        <div className="h-[260px] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      ) : tab === 'districts' && districtData.length === 0 ? (
        <div className="min-h-[200px] flex items-center justify-center text-xs text-slate-500 text-center">
          {tc.noDistrictData} {selectedState}.
        </div>
      ) : tab === 'cities' && cityData.length === 0 ? (
        <div className="min-h-[200px] flex items-center justify-center text-xs text-slate-500 text-center">
          {tc.noCityData}
        </div>
      ) : (
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tab === 'districts' ? districtData : cityData}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 35, bottom: 0 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length > 0) {
                  const item = e.activePayload[0].payload;
                  if (tab === 'districts' && onSelectDistrict) {
                    onSelectDistrict(item.name);
                  } else if (tab === 'cities' && onSelectCity) {
                    onSelectCity(item.state, item.district);
                  }
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                width={85}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-700 text-xs space-y-1">
                        <div className="font-bold text-blue-400">{d.name} {d.state ? `(${d.state})` : ''}</div>
                        <div className="text-sm font-black">
                          {d.aqi != null ? `AQI: ${d.aqi}` : `PM2.5: ${d.pm25} µg/m³`}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {tc.categoryLabel} {d.localizedCategory}
                        </div>
                        <div className="text-[9px] text-emerald-400 font-bold pt-1 border-t border-slate-800">
                          {tab === 'districts' ? tc.clickToViewDistrict : tc.clickToViewCity}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                fill="#2563EB"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};
