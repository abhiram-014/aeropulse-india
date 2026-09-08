import { AqiCategory, PollutantType, PollutantValues } from '../types/index.js';

export interface AiContextPayload {
  state: string;
  district: string;
  station?: string;
  selectedDate: string;
  aqi?: number | null;
  category?: AqiCategory | null;
  dominantPollutant?: PollutantType | null;
  pollutants?: PollutantValues;
  hasData: boolean;
  dataSource?: string;
  timestamp?: string;
  language?: 'en' | 'te' | 'hi';
}

export interface AiResponse {
  answer: string;
  disclaimer: string;
  generatedBy: 'RULE_BASED_SAFETY_ENGINE' | 'EXTERNAL_LLM';
}

export class AiAssistantService {
  private externalApiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

  async generateResponse(question: string, context: AiContextPayload): Promise<AiResponse> {
    const trimmedQuestion = question.trim().toLowerCase();

    // 1. If no data exists for this district/date, do NOT fabricate!
    if (!context.hasData || (context.aqi == null && !context.pollutants?.pm25)) {
      const msg = context.language === 'te'
        ? `క్షమించండి, ${context.district} జిల్లా కోసం ${context.selectedDate} తేదీన ధృవీకరించబడిన గాలి నాణ్యత డేటా అందుబాటులో లేదు. నేను ఊహాజనిత సమాచారాన్ని సృష్టించలేను.`
        : context.language === 'hi'
        ? `क्षमा करें, ${context.district} जिले के लिए ${context.selectedDate} को प्रमाणित वायु गुणवत्ता डेटा उपलब्ध नहीं है। मैं काल्पनिक डेटा प्रदान नहीं कर सकता।`
        : `Air-quality data is not available for ${context.district} on ${context.selectedDate}. I cannot answer with fabricated or synthetic air-quality values.`;
      
      const disc = context.language === 'te'
        ? 'CPCB ఆరోగ్య ప్రమాణాలపై ఆధారపడిన మార్గదర్శకం. మీకు అసౌకర్యంగా ఉంటే వైద్య సలహా తీసుకోండి.'
        : context.language === 'hi'
        ? 'सीपीसीबी स्वास्थ्य मानदंडों पर आधारित सलाह। अस्वस्थ महसूस होने पर चिकित्सकीय सहायता लें।'
        : 'Guidance based on CPCB health criteria. If you feel unwell, seek medical attention.';

      return {
        answer: msg,
        disclaimer: disc,
        generatedBy: 'RULE_BASED_SAFETY_ENGINE'
      };
    }

    // 2. Fallback rule-based engine (robust, medically safe, zero fabrication)
    return this.generateRuleBasedAnswer(trimmedQuestion, context);
  }

  private generateRuleBasedAnswer(q: string, ctx: AiContextPayload): AiResponse {
    const aqi = ctx.aqi;
    const cat = ctx.category || 'Satisfactory';
    const dom = ctx.dominantPollutant ? ctx.dominantPollutant.toUpperCase() : (ctx.pollutants?.pm25 ? 'PM2.5' : 'Unknown');
    const district = ctx.district;
    const date = ctx.selectedDate;
    const lang = ctx.language || 'en';

    let answer = '';
    let disclaimer = 'AeroPulse advisory only. Not a medical diagnosis or prescription. If you experience breathing distress, seek professional medical care.';

    if (lang === 'te') {
      disclaimer = 'ఏరోపల్స్ సాధారణ సలహా మాత్రమే. వైద్య నిర్ధారణ లేదా ప్రిస్క్రిప్షన్ కాదు. శ్వాస తీసుకోవడంలో తీవ్ర ఇబ్బంది ఉంటే వైద్యులను సంప్రదించండి.';
      answer = this.generateTeluguAnswer(q, district, date, cat, aqi, dom, ctx);
    } else if (lang === 'hi') {
      disclaimer = 'एयरोपल्स केवल सामान्य स्वास्थ्य सलाह है। चिकित्सकीय निदान या नुस्खा नहीं है। सांस लेने में गंभीर तकलीफ होने पर डॉक्टर से संपर्क करें।';
      answer = this.generateHindiAnswer(q, district, date, cat, aqi, dom, ctx);
    } else {
      answer = this.generateEnglishAnswer(q, district, date, cat, aqi, dom, ctx);
    }

    return {
      answer,
      disclaimer,
      generatedBy: 'RULE_BASED_SAFETY_ENGINE'
    };
  }

