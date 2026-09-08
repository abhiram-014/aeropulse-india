import React from 'react';
import { SubIndexCalculator } from '../components/aqi-guide/SubIndexCalculator.js';
import { CpcbBreakdownTable } from '../components/aqi-guide/CpcbBreakdownTable.js';
import { AqiCalculationResult, PollutantValues } from '../types/index.js';

interface AqiCalculatorPageProps {
  onCalculate: (values: PollutantValues) => AqiCalculationResult;
}

export const AqiCalculatorPage: React.FC<AqiCalculatorPageProps> = ({ onCalculate }) => {
  return (
    <div className="space-y-8">
      <SubIndexCalculator onCalculate={onCalculate} />
      <CpcbBreakdownTable />
    </div>
  );
};
