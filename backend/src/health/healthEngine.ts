import { AqiCategory, HealthRecommendation, PollutantType } from '../types/index.js';

export function getHealthRecommendation(
  category: AqiCategory,
  dominantPollutant?: PollutantType | null
): HealthRecommendation {
  let generalAdvisory = '';
  let sensitiveGroupAdvisory = '';
  let outdoorActivityAdvice = '';
  let maskRecommendation = '';
  let airPurifierAdvice = '';
  let ventilateHomeAdvice = '';
  let dominantPollutantSpecificAdvice = '';

  switch (category) {
    case 'Good':
      generalAdvisory = 'Air quality is excellent. Air pollution poses minimal or no health risk to the general population.';
      sensitiveGroupAdvisory = 'Safe for everyone, including children, elderly individuals, and individuals with respiratory conditions.';
      outdoorActivityAdvice = 'Ideal conditions for all outdoor sports, running, cycling, and leisure activities.';
      maskRecommendation = 'No mask required.';
      airPurifierAdvice = 'Air purifiers are generally not necessary under these clean ambient conditions.';
      ventilateHomeAdvice = 'Keep windows open to allow fresh, clean air circulation throughout your home.';
      break;

    case 'Satisfactory':
      generalAdvisory = 'Air quality is acceptable. Most individuals will not experience adverse respiratory symptoms.';
      sensitiveGroupAdvisory = 'Unusually sensitive individuals may experience slight respiratory irritation during prolonged heavy outdoor exertion.';
      outdoorActivityAdvice = 'Great conditions for normal outdoor exercises and activities.';
      maskRecommendation = 'Masks are generally not required for the general public.';
      airPurifierAdvice = 'Standard natural ventilation is sufficient for healthy indoor air quality.';
      ventilateHomeAdvice = 'Natural ventilation recommended during morning and afternoon hours.';
      break;

    case 'Moderate':
      generalAdvisory = 'Air quality may cause mild breathing discomfort to sensitive individuals and people with pre-existing lung or heart conditions.';
      sensitiveGroupAdvisory = 'Children, seniors, and individuals with asthma or COPD should take more breaks during intense outdoor physical activities.';
      outdoorActivityAdvice = 'Most people can continue normal outdoor activities. Sensitive groups should reduce prolonged strenuous exertion.';
      maskRecommendation = 'Sensitive individuals and prolonged outdoor workers may benefit from wearing an N95/KN95 respirator.';
      airPurifierAdvice = 'Consider running indoor HEPA air purifiers in bedrooms, especially for vulnerable family members.';
      ventilateHomeAdvice = 'Ventilate during periods of low traffic and avoid opening windows near heavy traffic corridors.';
      break;

    case 'Poor':
      generalAdvisory = 'Air quality can cause breathing discomfort to most people on prolonged exposure and aggravation of heart or lung diseases.';
      sensitiveGroupAdvisory = 'People with respiratory or cardiac conditions, children, and elderly should avoid prolonged outdoor exertion.';
      outdoorActivityAdvice = 'Shift strenuous outdoor workouts indoors or reschedule to times with better atmospheric dispersion.';
      maskRecommendation = 'Wear a well-fitted N95 / FFP2 mask when venturing outdoors for extended durations.';
      airPurifierAdvice = 'Operate HEPA air purifiers continuously in living spaces and bedrooms.';
      ventilateHomeAdvice = 'Keep windows and doors closed. Use air conditioning in recirculating mode.';
      break;

    case 'Very Poor':
      generalAdvisory = 'Significant health alert. Prolonged exposure can trigger respiratory illness in healthy individuals and acute symptoms in vulnerable groups.';
      sensitiveGroupAdvisory = 'Children, pregnant women, the elderly, and those with cardiovascular or lung disease should strictly remain indoors.';
      outdoorActivityAdvice = 'Avoid all outdoor running, intense sports, and cycling. Limit outdoor exposure to essential transit only.';
      maskRecommendation = 'Certified N95/N99 respirator is strongly recommended whenever stepping outside.';
      airPurifierAdvice = 'Run high-efficiency particulate air (HEPA) purifiers on high mode and ensure indoor seals are tight.';
      ventilateHomeAdvice = 'Seal door/window gaps. Avoid burning candles, incense, or frying foods that add to indoor PM2.5 levels.';
      break;

    case 'Severe':
    default:
      generalAdvisory = 'Emergency health warning. Air pollution at this level affects healthy individuals and seriously impacts those with pre-existing medical conditions.';
      sensitiveGroupAdvisory = 'High risk of acute cardiopulmonary stress. Strictly stay indoors with air purification. Seek medical attention if experiencing breathing distress.';
      outdoorActivityAdvice = 'Cancel all outdoor physical activities, construction work, and non-essential travel.';
      maskRecommendation = 'Mandatory high-grade N95 / N99 / FFP3 respirator with tight facial seal for any outdoor presence.';
      airPurifierAdvice = 'Maintain continuous multi-stage HEPA air filtration. Create a clean-air sanctuary room at home.';
      ventilateHomeAdvice = 'Do not open windows. Keep all outer doors sealed and minimize all indoor combustion activities.';
      break;
  }

  // Add dominant-pollutant specific context
  if (dominantPollutant) {
    switch (dominantPollutant) {
      case 'pm25':
        dominantPollutantSpecificAdvice = 'Primary Concern: Fine particles (PM2.5) penetrate deep into alveolar lung tissues and enter the vascular bloodstream. HEPA filtration is effective against PM2.5.';
        break;
      case 'pm10':
        dominantPollutantSpecificAdvice = 'Primary Concern: Coarse particles (PM10) cause upper airway irritation, throat itchiness, and eye irritation. Wash eyes and face after returning indoors.';
        break;
      case 'no2':
        dominantPollutantSpecificAdvice = 'Primary Concern: Nitrogen Dioxide (NO2) is primarily emitted from vehicular traffic. Avoid high-traffic corridors and peak rush hour periods.';
        break;
      case 'so2':
        dominantPollutantSpecificAdvice = 'Primary Concern: Sulfur Dioxide (SO2) causes acute bronchial constriction. Asthmatics should keep rescue inhalers accessible.';
        break;
      case 'co':
        dominantPollutantSpecificAdvice = 'Primary Concern: Carbon Monoxide (CO) impairs tissue oxygenation. Ensure adequate indoor ventilation if using combustion appliances.';
        break;
      case 'o3':
        dominantPollutantSpecificAdvice = 'Primary Concern: Ground-level Ozone peaks during sunny afternoons. Limit outdoor physical exertion between 12:00 PM and 5:00 PM.';
        break;
      case 'nh3':
        dominantPollutantSpecificAdvice = 'Primary Concern: Ammonia (NH3) can cause respiratory and eye irritation. Avoid proximity to agricultural or industrial waste sites.';
        break;
      default:
        break;
    }
  }

  return {
    category,
    generalAdvisory,
    sensitiveGroupAdvisory,
    outdoorActivityAdvice,
    maskRecommendation,
    airPurifierAdvice,
    ventilateHomeAdvice,
    dominantPollutantSpecificAdvice
  };
}
