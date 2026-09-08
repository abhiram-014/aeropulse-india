import React, { useState } from 'react';
import { AqiCalculationResult, PollutantValues } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface SubIndexCalculatorProps {
  onCalculate: (values: PollutantValues) => AqiCalculationResult;
}

export const SubIndexCalculator: React.FC<SubIndexCalculatorProps> = ({ onCalculate }) => {
  const { t } = useLanguage();
  const tc = t.calculator;

  const [pollutants, setPollutants] = useState<PollutantValues>({
    pm25: 85,
    pm10: 160,
    no2: 55,
    so2: 20,
    co: 1.5,
    o3: 45,
    nh3: 30,
    pb: 0.5
  });

  const result = onCalculate(pollutants);

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

  const handleSliderChange = (key: keyof PollutantValues, value: number) => {
    setPollutants(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePreset = (type: 'good' | 'moderate' | 'severe') => {
    if (type === 'good') {
      setPollutants({ pm25: 22, pm10: 40, no2: 25, so2: 15, co: 0.6, o3: 35, nh3: 20, pb: 0.2 });
    } else if (type === 'moderate') {
      setPollutants({ pm25: 75, pm10: 150, no2: 65, so2: 25, co: 2.2, o3: 50, nh3: 35, pb: 0.6 });
    } else {
      setPollutants({ pm25: 280, pm10: 450, no2: 120, so2: 60, co: 12.5, o3: 95, nh3: 85, pb: 2.2 });
    }
  };

  const inputs: { key: keyof PollutantValues; label: string; min: number; max: number; step: number; unit: string }[] = [
    { key: 'pm25', label: t.pollutants.fineParticles, min: 0, max: 400, step: 1, unit: 'µg/m³' },
    { key: 'pm10', label: t.pollutants.coarseParticles, min: 0, max: 600, step: 5, unit: 'µg/m³' },
    { key: 'no2', label: t.pollutants.nitrogenDioxide, min: 0, max: 400, step: 1, unit: 'µg/m³' },
    { key: 'so2', label: t.pollutants.sulfurDioxide, min: 0, max: 800, step: 5, unit: 'µg/m³' },
    { key: 'co', label: t.pollutants.carbonMonoxide, min: 0, max: 30, step: 0.1, unit: 'mg/m³' },
    { key: 'o3', label: t.pollutants.ozone, min: 0, max: 300, step: 1, unit: 'µg/m³' },
    { key: 'nh3', label: t.pollutants.ammonia, min: 0, max: 1000, step: 10, unit: 'µg/m³' },
    { key: 'pb', label: t.pollutants.lead, min: 0, max: 4, step: 0.1, unit: 'µg/m³' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header & Result Banner */}
      <div className="rounded-2xl glass-panel-glow p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {tc.interactiveEngine}
              </span>
              <span className="text-xs text-slate-400">
                {tc.cpcbFormulaNotice}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              {tc.whatIfTitle}
            </h2>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => handlePreset('good')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg text-emerald-300 hover:bg-emerald-500/10"
            >
              {tc.presetCleanDay}
            </button>
            <button
              onClick={() => handlePreset('moderate')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg text-amber-300 hover:bg-amber-500/10"
            >
              {tc.presetTypicalUrban}
            </button>
            <button
              onClick={() => handlePreset('severe')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg text-red-300 hover:bg-red-500/10"
            >
              {tc.presetWinterSmog}
            </button>
          </div>
        </div>

        {/* Live Calculation Output Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black font-mono shadow-lg"
              style={{ backgroundColor: `${result.color}25`, color: result.textColor, border: `2px solid ${result.color}` }}
            >
              {result.aqi}
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{getCategoryLabel(result.category)} {tc.airQualitySuffix}</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: result.color }} />
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {tc.dominantPollutantLabel} <strong className="text-slate-200">{result.dominantPollutant ? result.dominantPollutant.toUpperCase() : 'None'}</strong> ({tc.subIndexLabel} {result.aqi})
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <div>{tc.formulaLabel} <span className="font-mono text-slate-300">AQI = max(I_pm25, I_pm10, ..., I_pb)</span></div>
            <div className="text-[11px] text-emerald-400 mt-1">{tc.validityLabel} {result.isValid ? tc.valid : tc.incomplete} ({result.pollutantCount}/8 {tc.monitoredCount})</div>
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inputs.map((inp) => {
          const val = pollutants[inp.key] ?? 0;
          const subIdx = result.subIndices[inp.key] ?? 0;
          const isDominant = result.dominantPollutant === inp.key;

          return (
            <div 
              key={inp.key} 
              className={`p-4 rounded-xl glass-panel border transition-all ${
                isDominant ? 'border-amber-500/40 bg-slate-900/80' : 'border-slate-800/80 bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-300">{inp.label}</span>
                <span className="font-mono font-bold text-white">
                  {val} {inp.unit}
                </span>
              </div>

              <input
                type="range"
                min={inp.min}
                max={inp.max}
                step={inp.step}
                value={val}
                onChange={(e) => handleSliderChange(inp.key, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                <span>{tc.subIndexLabel} <strong className="text-white">{subIdx}</strong></span>
                {isDominant && <span className="text-amber-400 font-bold uppercase text-[10px]">{t.pollutants.primaryDriver}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
