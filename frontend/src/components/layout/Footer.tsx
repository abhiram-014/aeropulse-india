import React from 'react';
import { Wind } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mt-16 text-slate-600 dark:text-slate-400 text-xs py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Wind className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
            AeroPulse <span className="text-blue-600 dark:text-blue-400">India</span>
          </span>
        </div>

        <div className="text-center sm:text-right text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 font-medium">
          <div>{t.footer.engineNotice}</div>
          <div className="text-[10px] text-blue-600/80 dark:text-blue-400/80">{t.footer.telemetryTransparency}</div>
        </div>

      </div>
    </footer>
  );
};
