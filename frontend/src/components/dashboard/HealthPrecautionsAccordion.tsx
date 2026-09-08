import React, { useState } from 'react';
import { 
  AlertCircle, 
  Bot, 
  Briefcase, 
  Car, 
  ChevronDown, 
  ChevronUp, 
  Dumbbell, 
  HeartHandshake, 
  Home, 
  ShieldAlert, 
  Sparkles, 
  UserCheck, 
  Users, 
  Wind 
} from 'lucide-react';
import { AqiCalculationResult, PollutantValues } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface HealthPrecautionsAccordionProps {
  aqiResult: AqiCalculationResult | null;
  pollutants?: PollutantValues;
  district: string;
  onOpenAiModal: () => void;
}

export const HealthPrecautionsAccordion: React.FC<HealthPrecautionsAccordionProps> = ({
  aqiResult,
  pollutants,
  district,
  onOpenAiModal
}) => {
  const { t } = useLanguage();
  const th = t.health;
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('general');

  const category = aqiResult?.category || 'Satisfactory';
  const dominant = aqiResult?.dominantPollutant?.toUpperCase() || (pollutants?.pm25 ? 'PM2.5' : null);

  const getCatKey = (cat: string): 'good' | 'satisfactory' | 'moderate' | 'poor' | 'veryPoor' | 'severe' => {
    switch (cat?.toLowerCase()) {
      case 'good': return 'good';
      case 'satisfactory': return 'satisfactory';
      case 'moderate': return 'moderate';
      case 'poor': return 'poor';
      case 'very poor':
      case 'verypoor': return 'veryPoor';
      case 'severe':
      default: return 'severe';
    }
  };

  const catKey = getCatKey(category);

  // Short simple health message
  const getShortHealthMessage = () => {
    switch (catKey) {
      case 'good': return th.shortMessages.good;
      case 'satisfactory': return th.shortMessages.satisfactory;
      case 'moderate': return th.shortMessages.moderate;
      case 'poor': return th.shortMessages.poor;
      case 'veryPoor': return th.shortMessages.veryPoor;
      case 'severe': return th.shortMessages.severe;
      default: return th.shortMessages.provisional;
    }
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategory(expandedCategory === catId ? null : catId);
  };

  // Precaution items tailored by AQI category with full i18n
  const pTier = catKey === 'good' || catKey === 'satisfactory' ? 'good' : catKey === 'moderate' ? 'moderate' : 'poor';

  const categoriesList = [
    {
      id: 'general',
      title: th.precautions.general.title,
      icon: Users,
      summary: th.precautions.general[pTier]
    },
    {
      id: 'children',
      title: th.precautions.children.title,
      icon: HeartHandshake,
      summary: th.precautions.children[pTier]
    },
    {
      id: 'elderly',
      title: th.precautions.elderly.title,
      icon: UserCheck,
      summary: th.precautions.elderly[pTier]
    },
    {
      id: 'sensitive',
      title: th.precautions.sensitive.title,
      icon: ShieldAlert,
      summary: th.precautions.sensitive[pTier]
    },
    {
      id: 'workers',
      title: th.precautions.workers.title,
      icon: Briefcase,
      summary: th.precautions.workers[pTier]
    },
    {
      id: 'exercise',
      title: th.precautions.exercise.title,
      icon: Dumbbell,
      summary: th.precautions.exercise[pTier]
    },
    {
      id: 'indoor',
      title: th.precautions.indoor.title,
      icon: Home,
      summary: th.precautions.indoor[pTier]
    },
    {
      id: 'travel',
      title: th.precautions.travel.title,
      icon: Car,
      summary: th.precautions.travel[pTier]
    }
  ];

  return (
    <section
      aria-label={th.title}
      className="rounded-3xl glass-panel p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
    >
      {/* Short Summary Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              🛡️ {th.title} &mdash; {district} {t.districtBar.districtSuffix}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
              {getShortHealthMessage()}
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 self-stretch sm:self-auto justify-center"
        >
          <span>{isOpen ? th.hidePrecautions : th.viewPrecautions}</span>
        </button>
      </div>

      {/* Expanded Accordion Body */}
      {isOpen && (
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
          
          {/* Action Callout: Ask AeroPulse AI */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>🌬️ {th.aiBannerTitle}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {th.aiBannerSafeGuidance}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {th.aiBannerSubtitle}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAiModal}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{th.aiBannerButton}</span>
            </button>
          </div>

          {/* Pollutant-Specific Guidance (If Known) */}
          {dominant && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <Wind className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{th.dominantGuidanceTitle} ({dominant}): </span>
                {dominant === 'PM2.5' && th.dominantPm25}
                {dominant === 'PM10' && th.dominantPm10}
                {dominant === 'NO2' && th.dominantNo2}
                {dominant === 'O3' && th.dominantO3}
              </div>
            </div>
          )}

          {/* 8 Accordion Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categoriesList.map((c) => {
              const Icon = c.icon;
              const isExpanded = expandedCategory === c.id;

              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleCategory(c.id)}
                    aria-expanded={isExpanded}
                    className="w-full min-h-[44px] p-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {c.title}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-3.5 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1">
                      {c.summary}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 text-center font-medium">
            {th.medicalDisclaimer}
          </p>
        </div>
      )}
    </section>
  );
};
