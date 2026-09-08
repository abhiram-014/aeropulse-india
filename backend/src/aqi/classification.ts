import { AqiCategory } from '../types/index.js';

export interface CategoryDetails {
  category: AqiCategory;
  range: [number, number];
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  description: string;
  healthStatement: string;
}

export const CPCB_CATEGORIES: Record<AqiCategory, CategoryDetails> = {
  'Good': {
    category: 'Good',
    range: [0, 50],
    color: '#10B981', // emerald-500
    bgColor: 'rgba(16, 185, 129, 0.12)',
    textColor: '#34D399',
    borderColor: '#059669',
    description: 'Minimal impact. Air quality is considered satisfactory, and air pollution poses little or no risk.',
    healthStatement: 'Air quality is ideal for all individuals. Enjoy outdoor activities.'
  },
  'Satisfactory': {
    category: 'Satisfactory',
    range: [51, 100],
    color: '#84CC16', // lime-500
    bgColor: 'rgba(132, 204, 22, 0.12)',
    textColor: '#A3E635',
    borderColor: '#65A30D',
    description: 'Minor breathing discomfort to sensitive people. Air quality is acceptable for most people.',
    healthStatement: 'Sensitive individuals should monitor for mild symptoms during strenuous outdoor activity.'
  },
  'Moderate': {
    category: 'Moderate',
    range: [101, 200],
    color: '#F59E0B', // amber-500
    bgColor: 'rgba(245, 158, 11, 0.12)',
    textColor: '#FBBF24',
    borderColor: '#D97706',
    description: 'Breathing discomfort to people with asthma, heart diseases, and children/elderly.',
    healthStatement: 'People with respiratory or cardiac conditions should limit prolonged outdoor exertion.'
  },
  'Poor': {
    category: 'Poor',
    range: [201, 300],
    color: '#F97316', // orange-500
    bgColor: 'rgba(249, 115, 22, 0.12)',
    textColor: '#FB923C',
    borderColor: '#EA580C',
    description: 'Breathing discomfort to most people on prolonged exposure. May cause respiratory illness.',
    healthStatement: 'Everyone may begin to experience health effects; sensitive groups may experience more serious health effects.'
  },
  'Very Poor': {
    category: 'Very Poor',
    range: [301, 400],
    color: '#EF4444', // red-500
    bgColor: 'rgba(239, 68, 68, 0.12)',
    textColor: '#F87171',
    borderColor: '#DC2626',
    description: 'Respiratory illness on prolonged exposure. Pronounced effect on people with lung and heart diseases.',
    healthStatement: 'Health alert: The risk of health effects is increased for everyone. Avoid prolonged outdoor exertion.'
  },
  'Severe': {
    category: 'Severe',
    range: [401, 500],
    color: '#9333EA', // purple-600 / maroon
    bgColor: 'rgba(147, 51, 234, 0.15)',
    textColor: '#C084FC',
    borderColor: '#7E22CE',
    description: 'Affects healthy people and seriously impacts those with existing diseases. Emergency conditions.',
    healthStatement: 'Health warning of emergency conditions: Everyone should avoid all outdoor physical activity.'
  }
};

export function classifyAqi(aqi: number): CategoryDetails {
  if (aqi <= 50) return CPCB_CATEGORIES['Good'];
  if (aqi <= 100) return CPCB_CATEGORIES['Satisfactory'];
  if (aqi <= 200) return CPCB_CATEGORIES['Moderate'];
  if (aqi <= 300) return CPCB_CATEGORIES['Poor'];
  if (aqi <= 400) return CPCB_CATEGORIES['Very Poor'];
  return CPCB_CATEGORIES['Severe'];
}
