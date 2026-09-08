import React from 'react';
import { AlertCircle, Calendar, MapPin, RefreshCw } from 'lucide-react';
import { AqiCalculationResult, PollutantValues } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface AqiHeroGaugeProps {
  aqiResult?: AqiCalculationResult | null;
  pollutants?: PollutantValues;
  district?: string;
  state?: string;
  stationName?: string;
  selectedDate?: string;
  hasData?: boolean;
  noDataReason?: string;
  lastUpdated?: string;
  loading?: boolean;
  onRefresh?: () => void;
}

export const AqiHeroGauge: React.FC<AqiHeroGaugeProps> = ({
  aqiResult,
  pollutants,
  district = 'Hyderabad',
  state = 'Telangana',
  stationName,
  selectedDate,
  hasData = true,
  noDataReason,
  lastUpdated,
  loading = false,
  onRefresh
}) => {
  const { t } = useLanguage();
  const th = t.hero;

  const getCategoryInfo = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'good':
        return {
          icon: '🟢',
          emoji: '😊',
          label: t.aqi.good,
          statusMessage: th.statusGood,
          badgeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
          color: '#10B981',
          glowColor: 'rgba(16, 185, 129, 0.25)'
        };
      case 'satisfactory':
        return {
          icon: '🟢',
          emoji: '🙂',
          label: t.aqi.satisfactory,
          statusMessage: th.statusSatisfactory,
          badgeBg: 'bg-lime-500/15 border-lime-500/40 text-lime-700 dark:text-lime-300',
          color: '#84CC16',
          glowColor: 'rgba(132, 204, 22, 0.25)'
        };
      case 'moderate':
        return {
          icon: '🟡',
          emoji: '😐',
          label: t.aqi.moderate,
          statusMessage: th.statusModerate,
          badgeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300',
          color: '#F59E0B',
          glowColor: 'rgba(245, 158, 11, 0.25)'
        };
      case 'poor':
        return {
          icon: '🟠',
          emoji: '😷',
          label: t.aqi.poor,
          statusMessage: th.statusPoor,
          badgeBg: 'bg-orange-500/15 border-orange-500/40 text-orange-700 dark:text-orange-300',
          color: '#F97316',
          glowColor: 'rgba(249, 115, 22, 0.25)'
        };
      case 'very poor':
      case 'verypoor':
        return {
          icon: '🔴',
          emoji: '🚨',
          label: t.aqi.veryPoor,
          statusMessage: th.statusVeryPoor,
          badgeBg: 'bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-300',
          color: '#EF4444',
          glowColor: 'rgba(239, 68, 68, 0.25)'
        };
      case 'severe':
      default:
        return {
          icon: '🟣',
          emoji: '⚠️',
          label: t.aqi.severe,
          statusMessage: th.statusSevere,
          badgeBg: 'bg-purple-500/15 border-purple-500/40 text-purple-700 dark:text-purple-300',
          color: '#9333EA',
          glowColor: 'rgba(147, 51, 234, 0.25)'
        };
    }
  };

  const aqiVal = aqiResult?.isValid ? aqiResult.aqi : null;
  const catInfo = getCategoryInfo(aqiResult?.category);
  const dominant = aqiResult?.dominantPollutant?.toUpperCase() || (pollutants?.pm25 ? 'PM2.5' : null);

  // SVG circular gauge geometry
  const radius = 64;
  const stroke = 11;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = aqiVal != null
    ? circumference - (Math.min(aqiVal, 500) / 500) * circumference
    : circumference;

  return (
    <div className="relative rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
      
      {/* Top Location and Date Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {district} {th.districtSuffix}, {state}
            </h1>
          </div>
          {stationName && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 ml-6">
              {th.monitoringStation} <span className="font-semibold text-slate-700 dark:text-slate-300">{stationName}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-6 sm:ml-0">
          {selectedDate && (
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{selectedDate}</span>
            </span>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              title={th.refreshTelemetry}
              aria-label={th.refreshTelemetry}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Either Real Data OR Explicit No-Data State */}
      {!hasData ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {th.noDataTitle}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            {noDataReason || th.noDataDefault}
          </p>
        </div>
      ) : (
        <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Circular Ring AQI Indicator */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
                {/* Background Ring */}
                <circle
                  cx="64"
                  cy="64"
                  r={normalizedRadius}
                  stroke="currentColor"
                  strokeWidth={stroke}
                  fill="transparent"
                  className="text-slate-100 dark:text-slate-800/80"
                />
                {/* Value Ring */}
                <circle
                  cx="64"
                  cy="64"
                  r={normalizedRadius}
                  stroke={aqiVal != null ? catInfo.color : '#94A3B8'}
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference} ${circumference}`}
                  style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease' }}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Inside Ring: Value and Unit */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {aqiVal != null ? th.cpcbAqi : th.measured}
                </span>
                <span
                  className="text-4xl sm:text-5xl font-extrabold tracking-tighter"
                  style={{ color: aqiVal != null ? catInfo.color : '#64748B' }}
                >
                  {aqiVal != null ? aqiVal : (pollutants?.pm25 ? Math.round(pollutants.pm25) : '—')}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {aqiVal != null ? th.index : th.pm25Unit}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Category, Dominant Pollutant, and Health Advice */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Category Pill & Status */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className={`text-xs sm:text-sm font-black px-3.5 py-1 rounded-full border ${catInfo.badgeBg} flex items-center gap-1.5`}
                >
                  <span>{catInfo.emoji}</span>
                  <span>{aqiVal != null ? catInfo.label : th.provisionalMeasurements}</span>
                </span>

                {dominant && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {th.mainPollutant} <span className="text-blue-600 dark:text-blue-400">{dominant}</span>
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {catInfo.statusMessage}
              </h2>
            </div>

            {/* Invalidation Explanation (If Sub-indices insufficient) */}
            {aqiResult && !aqiResult.isValid && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
                <div className="font-bold mb-0.5">{th.cannotCalculateAqi}</div>
                <div>{aqiResult.validationMessage || th.cannotCalculateDesc}</div>
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">PM2.5</div>
                <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
                  {pollutants?.pm25 != null ? `${pollutants.pm25}` : '—'} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">PM10</div>
                <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
                  {pollutants?.pm10 != null ? `${pollutants.pm10}` : '—'} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">NO2</div>
                <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
                  {pollutants?.no2 != null ? `${pollutants.no2}` : '—'} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
                </div>
              </div>
            </div>

            {lastUpdated && (
              <div className="text-[10px] font-mono text-slate-400">
                {th.lastObservation} {lastUpdated.substring(0, 16).replace('T', ' ')} IST
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
