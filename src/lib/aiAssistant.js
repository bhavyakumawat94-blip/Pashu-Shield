// ==============================================================================
// PASHU SHIELD — AI Assistant Engine & Veterinary Knowledge Bridge
// PASHU AI: Verified Livestock Health Companion
// Features: Platform Knowledge, Veterinary Safety Guardrails, Multilingual
// Output, Emergency Triage Detection, and Secure Server/Proxy API Bridge.
// ==============================================================================

import { getLanguage } from "./i18n.js";

// System safety prompt defining the strict boundaries of PASHU AI
export const SYSTEM_VETERINARY_PROMPT = `
You are PASHU AI, a dedicated livestock health companion integrated into PASHU SHIELD.
Role & Guardrails:
1. Provide accurate, helpful guidance on livestock management, dairy cattle/buffalo/goat care, hygiene, nutrition, and government schemes (NADCP, Pashu Kisan Credit Card, Rashtriya Gokul Mission).
2. NEVER issue definitive medical diagnoses based solely on text or symptoms.
3. NEVER prescribe prescription-only antibiotics, steroids, or exact chemotherapeutic dosages. Always emphasize that drug administration requires on-site prescription by a licensed Veterinary Officer.
4. Immediately identify EMERGENCY red-flag symptoms: sudden unexplained mortality, blood discharge from orifices (suspected Anthrax), acute frothy bloat, high persistent fever with vesicular foot/mouth lesions, severe respiratory distress. Urge immediate physical veterinary intervention and isolation.
5. Accurately explain actual PASHU SHIELD application workflows: 12-digit Yellow Tag registration, Explainable Rule-Based Triage (0-100%), Voice Reporting, Lab Referrals, Offline IndexedDB syncing, and Digital Animal Passports.
6. Answer concisely, respectfully, and in the language requested by the user.
`;

// Emergency symptoms classifier
export function detectEmergencySymptoms(query) {
  const q = (query || "").toLowerCase();
  const emergencyPatterns = [
    // English
    "sudden death", "died suddenly", "blood from nose", "bleeding from mouth", "rectal bleeding",
    "severe bloat", "choking", "gasping for air", "cannot breathe", "downer cow", "unable to stand",
    "anthrax", "collapsed", "frothing heavily", "black quarter",
    // Hindi
    "अचानक मौत", "अचानक मर गई", "खून बह रहा", "नाक से खून", "पेशाब में खून",
    "पेट फूल गया", "अफारा", "सांस नहीं ले पा रही", "उठ नहीं पा रही", "गंभीर",
    // Marathi
    "अचानक मृत्यू", "रक्तस्त्राव", "नाकातून रक्त", "पोट फुगले", "आफरा",
    "श्वास घेता येत नाही", "उभी राहू शकत नाही", "खाली पडली"
  ];

  return emergencyPatterns.some((pattern) => q.includes(pattern));
}

