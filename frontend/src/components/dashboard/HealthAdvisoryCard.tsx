import React, { useState } from 'react';
import { Activity, Heart, Home, ShieldCheck, UserCheck } from 'lucide-react';
import { AqiCategory, HealthRecommendation } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface HealthAdvisoryCardProps {
  health?: HealthRecommendation;
  category: AqiCategory;
}

export const HealthAdvisoryCard: React.FC<HealthAdvisoryCardProps> = ({ health, category }) => {
  const { t } = useLanguage();
  const [showDetailedTabs, setShowDetailedTabs] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'sensitive' | 'outdoor' | 'mask' | 'indoor'>('general');

  const getCategoryKey = (cat: string): 'good' | 'satisfactory' | 'moderate' | 'poor' | 'veryPoor' | 'severe' => {
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

  const catKey = getCategoryKey(category);
  const localizedAdv = t.health.advisories[catKey];

  const tabs = [
    { id: 'general', label: t.health.generalPublic, icon: UserCheck },
    { id: 'sensitive', label: t.health.sensitiveGroups, icon: Heart },
    { id: 'outdoor', label: t.health.outdoorActivities, icon: Activity },
    { id: 'mask', label: t.health.masksPpe, icon: ShieldCheck },
    { id: 'indoor', label: t.health.indoorAir, icon: Home },
  ] as const;

  return (
    <div className="rounded-3xl glass-panel p-5 sm:p-6 space-y-4 border border-slate-200 dark:border-slate-800 transition-colors">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>❤️ {t.health.title}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t.health.whatShouldIDo}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowDetailedTabs(!showDetailedTabs)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
        >
          {showDetailedTabs ? t.aqi.lessDetails : t.aqi.moreDetails}
        </button>
      </div>

      {/* Main Friendly Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
          <div className="text-2xl p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0" aria-hidden="true">
            {category === 'Good' || category === 'Satisfactory' ? '😊' : category === 'Moderate' ? '😐' : '😷'}
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{t.health.generalPublic}</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
              {category === 'Good' || category === 'Satisfactory' 
                ? t.health.safeOutside 
                : category === 'Moderate' 
                  ? t.aqi.moderateDesc 
                  : t.aqi.poorDesc}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
          <div className="text-2xl p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex-shrink-0" aria-hidden="true">
            {category === 'Good' || category === 'Satisfactory' ? '❤️' : '🚨'}
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{t.health.sensitiveGroups}</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
              {category === 'Very Poor' || category === 'Severe' 
                ? t.health.maskAdviceShort 
                : t.health.sensitiveAdviceShort}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
          <div className="text-2xl p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex-shrink-0" aria-hidden="true">
            🏠
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{t.health.indoorAir}</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
              {category === 'Severe' || category === 'Very Poor' 
                ? t.aqi.severeDesc 
                : t.health.indoorAdviceShort}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Scientific Health Tabs (Progressive Disclosure) */}
      {showDetailedTabs && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {activeTab === 'general' && <p>{localizedAdv?.general || health?.generalAdvisory}</p>}
            {activeTab === 'sensitive' && <p>{localizedAdv?.sensitive || health?.sensitiveGroupAdvisory}</p>}
            {activeTab === 'outdoor' && <p>{localizedAdv?.outdoor || health?.outdoorActivityAdvice}</p>}
            {activeTab === 'mask' && <p>{localizedAdv?.mask || health?.maskRecommendation}</p>}
            {activeTab === 'indoor' && (
              <div className="space-y-2">
                <p>• {localizedAdv?.airPurifier || health?.airPurifierAdvice}</p>
                <p>• {localizedAdv?.ventilateHome || health?.ventilateHomeAdvice}</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
