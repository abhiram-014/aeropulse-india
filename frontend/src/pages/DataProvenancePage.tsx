import React from 'react';
import { 
  CheckCircle2, 
  Database, 
  ExternalLink, 
  FileCode2, 
  Info, 
  Layers, 
  Satellite, 
  ShieldAlert, 
  Sparkles, 
  Terminal, 
  Wind 
} from 'lucide-react';

export const DataProvenancePage: React.FC = () => {
  const sources = [
    {
      name: 'Central Pollution Control Board (CPCB) / CAAQMS',
      type: 'Ground-Based Continuous In-Situ Monitoring',
      role: 'Primary Air Quality Ground Truth',
      frequency: 'Hourly Automatic Ingestion',
      parameters: 'PM2.5, PM10, NO2, SO2, CO, O3, NH3, Pb',
      description: 'Continuous Ambient Air Quality Monitoring Stations operated by state pollution control boards and CPCB across major Indian metropolitan areas.',
      status: 'Active (Simulated & Real-time Adapters)'
    },
    {
      name: 'Open-Meteo High-Resolution NWP',
      type: 'Numerical Weather Prediction (ECMWF / DWD / GFS)',
      role: 'Meteorological Covariates & Dispersion Physics',
      frequency: 'Hourly Telemetry & 24h Forward Forecast',
      parameters: 'Temperature 2m, Relative Humidity, Pressure, Wind 10m, Precipitation, Boundary Layer Height',
      description: 'Global high-resolution meteorological models providing surface atmospheric physics crucial for understanding particulate dispersion and boundary layer trapping.',
      status: 'Active (Global Live Feed)'
    },
    {
      name: 'MOSDAC / SAC / ISRO INSAT-3DR L2B AOD',
      type: 'Geostationary Remote Sensing',
      role: 'Columnar Aerosol Optical Depth Context',
      frequency: 'Daytime Passes (NetCDF-4 Ingestion Pipeline)',
      parameters: 'Aerosol Optical Depth (550nm), Cloud Mask, Thermal Radiance',
      description: 'Space Applications Centre (ISRO) geostationary satellite products providing spatial aerosol optical thickness across the Indian subcontinent.',
      status: 'Integrated via Python xarray / netCDF4 Pipeline'
    },
    {
      name: 'OpenAQ Global Air Quality Network',
      type: 'Open Environmental Data Platform',
      role: 'Public REST API Bridge',
      frequency: 'On-Demand Ingestion',
      parameters: 'PM2.5, PM10, NO2, SO2, CO, O3',
      description: 'Global community platform aggregating open air quality telemetry from international and national agencies.',
      status: 'Available'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="rounded-2xl glass-panel-glow p-6 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            System Transparency
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Data Architecture & Provenance
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Scientific Transparency & Source Provenance
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          Every observation and forecast displayed in AeroPulse is strictly classified by origin, measurement modality, and timestamp. We adhere to scientific principles: ground measurements reflect ambient breathing air, while satellite products reflect atmospheric column optics.
        </p>
      </div>

      {/* Scientific Satellites Clarification Alert */}
      <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-start gap-3">
        <Satellite className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
          <strong className="text-white text-sm">Critical Scientific Clarification: INSAT & Satellite AOD</strong>
          <p>
            Geostationary satellites like INSAT-3D/3DR do <strong>NOT</strong> directly measure ground-level AQI or surface PM2.5. Instead, the Imager retrieves <strong>Aerosol Optical Depth (AOD)</strong>—a dimensionless measure of solar light extinction through the entire atmospheric column. In our platform, INSAT AOD is ingested strictly as an environmental covariate for spatial context and machine learning, never fabricated as a direct ground reading.
          </p>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src) => (
          <div key={src.name} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                  {src.type}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                  {src.name}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono border border-emerald-500/20 whitespace-nowrap">
                {src.status}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {src.description}
            </p>

            <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <div><strong>Role:</strong> {src.role}</div>
              <div><strong>Cadence:</strong> {src.frequency}</div>
              <div><strong>Variables:</strong> <span className="font-mono text-slate-400">{src.parameters}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* MOSDAC Ingestion Pipeline Details */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            MOSDAC / NetCDF-4 Data Ingestion Pipeline
          </h3>
          <span className="text-xs font-mono text-slate-400">scripts/ingest_mosdac.py</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 space-y-2 overflow-x-auto">
          <div className="text-emerald-400"># Ingestion workflow for ISRO SAC NetCDF/HDF5 products:</div>
          <div>1. Inspect NetCDF-4 metadata & dimensions (lat, lon, time, quality_flag)</div>
          <div>2. Extract variable: aerosol_optical_depth_550nm</div>
          <div>3. Filter missing/fill values (_FillValue: -999.0, cloud_mask == 1)</div>
          <div>4. Perform spatial bilinear interpolation onto CPCB station coordinates</div>
          <div>5. Ingest normalized environmental covariates into PostgreSQL database</div>
        </div>
      </div>

    </div>
  );
};
