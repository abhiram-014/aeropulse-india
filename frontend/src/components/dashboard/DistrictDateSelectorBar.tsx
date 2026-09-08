import React, { useEffect, useRef, useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  RotateCcw, 
  Search 
} from 'lucide-react';
import { INDIA_DISTRICTS_BY_STATE, INDIA_STATES } from '../../data/indiaAdminData.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface DistrictDateSelectorBarProps {
  selectedState: string;
  selectedDistrict: string;
  selectedDate: string;
  onSelectState: (state: string) => void;
  onSelectDistrict: (district: string) => void;
  onSelectDate: (date: string) => void;
}

export const DistrictDateSelectorBar: React.FC<DistrictDateSelectorBarProps> = ({
  selectedState,
  selectedDistrict,
  selectedDate,
  onSelectState,
  onSelectDistrict,
  onSelectDate
}) => {
  const { t } = useLanguage();
  const tb = t.districtBar;

  const [stateSearch, setStateSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  const stateRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) {
        setShowStateDropdown(false);
      }
      if (districtRef.current && !districtRef.current.contains(e.target as Node)) {
        setShowDistrictDropdown(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowStateDropdown(false);
        setShowDistrictDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const states = INDIA_STATES.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));
  const availableDistricts = (INDIA_DISTRICTS_BY_STATE[selectedState] || []).filter(d => 
    d.name.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const todayStr = new Date().toISOString().substring(0, 10);

  // Date shifting helpers
  const shiftDate = (days: number) => {
    try {
      const current = new Date(selectedDate);
      current.setDate(current.getDate() + days);
      const newStr = current.toISOString().substring(0, 10);
      onSelectDate(newStr);
    } catch {
      onSelectDate(todayStr);
    }
  };

  const isAnyDropdownOpen = showStateDropdown || showDistrictDropdown;

  return (
    <div className={`relative ${isAnyDropdownOpen ? 'z-30' : 'z-10'} rounded-3xl glass-panel p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-all duration-150`}>
      
      {/* Primary Row: State Selector + District Selector + Date Control */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* 1. State Selector (Searchable Dropdown) */}
        <div ref={stateRef} className={`relative md:col-span-4 ${showStateDropdown ? 'z-40' : 'z-20'}`}>
          <label className="block text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
            {tb.selectState}
          </label>
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={showStateDropdown}
              aria-label={`${tb.selectState}: ${selectedState}`}
              onClick={() => {
                setShowStateDropdown(!showStateDropdown);
                setShowDistrictDropdown(false);
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left text-xs font-bold text-slate-900 dark:text-white hover:border-blue-500 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">{selectedState}</span>
              </div>
              <span className="text-slate-400 text-xs shrink-0" aria-hidden="true">▼</span>
            </button>

            {showStateDropdown && (
              <div className="absolute z-50 top-full mt-1.5 w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in duration-150">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    placeholder={tb.searchState}
                    className="w-full text-xs bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="max-h-56 overflow-y-auto p-1 text-xs divide-y divide-slate-100 dark:divide-slate-800/40">
                  {states.length === 0 ? (
                    <div className="p-3 text-center text-slate-400">{tb.noDistrictsFound}</div>
                  ) : (
                    states.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          onSelectState(s);
                          setShowStateDropdown(false);
                          setStateSearch('');
                        }}
                        className={`w-full min-h-[38px] px-3 py-2 rounded-xl text-left font-medium transition-colors flex items-center justify-between ${
                          s === selectedState
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{s}</span>
                        {s === selectedState && <span className="text-blue-500 font-bold">✓</span>}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. District Selector (Searchable Dropdown) */}
        <div ref={districtRef} className={`relative md:col-span-4 ${showDistrictDropdown ? 'z-40' : 'z-20'}`}>
          <label className="block text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
            {tb.selectDistrict}
          </label>
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={showDistrictDropdown}
              aria-label={`${tb.selectDistrict}: ${selectedDistrict}`}
              onClick={() => {
                setShowDistrictDropdown(!showDistrictDropdown);
                setShowStateDropdown(false);
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left text-xs font-bold text-slate-900 dark:text-white hover:border-blue-500 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">{selectedDistrict} {tb.districtSuffix}</span>
              </div>
              <span className="text-slate-400 text-xs shrink-0" aria-hidden="true">▼</span>
            </button>

            {showDistrictDropdown && (
              <div className="absolute z-50 top-full mt-1.5 w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in duration-150">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    placeholder={`${tb.searchDistrictIn} ${selectedState}…`}
                    className="w-full text-xs bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="max-h-56 overflow-y-auto p-1 text-xs divide-y divide-slate-100 dark:divide-slate-800/40">
                  {availableDistricts.length === 0 ? (
                    <div className="p-3 text-center text-slate-400">{tb.noDistrictsFound}</div>
                  ) : (
                    availableDistricts.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          onSelectDistrict(d.name);
                          setShowDistrictDropdown(false);
                          setDistrictSearch('');
                        }}
                        className={`w-full min-h-[38px] px-3 py-2 rounded-xl text-left font-medium transition-colors flex items-center justify-between ${
                          d.name === selectedDistrict
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{d.name}</span>
                        {d.name === selectedDistrict && <span className="text-blue-500 font-bold">✓</span>}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Date Selector with Shift Buttons */}
        <div className="md:col-span-4">
          <label className="block text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
            {tb.selectDate}
          </label>
          <div className="flex items-center gap-1.5">
            
            {/* Previous Day */}
            <button
              type="button"
              onClick={() => shiftDate(-1)}
              title={tb.previousDay}
              aria-label={tb.previousDay}
              className="min-h-[44px] min-w-[38px] px-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-center transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Date Picker Input */}
            <div className="relative flex-1">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onSelectDate(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            {/* Next Day */}
            <button
              type="button"
              onClick={() => shiftDate(1)}
              title={tb.nextDay}
              aria-label={tb.nextDay}
              className="min-h-[44px] min-w-[38px] px-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-center transition-colors shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Today Button */}
            {selectedDate !== todayStr && (
              <button
                type="button"
                onClick={() => onSelectDate(todayStr)}
                title={tb.jumpToToday}
                className="min-h-[44px] px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{tb.today}</span>
              </button>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
