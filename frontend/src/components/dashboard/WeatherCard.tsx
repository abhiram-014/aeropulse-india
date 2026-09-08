import React from 'react';
import { 
  Compass, 
  Droplets, 
  Gauge, 
  Layers, 
  Satellite, 
  Sun, 
  Thermometer, 
  Wind 
} from 'lucide-react';
import { WeatherObservation } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface WeatherCardProps {
  weather: WeatherObservation;
  satelliteContext?: {
    aod550nm?: number;
    sensorName: string;
    productTimestamp: string;
    scientificDisclaimer: string;
  };
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, satelliteContext }) => {
  const { t } = useLanguage();
  const tw = t.weather;

  const getWindDirectionLabel = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round((deg % 360) / 22.5) % 16;
    return directions[idx];
  };

  return (
    <div className="rounded-3xl glass-panel p-5 sm:p-6 space-y-4 border border-slate-200 dark:border-slate-800 transition-colors">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-sky-500" />
            <span>🌤️ {tw.title}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {tw.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Temperature */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{tw.temp}</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
            {weather.temperature}°C
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">{tw.surfaceAmbient}</div>
        </div>

        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{tw.humidity}</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
            {weather.relativeHumidity}%
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">{tw.relativeMoisture}</div>
        </div>

        {/* Wind Speed & Vector */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{tw.wind}</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white flex items-baseline gap-1">
            {weather.windSpeed} <span className="text-xs font-sans text-slate-500">m/s</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
            <Compass className="w-3 h-3 text-teal-500" />
            {getWindDirectionLabel(weather.windDirection)} ({weather.windDirection}°)
          </div>
        </div>

        {/* Surface Pressure */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{tw.pressure}</span>
            <Gauge className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
            {weather.surfacePressure ?? 1012.5}
            <span className="text-xs font-sans text-slate-500 ml-1">hPa</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">{tw.barometricField}</div>
        </div>

        {/* Boundary Layer Height */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{tw.mixingLayer}</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
            {weather.boundaryLayerHeight ?? 650}
            <span className="text-xs font-sans text-slate-500 ml-1">m</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">{tw.pblHeight}</div>
        </div>

        {/* MOSDAC Satellite AOD */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{tw.satelliteAod}</span>
            <Satellite className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {satelliteContext?.aod550nm ?? 0.584}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{tw.opticalDepth550}</div>
        </div>

      </div>

      {/* Satellite Optical Disclaimer Note */}
      {satelliteContext && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <Satellite className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 dark:text-slate-300">{satelliteContext.sensorName}:</strong> {satelliteContext.scientificDisclaimer}
          </div>
        </div>
      )}

    </div>
  );
};
