import React, { useEffect } from 'react';
import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import { Layers, MapPin } from 'lucide-react';
import { DistrictStationReading } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTheme } from '../../context/ThemeContext.js';

interface IndiaAirMapProps {
  stations: DistrictStationReading[];
  selectedDistrict: string;
  selectedState: string;
  districtBoundary?: any | null;
  centroid?: [number, number];
  bbox?: [number, number, number, number];
  activeLayer?: string;
  onSelectStation?: (station: DistrictStationReading) => void;
}

const MapViewportSync: React.FC<{
  bbox?: [number, number, number, number];
  centroid?: [number, number];
}> = ({ bbox, centroid }) => {
  const map = useMap();

  useEffect(() => {
    if (bbox && bbox[0] && bbox[2]) {
      try {
        map.fitBounds([
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]]
        ], { padding: [35, 35], maxZoom: 10, animate: true });
      } catch {
        if (centroid) map.setView(centroid, 8, { animate: true });
      }
    } else if (centroid) {
      map.setView(centroid, 8, { animate: true });
    }
  }, [bbox, centroid, map]);

  return null;
};

export const IndiaAirMap: React.FC<IndiaAirMapProps> = ({
  stations,
  selectedDistrict,
  selectedState,
  districtBoundary,
  centroid = [17.45, 78.45],
  bbox,
  activeLayer = 'aqi',
  onSelectStation
}) => {
  const { t } = useLanguage();
  const tm = t.map;
  const { theme } = useTheme();

  const getCategoryLabel = (cat?: string | null) => {
    switch (cat?.toLowerCase()) {
      case 'good': return t.aqi.good;
      case 'satisfactory': return t.aqi.satisfactory;
      case 'moderate': return t.aqi.moderate;
      case 'poor': return t.aqi.poor;
      case 'very poor':
      case 'verypoor': return t.aqi.veryPoor;
      case 'severe': return t.aqi.severe;
      default: return cat || tm.popupMeasured;
    }
  };

  // Public basemap
  const tileUrl = theme === 'dark'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = theme === 'dark'
    ? '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; OpenStreetMap contributors | CPCB Telemetry'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | CPCB Telemetry';

  return (
    <div className="space-y-4 w-full">
      {/* Map Header */}
      <div className="rounded-3xl glass-panel p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>🗺️ {tm.title}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedDistrict} {t.districtBar.districtSuffix}, {selectedState} &bull; {stations.length} {tm.stationsActive}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span className="capitalize">{activeLayer.toUpperCase()} {tm.layerSuffix}</span>
          </span>
        </div>
      </div>

      {/* Map Leaflet Container */}
      <div className="relative w-full h-[450px] sm:h-[550px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl glass-panel">
        <MapContainer
          center={centroid}
          zoom={8}
          minZoom={4}
          maxZoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution={attribution}
            url={tileUrl}
          />

          <MapViewportSync bbox={bbox} centroid={centroid} />

          {/* Real District Boundary GeoJSON Polygon */}
          {districtBoundary && (
            <GeoJSON
              key={`${selectedState}_${selectedDistrict}_${districtBoundary.id || 'geom'}`}
              data={districtBoundary}
              style={{
                color: '#2563EB',
                weight: 2.5,
                fillColor: '#3B82F6',
                fillOpacity: theme === 'dark' ? 0.15 : 0.1,
                dashArray: '3'
              }}
            />
          )}

          {/* Real Monitoring Stations Markers */}
          {stations.map((s) => {
            const aqiVal = s.aqiResult?.aqi;
            let markerColor = '#10B981'; // Good default
            if (aqiVal != null) {
              if (aqiVal > 400) markerColor = '#9333EA'; // Severe
              else if (aqiVal > 300) markerColor = '#EF4444'; // Very Poor
              else if (aqiVal > 200) markerColor = '#F97316'; // Poor
              else if (aqiVal > 100) markerColor = '#F59E0B'; // Moderate
              else if (aqiVal > 50) markerColor = '#84CC16'; // Satisfactory
            } else if (s.pollutants?.pm25 != null) {
              const pm = s.pollutants.pm25;
              if (pm > 250) markerColor = '#9333EA';
              else if (pm > 120) markerColor = '#EF4444';
              else if (pm > 90) markerColor = '#F97316';
              else if (pm > 60) markerColor = '#F59E0B';
              else if (pm > 30) markerColor = '#84CC16';
            }

            return (
              <CircleMarker
                key={s.id}
                center={[s.latitude, s.longitude]}
                radius={14}
                eventHandlers={{
                  click: () => onSelectStation?.(s)
                }}
                pathOptions={{
                  fillColor: markerColor,
                  fillOpacity: 0.95,
                  color: '#FFFFFF',
                  weight: 2.5
                }}
              >
                <Popup>
                  <div className="p-1 space-y-2 min-w-[210px] text-slate-900">
                    <div>
                      <div className="text-[10px] font-mono uppercase font-bold text-blue-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{s.district}, {s.state}</span>
                      </div>
                      <div className="font-bold text-sm text-slate-900 leading-snug mt-0.5">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {s.latitude.toFixed(4)}°N, {s.longitude.toFixed(4)}°E
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">
                          {s.aqiResult?.isValid ? t.hero.cpcbAqi : t.hero.pm25Unit}
                        </div>
                        <div className="text-xl font-black font-mono" style={{ color: markerColor }}>
                          {s.aqiResult?.isValid ? s.aqiResult.aqi : (s.pollutants?.pm25 ?? 'N/A')}
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg text-white"
                        style={{ backgroundColor: markerColor }}
                      >
                        {getCategoryLabel(s.aqiResult?.category)}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100 font-mono">
                      <div>{tm.popupSource} {s.source}</div>
                      <div>{tm.popupUpdated} {s.timestamp.substring(0, 16).replace('T', ' ')}</div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="p-3.5 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <span>{tm.cpcbScale}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />{tm.legendGood}</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-lime-500" />{tm.legendSatisfactory}</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />{tm.legendModerate}</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" />{tm.legendPoor}</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" />{tm.legendVeryPoor}</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" />{tm.legendSevere}</span>
        </div>
      </div>
    </div>
  );
};
