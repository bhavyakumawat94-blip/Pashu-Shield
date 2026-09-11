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
  };
}

export async function loadCases(fallback) {
  if (!supabase) {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : fallback;
  }

  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(toAppCase);
}

export async function saveCase(c) {
  if (!supabase) {
    const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    localStorage.setItem(LOCAL_KEY, JSON.stringify([c, ...existing.filter(x => x.id !== c.id)]));
    return c;
  }

  // Write the case first. We intentionally do not request the inserted row
  // back here; this keeps the write path reliable with browser RLS policies.
  const { error } = await supabase
    .from("cases")
    .upsert(toDbCase(c), { onConflict: "case_id" });

  if (error) throw error;
  return c;
}

export function saveCasesLocal(cases) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(cases));
}
