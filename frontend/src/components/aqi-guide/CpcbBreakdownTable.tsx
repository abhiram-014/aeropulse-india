import React from 'react';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';

export const CpcbBreakdownTable: React.FC = () => {
  const { t } = useLanguage();
  const tb = t.cpcbBreakdown;

  const breakpoints = [
    {
      category: `${t.aqi.good} (0–50)`,
      color: '#10B981',
      pm25: '0 – 30',
      pm10: '0 – 50',
      no2: '0 – 40',
      so2: '0 – 40',
      co: '0 – 1.0',
      o3: '0 – 50',
      nh3: '0 – 200',
      pb: '0 – 0.5',
      impact: tb.impactGood
    },
    {
      category: `${t.aqi.satisfactory} (51–100)`,
      color: '#84CC16',
      pm25: '31 – 60',
      pm10: '51 – 100',
      no2: '41 – 80',
      so2: '41 – 80',
      co: '1.1 – 2.0',
      o3: '51 – 100',
      nh3: '201 – 400',
      pb: '0.6 – 1.0',
      impact: tb.impactSatisfactory
    },
    {
      category: `${t.aqi.moderate} (101–200)`,
      color: '#F59E0B',
      pm25: '61 – 90',
      pm10: '101 – 250',
      no2: '81 – 180',
      so2: '81 – 380',
      co: '2.1 – 10.0',
      o3: '101 – 168',
      nh3: '401 – 800',
      pb: '1.1 – 2.0',
      impact: tb.impactModerate
    },
    {
      category: `${t.aqi.poor} (201–300)`,
      color: '#F97316',
      pm25: '91 – 120',
      pm10: '251 – 350',
      no2: '181 – 280',
      so2: '381 – 800',
      co: '10.1 – 17.0',
      o3: '169 – 208',
      nh3: '801 – 1200',
      pb: '2.1 – 3.0',
      impact: tb.impactPoor
    },
    {
      category: `${t.aqi.veryPoor} (301–400)`,
      color: '#EF4444',
      pm25: '121 – 250',
      pm10: '351 – 430',
      no2: '281 – 400',
      so2: '801 – 1600',
      co: '17.1 – 34.0',
      o3: '209 – 748',
      nh3: '1201 – 1800',
      pb: '3.1 – 3.5',
      impact: tb.impactVeryPoor
    },
    {
      category: `${t.aqi.severe} (401–500)`,
      color: '#9333EA',
      pm25: '250+',
      pm10: '430+',
      no2: '400+',
      so2: '1600+',
      co: '34.0+',
      o3: '748+',
      nh3: '1800+',
      pb: '3.5+',
      impact: tb.impactSevere
    }
  ];

  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            {tb.title}
          </h3>
          <p className="text-xs text-slate-400">
            {tb.subtitle}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="text-[11px] uppercase bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800">
            <tr>
              <th className="py-3 px-3">{tb.thAqiCategory}</th>
              <th className="py-3 px-2">PM2.5 (24h)</th>
              <th className="py-3 px-2">PM10 (24h)</th>
              <th className="py-3 px-2">NO2 (24h)</th>
              <th className="py-3 px-2">SO2 (24h)</th>
              <th className="py-3 px-2">CO (8h)</th>
              <th className="py-3 px-2">O3 (8h)</th>
              <th className="py-3 px-2">NH3 (24h)</th>
              <th className="py-3 px-2">Pb (24h)</th>
              <th className="py-3 px-3">{tb.thHealthImpact}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {breakpoints.map((b) => (
              <tr key={b.category} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-3 font-sans font-bold flex items-center gap-1.5" style={{ color: b.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                  {b.category}
                </td>
                <td className="py-3 px-2 text-slate-200">{b.pm25}</td>
                <td className="py-3 px-2 text-slate-200">{b.pm10}</td>
                <td className="py-3 px-2 text-slate-200">{b.no2}</td>
                <td className="py-3 px-2 text-slate-200">{b.so2}</td>
                <td className="py-3 px-2 text-slate-200">{b.co}</td>
                <td className="py-3 px-2 text-slate-200">{b.o3}</td>
                <td className="py-3 px-2 text-slate-200">{b.nh3}</td>
                <td className="py-3 px-2 text-slate-200">{b.pb}</td>
                <td className="py-3 px-3 font-sans text-slate-300 max-w-xs text-[11px] leading-normal">
                  {b.impact}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