  private generateEnglishAnswer(q: string, district: string, date: string, cat: string, aqi: number | null | undefined, dom: string, ctx: AiContextPayload): string {
    if (q.includes('what should i do') || q.includes('do today') || q.includes('more precautions') || q.includes('precaution')) {
      if (cat === 'Good') {
        return `In ${district} on ${date}, the air quality is **Good** (AQI ${aqi ?? 'N/A'}). Air pollution poses minimal or no risk. You can freely engage in outdoor recreation, open your windows for fresh air ventilation, and conduct normal activities without restrictions.`;
      } else if (cat === 'Satisfactory') {
        return `In ${district} on ${date}, the air is **Satisfactory** (AQI ${aqi ?? 'N/A'}). Minor breathing discomfort may occur for sensitive individuals, but most people can safely enjoy outdoor activities. Normal ventilation is appropriate.`;
      } else if (cat === 'Moderate') {
        return `In ${district} on ${date}, the air is **Moderate** (AQI ${aqi ?? 'N/A'}), with ${dom} as the primary pollutant. Children, older adults, and individuals with respiratory or heart conditions should take regular rest breaks and limit prolonged heavy exertion outdoors.`;
      } else if (cat === 'Poor') {
        return `In ${district} on ${date}, air quality is **Poor** (AQI ${aqi ?? 'N/A'}). Reduce prolonged outdoor exertion. Wear an N95/FFP2 mask near heavy traffic or construction zones. Keep windows closed during rush hours and use indoor air filtration if available.`;
      } else if (cat === 'Very Poor' || cat === 'Severe') {
        return `In ${district} on ${date}, air quality is **${cat}** (AQI ${aqi ?? 'N/A'}). Avoid strenuous outdoor physical exertion. Vulnerable groups (children, elderly, asthma patients) should strictly stay indoors in clean air spaces. Keep windows closed and wear sealed N95 masks if you must commute.`;
      } else {
        return `Air quality in ${district} on ${date} shows ${dom} levels around ${ctx.pollutants?.pm25 ?? 'standard'} µg/m³. Maintain reasonable precautions and minimize roadside exposure during traffic peaks.`;
      }
    } else if (q.includes('exercise') || q.includes('workout') || q.includes('run') || q.includes('jog')) {
      if (cat === 'Good' || cat === 'Satisfactory') {
        return `Yes, outdoor exercise in ${district} is safe on ${date}. Air quality is **${cat}** (AQI ${aqi ?? 'optimal'}). It is an ideal time for running, cycling, or sports.`;
      } else if (cat === 'Moderate') {
        return `Outdoor exercise is acceptable for healthy adults, but sensitive individuals should reduce intense workouts. Consider exercising early in the morning before traffic builds up, or shift high-intensity cardio indoors.`;
      } else {
        return `Outdoor strenuous exercise is **not recommended** today in ${district} because the air is **${cat}** (AQI ${aqi ?? 'elevated'}). Heavy breathing brings high particulate loads (${dom}) deep into the lungs. Shift your workout indoors.`;
      }
    } else if (q.includes('children') || q.includes('child') || q.includes('kids') || q.includes('older') || q.includes('elderly')) {
      if (cat === 'Good' || cat === 'Satisfactory') {
        return `Yes, outdoor play and school activities are safe for children and older adults in ${district} on ${date}. The air is **${cat}**.`;
      } else if (cat === 'Moderate') {
        return `Children and older adults can play outside, but should take frequent hydration and rest breaks. Watch for symptoms like coughing, throat irritation, or wheezing.`;
      } else {
        return `Caution: Air is **${cat}** in ${district}. Children and older adults should avoid prolonged outdoor play. Keep school sports indoors and monitor anyone with asthma closely.`;
      }
    } else if (q.includes('main pollutant') || q.includes('dominant') || q.includes('pollutant')) {
      const pm25Val = ctx.pollutants?.pm25 != null ? `${ctx.pollutants.pm25} µg/m³` : 'N/A';
      const pm10Val = ctx.pollutants?.pm10 != null ? `${ctx.pollutants.pm10} µg/m³` : 'N/A';
      const no2Val = ctx.pollutants?.no2 != null ? `${ctx.pollutants.no2} µg/m³` : 'N/A';

      return `The dominant pollutant identified for ${district} on ${date} is **${dom}**.\n\nRecorded 24-hour levels:\n- **PM2.5:** ${pm25Val} (fine inhalable particulate)\n- **PM10:** ${pm10Val} (coarse inhalable dust)\n- **NO2:** ${no2Val} (traffic/combustion gas)\n\n${this.getPollutantGuidance(dom, 'en')}`;
    } else if (q.includes('how was the air') || q.includes('on this date') || q.includes('history')) {
      return `For **${district}** on **${date}**:\n- **CPCB AQI:** ${aqi ?? 'Provisional / Insufficient sub-indices'}\n- **Category:** ${cat}\n- **Primary Pollutant:** ${dom}\n- **Data Source:** ${ctx.dataSource || 'CPCB / Atmospheric Observations'}\nAll values reflect actual observations recorded for this specific date.`;
    } else {
      return `Regarding your query about **${district}** on **${date}**:\nThe air quality category is **${cat}** with an AQI of **${aqi ?? 'N/A'}** and dominant pollutant **${dom}**.\n\nGeneral guidance: Keep exposure to roadside vehicular exhaust low, ensure adequate indoor ventilation when outdoor levels are reasonable, and follow CPCB precautions appropriate for ${cat} air.`;
    }
  }

