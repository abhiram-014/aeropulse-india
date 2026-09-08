import React, { useState } from 'react';
import { 
  BarChart3, 
  Building2, 
  Globe, 
  Home, 
  Map, 
  MapPin, 
  Moon, 
  Navigation, 
  Search, 
  Settings as SettingsIcon, 
  Sun, 
  Wind 
} from 'lucide-react';
import { LocationInfo } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { Language } from '../../locales/types.js';

interface NavbarProps {
  locations: LocationInfo[];
  selectedLocation: LocationInfo | null;
  selectedState?: string;
  selectedDistrict?: string;
  onSelectDistrict?: (state: string, district: string) => void;
  onSelectLocation: (loc: LocationInfo) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDemo?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  locations,
  selectedLocation,
  selectedState,
  selectedDistrict,
  onSelectDistrict,
  onSelectLocation,
  activeTab,
  setActiveTab,
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      alert(t.nav.myLocationNotSupported);
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        const { latitude, longitude } = pos.coords;
        let nearest = locations[0];
        let minDist = Number.MAX_VALUE;
        for (const loc of locations) {
          const d = Math.hypot(loc.latitude - latitude, loc.longitude - longitude);
          if (d < minDist) {
            minDist = d;
            nearest = loc;
          }
        }
        if (nearest) {
          onSelectLocation(nearest);
        }
      },
      () => {
        setGeoLocating(false);
        alert(t.nav.myLocationError);
      },
      { timeout: 8000 }
    );
  };

  // 5 Clean Simplified Navigation Tabs
  const navItems = [
    { id: 'dashboard', label: t.nav.home, icon: Home },
    { id: 'map', label: t.nav.map, icon: Map },
    { id: 'history', label: t.nav.history, icon: BarChart3 },
    { id: 'cities', label: t.nav.cities, icon: Building2 },
    { id: 'settings', label: t.nav.settings, icon: SettingsIcon },
  ];

  const languageNames: Record<Language, string> = {
    en: 'English',
    te: 'తెలుగు',
    hi: 'हिन्दी',
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo */}
          <button 
            type="button"
            onClick={() => setActiveTab('dashboard')} 
            aria-label="AeroPulse India Home"
            className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1 min-h-[44px]"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-900/20 flex-shrink-0">
              <Wind className="w-5 h-5 text-white stroke-[2.5]" aria-hidden="true" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                AeroPulse <span className="text-blue-600 dark:text-blue-400 font-black">India</span>
              </span>
            </div>
          </button>

          {/* Location Picker */}
          <div className="relative flex items-center max-w-[160px] sm:max-w-xs w-full">
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsLangDropdownOpen(false);
                }}
                aria-label={t.nav.selectLocation}
                className="w-full min-h-[44px] flex items-center justify-between px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-200 hover:border-blue-500 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate text-left font-bold">
                    {selectedDistrict ? `${selectedDistrict} ${t.districtBar.districtSuffix}, ${selectedState}` : (selectedLocation ? selectedLocation.city : t.nav.selectLocation)}
                  </span>
                </div>
                <Search className="w-3.5 h-3.5 text-blue-600/70 dark:text-blue-400/70 flex-shrink-0 ml-1" />
              </button>

              {/* Station Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full mt-1.5 left-0 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <input
                      type="text"
                      placeholder={t.nav.selectLocation}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
                    {filteredLocations.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          onSelectLocation(loc);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between min-h-[44px] ${
                          selectedLocation?.id === loc.id
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{loc.city}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{loc.name}</div>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                          {loc.state}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Geolocation Button */}
            <button
              type="button"
              onClick={handleUseGeolocation}
              title={t.nav.useMyLocation}
              aria-label={t.nav.useMyLocation}
              disabled={geoLocating}
              className="ml-1.5 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:border-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <Navigation className={`w-4 h-4 ${geoLocating ? 'animate-spin text-blue-500' : ''}`} />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-700/25'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language & Theme */}
          <div className="flex items-center gap-1.5">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  setIsDropdownOpen(false);
                }}
                aria-label={t.nav.languageSelector}
                className="flex items-center gap-1 px-3 py-2 min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-500 transition-colors text-xs font-bold shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-bold">{languageNames[language]}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 p-1 divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="space-y-0.5">
                    {(['en', 'te', 'hi'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setLanguage(lang);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between min-h-[44px] transition-colors ${
                          language === lang
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{languageNames[lang]}</span>
                        {language === lang && <span className="text-blue-600 font-bold text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t.nav.switchToLight : t.nav.switchToDark}
              className="flex items-center justify-center p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-200/60 dark:border-slate-800 gap-1 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold min-h-[44px] transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
