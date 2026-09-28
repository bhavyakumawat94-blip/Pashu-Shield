// Multilingual Symptom Extraction for English, Hindi, and Marathi (USP 5)

export const SUPPORTED_LANGUAGES = [
  { code: "en-IN", label: "English", native: "English (India)" },
  { code: "hi-IN", label: "Hindi", native: "हिन्दी" },
  { code: "mr-IN", label: "Marathi", native: "मराठी" }
];

export function extractSymptomKeywords(text) {
  if (!text) return {};
  const lower = text.toLowerCase();
  return {
    fever:
      lower.includes("fever") ||
      lower.includes("temperature") ||
      lower.includes("बुखार") ||
      lower.includes("ताप") ||
      lower.includes("bukhar") ||
      lower.includes("taap"),
    nasal:
      lower.includes("nasal") ||
      lower.includes("discharge") ||
      lower.includes("runny") ||
      lower.includes("नाक") ||
      lower.includes("sardi") ||
      lower.includes("सर्दी") ||
      lower.includes("शिंक"),
    cough:
      lower.includes("cough") ||
      lower.includes("khansi") ||
      lower.includes("खांसी") ||
      lower.includes("खोकला") ||
      lower.includes("khokla"),
    appetite:
      lower.includes("appetite") ||
      lower.includes("eating") ||
      lower.includes("feed") ||
      lower.includes("भूख") ||
      lower.includes("चारा") ||
      lower.includes("भूक") ||
      lower.includes("गवत") ||
      lower.includes("bhukh"),
    lethargy:
      lower.includes("lethargy") ||
      lower.includes("weak") ||
      lower.includes("tired") ||
      lower.includes("सुस्त") ||
      lower.includes("कमजोर") ||
      lower.includes("थकवा") ||
      lower.includes("sust") ||
      lower.includes("thakva")
  };
}
