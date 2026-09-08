import fs from 'fs';
import path from 'path';

export interface GeoJsonFeature {
  type: string;
  id: string;
  properties: {
    id: string;
    district: string;
    state: string;
    country: string;
    centroid: [number, number];
    bbox: [number, number, number, number];
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

export class BoundaryService {
  private features: GeoJsonFeature[] = [];
  private loaded = false;

  private loadData(): void {
    if (this.loaded) return;
    try {
      const candidates = [
        path.resolve(process.cwd(), 'data', 'processed', 'india_districts.json'),
        path.resolve(process.cwd(), '..', 'data', 'processed', 'india_districts.json'),
        path.resolve(__dirname, '..', '..', 'data', 'processed', 'india_districts.json')
      ];

      for (const p of candidates) {
        if (fs.existsSync(p)) {
          const raw = fs.readFileSync(p, 'utf-8');
          const parsed = JSON.parse(raw);
          this.features = parsed.features || [];
          this.loaded = true;
          break;
        }
      }
    } catch (err) {
      console.error('Failed to load district boundaries GeoJSON:', err);
    }
  }

  getDistrictBoundary(state: string, district: string): GeoJsonFeature | null {
    this.loadData();
    const targetState = state.toLowerCase().trim();
    const targetDist = district.toLowerCase().trim();

    const match = this.features.find(f => {
      const s = f.properties.state.toLowerCase().trim();
      const d = f.properties.district.toLowerCase().trim();
      return (s === targetState || s.includes(targetState) || targetState.includes(s)) &&
             (d === targetDist || d.includes(targetDist) || targetDist.includes(d));
    });

    return match || null;
  }

  getStateDistricts(state: string): GeoJsonFeature[] {
    this.loadData();
    const targetState = state.toLowerCase().trim();
    return this.features.filter(f => {
      const s = f.properties.state.toLowerCase().trim();
      return s === targetState || s.includes(targetState) || targetState.includes(s);
    });
  }
}
