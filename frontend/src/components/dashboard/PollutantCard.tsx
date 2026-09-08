import React from 'react';
import { Flame } from 'lucide-react';
import { SubIndexDetail } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface PollutantCardProps {
  details: SubIndexDetail[];
}

export const PollutantCard: React.FC<PollutantCardProps> = ({ details }) => {
  const { t } = useLanguage();
  const tp = t.pollutants;

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

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'Good': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Satisfactory': return 'text-lime-600 dark:text-lime-400 bg-lime-500/10 border-lime-500/30';
      case 'Moderate': return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Poor': return 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Very Poor': return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30';
      case 'Severe': return 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700';
    }
  };

  const getBarColor = (category: string) => {
    switch (category) {
      case 'Good': return '#10B981';
      case 'Satisfactory': return '#84CC16';
      case 'Moderate': return '#F59E0B';
      case 'Poor': return '#F97316';
      case 'Very Poor': return '#EF4444';
      case 'Severe': return '#9333EA';
      default: return '#64748B';
    }
  };

  const formatName = (p: string) => {
    const map: Record<string, string> = {
      pm25: tp.fineParticles,
      pm10: tp.coarseParticles,
      no2: tp.nitrogenDioxide,
      so2: tp.sulfurDioxide,
      co: tp.carbonMonoxide,
      o3: tp.ozone,
      nh3: tp.ammonia,
      pb: tp.lead
    };
    return map[p] || p.toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            🌫️ {tp.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {tp.subTitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {details.map((item) => {
          const barWidth = Math.min(100, Math.max(5, (item.subIndex / 500) * 100));
          const isDominant = item.isDominant;

          return (
            <div 
              key={item.pollutant} 
              className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
                isDominant 
                  ? 'glass-panel-glow border-amber-500/40 bg-amber-500/5 shadow-md' 
                  : 'glass-panel hover:border-slate-300 dark:hover:border-slate-700 bg-white/70 dark:bg-slate-900/50'
              }`}
            >
              {/* Dominant Driver Tag */}
              {isDominant && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  <Flame className="w-3 h-3 text-amber-500" />
                  {tp.primaryDriver}
                </div>
              )}

              {/* Pollutant Name */}
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide mb-2 flex items-center gap-1.5 pr-16">
                <span>{formatName(item.pollutant)}</span>
              </div>

              {/* Concentration & SubIndex */}
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {item.concentration}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1 font-sans">{item.unit}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.averagingPeriod}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {tp.subIndexLabel} <span className="text-base text-slate-900 dark:text-white">{item.subIndex}</span>
                  </div>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border mt-1 ${getBadgeColor(item.category)}`}>
                    {getCategoryLabel(item.category)}
                  </span>
                </div>
              </div>

              {/* Sub-Index Bar Meter */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${barWidth}%`, 
                    backgroundColor: getBarColor(item.category) 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
