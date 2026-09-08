import { 
  AqiCalculationResult, 
  PollutantType, 
  PollutantValues, 
  SubIndexDetail 
} from '../types/index.js';
import { CPCB_BREAKPOINTS, POLLUTANT_METADATA } from './breakpoints.js';
import { classifyAqi } from './classification.js';

/**
 * Calculates pollutant sub-index using CPCB piecewise linear interpolation:
 * I_p = I_low + ((I_high - I_low) / (C_high - C_low)) * (C_p - C_low)
 */
export function calculateSubIndex(pollutant: PollutantType, concentration: number | null | undefined): number | null {
  if (concentration === null || concentration === undefined || isNaN(concentration) || concentration < 0) {
    return null;
  }

  const breakpoints = CPCB_BREAKPOINTS[pollutant];
  if (!breakpoints || breakpoints.length === 0) {
    return null;
  }

  // Find the matching breakpoint bucket
  for (const bp of breakpoints) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      const subIndex = bp.iLow + ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow);
      return Math.round(subIndex);
    }
  }

  // If concentration exceeds the highest defined bucket (Severe+)
  const highestBp = breakpoints[breakpoints.length - 1];
  if (concentration > highestBp.cHigh) {
    // Extrapolate linearly based on severe slope, capped reasonably or standard formula
    const slope = (highestBp.iHigh - highestBp.iLow) / (highestBp.cHigh - highestBp.cLow);
    const extrapolated = highestBp.iHigh + slope * (concentration - highestBp.cHigh);
    return Math.min(500, Math.round(extrapolated));
  }

  return 0;
}

/**
 * Complete Indian AQI (CPCB Methodology) Engine
 * 
 * Rules:
 * 1. Calculate sub-index for all available pollutants.
 * 2. AQI = max(sub-index).
 * 3. Dominant pollutant = pollutant with the highest sub-index.
 * 4. Validation criteria: Minimum 3 pollutants must be monitored,
 *    and at least one MUST be PM2.5 or PM10.
 */
export function calculateIndianAQI(pollutants: PollutantValues): AqiCalculationResult {
  const pollutantKeys: PollutantType[] = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3', 'nh3', 'pb'];
  const subIndices: Record<PollutantType, number | null> = {
    pm25: null,
    pm10: null,
    no2: null,
    so2: null,
    co: null,
    o3: null,
    nh3: null,
    pb: null
  };

  let maxSubIndex = -1;
  let dominantPollutant: PollutantType | null = null;
  let validPollutantCount = 0;
  const subIndexDetails: SubIndexDetail[] = [];

  for (const key of pollutantKeys) {
    const rawVal = pollutants[key];
    if (rawVal !== null && rawVal !== undefined && !isNaN(rawVal) && rawVal >= 0) {
      const subIdx = calculateSubIndex(key, rawVal);
      subIndices[key] = subIdx;

      if (subIdx !== null) {
        validPollutantCount++;
        if (subIdx > maxSubIndex) {
          maxSubIndex = subIdx;
          dominantPollutant = key;
        }

        const catDetails = classifyAqi(subIdx);
        const meta = POLLUTANT_METADATA[key];

        subIndexDetails.push({
          pollutant: key,
          concentration: rawVal,
          subIndex: subIdx,
          category: catDetails.category,
          unit: meta?.unit ?? 'µg/m³',
          averagingPeriod: meta?.averagingPeriod ?? '24-Hour Average',
          isDominant: false // set below
        });
      }
    }
  }

  // Mark dominant pollutant in details
  if (dominantPollutant) {
    for (const detail of subIndexDetails) {
      if (detail.pollutant === dominantPollutant) {
        detail.isDominant = true;
      }
    }
  }

  // Sort subIndexDetails by subIndex descending
  subIndexDetails.sort((a, b) => b.subIndex - a.subIndex);

  // CPCB Validity check: Minimum 3 pollutants + at least 1 particulate (PM2.5 or PM10)
  const hasParticulate = subIndices.pm25 !== null || subIndices.pm10 !== null;
  const meetsMinPollutants = validPollutantCount >= 3;
  const isValid = meetsMinPollutants && hasParticulate && maxSubIndex >= 0;

  let validationMessage: string | undefined;
  if (!hasParticulate) {
    validationMessage = 'CPCB guideline requires at least PM2.5 or PM10 to be monitored for valid AQI.';
  } else if (!meetsMinPollutants) {
    validationMessage = `CPCB guideline requires minimum 3 monitored pollutants for official AQI (currently ${validPollutantCount}). Sub-index shown is provisional.`;
  }

  const finalAqi = maxSubIndex >= 0 ? maxSubIndex : 0;
  const categoryDetails = classifyAqi(finalAqi);

  return {
    aqi: finalAqi,
    category: categoryDetails.category,
    dominantPollutant,
    subIndices,
    subIndexDetails,
    pollutantCount: validPollutantCount,
    isValid,
    validationMessage,
    methodology: 'CPCB_INDIA_2014',
    color: categoryDetails.color,
    textColor: categoryDetails.textColor,
    description: categoryDetails.description
  };
}
