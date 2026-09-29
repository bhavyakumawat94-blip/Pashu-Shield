// Explainable Clinical Triage Risk Engine (USP 3)
// Rule-based decision support logic and factor breakdown

export const SYMPTOM_WEIGHTS = {
  fever: { points: 20, name: "High Body Temperature / Fever", category: "symptom", desc: "Pyrexia indicates acute host inflammatory response or systemic infection." },
  nasal: { points: 16, name: "Nasal Discharge & Catarrh", category: "symptom", desc: "Mucopurulent or serous discharge indicating upper respiratory involvement." },
  cough: { points: 12, name: "Persistent Cough / Dyspnea", category: "symptom", desc: "Lower respiratory tract / bronchial irritation requiring auscultation." },
  appetite: { points: 10, name: "Reduced Feed Intake / Anorexia", category: "symptom", desc: "Metabolic distress and cessation of active rumination." },
  lethargy: { points: 8, name: "Lethargy & Recumbency Signs", category: "symptom", desc: "Generalized depression and decreased physical activity." }
};

export function scoreCase({ fever, nasal, cough, appetite, lethargy, affected, mortality }) {
  let score = 0;
  if (fever) score += 20;
  if (nasal) score += 16;
  if (cough) score += 12;
  if (appetite) score += 10;
  if (lethargy) score += 8;
  score += Math.min(Number(affected || 0) * 3, 18);
  score += Math.min(Number(mortality || 0) * 12, 24);
  return Math.min(score, 100);
}

export function computeTriageBreakdown({ form, cases = [], animal = null }) {
  const factors = [];
  let score = 0;

  if (form.fever) {
    score += 20;
    factors.push(SYMPTOM_WEIGHTS.fever);
  }

  if (form.nasal) {
    score += 16;
    factors.push(SYMPTOM_WEIGHTS.nasal);
  }

  if (form.cough) {
    score += 12;
    factors.push(SYMPTOM_WEIGHTS.cough);
  }

  if (form.appetite) {
    score += 10;
    factors.push(SYMPTOM_WEIGHTS.appetite);
  }

  if (form.lethargy) {
    score += 8;
    factors.push(SYMPTOM_WEIGHTS.lethargy);
  }

  const affectedCount = Number(form.affected || 0);
  if (affectedCount > 0) {
    const affPts = Math.min(affectedCount * 3, 18);
    score += affPts;
    factors.push({
      name: `Morbidity Cluster (${affectedCount} animals affected)`,
      points: affPts,
      category: "cluster",
      desc: `High transmission risk: multiple animals displaying symptoms in ${form.village || 'the village'}.`
    });
  }

  const mortCount = Number(form.mortality || 0);
  if (mortCount > 0) {
    const mortPts = Math.min(mortCount * 12, 24);
    score += mortPts;
    factors.push({
      name: `Reported Mortality (${mortCount} dead)`,
      points: mortPts,
      category: "severity",
      desc: "Emergency triage escalation: mortality signals acute pathogen virulence."
    });
  }

  const finalScore = Math.min(score, 100);
  const status = finalScore >= 61 ? "High" : finalScore >= 31 ? "Medium" : "Low";

  // Check existing disease reports in same village and species
  const villageSignals = (cases || []).filter(
    c => c.village?.toLowerCase() === (form.village || "").toLowerCase() &&
         c.species?.toLowerCase() === (form.species || "").toLowerCase()
  );

  return {
    score: finalScore,
    status,
    factors,
    villageSignals,
    animalContext: animal ? `${animal.nameTag} (${animal.species}${animal.breed ? ` • ${animal.breed}` : ""})` : null
  };
}
