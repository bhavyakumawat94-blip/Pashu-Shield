import { validateLivestockId, initialAnimals, initialHealthRecords } from "./src/lib/animalsDb.js";
import { computeTriageBreakdown } from "./src/lib/triageEngine.js";
import { extractSymptomKeywords } from "./src/lib/voiceKeywords.js";
import { generateQrSvg } from "./src/lib/qrCode.js";

console.log("=== RUNNING PASHU SHIELD SIH ROUND 3 UPGRADE TESTS ===");
let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
  }
}

// ----------------------------------------------------
// USP 2: 12-Digit Unique Livestock Identification Tests
// ----------------------------------------------------
console.log("\n--- Testing USP 2: Unique Livestock Identification ---");
// Valid 12-digit
const validRes = validateLivestockId("100234567899", initialAnimals);
assert(validRes.valid === true, "Valid 12-digit numeric Livestock ID passes validation");

// Invalid: 5 digits
const shortRes = validateLivestockId("12345", initialAnimals);
assert(shortRes.valid === false && shortRes.error.includes("exactly 12 numeric digits"), "Short ID (5 digits) is rejected with clear error");

// Invalid: Contains characters
const charRes = validateLivestockId("10023456789A", initialAnimals);
assert(charRes.valid === false, "Alphanumeric ID is rejected");

// Prevent duplicates
const dupRes = validateLivestockId("100234567891", initialAnimals); // Gauri's ID
assert(dupRes.valid === false && dupRes.error.includes("already registered"), "Duplicate Livestock ID is detected and rejected");

// QR code generation
const qrOutput = generateQrSvg("PASHU-SHIELD:ANM-1001:100234567891", 160);
assert(qrOutput.includes("<svg") && qrOutput.includes("<rect"), "Embedded SVG QR Code generates valid SVG markup");

// ----------------------------------------------------
// USP 3: Explainable Rule-Based Decision Support Tests
// ----------------------------------------------------
console.log("\n--- Testing USP 3: Explainable Decision Support Engine ---");
const testForm = {
  fever: true,
  nasal: true,
  cough: false,
  appetite: true,
  lethargy: false,
  affected: 5,
  mortality: 1,
  village: "Village A",
  species: "Cattle"
};

const dummyCases = [
  { id: "PS-1024", village: "Village A", species: "Cattle", score: 82, status: "High" },
  { id: "PS-1019", village: "Village B", species: "Buffalo", score: 54, status: "Medium" }
];

const triageRes = computeTriageBreakdown({
  form: testForm,
  cases: dummyCases,
  animal: initialAnimals[0]
});

// Score calculation: fever(20) + nasal(16) + appetite(10) + affected(5*3=15) + mortality(1*12=12) = 73
assert(triageRes.score === 73, `Score calculated correctly as 73% (got ${triageRes.score})`);
assert(triageRes.status === "High", `Status classified as High (score >= 61)`);
assert(triageRes.factors.length === 5, `5 contributing factors identified in breakdown`);
assert(triageRes.factors.some(f => f.name.includes("Fever") && f.points === 20), "Fever contributes +20 pts");
assert(triageRes.factors.some(f => f.name.includes("Nasal") && f.points === 16), "Nasal discharge contributes +16 pts");
assert(triageRes.factors.some(f => f.name.includes("Morbidity Cluster") && f.points === 15), "5 affected animals contributes +15 pts cluster factor");
assert(triageRes.factors.some(f => f.name.includes("Mortality") && f.points === 12), "1 mortality contributes +12 pts severity factor");
assert(triageRes.villageSignals.length === 1, "Detects active disease signal in Village A for Cattle");

// ----------------------------------------------------
// USP 5: Multilingual Voice Intake NLP Keyword Extraction Tests
// ----------------------------------------------------
console.log("\n--- Testing USP 5: Multilingual Voice Symptom Extraction ---");

// English speech text
const enKeywords = extractSymptomKeywords("The cow has high fever, coughing and is not eating any feed");
assert(enKeywords.fever === true, "English: 'fever' extracted");
assert(enKeywords.cough === true, "English: 'coughing' extracted");
assert(enKeywords.appetite === true, "English: 'not eating' extracted");
assert(enKeywords.nasal === false, "English: nasal not falsely matched");

// Hindi speech text (हिन्दी)
const hiKeywords = extractSymptomKeywords("गाय को तीन दिन से तेज बुखार है, नाक बह रही है और बहुत सुस्त है");
assert(hiKeywords.fever === true, "Hindi: 'बुखार' (bukhar) correctly matched to fever");
assert(hiKeywords.nasal === true, "Hindi: 'नाक बह रही है' correctly matched to nasal discharge");
assert(hiKeywords.lethargy === true, "Hindi: 'सुस्त' (sust) correctly matched to lethargy");

// Marathi speech text (मराठी)
const mrKeywords = extractSymptomKeywords("म्हशीला तीव्र ताप आला आहे, खोकला आहे आणि चारा खात नाही");
assert(mrKeywords.fever === true, "Marathi: 'ताप' (taap) correctly matched to fever");
assert(mrKeywords.cough === true, "Marathi: 'खोकला' (khokla) correctly matched to cough");
assert(mrKeywords.appetite === true, "Marathi: 'चारा खात नाही' correctly matched to reduced appetite");

