import { supabase } from "./supabaseClient";

const LOCAL_KEY = "pashu_cases";

function toAppCase(row) {
  return {
    id: row.case_id,
    village: row.village,
    species: row.species,
    affected: row.affected,
    mortality: row.mortality,
    score: row.score,
    status: row.status,
    symptoms: row.symptoms || [],
    date: row.reported_date,
    voiceUrl: row.voice_url || null,
    animalId: row.animal_id || null,
    livestockId: row.livestock_id || null,
    voiceLang: row.voice_lang || "en-IN",
    transcription: row.transcription || null,
    riskBreakdown: Array.isArray(row.risk_breakdown) ? row.risk_breakdown : [],
    syncClientId: row.sync_client_id || null,
    syncStatus: "synced"
  };
}

function toDbCase(c) {
  return {
    case_id: c.id,
    village: c.village,
    species: c.species,
    affected: Number(c.affected),
    mortality: Number(c.mortality),
    score: Number(c.score),
    status: c.status,
    symptoms: c.symptoms || [],
    reported_date: c.date || new Date().toISOString().slice(0, 10),
    voice_url: c.voiceUrl || null,
    animal_id: c.animalId || null,
    livestock_id: c.livestockId || null,
    voice_lang: c.voiceLang || "en-IN",
    transcription: c.transcription || null,
    risk_breakdown: Array.isArray(c.riskBreakdown) ? c.riskBreakdown : [],
    sync_client_id: c.syncClientId || null,
  };
}

export async function loadCases(fallback) {
  if (!supabase) {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : fallback;
  }

  try {
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return fallback;
    return data.map(toAppCase);
  } catch (err) {
    console.warn("Supabase loadCases fallback to local:", err);
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : fallback;
  }
}

export async function saveCase(c) {
  const caseToSave = {
    ...c,
    syncStatus: "synced"
  };

  // Always update local storage first so offline & immediate views work
  const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  localStorage.setItem(LOCAL_KEY, JSON.stringify([caseToSave, ...existing.filter(x => x.id !== caseToSave.id)]));

  if (!supabase) {
    return caseToSave;
  }

  try {
    const { error } = await supabase
      .from("cases")
      .upsert(toDbCase(caseToSave), { onConflict: "case_id" });

    if (error) {
      console.warn("Supabase saveCase notice:", error.message);
    }
  } catch (err) {
    console.warn("Supabase saveCase network issue, saved locally:", err);
  }

  return caseToSave;
}

export function saveCasesLocal(cases) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(cases));
}