// Platform knowledge articles used for accurate, grounded local responses
const PLATFORM_KNOWLEDGE = {
  registration: {
    en: "To register an animal in PASHU SHIELD:\n1. Open 'Animal Records' or click 'Link to Registered Animal Profile' in the Report form.\n2. Click 'Register New Animal'.\n3. Enter the 12-digit numeric Livestock ID (from the official Bharat Pashudhan Yellow Tag). The system validates for exactly 12 digits and prevents duplicates.\n4. Enter the animal name, species (Cattle, Buffalo, Goat, Sheep), breed, age, sex, and owner details.\n5. Click 'Save Profile' to generate an instant Digital Health Passport and QR verification tag.",
    hi: "पशु शील्ड में पशु पंजीकृत करने की प्रक्रिया:\n1. 'पशु रिकॉर्ड' पर जाएं या रिपोर्ट फॉर्म में 'पंजीकृत पशु प्रोफाइल से जोड़ें' चुनें।\n2. 'नया पशु पंजीकृत करें' पर क्लिक करें।\n3. 12-अंकीय पशुधन आईडी दर्ज करें (आधिकारिक पीले कान के टैग से)। प्रणाली 12 अंकों की पुष्टि करती है और डुप्लिकेट रोकती है।\n4. पशु का नाम, प्रजाति (गाय, भैंस, बकरी, भेड़), नस्ल, उम्र, लिंग और मालिक का विवरण भरें।\n5. 'प्रोफाइल सहेजें' पर क्लिक करें। इससे तुरंत डिजिटल स्वास्थ्य पासपोर्ट और क्यूआर सत्यापन कोड बन जाता है।",
    mr: "पशु शील्डमध्ये जनावराची नोंदणी कशी करावी:\n1. 'पशु नोंदी' उघडा किंवा रिपोर्ट फॉर्ममधील 'नोंदणीकृत जनावराशी जोडा' निवडा.\n2. 'नवीन जनावर नोंदवा' वर क्लिक करा.\n3. अधिकृत पिवळ्या कानाच्या टॅगवरील १२-अंकी पशुधन आयडी प्रविष्ट करा. प्रणाली १२ अंकांची अचूक पडताळणी करते.\n4. जनावराचे नाव, प्रजाती (गाय, म्हैस, शेळी, मेंढी), जात, वय आणि मालकाची माहिती भरा.\n5. 'नोंद जतन करा' वर क्लिक करा. यामुळे तात्काळ डिजिटल आरोग्य पासपोर्ट आणि क्यूआर कोड तयार होतो."
  },
  triage: {
    en: "PASHU SHIELD's Decision Support Engine uses an explainable, rule-based clinical scoring model (0 to 100%):\n• Fever: +20 points\n• Nasal discharge: +16 points\n• Coughing: +12 points\n• Reduced appetite: +10 points\n• Lethargy: +8 points\n• Morbidity cluster: +3 points per affected animal (up to 18 pts)\n• Mortality: +12 points per death (up to 24 pts)\n• Active village spatial signal: +10 bonus points.\nScores >= 61% are prioritized as High Risk for immediate veterinary intervention.",
    hi: "पशु शील्ड का निर्णय समर्थन इंजन पारदर्शी, नियम-आधारित क्लीनिकल स्कोरिंग (0 से 100%) का उपयोग करता है:\n• बुखार: +20 अंक\n• नाक से स्राव: +16 अंक\n• खांसी: +12 अंक\n• भूख में कमी: +10 अंक\n• सुस्ती: +8 अंक\n• समूह में फैलाव: +3 अंक प्रति प्रभावित पशु (अधिकतम 18)\n• मृत्यु दर: +12 अंक प्रति मृत्यु (अधिकतम 24)\n• सक्रिय ग्राम स्थानिक संकेत: +10 अंक।\n61% या अधिक स्कोर को तत्काल पशु चिकित्सा हस्तक्षेप के लिए 'उच्च जोखिम' माना जाता है।",
    mr: "पशु शील्डचे निर्णय समर्थन इंजिन पारदर्शक आणि नियम-आधारित क्लीनिकल स्कोअरिंग (० ते १००%) वापरते:\n• ताप: +२० गुण\n• नाकातून स्राव: +१६ गुण\n• खोकला: +१२ गुण\n• भूक मंदावणे: +१० गुण\n• सुस्ती: +८ गुण\n• बाधित जनावरांची संख्या: +३ गुण प्रति जनावर (कमाल १८)\n• मृत्यू: +१२ गुण प्रति मृत्यू (कमाल २४)\n• सक्रिय गाव सिग्नल: +१० गुण.\n६१% पेक्षा जास्त गुण आल्यास तात्काळ पशुवैद्यकीय तपासणीसाठी 'उच्च जोखीम' म्हणून वर्गीकृत केले जाते."
  },
  offlineSync: {
    en: "PASHU SHIELD is offline-first for remote rural belts:\n1. If internet connectivity drops, reports are automatically stored locally in browser IndexedDB with a unique 'syncClientId'.\n2. The offline badge turns red and indicates pending offline submissions.\n3. As soon as cellular network or Wi-Fi reconnects, the background synchronizer submits queued cases to the cloud database without duplicates.\n4. You can also test offline capabilities using the 'Simulate Offline' toggle in the topbar.",
    hi: "पशु शील्ड ग्रामीण क्षेत्रों के लिए ऑफ़लाइन-प्रथम प्रणाली है:\n1. इंटरनेट न होने पर, रिपोर्टें विशिष्ट 'syncClientId' के साथ स्थानीय IndexedDB में सुरक्षित हो जाती हैं।\n2. ऑफ़लाइन बैज लाल होकर लंबित रिपोर्टों की संख्या दर्शाता है।\n3. जैसे ही मोबाइल नेटवर्क या वाई-फाई वापस आता है, बैकग्राउंड ऑटो-सिंक बिना किसी डुप्लिकेट के डेटा को क्लाउड डेटाबेस पर भेज देता है।\n4. आप शीर्ष पट्टी में 'ऑफ़लाइन सिमुलेशन' टॉगल का उपयोग करके इसका परीक्षण भी कर सकते हैं।",
    mr: "पशु शील्ड ग्रामीण भागासाठी ऑफलाइन-सक्षम आहे:\n1. इंटरनेट नसल्यास, अहवाल स्थानिक IndexedDB मध्ये एका युनिक आयडीसह सुरक्षित राहतात.\n2. ऑफलाइन बॅज लाल होतो आणि प्रलंबित अहवाल दाखवतो.\n3. नेटवर्क परत येताच, पार्श्वभूमीतील ऑटो-सिंक सर्व नोंदी क्लाउड डेटाबेसवर पाठवते.\n4. तुम्ही वरच्या पट्टीतील 'सिम्युलेट ऑफलाइन' बटणाने याचे प्रात्यक्षिक तपासू शकता."
  },
  fmd: {
    en: "Foot & Mouth Disease (FMD / खुरपका-मुंहपका / लाळ्या खुरकूत) Advisory:\n• Common symptoms: High fever (104-106°F), excessive stringy salivation/drooling, painful vesicles/blisters on tongue, gums, dental pad, and interdigital cleft of hooves leading to lameness.\n• First Aid: Immediately isolate the affected animal. Wash mouth lesions with 1% potassium permanganate or mild alum solution. Apply boro-glycerine. Keep hooves clean and dry in fly-free shed.\n• Preventive Action: 6-monthly vaccination under National Animal Disease Control Programme (NADCP). Report immediately in PASHU SHIELD.",
    hi: "खुरपका-मुंहपका रोग (FMD) परामर्श:\n• मुख्य लक्षण: तेज बुखार (104-106°F), मुंह से लार टपकना, जीभ, मसूड़ों और खुरों के बीच छाले पड़ना जिससे पशु लंगड़ाकर चलता है।\n• प्राथमिक उपचार: बीमार पशु को तुरंत अलग करें। मुंह के छालों को 1% पोटाश (पोटैशियम परमैंगनेट) या फिटकरी के घोल से साफ करें। बोरो-ग्लिसरीन लगाएं। खुरों को साफ और सूखा रखें।\n• रोकथाम: राष्ट्रीय पशु रोग नियंत्रण कार्यक्रम (NADCP) के तहत हर 6 महीने में टीकाकरण अनिवार्य है।",
    mr: "लाळ्या खुरकूत (FMD) आजार सल्ला:\n• मुख्य लक्षणे: तीव्र ताप (१०४-१०६°F), तोंडावर आणि जिभेवर फोड येणे, तोंडातून लाळ गळणे, खुरांच्या बेचक्यात फोड आल्याने लंगडणे.\n• प्राथमिक काळजी: बाधित जनावराला तात्काळ वेगळे बांधा. तोंड १% पोटॅशियम परमँगनेट किंवा तुरटीच्या पाण्याने धुवा. बोरो-ग्लिसरीन लावा. गोठा कोरडा व स्वच्छ ठेवा.\n• प्रतिबंधक उपाय: वर्षातून दोनदा (दर ६ महिन्यांनी) लाळ्या खुरकूत प्रतिबंधक लस टोचून घ्या."
  },
  schemes: {
    en: "Key Government Livestock Schemes in India:\n1. National Animal Disease Control Programme (NADCP): 100% centrally funded free 12-digit ear-tagging and vaccination against FMD and Brucellosis.\n2. Pashu Kisan Credit Card (PKCC): Provides short-term credit up to ₹1.6 lakh without collateral (and up to ₹3 lakh with collateral) at subsidized 4% interest rate for feed, fodder, and veterinary care.\n3. Rashtriya Gokul Mission (RGM): Subsidies for indigenous breed development, sex-sorted semen, and setting up breed multiplication farms.\n4. Livestock Insurance Scheme: Subsidized insurance coverage against accidental death or disease.",
    hi: "भारत सरकार की प्रमुख पशुधन योजनाएं:\n1. राष्ट्रीय पशु रोग नियंत्रण कार्यक्रम (NADCP): 12-अंकीय टैग के साथ एफएमडी और ब्रुसेलोसिस का 100% निःशुल्क टीकाकरण।\n2. पशु किसान क्रेडिट कार्ड (PKCC): चारा और पशु देखभाल के लिए बिना गारंटी 1.6 लाख रुपये तक और गारंटी के साथ 3 लाख रुपये तक 4% ब्याज पर अल्पकालिक ऋण।\n3. राष्ट्रीय गोकुल मिशन: देसी नस्लों के संवर्धन, सेक्स-सॉर्टेड सीमन और ब्रीड फार्मों के लिए सरकारी सहायता।\n4. पशु बीमा योजना: बीमारी या दुर्घटना में पशु की मृत्यु पर बीमा कवरेज।",
    mr: "भारतातील प्रमुख शासकीय पशुधन योजना:\n1. राष्ट्रीय पशु रोग नियंत्रण कार्यक्रम (NADCP): १२-अंकी टॅगसह लाळ्या खुरकूत व ब्रुसेलोसिसचे मोफत लसीकरण.\n2. पशु किसान क्रेडिट कार्ड (PKCC): चारा आणि जनावरांच्या देखभालीसाठी १.६ लाखांपर्यंत विनातारण व ३ लाखांपर्यंत ४% सवलतीच्या व्याजदराने कर्ज.\n3. राष्ट्रीय गोकुळ मिशन: देशी गोवंशाचे संवर्धन आणि पैदास केंद्रांसाठी अनुदान.\n4. पशुधन विमा योजना: आकस्मिक मृत्यू किंवा रोगापासून जनावरांना विमा संरक्षण."
  }
};

