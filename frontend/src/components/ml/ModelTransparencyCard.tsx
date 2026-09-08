import React from 'react';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Database, 
  FileText, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { ModelPerformanceMetadata } from '../../types/index.js';

interface ModelTransparencyCardProps {
  metadata: ModelPerformanceMetadata;
}

export const ModelTransparencyCard: React.FC<ModelTransparencyCardProps> = ({ metadata }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Lags': return '#10B981'; // emerald
      case 'Weather': return '#0EA5E9'; // sky
      case 'Temporal': return '#F59E0B'; // amber
      case 'Satellite': return '#8B5CF6'; // purple
      case 'Spatial': return '#EC4899'; // pink
      default: return '#64748B';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="rounded-2xl glass-panel-glow p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Machine Learning Transparency
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {metadata.modelVersion}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              Forecasting Model Architecture & Empirical Metrics
            </h2>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Chronological Time-Series Validation</span>
          </div>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          To prevent temporal data leakage, our forecasting models are strictly evaluated on held-out chronological out-of-time test partitions. We explicitly forbid random shuffling or standard k-fold cross validation for time-series evaluation.
        </p>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Target Objective</span>
            <div className="text-sm font-bold text-white mt-0.5">{metadata.targetVariable}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Model Algorithm</span>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{metadata.modelType}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Horizon Step</span>
            <div className="text-sm font-bold text-white mt-0.5">24 Hours (Hourly Multi-Step)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400">Training Samples</span>
            <div className="text-sm font-bold text-white mt-0.5 font-mono">{metadata.sampleCount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">R² Coefficient</span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {metadata.metrics.r2}
          </div>
          <div className="text-[10px] text-slate-400">Variance explained</div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Mean Absolute Error (MAE)</span>
          <div className="text-2xl font-black font-mono text-sky-400">
            {metadata.metrics.mae} <span className="text-xs font-sans text-slate-400">µg/m³</span>
          </div>
          <div className="text-[10px] text-slate-400">Average prediction error</div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Root Mean Sq Error (RMSE)</span>
          <div className="text-2xl font-black font-mono text-amber-400">
            {metadata.metrics.rmse} <span className="text-xs font-sans text-slate-400">µg/m³</span>
          </div>
          <div className="text-[10px] text-slate-400">Penalizes large deviations</div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">MAPE</span>
          <div className="text-2xl font-black font-mono text-purple-400">
            {metadata.metrics.mape}%
          </div>
          <div className="text-[10px] text-slate-400">Percentage error</div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">AQI Category Accuracy</span>
          <div className="text-2xl font-black font-mono text-teal-400">
            {metadata.metrics.aqiCategoryAccuracyPct}%
          </div>
          <div className="text-[10px] text-slate-400">Exact classification match</div>
        </div>

      </div>

      {/* Feature Importance Chart */}
      <div className="rounded-2xl glass-panel p-5 sm:p-6 space-y-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Relative Feature Importance (Gini / Gain Decomposition)
            </h3>
            <p className="text-xs text-slate-400">
              Contribution of autoregressive lags, meteorological drivers, boundary layer height, and satellite AOD
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="text-slate-300">Lags</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" />
              <span className="text-slate-300">Weather</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="text-slate-300">Temporal</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
              <span className="text-slate-300">Satellite</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metadata.featureImportance}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-xs space-y-1">
                        <div className="font-bold text-white">{d.feature}</div>
                        <div className="text-slate-300">
                          Relative Gain: <strong className="text-emerald-400">{(d.importance * 100).toFixed(1)}%</strong>
                        </div>
                        <div className="text-[10px] text-slate-400">Category: {d.category}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {metadata.featureImportance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