// ----------------------------------------------------
// USP 1: Digital Animal Profiles & Health History
// ----------------------------------------------------
console.log("\n--- Testing USP 1: Individual Animal Health Records ---");
assert(initialAnimals.length >= 4, `Initial digital animal registry has ${initialAnimals.length} seeded profiles`);
assert(initialAnimals.every(a => a.id && a.nameTag && a.species && a.village), "All animals possess unique internal ID, name/tag, species, village");
assert(initialHealthRecords.some(r => r.recordType === "vaccination" && r.title.includes("FMD")), "Vaccination history includes FMD records");
assert(initialHealthRecords.some(r => r.animalId === "ANM-1001"), "Health records linked to animal ANM-1001 (Gauri)");

// ----------------------------------------------------
// FEATURE 1: Complete Multilingual Application Engine
// ----------------------------------------------------
console.log("\n--- Testing Feature 1: Multilingual Internationalization Engine ---");
const { ALL_INDIAN_LANGUAGES, t, setLanguage, getLanguage, formatNumber, formatDate } = await import("./src/lib/i18n.js");

assert(ALL_INDIAN_LANGUAGES.length >= 23, `Registered ${ALL_INDIAN_LANGUAGES.length} Indian languages (22 Scheduled + English)`);
assert(ALL_INDIAN_LANGUAGES.some(l => l.code === "hi" && l.native === "हिन्दी"), "Hindi registered with native script");
assert(ALL_INDIAN_LANGUAGES.some(l => l.code === "mr" && l.native === "मराठी"), "Marathi registered with native script");
assert(ALL_INDIAN_LANGUAGES.some(l => l.code === "bn" && l.native === "বাংলা"), "Bengali registered with native script");
assert(ALL_INDIAN_LANGUAGES.some(l => l.code === "te" && l.native === "తెలుగు"), "Telugu registered with native script");
assert(ALL_INDIAN_LANGUAGES.some(l => l.code === "ta" && l.native === "தமிழ்"), "Tamil registered with native script");
assert(ALL_INDIAN_LANGUAGES.some(l => l.code === "gu" && l.native === "ગુજરાતી"), "Gujarati registered with native script");

// Test English
setLanguage("en");
assert(t("appTitle") === "PASHU SHIELD", "English: 'PASHU SHIELD' title retrieved");
assert(t("navDashboard") === "Dashboard", "English: 'Dashboard' nav label retrieved");

// Test Hindi
setLanguage("hi");
assert(t("appTitle") === "पशु शील्ड", "Hindi: 'पशु शील्ड' title retrieved");
assert(t("activeCases") === "सक्रिय मामले", "Hindi: 'सक्रिय मामले' active cases label retrieved");

// Test Marathi
setLanguage("mr");
assert(t("appTitle") === "पशु शील्ड", "Marathi: 'पशु शील्ड' title retrieved");
assert(t("navCases") === "प्राधान्य प्रकरणे", "Marathi: 'प्राधान्य प्रकरणे' cases label retrieved");

// Reset to English
setLanguage("en");

// Test formatters
assert(formatNumber(150000).includes("1,50,000") || formatNumber(150000).includes("150,000"), "Number formatted with locale separators");

// ----------------------------------------------------
// FEATURE 2: PASHU AI Assistant & Veterinary Safety
// ----------------------------------------------------
console.log("\n--- Testing Feature 2: PASHU AI Assistant & Safety Guardrails ---");
const { detectEmergencySymptoms, generateLocalAiResponse } = await import("./src/lib/aiAssistant.js");

// Emergency symptom detection
assert(detectEmergencySymptoms("The cow is having sudden death and bleeding from mouth") === true, "English emergency: Detected sudden death / bleeding");
assert(detectEmergencySymptoms("गाय के मुंह और नाक से खून बह रहा है और वह उठ नहीं पा रही") === true, "Hindi emergency: Detected acute hemorrhage & recumbency");
assert(detectEmergencySymptoms("जनावराचे पोट खूप फुगले आहे आणि अचानक मृत्यू झाला") === true, "Marathi emergency: Detected severe bloat & sudden death");
assert(detectEmergencySymptoms("Normal checkup routine inquiry") === false, "Routine query: Not falsely flagged as emergency");

// Verified knowledge generation
const tagHelp = generateLocalAiResponse("How do I register a cow with 12 digit yellow tag?", "en");
assert(tagHelp.includes("12-digit") && tagHelp.includes("Animal Records"), "Grounded guidance: 12-digit tag registration steps explained");

const fmdHelpHi = generateLocalAiResponse("खुरपका मुंहपका बीमारी के लक्षण", "hi");
assert(fmdHelpHi.includes("खुरपका") || fmdHelpHi.includes("लार") || fmdHelpHi.includes("छाले") || fmdHelpHi.includes("परामर्श"), "Hindi clinical advisory: FMD symptoms accurately explained");

const emergencyAlert = generateLocalAiResponse("Cow died suddenly with bleeding from nose", "en");
assert(emergencyAlert.includes("EMERGENCY VETERINARY ALERT") && emergencyAlert.includes("Immediate Contact"), "Safety guardrail: Direct emergency vet escalation triggered");

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log(`========================================\n`);

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}

