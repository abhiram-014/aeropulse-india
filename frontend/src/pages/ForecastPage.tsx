import React from 'react';
import { ForecastResponse } from '../types/index.js';
import { ForecastTimelineChart } from '../components/forecast/ForecastTimelineChart.js';

interface ForecastPageProps {
  forecastData: ForecastResponse | null;
  loading: boolean;
}

export const ForecastPage: React.FC<ForecastPageProps> = ({ forecastData, loading }) => {
  if (loading || !forecastData) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3 glass-panel rounded-2xl">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
        <span className="text-sm font-medium text-slate-300">Computing 24-Hour ML Multi-Step Forecast...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ForecastTimelineChart forecastData={forecastData} />
    </div>
  );
};
