import React from 'react';
import { 
  Globe, 
  Moon, 
  Sun, 
  Settings as SettingsIcon, 
  Database, 
  ShieldCheck, 
  Leaf, 
  Info 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { Language } from '../locales/types.js';

interface SettingsPageProps {
  isDemo: boolean;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ isDemo }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-green-800/20 dark:border-green-800/30">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>⚙️ {t.settings.title}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.settings.subtitle}
        </p>
      </div>

      {/* 1. Theme Selection (Light / Dark) */}
      <div className="rounded-3xl glass-panel p-6 border border-green-800/20 dark:border-green-800/30 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎨 {t.settings.theme}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.settings.themeDesc}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Light Theme Button */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between min-h-[56px] ${
              theme === 'light'
                ? 'bg-green-100/80 dark:bg-green-900/40 border-green-500 text-green-900 dark:text-green-100 font-bold shadow-sm'
                : 'bg-white/60 dark:bg-[#071d15]/60 border-green-200 dark:border-green-900/60 text-slate-700 dark:text-slate-300 hover:border-green-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">{t.settings.lightMode}</span>
            </div>
            {theme === 'light' && <span className="text-green-600 font-bold text-sm">✓</span>}
          </button>

          {/* Dark Theme Button */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between min-h-[56px] ${
              theme === 'dark'
                ? 'bg-green-100/80 dark:bg-green-900/40 border-green-500 text-green-900 dark:text-green-100 font-bold shadow-sm'
                : 'bg-white/60 dark:bg-[#071d15]/60 border-green-200 dark:border-green-900/60 text-slate-700 dark:text-slate-300 hover:border-green-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">{t.settings.darkMode}</span>
            </div>
            {theme === 'dark' && <span className="text-green-600 font-bold text-sm">✓</span>}
          </button>
        </div>
      </div>

      {/* 2. Language Selection (English, Telugu, Hindi) */}
      <div className="rounded-3xl glass-panel p-6 border border-green-800/20 dark:border-green-800/30 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span>{t.settings.language}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.settings.languageDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { code: 'en' as Language, title: 'English', native: 'English', flag: '🇬🇧' },
            { code: 'te' as Language, title: 'Telugu', native: 'తెలుగు', flag: '🌿' },
            { code: 'hi' as Language, title: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
          ].map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => setLanguage(item.code)}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between min-h-[56px] ${
                language === item.code
                  ? 'bg-green-100/80 dark:bg-green-900/40 border-green-500 text-green-900 dark:text-green-100 font-bold shadow-sm'
                  : 'bg-white/60 dark:bg-[#071d15]/60 border-green-200 dark:border-green-900/60 text-slate-700 dark:text-slate-300 hover:border-green-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{item.flag}</span>
                <div>
                  <div className="text-xs font-bold">{item.native}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.title}</div>
                </div>
              </div>
              {language === item.code && <span className="text-green-600 font-bold text-sm">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Scientific Standards & Provenance Info */}
      <div className="rounded-3xl glass-panel p-6 border border-green-800/20 dark:border-green-800/30 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span>{t.settings.cpcbMethodology}</span>
        </h2>
        
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {t.settings.cpcbMethodologyDesc}
        </p>

        <div className="p-3.5 rounded-2xl bg-green-50/80 dark:bg-green-950/40 border border-green-200/80 dark:border-green-800/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-green-800 dark:text-green-300">
            <Leaf className="w-3.5 h-3.5" />
            <span>{t.settings.aboutTitle}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t.settings.aboutDesc}
          </p>
        </div>
      </div>

    </div>
  );
};