  private generateTeluguAnswer(q: string, district: string, date: string, cat: string, aqi: number | null | undefined, dom: string, ctx: AiContextPayload): string {
    const catMap: Record<string, string> = {
      'Good': 'మంచిది (Good)',
      'Satisfactory': 'సంతృప్తికరం (Satisfactory)',
      'Moderate': 'మితమైనది (Moderate)',
      'Poor': 'పేలవమైనది (Poor)',
      'Very Poor': 'చాలా పేలవమైనది (Very Poor)',
      'Severe': 'తీవ్రమైనది (Severe)'
    };
    const catTe = catMap[cat] || cat;

    if (q.includes('what should i do') || q.includes('do today') || q.includes('more precautions') || q.includes('precaution') || q.includes('చేయాలి') || q.includes('జాగ్రత్తలు')) {
      if (cat === 'Good') {
        return `${district}లో ${date} తేదీన గాలి నాణ్యత **${catTe}** (AQI ${aqi ?? 'N/A'}). కాలుష్య ప్రమాదం లేదు. మీరు నిశ్చింతగా బయట తిరగవచ్చు, కిటికీలు తెరిచి తాజా గాలిని ఆస్వాదించవచ్చు.`;
      } else if (cat === 'Satisfactory') {
        return `${district}లో ${date} తేదీన గాలి నాణ్యత **${catTe}** (AQI ${aqi ?? 'N/A'}). సున్నితమైన వారికి స్వల్ప అసౌకర్యం ఉండవచ్చు, కానీ సాధారణ ప్రజలు బయటి పనులను సురక్షితంగా నిర్వహించవచ్చు.`;
      } else if (cat === 'Moderate') {
        return `${district}లో ${date} తేదీన గాలి **${catTe}** (AQI ${aqi ?? 'N/A'}), ప్రధాన కాలుష్య కారకం ${dom}. పిల్లలు, వృద్ధులు మరియు శ్వాసకోశ సమస్యలు ఉన్నవారు ఎక్కువ సమయం బయట శ్రమించకూడదు.`;
      } else if (cat === 'Poor') {
        return `${district}లో ${date} తేదీన గాలి నాణ్యత **${catTe}** (AQI ${aqi ?? 'N/A'}). బయట గడిపే సమయాన్ని తగ్గించండి. రద్దీ ప్రాంతాల్లో N95 మాస్క్ ధరించండి. కిటికీలు మూసి ఉంచండి.`;
      } else if (cat === 'Very Poor' || cat === 'Severe') {
        return `${district}లో ${date} తేదీన గాలి నాణ్యత **${catTe}** (AQI ${aqi ?? 'N/A'}). బయట శ్రమతో కూడిన పనులు అస్సలు చేయవద్దు. పిల్లలు, వృద్ధులు ఇళ్లలోనే ఉండాలి. ప్రయాణం చేయాల్సి వస్తే N95 మాస్క్ తప్పనిసరి.`;
      } else {
        return `${district}లో ${date}న గాలి నాణ్యత పరిశీలన ప్రకారం జాగ్రత్తలు పాటించండి. రద్దీ వేళల్లో రోడ్లపై ఎక్కువసేపు ఉండకండి.`;
      }
    } else if (q.includes('exercise') || q.includes('workout') || q.includes('run') || q.includes('jog') || q.includes('వ్యాయామం')) {
      if (cat === 'Good' || cat === 'Satisfactory') {
        return `అవును, ${district}లో ${date}న బయట వ్యాయామం సురక్షితం. గాలి నాణ్యత **${catTe}** (AQI ${aqi ?? 'N/A'}). రన్నింగ్, సైక్లింగ్ కోసం ఇది అనుకూల సమయం.`;
      } else if (cat === 'Moderate') {
        return `ఆరోగ్యవంతులు వ్యాయామం చేయవచ్చు, కానీ శ్వాసకోశ సమస్యలు ఉన్నవారు తగ్గించాలి. ట్రాఫిక్ పెరగకముందే ఉదయాన్నే వ్యాయామం ముగించడం మంచిది.`;
      } else {
        return `బయట వ్యాయామం **సిఫార్సు చేయబడదు**. గాలి **${catTe}**గా ఉంది (AQI ${aqi ?? 'N/A'}). లోతుగా శ్వాస పీల్చడం వల్ల సూక్ష్మ ధూళి (${dom}) ఊపిరితిత్తులలోకి చేరుతుంది. వ్యాయామాన్ని ఇంటి లోపలే చేయండి.`;
      }
    } else if (q.includes('children') || q.includes('child') || q.includes('kids') || q.includes('older') || q.includes('elderly') || q.includes('పిల్లలు') || q.includes('వృద్ధులు')) {
      if (cat === 'Good' || cat === 'Satisfactory') {
        return `అవును, ${district}లో ${date}న పిల్లలు, వృద్ధులకు బయటి వాతావరణం సురక్షితం. గాలి **${catTe}**గా ఉంది.`;
      } else if (cat === 'Moderate') {
        return `పిల్లలు, వృద్ధులు బయట ఆడుకోవచ్చు, కానీ తరచూ నీళ్లు తాగుతూ విశ్రాంతి తీసుకోవాలి. దగ్గు లేదా ఆయాసం వస్తే గమనించండి.`;
      } else {
        return `హెచ్చరిక: ${district}లో గాలి **${catTe}**గా ఉంది. పిల్లలు, వృద్ధులు బయట ఎక్కువసేపు ఉండకూడదు. ఆటలను ఇంటి లోపలే నిర్వహించండి.`;
      }
    } else if (q.includes('main pollutant') || q.includes('dominant') || q.includes('pollutant') || q.includes('కాలుష్య కారకం')) {
      const pm25Val = ctx.pollutants?.pm25 != null ? `${ctx.pollutants.pm25} µg/m³` : 'N/A';
      const pm10Val = ctx.pollutants?.pm10 != null ? `${ctx.pollutants.pm10} µg/m³` : 'N/A';
      const no2Val = ctx.pollutants?.no2 != null ? `${ctx.pollutants.no2} µg/m³` : 'N/A';

      return `${district}లో ${date}న నమోదైన ప్రధాన కాలుష్య కారకం **${dom}**.\n\n24 గంటల స్థాయిలు:\n- **PM2.5:** ${pm25Val} (పీల్చదగిన సూక్ష్మ ధూళికణాలు)\n- **PM10:** ${pm10Val} (స్థూల ధూళికణాలు)\n- **NO2:** ${no2Val} (ట్రాఫిక్/ఇంధన ఉద్గారాలు)\n\n${this.getPollutantGuidance(dom, 'te')}`;
    } else if (q.includes('how was the air') || q.includes('on this date') || q.includes('history') || q.includes('ఎలా ఉంది')) {
      return `**${district}**లో **${date}** తేదీ నాటి వివరాలు:\n- **CPCB AQI:** ${aqi ?? 'పరిశీలనలో ఉంది'}\n- **వర్గం:** ${catTe}\n- **ప్రధాన కారకం:** ${dom}\n- **డేటా మూలం:** ${ctx.dataSource || 'CPCB / వాతావరణ పరిశీలనలు'}\nఅన్ని విలువలు ఈ నిర్దిష్ట తేదీకి సంబంధించిన వాస్తవ కొలతలను ప్రతిబింబిస్తాయి.`;
    } else {
      return `**${district}**లో **${date}** తేదీన గాలి నాణ్యత సమాచారం:\nగాలి నాణ్యత వర్గం **${catTe}**, AQI: **${aqi ?? 'N/A'}**, ప్రధాన కాలుష్య కారకం: **${dom}**.\n\nసాధారణ సలహా: వాహనాల పొగకు దూరంగా ఉండండి, గాలి సాధారణంగా ఉన్నప్పుడు కిటికీలు తెరవండి, మరియు CPCB సిఫార్సు చేసిన జాగ్రత్తలు పాటించండి.`;
    }
  }