// Fallback Verified Veterinary Reasoning Engine
export function generateLocalAiResponse(userMessage, currentLanguage = "en") {
  const q = (userMessage || "").toLowerCase();
  const lang = ["en", "hi", "mr"].includes(currentLanguage) ? currentLanguage : "en";

  // Check emergency triggers first
  if (detectEmergencySymptoms(userMessage)) {
    if (lang === "hi") {
      return `🚨 **आपातकालीन पशु चिकित्सा चेतावनी**:\nआपके द्वारा बताए गए लक्षण अत्यंत गंभीर हैं।\n\n1. **तत्काल कार्रवाई**: निकटतम राजकीय पशु चिकित्सालय या पंजीकृत पशु चिकित्सक से तुरंत संपर्क करें।\n2. **अलगाव**: प्रभावित पशु को तुरंत झुंड से अलग करें ताकि संक्रमण न फैले।\n3. **सावधानी**: बिना पशु चिकित्सक के परामर्श के कोई भी एंटीबायोटिक या इंजेक्शन न दें।\n4. **रिपोर्ट**: पशु शील्ड में 'समस्या रिपोर्ट करें' फॉर्म भरकर इसे उच्च प्राथमिकता के रूप में दर्ज करें।`;
    }
    if (lang === "mr") {
      return `🚨 **तातडीची पशुवैद्यकीय सूचना**:\nआपण नोंदवलेली लक्षणे गंभीर आहेत.\n\n1. **तातडीने संपर्क**: जवळच्या शासकीय पशुवैद्यकीय दवाखान्याशी किंवा डॉक्टरांशी त्वरित संपर्क साधा.\n2. **विलगीकरण**: आजारी जनावराला इतर जनावरांपासून ताबडतोब वेगळे करा.\n3. **काळजी**: डॉक्टरांच्या सल्ल्याशिवाय कोणतेही इंजेक्शन किंवा औषध देऊ नका.\n4. **नोंद**: पशु शील्डमध्ये 'तक्रार नोंदवा' वर जाऊन हे उच्च प्राधान्य म्हणून सबमिट करा.`;
    }
    return `🚨 **EMERGENCY VETERINARY ALERT**:\nThe symptoms you reported indicate an urgent clinical condition requiring immediate physical intervention.\n\n1. **Immediate Contact**: Contact your nearest Veterinary Dispensary or registered Veterinary Officer right away.\n2. **Isolation**: Immediately isolate the affected animal to prevent transmission.\n3. **Caution**: Do NOT administer unprescribed medications or antibiotics.\n4. **Escalation**: Submit a report through PASHU SHIELD to trigger immediate lab and triage referral.`;
  }

  // Check for platform-specific queries
  if (q.includes("register") || q.includes("tag") || q.includes("पंजीकरण") || q.includes("नोंदणी") || q.includes("yellow")) {
    return PLATFORM_KNOWLEDGE.registration[lang] || PLATFORM_KNOWLEDGE.registration.en;
  }

  if (q.includes("triage") || q.includes("score") || q.includes("risk") || q.includes("ट्राइएज") || q.includes("जोखीम") || q.includes("जोखिम")) {
    return PLATFORM_KNOWLEDGE.triage[lang] || PLATFORM_KNOWLEDGE.triage.en;
  }

  if (q.includes("offline") || q.includes("sync") || q.includes("ऑफ़लाइन") || q.includes("ऑफलाइन") || q.includes("इंटरनेट")) {
    return PLATFORM_KNOWLEDGE.offlineSync[lang] || PLATFORM_KNOWLEDGE.offlineSync.en;
  }

  if (q.includes("fmd") || q.includes("mouth") || q.includes("foot") || q.includes("खुरपका") || q.includes("मुंहपका") || q.includes("लाळ्या") || q.includes("खुरकूत")) {
    return PLATFORM_KNOWLEDGE.fmd[lang] || PLATFORM_KNOWLEDGE.fmd.en;
  }

  if (q.includes("scheme") || q.includes("kcc") || q.includes("yojana") || q.includes("योजना") || q.includes("कर्ज") || q.includes("credit")) {
    return PLATFORM_KNOWLEDGE.schemes[lang] || PLATFORM_KNOWLEDGE.schemes.en;
  }

  // General helpful clinical response
  if (lang === "hi") {
    return `पशु स्वास्थ्य परामर्श:\nआपके प्रश्न: "${userMessage}" के संदर्भ में:\n\n• **सामान्य देखभाल**: पशु को स्वच्छ एवं छायादार स्थान पर रखें, प्रचुर मात्रा में साफ पानी और सुपाच्य हरा चारा दें।\n• **दवाइयों की सावधानी**: बिना योग्य पशु चिकित्सक की सलाह के कोई भी दवा या रासायनिक खुराक न दें।\n• **पशु शील्ड में दर्ज करें**: यदि पशु में बुखार, सुस्ती या भूख की कमी दिख रही है, तो तुरंत 'समस्या रिपोर्ट करें' टैब में जाकर 12-अंकीय टैग के साथ रिपोर्ट दर्ज करें।\n• **नियमित टीकाकरण**: एफएमडी, एचएस और बीक्यू के निर्धारित टीकों का समय पर पालन करें।`;
  }
  if (lang === "mr") {
    return `पशु आरोग्य सल्ला:\nआपल्या विचारणेनुसार: "${userMessage}":\n\n• **सामान्य काळजी**: जनावराला हवेशीर व स्वच्छ गोठ्यात ठेवा, भरपूर पिण्याचे स्वच्छ पाणी व पौष्टिक चारा द्या.\n• **औषधोपचार दक्षता**: डॉक्टरांच्या सल्ल्याशिवाय स्वतःहून कोणतेही रासायनिक किंवा प्रतिजैविक (antibiotic) औषध देऊ नका.\n• **पशु शील्डवर नोंदवा**: जर जनावराला ताप, खोकला किंवा भूक मंदावल्याचे दिसत असेल, तर तात्काळ १२-अंकी टॅगसह 'तक्रार नोंदवा' मध्ये माहिती भरा.\n• **लसीकरण वेळापत्रक**: लाळ्या खुरकूत व घटसर्पाची प्रतिबंधक लस नियमित टोचून घ्या.`;
  }
  return `Livestock Health Guidance:\nRegarding your query: "${userMessage}":\n\n• **General Herd Care**: Ensure adequate clean drinking water, dry bedding, balanced green/dry fodder, and mineral mixture supplementation.\n• **Clinical Caution**: Never administer prescription antibiotics or antipyretics without verified veterinary diagnosis and dosage calculation.\n• **Platform Action**: If you observe signs of fever, loss of appetite, or nasal discharge, record a report using PASHU SHIELD's voice or form interface linked with the 12-digit Livestock ID.\n• **Preventive Immunization**: Verify your herd's FMD and HS/BQ vaccination records in the 'Care Tracker' tab.`;
}

