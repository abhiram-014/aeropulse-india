import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, TranslationSchema } from '../locales/types.js';
import { en } from '../locales/en.js';
import { te } from '../locales/te.js';
import { hi } from '../locales/hi.js';

const translations: Record<Language, TranslationSchema> = {
  en,
  te,
  hi,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('aeropulse-lang') as Language;
    if (saved && ['en', 'te', 'hi'].includes(saved)) {
      return saved;
    }
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith('te')) return 'te';
    if (navLang.startsWith('hi')) return 'hi';
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aeropulse-lang', lang);
  };

  const t = translations[language] || en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
