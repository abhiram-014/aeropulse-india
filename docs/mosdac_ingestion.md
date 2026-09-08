# MOSDAC / ISRO Satellite Ingestion Architecture

## 1. Scientific Principles
1. **No Direct AQI Measurement**: INSAT-3D/3DR/3DS geostationary satellites do **NOT** directly measure ground-level AQI or ground particulate concentrations.
2. **Columnar Optical Depth**: The INSAT Imager retrieves **Aerosol Optical Depth (AOD)** at 550 nm, representing the total column integration of light extinction by aerosols from top of atmosphere to surface.
3. **Contextual Use**: Satellite AOD is ingested strictly as an environmental/meteorological covariate to inform regional spatial transport and ML dispersion models.

## 2. Ingestion Script (`scripts/ingest_mosdac.py`)
The pipeline supports:
- **NetCDF-4 (`.nc`)** and **HDF5 (`.h5`)** formats via `xarray` / `netCDF4` / `h5py`.
- Automated dataset attribute inspection (satellite name, sensor, pass timestamp).
- Extraction of geospatial bounding box for India ($6^\circ N - 38^\circ N, 68^\circ E - 98^\circ E$).
- Handling of fill values (`_FillValue: -999.0`, cloud mask filtering).
- Spatial mapping onto ground monitoring station coordinates.
- Export to PostgreSQL / JSON / Parquet.

## 3. Running the Ingestion Script
```bash
# Generate sample test metadata file
python scripts/generate_sample_satellite_nc.py

# Run MOSDAC parser and ingestion pipeline
python scripts/ingest_mosdac.py --file data/raw/insat3dr_sample_aod.json --output data/processed/mosdac_aod_latest.json
```
