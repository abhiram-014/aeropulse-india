import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Building2, MapPin, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { LocationInfo } from '../types/index.js';
import { useLanguage } from '../context/LanguageContext.js';
import { useTheme } from '../context/ThemeContext.js';

interface CitiesPageProps {
  locations: LocationInfo[];
  onSelectLocation: (loc: LocationInfo) => void;
  onNavigateHome: () => void;
}

// Available States & Districts Directory
interface DistrictConfig {
  name: string;
  cityMatch?: string;
  stationName?: string;
}

const STATE_DISTRICT_MAP: Record<string, DistrictConfig[]> = {
  'Telangana': [
    { name: 'Hyderabad (Urban)', cityMatch: 'Hyderabad', stationName: 'Sanathnagar CAAQMS' },
    { name: 'Rangareddy', cityMatch: 'Hyderabad', stationName: 'ICRISAT Patancheru' },
    { name: 'Medchal-Malkajgiri', cityMatch: 'Hyderabad', stationName: 'Balanagar Industrial' },
    { name: 'Warangal' },
    { name: 'Nizamabad' },
    { name: 'Khammam' },
  ],
  'Maharashtra': [
    { name: 'Mumbai City', cityMatch: 'Mumbai', stationName: 'Bandra Kurla Complex' },
    { name: 'Mumbai Suburban', cityMatch: 'Mumbai', stationName: 'Worli Sea Face' },
    { name: 'Pune', cityMatch: 'Pune', stationName: 'Shivajinagar' },
    { name: 'Nagpur' },
    { name: 'Nashik' },
    { name: 'Aurangabad (Chhatrapati Sambhaji Nagar)' },
  ],
  'Delhi': [
    { name: 'East Delhi', cityMatch: 'Delhi', stationName: 'Anand Vihar CAAQMS' },
    { name: 'Central Delhi', cityMatch: 'Delhi', stationName: 'ITO Cross Road' },
    { name: 'South Delhi', cityMatch: 'Delhi', stationName: 'R K Puram' },
    { name: 'North Delhi' },
  ],
  'Karnataka': [
    { name: 'Bengaluru Urban', cityMatch: 'Bengaluru', stationName: 'BTM Layout CAAQMS' },
    { name: 'Bengaluru South', cityMatch: 'Bengaluru', stationName: 'Silk Board Junction' },
    { name: 'Mysuru' },
    { name: 'Hubballi-Dharwad' },
    { name: 'Mangaluru' },
  ],
  'West Bengal': [
    { name: 'Kolkata', cityMatch: 'Kolkata', stationName: 'Victoria Memorial Hall' },
    { name: 'South 24 Parganas', cityMatch: 'Kolkata', stationName: 'Jadavpur University' },
    { name: 'Howrah' },
    { name: 'North 24 Parganas' },
  ],
  'Tamil Nadu': [
    { name: 'Chennai', cityMatch: 'Chennai', stationName: 'Alagappa Nagar CAAQMS' },
    { name: 'Coimbatore' },
    { name: 'Madurai' },
    { name: 'Tiruchirappalli' },
  ]
};

export const CitiesPage: React.FC<CitiesPageProps> = ({
  locations,
  onSelectLocation,
  onNavigateHome
}) => {
  const { t } = useLanguage();
  const tc = t.cities;
  const { theme } = useTheme();

  const [selectedState, setSelectedState] = useState<string>('Telangana');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Hyderabad (Urban)');
  const [cityData, setCityData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch current city AQI from real backend telemetry on mount
  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      try {
        const resp = await api.getCurrentCitiesAqi();
        if (isSubscribed) {
          setCityData(resp.data || []);
          setLoading(false);
        }
      } catch (e) {
        if (isSubscribed) {
          setError(t.common.error);
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isSubscribed = false;
    };
  }, [t.common.error]);

  const effectiveData = cityData;

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)';
  const textColor = isDark ? '#94a3b8' : '#475569';

  const currentDistricts = STATE_DISTRICT_MAP[selectedState] || [];
  const districtConfig = currentDistricts.find(d => d.name === selectedDistrict);

  const matchingLiveCity = districtConfig?.cityMatch 
    ? effectiveData.find(c => c.city?.toLowerCase() === districtConfig.cityMatch?.toLowerCase())
    : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>🏙️ {tc.title}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {tc.subtitle}
        </p>
      </div>

      {/* 1. Bar Chart: Major Cities Real Telemetry */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{tc.allIndiaRanking}</span>
        </h2>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-rose-500 text-sm font-medium">
            {error}
          </div>
        ) : effectiveData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
            {t.home.dataUnavailable}
          </div>
        ) : (
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={effectiveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="city" stroke={textColor} fontSize={10} interval={0} angle={-30} textAnchor="end" height={45} />
                <YAxis stroke={textColor} fontSize={11} domain={[0, 250]} tickLine={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    borderRadius: '0.75rem',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="aqi" radius={[6, 6, 0, 0]}>
                  {effectiveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 2. Major Cities Quick Navigation Cards */}
      {!loading && !error && effectiveData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {effectiveData.map((c) => {
            const loc = locations.find(l => l.city && l.city.toLowerCase() === c.city.toLowerCase());
            return (
              <button
                key={c.id ?? c.city}
                type="button"
                onClick={() => {
                  if (loc) {
                    onSelectLocation(loc);
                    onNavigateHome();
                  }
                }}
                className="p-3.5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 transition-all text-left flex flex-col justify-between gap-2 group min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {c.city}
                  </span>
                  <span className="text-base" aria-hidden="true">{c.icon ?? '🏙️'}</span>
                </div>
                
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xl font-black" style={{ color: c.color }}>
                    {c.aqi}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    {getCategoryLabel(c.category)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. District Level Explorer */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{tc.districtExplorer}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {tc.districtSubtitle}
          </p>
        </div>

        {/* State & District Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Select State */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {tc.selectState}
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                const newState = e.target.value;
                setSelectedState(newState);
                const firstDistrict = STATE_DISTRICT_MAP[newState]?.[0]?.name || '';
                setSelectedDistrict(firstDistrict);
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(STATE_DISTRICT_MAP).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Select District */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {tc.selectDistrict}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currentDistricts.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Result Card */}
        <div className="pt-2">
          {matchingLiveCity ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{districtConfig?.name}</span>
                </div>
                {districtConfig?.stationName && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {tc.monitoredStation}: <strong className="text-slate-700 dark:text-slate-300">{districtConfig.stationName}</strong>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">{tc.currentAqi}</div>
                  <div className="text-2xl font-black" style={{ color: matchingLiveCity.color }}>
                    {matchingLiveCity.aqi}
                  </div>
                </div>
                <span 
                  className="px-3 py-1 rounded-xl text-xs font-bold border"
                  style={{ borderColor: matchingLiveCity.color, color: matchingLiveCity.color }}
                >
                  {getCategoryLabel(matchingLiveCity.category)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                <strong>{tc.districtDataNotAvailable}</strong>
                <div className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                  {t.history.dataAvailabilityNotice}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
