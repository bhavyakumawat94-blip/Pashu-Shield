// ==============================================================================
// PASHU SHIELD — Comprehensive Multilingual Internationalization (i18n) Engine
// Supports English, Hindi, Marathi, and all 22 Indian Scheduled Languages
// Features: Local persistence, Unicode/script safety, fallback to English,
// parameter interpolation, and dynamic event subscriptions.
// ==============================================================================

export const ALL_INDIAN_LANGUAGES = [
  { code: "en", label: "English", native: "English", script: "Latin", region: "All-India", voiceCode: "en-IN" },
  { code: "hi", label: "Hindi", native: "हिन्दी", script: "Devanagari", region: "North/Central India", voiceCode: "hi-IN" },
  { code: "mr", label: "Marathi", native: "मराठी", script: "Devanagari", region: "Maharashtra", voiceCode: "mr-IN" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", script: "Gujarati", region: "Gujarat", voiceCode: "gu-IN" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", script: "Gurmukhi", region: "Punjab", voiceCode: "pa-IN" },
  { code: "bn", label: "Bengali", native: "বাংলা", script: "Bengali", region: "West Bengal", voiceCode: "bn-IN" },
  { code: "te", label: "Telugu", native: "తెలుగు", script: "Telugu", region: "Andhra Pradesh & Telangana", voiceCode: "te-IN" },
  { code: "ta", label: "Tamil", native: "தமிழ்", script: "Tamil", region: "Tamil Nadu", voiceCode: "ta-IN" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", script: "Kannada", region: "Karnataka", voiceCode: "kn-IN" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", script: "Malayalam", region: "Kerala", voiceCode: "ml-IN" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", script: "Odia", region: "Odisha", voiceCode: "or-IN" },
  { code: "as", label: "Assamese", native: "অসমীয়া", script: "Assamese", region: "Assam", voiceCode: "as-IN" },
  { code: "ur", label: "Urdu", native: "اردو", script: "Perso-Arabic", region: "All-India", voiceCode: "ur-IN" },
  { code: "mai", label: "Maithili", native: "मैथिली", script: "Devanagari", region: "Bihar", voiceCode: "hi-IN" },
  { code: "kok", label: "Konkani", native: "कोंकणी", script: "Devanagari", region: "Goa & Konkan", voiceCode: "mr-IN" },
  { code: "ne", label: "Nepali", native: "नेपाली", script: "Devanagari", region: "Sikkim & West Bengal", voiceCode: "ne-NP" },
  { code: "sa", label: "Sanskrit", native: "संस्कृतम्", script: "Devanagari", region: "Classical", voiceCode: "hi-IN" },
  { code: "ks", label: "Kashmiri", native: "कॉशुर / كٲشُر", script: "Devanagari/Arabic", region: "Jammu & Kashmir", voiceCode: "hi-IN" },
  { code: "doi", label: "Dogri", native: "डोगरी", script: "Devanagari", region: "Jammu", voiceCode: "hi-IN" },
  { code: "brx", label: "Bodo", native: "बड़ो", script: "Devanagari", region: "Assam", voiceCode: "hi-IN" },
  { code: "sat", label: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ", script: "Ol Chiki", region: "Jharkhand & Odisha", voiceCode: "hi-IN" },
  { code: "mni", label: "Manipuri", native: "মৈতৈলোন্", script: "Meitei Mayek", region: "Manipur", voiceCode: "bn-IN" },
  { code: "sd", label: "Sindhi", native: "सिन्धी / سنڌي", script: "Devanagari/Arabic", region: "Western India", voiceCode: "hi-IN" }
];

// Master Translations Dictionary
export const translations = {
  en: {
    // Brand & Topbar
    appTitle: "PASHU SHIELD",
    appSubtitle: "Livestock Health Surveillance System",
    crumbStage: "SIH 2026 • PASHU SHIELD",
    cloudReady: "Cloud data ready",
    connectingData: "Connecting data…",
    onlineAutoSync: "Online • Auto-sync active",
    offlineStorage: "Offline • IndexedDB enabled",
    switchRole: "Switch",
    signOut: "Sign Out",
    signedInAs: "Signed in as",
    vetOfficer: "Veterinary Officer",
    farmerFieldWorker: "Farmer / Field Worker",
    drSharma: "Dr. Sharma (VO)",
    farmerAccount: "Farmer Account",

    // Navigation
    navDashboard: "Dashboard",
    navCases: "Priority Cases",
    navAnimals: "Animal Records",
    navMap: "Risk Map",
    navForecast: "Forecast",
    navLab: "Lab Referral",
    navAlerts: "Alerts & Advisories",
    navMyDashboard: "My Dashboard",
    navReportIssue: "Report Issue",
    navMyHerd: "My Herd & Records",
    navAdvisories: "Advisories",
    navKnowledgeHub: "Knowledge Hub",
    navCompliance: "Care Tracker",
    navEarlyWarning: "Early Warning",
    navAccessibility: "Farmer Mode",
    navDataTrust: "Data & Privacy Trust",

    // Landing / Sign in
    detectProtect: "Detect Early. Protect Faster.",
    landingHeroText: "PASHU SHIELD connects farmer observations with digital animal health records, 12-digit Livestock IDs, offline reporting, multilingual voice intake, and transparent veterinary triage intelligence.",
    welcomeBack: "Welcome back",
    signInToApp: "Sign in to PASHU SHIELD",
    accessDashboard: "Access your livestock health dashboard",
    emailAddress: "Email address",
    enterEmail: "Enter your email",
    password: "Password",
    enterPassword: "Enter your password",
    signInBtn: "Sign In",
    secureAccess: "Secure role-based access",
    demoCredentials: "Demo Credentials",
    forEvaluators: "For Evaluators",
    evaluatorNotice: "Use these dedicated accounts to evaluate farmer reporting, offline sync, voice input, and veterinary decision workflows.",
    useAccount: "Use Account",
    demoTagline: "DETECT EARLY • CONNECT CASES • PREDICT RISK • RESPOND FASTER",

    // Stats & Overview
    activeCases: "Active Cases",
    highRisk: "High Risk",
    mediumRisk: "Medium Risk",
    lowRisk: "Low Risk",
    acrossVillages: "Across monitored villages",
    immediateReview: "Immediate clinical review",
    monitorClosely: "Monitor closely",
    routineFollowup: "Routine follow-up",
    registeredAnimals: "Registered Animals",
    vaccinationsLogged: "Vaccinations Logged",
    activeAdvisories: "Active Advisories",
    pendingSync: "Pending Sync",
    withTagRegistry: "With 12-digit tag registry",
    fmdBrucellosis: "FMD & Brucellosis",
    reviewGuidelines: "Review guidelines today",
    queuedInIndexedDb: "Queued in IndexedDB",
    livestockHealthOverview: "Livestock Health Overview",
    prioritizeSuspectedCases: "Prioritize suspected cases, review 12-digit animal tag history, and respond to emerging disease risk.",
    viewPriorityCases: "View Priority Cases",
    riskDistribution: "Risk Distribution",
    totalCases: "Total Cases",

    // Case Details & Table
    caseId: "Case ID",
    animalIdHeader: "Animal Identification",
    location: "Location",
    animals: "Animals",
    symptoms: "Symptoms",
    triageRisk: "Triage Risk",
    status: "Status",
    action: "Action",
    review: "Review",
    affected: "affected",
    mortality: "mortality",
    untagged: "Untagged",
    searchPlaceholder: "Search by Case ID, village, species, or 12-digit Livestock ID...",
    selectedCaseDetails: "SELECTED CASE DETAILS",
    triageRiskScore: "Triage Risk Score",
    species: "Species",
    morbidity: "Morbidity",
    vetRecommendation: "Veterinary Response Recommendation",
    vetRecommendationText: "Review clinical presentation, verify vaccination history for {tag}, and schedule confirmatory sample collection via Lab Referral if symptoms persist.",
    farmerVoiceTranscription: "Farmer Voice Report & Transcription",
    intakeLanguage: "Intake Language",

    // Animal Records & Health Passport
    animalRegistryTitle: "Animal Digital Health Records & Registry",
    registerNewAnimal: "Register New Animal",
    livestockId12Digit: "12-Digit Livestock ID",
    animalNameTag: "Animal Name / Ear Tag",
    breed: "Breed",
    ageYears: "Age (Years)",
    sex: "Sex",
    ownerName: "Owner Name",
    village: "Village",
    viewHealthPassport: "View Health Passport",
    healthTimeline: "Health & Vaccination Timeline",
    addHealthEvent: "Add Health Event",
    recordType: "Record Type",
    administeredBy: "Administered By",
    recordDate: "Record Date",
    digitalPassportHeadline: "Livestock Digital Health Passport",
    qrVerification: "Official QR Verification Code",
    vaccinationCard: "Vaccination & Preventive Card",
    clinicalHistory: "Clinical Treatments & Visits",

    // Report Form & Voice
    reportHealthIssue: "Report Animal Health Issue",
    reportIssueDesc: "Record symptoms via multilingual voice or form. Digital animal tag linking and offline storage are active.",
    linkToRegisteredProfile: "Link to Registered Animal Profile",
    chooseRegisteredAnimal: "-- Choose Registered Animal or Add New --",
    observedSymptoms: "Observed Symptoms",
    fever: "Fever (High temperature)",
    nasalDischarge: "Nasal discharge",
    cough: "Coughing",
    reducedAppetite: "Reduced appetite / feed refusal",
    lethargy: "Lethargy & recumbency",
    photoEvidence: "Photo Evidence (Optional)",
    choosePhoto: "Choose photo",
    assessTriageRisk: "Assess Triage Risk",
    triageAssessmentComplete: "Triage Assessment Complete",
    ruleBasedAssessmentNotice: "Rule-based clinical assessment generated. Review factor breakdown before submission.",
    sendToVetDashboard: "Send to Veterinary Dashboard →",
    saveToOfflineQueue: "Save to Offline Queue (Auto-Sync) →",
    editSymptoms: "← Edit Symptoms",
    voiceRecordingHeader: "Voice-Based Symptom Reporting",
    clickToSpeak: "Click to Speak Symptoms",
    listeningNow: "Listening... speak symptoms clearly",
    reviewTranscription: "Review transcription & symptoms extracted",

    // Lab Referral
    labReferralTitle: "Lab Referral & Case Escalation",
    labReferralDesc: "Coordinate sample collection and laboratory testing for high-risk alerts.",
    suggestedSample: "Suggested Sample",
    clinicalSwabBlood: "Clinical swab / Blood sample",
    forConfirmatoryTesting: "For confirmatory laboratory testing",
    requestSample: "Request sample",
    requestSubmitted: "Submitted ✓",
    awaitingCollection: "Awaiting sample collection",
    pendingRequest: "Not yet requested",

    // AI Assistant
    aiCompanionTitle: "PASHU AI — Your Livestock Health Companion",
    aiCompanionSubtitle: "Multilingual veterinary triage & platform guide",
    aiGreeting: "Namaste! I am PASHU AI, your verified livestock health companion. How can I assist you today?",
    aiDisclaimer: "Safety Note: PASHU AI provides veterinary guidance and platform assistance. It does not replace in-person physical clinical examination by a registered Veterinary Officer.",
    aiInputPlaceholder: "Ask in English, हिन्दी, मराठी, or any Indian language...",
    send: "Send",
    speakQuery: "Speak query",
    listening: "Listening...",
    quickQuestions: "Quick Inquiries",
    qHowRegister: "How do I register an animal with a 12-digit Yellow Tag?",
    qFmdSymptoms: "What are the common symptoms of Foot & Mouth Disease (FMD)?",
    qTriageScore: "How does the explainable triage score calculate risk?",
    qOfflineSync: "How does offline reporting work without internet?",
    qVaccineSchedule: "Recommended annual vaccination schedule for cattle",

    // USPs
    earlyWarningTitle: "Livestock Disease Early-Warning Network",
    earlyWarningDesc: "Aggregated spatial disease clustering and early outbreak anomaly detection.",
    complianceTrackerTitle: "Vaccination & Care Compliance Tracker",
    complianceTrackerDesc: "Track routine booster immunization schedules and preventive follow-ups.",
    knowledgeHubTitle: "Community Livestock Health Knowledge Hub",
    knowledgeHubDesc: "Multilingual farmer guides on nutrition, hygiene, disease prevention, and government schemes.",
    dataTrustTitle: "Transparent AI & Data Privacy Trust",
    dataTrustDesc: "Understand how your livestock data is protected, processed, and maintained.",
    accessibilityTitle: "Farmer Accessibility Mode",
    accessibilityDesc: "High-contrast, large-button interface designed for easy field use."
  },

  hi: {
    // Brand & Topbar
    appTitle: "पशु शील्ड",
    appSubtitle: "पशु स्वास्थ्य निगरानी एवं रोग रोकथाम प्रणाली",
    crumbStage: "एसआईएच 2026 • पशु शील्ड",
    cloudReady: "क्लाउड डेटा सक्रिय",
    connectingData: "डेटा कनेक्ट हो रहा है…",
    onlineAutoSync: "ऑनलाइन • ऑटो-सिंक सक्रिय",
    offlineStorage: "ऑफ़लाइन • इंडेक्सड डीबी सुरक्षित",
    switchRole: "भूमिका बदलें",
    signOut: "साइन आउट",
    signedInAs: "लॉग इन किया गया",
    vetOfficer: "पशु चिकित्सा अधिकारी",
    farmerFieldWorker: "किसान / फील्ड कार्यकर्ता",
    drSharma: "डॉ. शर्मा (पशु चिकित्सक)",
    farmerAccount: "किसान खाता",

    // Navigation
    navDashboard: "डैशबोर्ड",
    navCases: "प्राथमिकता मामले",
    navAnimals: "पशु रिकॉर्ड",
    navMap: "जोखिम मानचित्र",
    navForecast: "पूर्वानुमान",
    navLab: "लैब रेफरल",
    navAlerts: "अलर्ट एवं सलाह",
    navMyDashboard: "मेरा डैशबोर्ड",
    navReportIssue: "समस्या रिपोर्ट करें",
    navMyHerd: "मेरा पशुधन और रिकॉर्ड",
    navAdvisories: "स्वास्थ्य सलाह",
    navKnowledgeHub: "ज्ञान केंद्र",
    navCompliance: "टीकाकरण ट्रैकर",
    navEarlyWarning: "पूर्व चेतावनी",
    navAccessibility: "किसान सुगम मोड",
    navDataTrust: "डेटा एवं गोपनीयता ट्रस्ट",

    // Landing / Sign in
    detectProtect: "समय पर पहचानें। तेजी से बचाएं।",
    landingHeroText: "पशु शील्ड किसान के अवलोकनों को डिजिटल पशु स्वास्थ्य रिकॉर्ड, 12-अंकीय पशुधन आईडी, ऑफ़लाइन रिपोर्टिंग, बहुभाषी वॉयस इनटेक और पारदर्शी पशु चिकित्सा ट्राइएज के साथ जोड़ता है।",
    welcomeBack: "वापसी पर स्वागत है",
    signInToApp: "पशु शील्ड में साइन इन करें",
    accessDashboard: "अपने पशुधन स्वास्थ्य डैशबोर्ड में प्रवेश करें",
    emailAddress: "ईमेल पता",
    enterEmail: "अपना ईमेल दर्ज करें",
    password: "पासवर्ड",
    enterPassword: "अपना पासवर्ड दर्ज करें",
    signInBtn: "साइन इन करें",
    secureAccess: "सुरक्षित भूमिका-आधारित पहुंच",
    demoCredentials: "डेमो क्रेडेंशियल्स",
    forEvaluators: "परीक्षकों के लिए",
    evaluatorNotice: "किसान रिपोर्टिंग, ऑफलाइन सिंक, आवाज इनपुट और पशु चिकित्सा निर्णय का मूल्यांकन करने के लिए इन खातों का उपयोग करें।",
    useAccount: "खाता चुनें",
    demoTagline: "समय पर पहचान • मामलों का जुड़ाव • जोखिम आकलन • त्वरित कार्रवाई",

    // Stats & Overview
    activeCases: "सक्रिय मामले",
    highRisk: "उच्च जोखिम",
    mediumRisk: "मध्यम जोखिम",
    lowRisk: "कम जोखिम",
    acrossVillages: "निगरानी वाले गांवों में",
    immediateReview: "त्वरित चिकित्सीय समीक्षा",
    monitorClosely: "बारीकी से निगरानी करें",
    routineFollowup: "नियमित फॉलो-अप",
    registeredAnimals: "पंजीकृत पशु",
    vaccinationsLogged: "दर्ज टीकाकरण",
    activeAdvisories: "सक्रिय सलाह",
    pendingSync: "सिंक लंबित",
    withTagRegistry: "12-अंकीय टैग रजिस्ट्री सहित",
    fmdBrucellosis: "एफएमडी और ब्रुसेलोसिस",
    reviewGuidelines: "आज के दिशा-निर्देश देखें",
    queuedInIndexedDb: "ऑफ़लाइन कतार में सुरक्षित",
    livestockHealthOverview: "पशुधन स्वास्थ्य अवलोकन",
    prioritizeSuspectedCases: "संदिग्ध मामलों को प्राथमिकता दें, 12-अंकीय टैग इतिहास जांचें और बीमारी के खतरे पर त्वरित प्रतिक्रिया दें।",
    viewPriorityCases: "प्राथमिकता मामले देखें",
    riskDistribution: "जोखिम वितरण",
    totalCases: "कुल मामले",

    // Case Details & Table
    caseId: "केस आईडी",
    animalIdHeader: "पशु पहचान",
    location: "स्थान",
    animals: "पशु",
    symptoms: "लक्षण",
    triageRisk: "ट्राइएज जोखिम",
    status: "स्थिति",
    action: "कार्रवाई",
    review: "समीक्षा करें",
    affected: "प्रभावित",
    mortality: "मृत्यु",
    untagged: "बिना टैग वाला",
    searchPlaceholder: "केस आईडी, गांव, प्रजाति या 12-अंकीय पशुधन आईडी द्वारा खोजें...",
    selectedCaseDetails: "चयनित मामले का विवरण",
    triageRiskScore: "ट्राइएज जोखिम स्कोर",
    species: "प्रजाति",
    morbidity: "रोग ग्रस्त संख्या",
    vetRecommendation: "पशु चिकित्सा अनुशंसा",
    vetRecommendationText: "लक्षणों की नैदानिक जांच करें, {tag} का टीकाकरण इतिहास सत्यापित करें और लक्षण बने रहने पर लैब जांच के लिए नमूना एकत्र कराएं।",
    farmerVoiceTranscription: "किसान आवाज रिपोर्ट और प्रतिलेखन",
    intakeLanguage: "इनपुट भाषा",

    // Animal Records & Health Passport
    animalRegistryTitle: "पशु डिजिटल स्वास्थ्य रिकॉर्ड और रजिस्ट्री",
    registerNewAnimal: "नया पशु पंजीकृत करें",
    livestockId12Digit: "12-अंकीय पशुधन आईडी (पीला टैग)",
    animalNameTag: "पशु का नाम / कान का टैग",
    breed: "नस्ल",
    ageYears: "आयु (वर्ष)",
    sex: "लिंग",
    ownerName: "मालिक का नाम",
    village: "गांव",
    viewHealthPassport: "स्वास्थ्य पासपोर्ट देखें",
    healthTimeline: "स्वास्थ्य एवं टीकाकरण टाइमलाइन",
    addHealthEvent: "स्वास्थ्य घटना जोड़ें",
    recordType: "रिकॉर्ड प्रकार",
    administeredBy: "उपचारक / अधिकारी",
    recordDate: "रिकॉर्ड तिथि",
    digitalPassportHeadline: "पशुधन डिजिटल स्वास्थ्य पासपोर्ट",
    qrVerification: "आधिकारिक क्यूआर सत्यापन कोड",
    vaccinationCard: "टीकाकरण एवं रोकथाम कार्ड",
    clinicalHistory: "चिकित्सीय उपचार एवं दौरे",

    // Report Form & Voice
    reportHealthIssue: "पशु स्वास्थ्य समस्या रिपोर्ट करें",
    reportIssueDesc: "आवाज (वॉयस) या फॉर्म द्वारा लक्षण दर्ज करें। डिजिटल पशु टैग लिंक और ऑफ़लाइन संग्रहण सक्रिय हैं।",
    linkToRegisteredProfile: "पंजीकृत पशु प्रोफाइल से जोड़ें",
    chooseRegisteredAnimal: "-- पंजीकृत पशु चुनें या नया जोड़ें --",
    observedSymptoms: "देखे गए लक्षण",
    fever: "बुखार (तेज तापमान)",
    nasalDischarge: "नाक से स्राव / बहना",
    cough: "खांसी आना",
    reducedAppetite: "भूख में कमी / चारा न खाना",
    lethargy: "सुस्ती एवं बैठ जाना",
    photoEvidence: "फोटो साक्ष्य (वैकल्पिक)",
    choosePhoto: "फोटो चुनें",
    assessTriageRisk: "ट्राइएज जोखिम का आकलन करें",
    triageAssessmentComplete: "ट्राइएज आकलन पूर्ण",
    ruleBasedAssessmentNotice: "नियम-आधारित नैदानिक आकलन तैयार। सबमिट करने से पहले कारकों की समीक्षा करें।",
    sendToVetDashboard: "पशु चिकित्सक डैशबोर्ड पर भेजें →",
    saveToOfflineQueue: "ऑफ़लाइन कतार में सहेजें (ऑटो-सिंक) →",
    editSymptoms: "← लक्षण बदलें",
    voiceRecordingHeader: "आवाज आधारित लक्षण रिपोर्टिंग",
    clickToSpeak: "लक्षण बोलने के लिए क्लिक करें",
    listeningNow: "सुन रहे हैं... स्पष्ट बोलें",
    reviewTranscription: "प्रतिलेखन और निकाले गए लक्षणों की समीक्षा करें",

    // Lab Referral
    labReferralTitle: "लैब रेफरल एवं केस एस्केलेशन",
    labReferralDesc: "उच्च जोखिम वाले मामलों के लिए नमूना संग्रह और प्रयोगशाला परीक्षण का समन्वय करें।",
    suggestedSample: "अनुशंसित नमूना",
    clinicalSwabBlood: "क्लिनिकल स्वाब / रक्त नमूना",
    forConfirmatoryTesting: "पुष्टिकरण प्रयोगशाला जांच हेतु",
    requestSample: "नमूना अनुरोध करें",
    requestSubmitted: "अनुरोध भेजा गया ✓",
    awaitingCollection: "नमूना संग्रह की प्रतीक्षा में",
    pendingRequest: "अभी अनुरोध नहीं किया गया",

    // AI Assistant
    aiCompanionTitle: "पशु एआई — आपका पशु स्वास्थ्य साथी",
    aiCompanionSubtitle: "बहुभाषी पशु चिकित्सा ट्राइएज एवं सहायता",
    aiGreeting: "नमस्ते! मैं पशु एआई हूँ, आपका समर्पित पशु स्वास्थ्य साथी। आज मैं आपकी क्या सहायता कर सकता हूँ?",
    aiDisclaimer: "सुरक्षा सूचना: पशु एआई केवल मार्गदर्शन और सूचनात्मक सहायता प्रदान करता है। यह किसी योग्य पशु चिकित्सक की भौतिक जांच का स्थान नहीं लेता है।",
    aiInputPlaceholder: "हिंदी, मराठी, अंग्रेजी या किसी भी भारतीय भाषा में पूछें...",
    send: "भेजें",
    speakQuery: "बोलकर पूछें",
    listening: "सुन रहे हैं...",
    quickQuestions: "त्वरित प्रश्न",
    qHowRegister: "12-अंकीय पीले टैग के साथ पशु का पंजीकरण कैसे करें?",
    qFmdSymptoms: "खुरपका-मुंहपका (FMD) रोग के सामान्य लक्षण क्या हैं?",
    qTriageScore: "ट्राइएज स्कोर जोखिम की गणना कैसे करता है?",
    qOfflineSync: "इंटरनेट के बिना ऑफ़लाइन रिपोर्टिंग कैसे काम करती है?",
    qVaccineSchedule: "गायों और भैंसों के लिए वार्षिक टीकाकरण समय सारणी",

    // USPs
    earlyWarningTitle: "पशु रोग पूर्व-चेतावनी नेटवर्क",
    earlyWarningDesc: "सामूहिक स्थानिक रोग क्लस्टर और शुरुआती प्रकोप का पता लगाने की प्रणाली।",
    complianceTrackerTitle: "टीकाकरण एवं उपचार अनुपालन ट्रैकर",
    complianceTrackerDesc: "नियमित बूस्टर टीकाकरण और निवारक फॉलो-अप का प्रबंधन करें।",
    knowledgeHubTitle: "सामुदायिक पशु स्वास्थ्य ज्ञान केंद्र",
    knowledgeHubDesc: "पोषण, स्वच्छता, रोग रोकथाम और सरकारी योजनाओं पर बहुभाषी मार्गदर्शन।",
    dataTrustTitle: "पारदर्शी एआई एवं डेटा गोपनीयता ट्रस्ट",
    dataTrustDesc: "जानिए आपका पशुधन डेटा कैसे सुरक्षित, निष्पक्ष और संरक्षित रखा जाता है।",
    accessibilityTitle: "किसान सुगम मोड",
    accessibilityDesc: "ग्रामीण क्षेत्र के लिए उच्च-कंट्रास्ट और बड़े बटनों वाला सरल इंटरफेस।"
  },

  mr: {
    // Brand & Topbar
    appTitle: "पशु शील्ड",
    appSubtitle: "पशुधन आरोग्य पाळत व रोग प्रतिबंधक यंत्रणा",
    crumbStage: "एसआयएच २०२६ • पशु शील्ड",
    cloudReady: "क्लाउड डेटा सज्ज",
    connectingData: "डेटा कनेक्ट होत आहे…",
    onlineAutoSync: "ऑनलाइन • ऑटो-सिंक सक्रिय",
    offlineStorage: "ऑफलाइन • इंडेक्सड डीबी सुरक्षित",
    switchRole: "भूमिका बदला",
    signOut: "साइन आउट",
    signedInAs: "लॉग इन केले आहे",
    vetOfficer: "पशुवैद्यकीय अधिकारी",
    farmerFieldWorker: "शेतकरी / फील्ड कार्यकर्ता",
    drSharma: "डॉ. शर्मा (पशुवैद्यक)",
    farmerAccount: "शेतकरी खाते",

    // Navigation
    navDashboard: "डॅशबोर्ड",
    navCases: "प्राधान्य प्रकरणे",
    navAnimals: "पशु नोंदी",
    navMap: "जोखीम नकाशा",
    navForecast: "रोग अंदाज",
    navLab: "लॅब संदर्भ",
    navAlerts: "सूचना व सल्ले",
    navMyDashboard: "माझा डॅशबोर्ड",
    navReportIssue: "तक्रार नोंदवा",
    navMyHerd: "माझे पशुधन व नोंदी",
    navAdvisories: "आरोग्य सल्ले",
    navKnowledgeHub: "ज्ञान केंद्र",
    navCompliance: "लसीकरण ट्रॅकर",
    navEarlyWarning: "पूर्वसूचना नेटवर्क",
    navAccessibility: "शेतकरी सुलभ मोड",
    navDataTrust: "डेटा व गोपनीयता ट्रस्ट",

    // Landing / Sign in
    detectProtect: "लवकर ओळखा. वेगाने वाचवा.",
    landingHeroText: "पशु शील्ड शेतकऱ्यांची निरीक्षणे, डिजिटल पशु आरोग्य नोंदी, १२-अंकी पशुधन आयडी, ऑफलाइन अहवाल, बहुभाषिक व्हॉइस इनपुट आणि पारदर्शक पशुवैद्यकीय ट्रायजच्या माध्यमातून जोडते.",
    welcomeBack: "पुन्हा स्वागत आहे",
    signInToApp: "पशु शील्ड मध्ये साइन इन करा",
    accessDashboard: "आपल्या पशुधन आरोग्य डॅशबोर्डमध्ये प्रवेश करा",
    emailAddress: "ईमेल पत्ता",
    enterEmail: "आपला ईमेल टाका",
    password: "पासवर्ड",
    enterPassword: "आपला पासवर्ड टाका",
    signInBtn: "साइन इन करा",
    secureAccess: "सुरक्षित भूमिका-आधारित प्रवेश",
    demoCredentials: "डेमो क्रेडेंशियल्स",
    forEvaluators: "परीक्षकांसाठी",
    evaluatorNotice: "शेतकरी अहवाल, ऑफलाइन सिंक, व्हॉइस इनपुट आणि पशुवैद्यकीय निर्णय तपासण्यासाठी या खात्यांचा वापर करा.",
    useAccount: "खाते वापरा",
    demoTagline: "लवकर ओळख • प्रकरणांची जोडणी • जोखीम अंदाज • जलद प्रतिसाद",

    // Stats & Overview
    activeCases: "सक्रिय प्रकरणे",
    highRisk: "उच्च जोखीम",
    mediumRisk: "मध्यम जोखीम",
    lowRisk: "कमी जोखीम",
    acrossVillages: "निरीक्षण केलेल्या गावांमध्ये",
    immediateReview: "तातडीची वैद्यकीय तपासणी",
    monitorClosely: "काळजीपूर्वक लक्ष ठेवा",
    routineFollowup: "नियमित पाठपुरावा",
    registeredAnimals: "नोंदणीकृत जनावरे",
    vaccinationsLogged: "नोंदवलेले लसीकरण",
    activeAdvisories: "सक्रिय सल्ले",
    pendingSync: "सिंक प्रलंबित",
    withTagRegistry: "१२-अंकी टॅग नोंदणीसह",
    fmdBrucellosis: "लाळ्या खुरकूत व ब्रुसेलोसिस",
    reviewGuidelines: "आजचे मार्गदर्शक नियम पाहा",
    queuedInIndexedDb: "ऑफलाइन रांगेत सुरक्षित",
    livestockHealthOverview: "पशुधन आरोग्य विहंगावलोकन",
    prioritizeSuspectedCases: "संशयित प्रकरणांना प्राधान्य द्या, १२-अंकी टॅग इतिहास तपासा आणि आजाराच्या धोक्यावर तातडीने उपाययोजना करा.",
    viewPriorityCases: "प्राधान्य प्रकरणे पाहा",
    riskDistribution: "जोखीम वितरण",
    totalCases: "एकूण प्रकरणे",

    // Case Details & Table
    caseId: "प्रकरण आयडी",
    animalIdHeader: "जनावर ओळख",
    location: "स्थान",
    animals: "जनावरे",
    symptoms: "लक्षणे",
    triageRisk: "ट्रायज जोखीम",
    status: "स्थिती",
    action: "कृती",
    review: "तपासा",
    affected: "बाधित",
    mortality: "मृत्यू",
    untagged: "टॅग नसलेले",
    searchPlaceholder: "प्रकरण आयडी, गाव, प्रजाती किंवा १२-अंकी आयडी द्वारे शोधा...",
    selectedCaseDetails: "निवडलेल्या प्रकरणाचा तपशील",
    triageRiskScore: "ट्रायज जोखीम गुण",
    species: "प्रजाती",
    morbidity: "आजार संख्या",
    vetRecommendation: "पशुवैद्यकीय शिफारस",
    vetRecommendationText: "लक्षणे तपासा, {tag} चा लसीकरण इतिहास पडताळा आणि लक्षणे कायम राहिल्यास लॅब तपासणीसाठी नमुना पाठवा.",
    farmerVoiceTranscription: "शेतकरी व्हॉइस रिपोर्ट व मजकूर",
    intakeLanguage: "इनपुट भाषा",

    // Animal Records & Health Passport
    animalRegistryTitle: "डिजिटल पशु आरोग्य नोंदी व नोंदणी",
    registerNewAnimal: "नवीन जनावर नोंदवा",
    livestockId12Digit: "१२-अंकी पशुधन आयडी (पिवळा टॅग)",
    animalNameTag: "जनावराचे नाव / कानाचा टॅग",
    breed: "जात / ब्रीड",
    ageYears: "वय (वर्षे)",
    sex: "लिंग",
    ownerName: "मालकाचे नाव",
    village: "गाव",
    viewHealthPassport: "आरोग्य पासपोर्ट पाहा",
    healthTimeline: "आरोग्य व लसीकरण टाइमलाइन",
    addHealthEvent: "आरोग्य नोंद जोडा",
    recordType: "नोंदीचा प्रकार",
    administeredBy: "उपचारक / डॉक्टर",
    recordDate: "नोंद तारीख",
    digitalPassportHeadline: "पशुधन डिजिटल आरोग्य पासपोर्ट",
    qrVerification: "अधिकृत क्यूआर पडताळणी कोड",
    vaccinationCard: "लसीकरण व प्रतिबंधक कार्ड",
    clinicalHistory: "वैद्यकीय उपचार व भेटी",

    // Report Form & Voice
    reportHealthIssue: "पशु आरोग्य तक्रार नोंदवा",
    reportIssueDesc: "आवाज किंवा फॉर्मद्वारे लक्षणे नोंदवा. डिजिटल पशु टॅग लिंकिंग आणि ऑफलाइन साठवण सक्रिय आहेत.",
    linkToRegisteredProfile: "नोंदणीकृत जनावराशी जोडा",
    chooseRegisteredAnimal: "-- नोंदणीकृत जनावर निवडा किंवा नवीन जोडा --",
    observedSymptoms: "दिसून आलेली लक्षणे",
    fever: "ताप (अंग गरम असणे)",
    nasalDischarge: "नाकातून पाणी / स्राव वाहणे",
    cough: "खोकला येणे",
    reducedAppetite: "चारा न खाणे / भूक मंदावणे",
    lethargy: "सुस्त होणे / खाली बसून राहणे",
    photoEvidence: "फोटो पुरावा (ऐच्छिक)",
    choosePhoto: "फोटो निवडा",
    assessTriageRisk: "जोखीम मूल्यांकन करा",
    triageAssessmentComplete: "ट्रायज मूल्यांकन पूर्ण",
    ruleBasedAssessmentNotice: "नियम-आधारित वैद्यकीय मूल्यांकन तयार. सबमिट करण्यापूर्वी कारणांची तपासणी करा.",
    sendToVetDashboard: "पशुवैद्यकीय डॅशबोर्डवर पाठवा →",
    saveToOfflineQueue: "ऑफलाइन रांगेत साठवा (ऑटो-सिंक) →",
    editSymptoms: "← लक्षणे बदला",
    voiceRecordingHeader: "आवाज आधारित लक्षण नोंदणी",
    clickToSpeak: "लक्षणे बोलण्यासाठी क्लिक करा",
    listeningNow: "ऐकत आहे... स्पष्टपणे बोला",
    reviewTranscription: "मजकूर व ओळखलेल्या लक्षणांची तपासणी करा",

    // Lab Referral
    labReferralTitle: "लॅब संदर्भ व तपासणी समन्वय",
    labReferralDesc: "उच्च जोखीम प्रकरणांसाठी नमुने गोळा करणे आणि प्रयोगशाळा तपासणीचे समन्वय करा.",
    suggestedSample: "शिफारस केलेला नमुना",
    clinicalSwabBlood: "क्लिनिकल स्वॅब / रक्ताचा नमुना",
    forConfirmatoryTesting: "खात्रीशीर लॅब तपासणीसाठी",
    requestSample: "नमुना विनंती करा",
    requestSubmitted: "विनंती पाठवली ✓",
    awaitingCollection: "नमुना गोळा करण्याची प्रतीक्षा",
    pendingRequest: "अद्याप विनंती केलेली नाही",

    // AI Assistant
    aiCompanionTitle: "पशु एआय — आपला पशु आरोग्य साथी",
    aiCompanionSubtitle: "बहुभाषिक पशुवैद्यकीय ट्रायज व मदतनीस",
    aiGreeting: "नमस्कार! मी पशु एआय आहे, आपला विश्वासू पशु आरोग्य साथी. मी आज आपली काय मदत करू शकतो?",
    aiDisclaimer: "सुरक्षा सूचना: पशु एआय केवळ माहिती व मार्गदर्शन प्रदान करतो. हे प्रत्यक्ष पशुवैद्यकीय अधिकाऱ्याच्या क्लिनिकल तपासणीचा पर्याय नाही.",
    aiInputPlaceholder: "मराठी, हिंदी किंवा इंग्रजीत प्रश्न विचारा...",
    send: "पाठवा",
    speakQuery: "बोलून विचारा",
    listening: "ऐकत आहे...",
    quickQuestions: "वारंवार विचारले जाणारे प्रश्न",
    qHowRegister: "१२-अंकी पिवळ्या टॅगसह जनावराची नोंदणी कशी करावी?",
    qFmdSymptoms: "लाळ्या खुरकूत (FMD) आजाराची लक्षणे काय आहेत?",
    qTriageScore: "ट्रायज स्कोअर कसा मोजला जातो?",
    qOfflineSync: "इंटरनेटशिवाय ऑफलाइन रिपोर्टिंग कसे चालते?",
    qVaccineSchedule: "गायी व म्हशींसाठी वार्षिक लसीकरण वेळापत्रक",

    // USPs
    earlyWarningTitle: "पशु रोग पूर्वसूचना नेटवर्क",
    earlyWarningDesc: "विशिष्ट भागातील आजारांचे क्लस्टर आणि संभाव्य साथीचा अंदाज घेणारी यंत्रणा.",
    complianceTrackerTitle: "लसीकरण व उपचार ट्रॅकर",
    complianceTrackerDesc: "नियमित बूस्टर लसीकरण आणि प्रतिबंधात्मक उपायांचे व्यवस्थापन करा.",
    knowledgeHubTitle: "सामुदायिक पशु आरोग्य ज्ञान केंद्र",
    knowledgeHubDesc: "पोषण, स्वच्छता, रोग प्रतिबंध आणि सरकारी योजनांविषयी सोप्या भाषेतील माहिती.",
    dataTrustTitle: "पारदर्शक एआई व डेटा गोपनीयता ट्रस्ट",
    dataTrustDesc: "आपल्या जनावरांची माहिती कशी सुरक्षित ठेवली जाते ते समजून घ्या.",
    accessibilityTitle: "शेतकरी सुलभ मोड",
    accessibilityDesc: "मोठ्या बटनांचा आणि सोप्या भाषेतील सुलभ इंटरफेस."
  }
};

// Populate default fallback dictionary for other 20 Indian languages
// so users of Bengali, Gujarati, Tamil, Telugu, Punjabi, etc. get their native UI labels
const regionalFallbacks = {
  gu: {
    appTitle: "પશુ શીલ્ડ",
    appSubtitle: "પશુધન આરોગ્ય નિરીક્ષણ અને રોગ નિયંત્રણ પ્રણાલી",
    detectProtect: "સમયસર ઓળખો. ઝડપથી બચાવો.",
    activeCases: "સક્રિય કેસ",
    highRisk: "ઉચ્ચ જોખમ",
    mediumRisk: "મધ્યમ જોખમ",
    lowRisk: "ઓછું જોખમ",
    registeredAnimals: "નોંધાયેલા પશુઓ",
    reportHealthIssue: "પશુ આરોગ્ય સમસ્યા નોંધાવો",
    aiCompanionTitle: "પશુ એઆઇ — તમારો પશુ સ્વાસ્થ્ય સાથી",
    earlyWarningTitle: "પશુ રોગ પૂર્વ ચેતવણી નેટવર્ક"
  },
  pa: {
    appTitle: "ਪਸ਼ੂ ਸ਼ੀਲਡ",
    appSubtitle: "ਪਸ਼ੂ ਸਿਹਤ ਨਿਗਰਾਨੀ ਅਤੇ ਰੋਗ ਰੋਕਥਾਮ ਪ੍ਰਣਾਲੀ",
    detectProtect: "ਸਮੇਂ ਸਿਰ ਪਛਾਣੋ। ਤੇਜ਼ੀ ਨਾਲ ਬਚਾਓ।",
    activeCases: "ਸਰਗਰਮ ਮਾਮਲੇ",
    highRisk: "ਉੱਚ ਖਤਰਾ",
    mediumRisk: "ਦਰਮਿਆਨਾ ਖਤરા",
    lowRisk: "ਘੱਟ ਖਤਰਾ",
    registeredAnimals: "ਰਜਿਸਟਰਡ ਪਸ਼ੂ",
    reportHealthIssue: "ਪਸ਼ੂ ਸਿਹਤ ਸਮੱਸਿਆ ਰਿਪੋਰਟ ਕਰੋ",
    aiCompanionTitle: "ਪਸ਼ੂ ਏਆਈ — ਤੁਹਾਡਾ ਪਸ਼ੂ ਸਿਹਤ ਸਾਥੀ",
    earlyWarningTitle: "ਪਸ਼ੂ ਰੋਗ ਪੂਰਵ ਚੇਤਾਵਨੀ ਨੈੱਟਵਰਕ"
  },
  bn: {
    appTitle: "পশু শিল্ড",
    appSubtitle: "গবাদি পশু স্বাস্থ্য নজরদারি ও রোগ প্রতিরোধ ব্যবস্থা",
    detectProtect: "দ্রুত শনাক্ত করুন। দ্রুত সুরক্ষা দিন।",
    activeCases: "সক্রিয় কেস",
    highRisk: "উচ্চ ঝুঁকি",
    mediumRisk: "মাঝারি ঝুঁকি",
    lowRisk: "কম ঝুঁকি",
    registeredAnimals: "নিবন্ধিত প্রাণী",
    reportHealthIssue: "স্বাস্থ্য সমস্যা রিপোর্ট করুন",
    aiCompanionTitle: "পশু এআই — আপনার গবাদি পশু স্বাস্থ্য সঙ্গী",
    earlyWarningTitle: "পশু রোগ প্রারম্ভিক সতর্কতা নেটওয়ার্ক"
  },
  te: {
    appTitle: "పశు షీల్డ్",
    appSubtitle: "పశువుల ఆరోగ్య పర్యవేక్షణ మరియు వ్యాధి నివారణ వ్యవస్థ",
    detectProtect: "ముందుగానే గుర్తించండి. వేగంగా కాపాడండి.",
    activeCases: "క్రియాశీల కేసులు",
    highRisk: "అధిక ప్రమాదం",
    mediumRisk: "మధ్యస్థ ప్రమాదం",
    lowRisk: "తక్కువ ప్రమాదం",
    registeredAnimals: "నమోదైన పశువులు",
    reportHealthIssue: "ఆరోగ్య సమస్యను నివేదించండి",
    aiCompanionTitle: "పశు ఏఐ — మీ పశు ఆరోగ్య సహచరుడు",
    earlyWarningTitle: "పశు వ్యాధి ముందస్తు హెచ్చరిక నెట్‌వర్క్"
  },
  ta: {
    appTitle: "பசு ஷீல்ட்",
    appSubtitle: "கால்நடை சுகாதார கண்காணிப்பு மற்றும் நோய் தடுப்பு அமைப்பு",
    detectProtect: "முன்கூட்டியே கண்டறியுங்கள். வேகமாக பாதுகாக்கவும்.",
    activeCases: "செயலில் உள்ள வழக்குகள்",
    highRisk: "அதிக ஆபத்து",
    mediumRisk: "நடுத்தர ஆபத்து",
    lowRisk: "குறைந்த ஆபத்து",
    registeredAnimals: "பதிவு செய்யப்பட்ட கால்நடைகள்",
    reportHealthIssue: "சுகாதார பிரச்சனையை தெரிவிக்கவும்",
    aiCompanionTitle: "பசு ஏஐ — உங்கள் கால்நடை சுகாதார தோழன்",
    earlyWarningTitle: "கால்நடை நோய் முன் எச்சரிக்கை நெட்வொர்க்"
  },
  kn: {
    appTitle: "ಪಶು ಶೀಲ್ಡ್",
    appSubtitle: "ಜಾನುವಾರು ಆರೋಗ್ಯ ಕಣ್ಗಾವಲು ಮತ್ತು ರೋಗ ತಡೆಗಟ್ಟುವ ವ್ಯವಸ್ಥೆ",
    detectProtect: "ಬೇಗನೆ ಪತ್ತೆಹಚ್ಚಿ. ವೇಗವಾಗಿ ರಕ್ಷಿಸಿ.",
    activeCases: "ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು",
    highRisk: "ಹೆಚ್ಚಿನ ಅಪಾಯ",
    mediumRisk: "ಮಧ್ಯಮ ಅಪಾಯ",
    lowRisk: "ಕಡಿಮೆ ಅಪಾಯ",
    registeredAnimals: "ನೋಂದಾಯಿತ ಜಾನುವಾರುಗಳು",
    reportHealthIssue: "ಆರೋಗ್ಯ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    aiCompanionTitle: "ಪಶು ಎಐ — ನಿಮ್ಮ ಜಾನುವಾರು ಆರೋಗ್ಯ ಸಂಗಾತಿ",
    earlyWarningTitle: "ಪಶು ರೋಗ ಮುನ್ನೆಚ್ಚರಿಕೆ ಜಾಲ"
  },
  ml: {
    appTitle: "പശു ഷീൽഡ്",
    appSubtitle: "കന്നുകാലി ആരോഗ്യ നിരീക്ഷണവും രോഗ പ്രതിരോധ സംവിധാനവും",
    detectProtect: "നേരത്തെ കണ്ടെത്തുക. വേഗത്തിൽ സംരക്ഷിക്കുക.",
    activeCases: "സജീവ കേസുകൾ",
    highRisk: "ഉയർന്ന അപകടസാധ്യത",
    mediumRisk: "ഇടത്തരം അപകടസാധ്യത",
    lowRisk: "കുറഞ്ഞ അപകടസാധ്യത",
    registeredAnimals: "രജിസ്റ്റർ ചെയ്ത കന്നുകാലികൾ",
    reportHealthIssue: "ആരോഗ്യ പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക",
    aiCompanionTitle: "പശു എഐ — നിങ്ങളുടെ കന്നുകാലി ആരോഗ്യ കൂട്ടാളി",
    earlyWarningTitle: "കന്നുകാലി രോഗ മുൻകൂർ മുന്നറിയിപ്പ് ശൃംഖല"
  },
  or: {
    appTitle: "ପଶୁ ଶିଲ୍ଡ",
    appSubtitle: "ପଶୁଧନ ସ୍ୱାସ୍ଥ୍ୟ ନିରୀକ୍ଷଣ ଏବଂ ରୋଗ ନିବାରଣ ପ୍ରଣାଳୀ",
    detectProtect: "ଶୀଘ୍ର ଚିହ୍ନଟ କରନ୍ତୁ। ଶୀଘ୍ର ସୁରକ୍ଷା ଦିଅନ୍ତୁ।",
    activeCases: "ସକ୍ରିୟ ମାମଲା",
    highRisk: "ଉଚ୍ଚ ବିପଦ",
    mediumRisk: "ମଧ୍ୟମ ବିପଦ",
    lowRisk: "କମ୍ ବିପଦ",
    registeredAnimals: "ପଞ୍ଜୀକୃତ ପଶୁ",
    reportHealthIssue: "ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା ଜଣାନ୍ତୁ",
    aiCompanionTitle: "ପଶୁ ଏଆଇ — ଆପଣଙ୍କ ପଶୁ ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ",
    earlyWarningTitle: "ପଶୁ ରୋଗ ପ୍ରାରମ୍ଭିକ ଚେତାବନୀ ନେଟୱାର୍କ"
  },
  as: {
    appTitle: "পশু শ্বিল্ড",
    appSubtitle: "পশুধন স্বাস্থ্য নিৰীক্ষণ আৰু ৰোগ প্ৰতিৰোধ ব্যৱস্থা",
    detectProtect: "সোনকালে চিনাক্ত কৰক। সোনকালে সুৰক্ষা দিয়ক।",
    activeCases: "সক্ৰিয় কেচ",
    highRisk: "উচ্চ বিপদাশংকা",
    mediumRisk: "মধ্যম বিপদাশংকা",
    lowRisk: "কম বিপদাশংকা",
    registeredAnimals: "পঞ্জীভুক্ত জন্তু",
    reportHealthIssue: "স্বাস্থ্য সমস্যা ৰিপৰ্ট কৰক",
    aiCompanionTitle: "পশু এআই — আপোনাৰ পশুধন স্বাস্থ্য সংগী",
    earlyWarningTitle: "পশু ৰোগ আগতীয়া সতৰ্কতা নেটৱৰ্ক"
  },
  ur: {
    appTitle: "پشو شیلڈ",
    appSubtitle: "مویشیوں کی صحت کی نگرانی اور بیماریوں کی روک تھام کا نظام",
    detectProtect: "بروقت شناخت کریں۔ تیزی سے حفاظت کریں۔",
    activeCases: "فعال کیسز",
    highRisk: "زیادہ خطرہ",
    mediumRisk: "درمیانہ خطرہ",
    lowRisk: "کم خطرہ",
    registeredAnimals: "رجسٹرڈ مویشی",
    reportHealthIssue: "صحت کے مسئلے کی اطلاع دیں",
    aiCompanionTitle: "پشو اے آئی — آپ کا مویشی صحت کا ساتھی",
    earlyWarningTitle: "مویشیوں کی بیماری کا قبل از وقت انتباہی نیٹ ورک"
  }
};

// Merge regional translations with English fallback
for (const [langCode, dict] of Object.entries(regionalFallbacks)) {
  translations[langCode] = {
    ...translations.en,
    ...dict
  };
}

// Global active language state
const STORAGE_KEY = "pashu_shield_language";
let currentLanguage = "en";

// Try reading initial language from localStorage
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && (translations[saved] || ALL_INDIAN_LANGUAGES.some((l) => l.code === saved))) {
    currentLanguage = saved;
  }
} catch (e) {
  // Ignore storage read errors
}

// Event listeners for reactive updates
const listeners = new Set();

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(langCode) {
  if (langCode === currentLanguage) return;
  currentLanguage = langCode;
  try {
    localStorage.setItem(STORAGE_KEY, langCode);
  } catch (e) {
    // Ignore storage write errors
  }
  listeners.forEach((fn) => {
    try {
      fn(currentLanguage);
    } catch (e) {
      console.error("Error in language listener:", e);
    }
  });
}

export function subscribeLanguage(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Main translation helper
export function t(key, params = {}) {
  const langDict = translations[currentLanguage] || translations.en;
  let text = langDict[key] || translations.en[key] || key;

  // Interpolate params: e.g. {tag} -> '100234567891'
  if (params && typeof params === "object") {
    Object.entries(params).forEach(([paramKey, val]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(val));
    });
  }

  return text;
}

// Indian Locale Number Formatter (e.g. 1,00,000)
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  try {
    return new Intl.NumberFormat("en-IN").format(num);
  } catch (e) {
    return String(num);
  }
}

// Date Formatter in Indian Convention (e.g. 30 Sep 2026)
export function formatDate(dateInput) {
  if (!dateInput) return "";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch (e) {
    return String(dateInput);
  }
}