  private generateHindiAnswer(q: string, district: string, date: string, cat: string, aqi: number | null | undefined, dom: string, ctx: AiContextPayload): string {
    const catMap: Record<string, string> = {
      'Good': 'अच्छा (Good)',
      'Satisfactory': 'संतोषजनक (Satisfactory)',
      'Moderate': 'मध्यम (Moderate)',
      'Poor': 'खराब (Poor)',
      'Very Poor': 'बहुत खराब (Very Poor)',
      'Severe': 'गंभीर (Severe)'
    };
    const catHi = catMap[cat] || cat;

    if (q.includes('what should i do') || q.includes('do today') || q.includes('more precautions') || q.includes('precaution') || q.includes('क्या करें') || q.includes('सावधानी')) {
      if (cat === 'Good') {
        return `${district} में ${date} को वायु गुणवत्ता **${catHi}** (AQI ${aqi ?? 'N/A'}) है। प्रदूषण का कोई खतरा नहीं है। आप बाहर गतिविधियों का आनंद ले सकते हैं और घर की खिड़कियां खोल सकते हैं।`;
      } else if (cat === 'Satisfactory') {
        return `${district} में ${date} को वायु गुणवत्ता **${catHi}** (AQI ${aqi ?? 'N/A'}) है। संवेदनशील व्यक्तियों को हल्का असर हो सकता है, लेकिन अधिकांश लोगों के लिए बाहर जाना सुरक्षित है।`;
      } else if (cat === 'Moderate') {
        return `${district} में ${date} को वायु **${catHi}** (AQI ${aqi ?? 'N/A'}) है, जिसमें मुख्य प्रदूषक ${dom} है। बच्चों, बुजुर्गों और सांस के मरीजों को बाहर अधिक परिश्रम से बचना चाहिए।`;
      } else if (cat === 'Poor') {
        return `${district} में ${date} को वायु गुणवत्ता **${catHi}** (AQI ${aqi ?? 'N/A'}) है। बाहर अधिक समय बिताने से बचें। भारी ट्रैफिक या निर्माण क्षेत्रों में N95 मास्क पहनें और खिड़कियां बंद रखें।`;
      } else if (cat === 'Very Poor' || cat === 'Severe') {
        return `${district} में ${date} को वायु गुणवत्ता **${catHi}** (AQI ${aqi ?? 'N/A'}) है। बाहर शारीरिक परिश्रम से पूरी तरह बचें। बच्चे और बुजुर्ग घर के अंदर ही रहें। बाहर निकलना जरूरी हो तो N95 मास्क अवश्य पहनें।`;
      } else {
        return `${district} में ${date} के वायु गुणवत्ता स्तर को देखते हुए सामान्य स्वास्थ्य सावधानियां बरतें।`;
      }
    } else if (q.includes('exercise') || q.includes('workout') || q.includes('run') || q.includes('jog') || q.includes('व्यायाम')) {
      if (cat === 'Good' || cat === 'Satisfactory') {
        return `हाँ, ${district} में ${date} को बाहर व्यायाम करना पूरी तरह सुरक्षित है। वायु गुणवत्ता **${catHi}** (AQI ${aqi ?? 'N/A'}) है। दौड़ने या खेलकूद के लिए यह सही समय है।`;
      } else if (cat === 'Moderate') {
        return `स्वस्थ वयस्कों के लिए बाहर व्यायाम ठीक है, लेकिन संवेदनशील लोग भारी कसरत से बचें। सुबह जल्दी ट्रैफिक बढ़ने से पहले व्यायाम पूरा करें।`;
      } else {
        return `बाहर भारी व्यायाम **उचित नहीं है**। वायु **${catHi}** स्तर पर है (AQI ${aqi ?? 'N/A'})। तेज सांस लेने से बारीक कण (${dom}) फेफड़ों में गहराई तक जा सकते हैं। वर्कआउट घर के अंदर ही करें।`;
      }
    } else if (q.includes('children') || q.includes('child') || q.includes('kids') || q.includes('older') || q.includes('elderly') || q.includes('बच्चे') || q.includes('बुजुर्ग')) {
      if (cat === 'Good' || cat === 'Satisfactory') {
        return `हाँ, ${district} में ${date} को बच्चों और बुजुर्गों के लिए बाहर जाना सुरक्षित है। वायु **${catHi}** है।`;
      } else if (cat === 'Moderate') {
        return `बच्चे और बुजुर्ग बाहर खेल-कूद सकते हैं, लेकिन समय-समय पर पानी पिएं और आराम करें। खांसी या सांस फूलने पर ध्यान दें।`;
      } else {
        return `चेतावनी: ${district} में वायु **${catHi}** है। बच्चों और बुजुर्गों को बाहर खेलने या टहलने से बचना चाहिए। खेल गतिविधियां इनडोर रखें।`;
      }
    } else if (q.includes('main pollutant') || q.includes('dominant') || q.includes('pollutant') || q.includes('मुख्य प्रदूषक')) {
      const pm25Val = ctx.pollutants?.pm25 != null ? `${ctx.pollutants.pm25} µg/m³` : 'N/A';
      const pm10Val = ctx.pollutants?.pm10 != null ? `${ctx.pollutants.pm10} µg/m³` : 'N/A';
      const no2Val = ctx.pollutants?.no2 != null ? `${ctx.pollutants.no2} µg/m³` : 'N/A';

      return `${district} में ${date} को मुख्य प्रदूषक **${dom}** दर्ज किया गया है।\n\n24 घंटे के स्तर:\n- **PM2.5:** ${pm25Val} (अति सूक्ष्म कण)\n- **PM10:** ${pm10Val} (धूल के मोटे कण)\n- **NO2:** ${no2Val} (वाहनों और दहन से निकली गैस)\n\n${this.getPollutantGuidance(dom, 'hi')}`;
    } else if (q.includes('how was the air') || q.includes('on this date') || q.includes('history') || q.includes('कैसी थी')) {
      return `**${district}** में **${date}** की स्थिति:\n- **CPCB AQI:** ${aqi ?? 'अनुमानित / अपूर्ण आंकड़े'}\n- **श्रेणी:** ${catHi}\n- **मुख्य प्रदूषक:** ${dom}\n- **डेटा स्रोत:** ${ctx.dataSource || 'CPCB / वायुमंडलीय अवलोकन'}\nसभी आंकड़े इस तारीख के वास्तविक रिकॉर्ड पर आधारित हैं।`;
    } else {
      return `**${district}** में **${date}** के लिए वायु गुणवत्ता जानकारी:\nवायु गुणवत्ता श्रेणी **${catHi}** है (AQI: **${aqi ?? 'N/A'}**), मुख्य प्रदूषक: **${dom}**।\n\nसामान्य सलाह: वाहनों के धुएं से दूरी बनाए रखें, घर में शुद्ध वायु का प्रवाह रखें और CPCB द्वारा सुझाई गई सावधानियों का पालन करें।`;
    }
  }