// Client API caller with graceful offline fallback
export async function sendAiChatMessage({ message, history = [], language = "en" }) {
  // Check for external AI API endpoint (configured via Vite env VITE_AI_ENDPOINT or VITE_AI_API_KEY)
  const endpoint =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_AI_ENDPOINT) ||
    "/api/ai-chat";

  const apiKey =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_AI_API_KEY) ||
    "";

  // If online and an endpoint is available, try server call
  if (navigator.onLine && (apiKey || endpoint !== "/api/ai-chat")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
        },
        body: JSON.stringify({
          message,
          history: history.slice(-6), // last 6 turns for context
          language,
          systemPrompt: SYSTEM_VETERINARY_PROMPT
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          return {
            reply: data.reply,
            source: "cloud-ai",
            isEmergency: detectEmergencySymptoms(message)
          };
        }
      }
    } catch (e) {
      console.warn("Cloud AI endpoint unavailable or timed out, falling back to verified clinical knowledge base.", e);
    }
  }

  // Fallback to verified local veterinary reasoning engine
  // Simulate natural brief latency (400ms) for UI responsiveness
  await new Promise((res) => setTimeout(res, 400));
  const localReply = generateLocalAiResponse(message, language);

  return {
    reply: localReply,
    source: "verified-knowledge-base",
    isEmergency: detectEmergencySymptoms(message)
  };
}
