import React from 'react';
import { DistrictAirQualitySummary, DistrictStationReading } from '../types/index.js';
import { IndiaAirMap } from '../components/map/IndiaAirMap.js';

interface MapExplorerPageProps {
  summary: DistrictAirQualitySummary | null;
  selectedState: string;
  selectedDistrict: string;
  onSelectStation?: (station: DistrictStationReading) => void;
}

export const MapExplorerPage: React.FC<MapExplorerPageProps> = ({
  summary,
  selectedState,
  selectedDistrict,
  onSelectStation,
}) => {
  return (
    <div className="space-y-6">
      <IndiaAirMap
        stations={summary?.stations ?? []}
        selectedDistrict={selectedDistrict}
        selectedState={selectedState}
        districtBoundary={summary?.bbox ? null : null}
        centroid={summary?.centroid}
        bbox={summary?.bbox}
        onSelectStation={onSelectStation}
      />
    </div>
  );
};