  private getPollutantGuidance(pollutant: string, lang: 'en' | 'te' | 'hi' = 'en'): string {
    const p = pollutant.toUpperCase();
    if (lang === 'te') {
      if (p.includes('PM2.5')) {
        return 'PM2.5 సూక్ష్మ కణాలు రక్తప్రవాహంలోకి చేరగలవు. కాలుష్యం ఎక్కువగా ఉన్నప్పుడు బయట తిరగడం తగ్గించండి.';
      } else if (p.includes('PM10')) {
        return 'PM10 ధూళికణాలు గొంతు మరియు కంటి చికాకును కలిగిస్తాయి. సాధారణ మాస్క్ ధరించడం రక్షణనిస్తుంది.';
      } else if (p.includes('NO2')) {
        return 'NO2 వాహన ఉద్గారాల నుండి విడుదలవుతుంది. ట్రాఫిక్ ఎక్కువగా ఉండే ప్రాంతాల్లో ఎక్కువసేపు ఉండకండి.';
      } else if (p.includes('O3')) {
        return 'ఎండ వేళల్లో ఓజోన్ పెరుగుతుంది. మధ్యాహ్నం వేళల్లో శ్రమతో కూడిన పనులు తగ్గించండి.';
      }
      return '';
    }

    if (lang === 'hi') {
      if (p.includes('PM2.5')) {
        return 'PM2.5 अति सूक्ष्म कण फेफड़ों में गहराई तक जा सकते हैं। प्रदूषण अधिक होने पर बाहर जाने से बचें।';
      } else if (p.includes('PM10')) {
        return 'PM10 धूल के मोटे कण गले और आंखों में जलन पैदा कर सकते हैं। मास्क पहनना उपयोगी है।';
      } else if (p.includes('NO2')) {
        return 'NO2 वाहनों के धुएं से निकलती है। भारी ट्रैफिक वाले क्षेत्रों में जाने से बचें।';
      } else if (p.includes('O3')) {
        return 'धूप के समय ओजोन का स्तर बढ़ता है। दोपहर के समय बाहर शारीरिक श्रम कम करें।';
      }
      return '';
    }

    if (p.includes('PM2.5')) {
      return 'PM2.5 consists of tiny microscopic particles (under 2.5 micrometers) that can penetrate deep into lung tissue. Reducing outdoor exposure during peaks is recommended.';
    } else if (p.includes('PM10')) {
      return 'PM10 consists of inhalable coarse dust and road particles that can irritate airways, eyes, and throat.';
    } else if (p.includes('NO2')) {
      return 'NO2 is a gaseous byproduct of vehicle combustion and power generation that irritates the respiratory lining.';
    } else if (p.includes('O3')) {
      return 'Ground-level ozone forms via photochemical reactions in sunlight and can cause airway reactivity during afternoon exertion.';
    }
    return '';
  }
}
