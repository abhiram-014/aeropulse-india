import React from 'react';
import { ModelPerformanceMetadata } from '../types/index.js';
import { ModelTransparencyCard } from '../components/ml/ModelTransparencyCard.js';

interface ModelTransparencyPageProps {
  metadata: ModelPerformanceMetadata | null;
}

export const ModelTransparencyPage: React.FC<ModelTransparencyPageProps> = ({ metadata }) => {
  if (!metadata) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3 glass-panel rounded-2xl">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
        <span className="text-sm font-medium text-slate-300">Loading ML Performance Specifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ModelTransparencyCard metadata={metadata} />
    </div>
  );
};
