import { supabase } from "./supabaseClient.js";

const LOCAL_KEY_ANIMALS = "pashu_animals";
const LOCAL_KEY_HEALTH_RECORDS = "pashu_health_records";

export const initialAnimals = [
  {
    id: "ANM-1001",
    livestockId: "100234567891",
    nameTag: "Gauri (Tag #42)",
    species: "Cattle",
    breed: "Sahiwal",
    ageYears: 4.5,
    sex: "Female",
    ownerName: "Ramesh Patel",
    village: "Village A",
    createdAt: "2026-08-10"
  },
  {
    id: "ANM-1002",
    livestockId: "100234567892",
    nameTag: "Bhima (Tag #18)",
    species: "Buffalo",
    breed: "Murrah",
    ageYears: 5.0,
    sex: "Male",
    ownerName: "Suresh Deshmukh",
    village: "Village B",
    createdAt: "2026-07-22"
  },
  {
    id: "ANM-1003",
    livestockId: "100234567893",
    nameTag: "Kaveri (Tag #77)",
    species: "Cattle",
    breed: "Gir Cross",
    ageYears: 3.0,
    sex: "Female",
    ownerName: "Anand Kulkarni",
    village: "Village C",
    createdAt: "2026-08-01"
  },
  {
    id: "ANM-1004",
    livestockId: null,
    nameTag: "Rani (Tag #09)",
    species: "Goat",
    breed: "Jamnapari",
    ageYears: 2.0,
    sex: "Female",
    ownerName: "Ramesh Patel",
    village: "Village A",
    createdAt: "2026-08-15"
  }
];

export const initialHealthRecords = [
  {
    id: "REC-2001",
    animalId: "ANM-1001",
    recordType: "vaccination",
    title: "FMD Vaccination (Round 4)",
    details: "Administered Foot & Mouth Disease bivalent vaccine",
    administeredBy: "Dr. Sharma (VO)",
    recordDate: "2026-08-15"
  },
  {
    id: "REC-2002",
    animalId: "ANM-1001",
    recordType: "vaccination",
    title: "Brucellosis Strain 19",
    details: "Standard heifer immunisation dose",
    administeredBy: "Dr. Sharma (VO)",
    recordDate: "2026-04-01"
  },
  {
    id: "REC-2003",
    animalId: "ANM-1001",
    recordType: "checkup",
    title: "Routine Herd Surveillance",
    details: "Normal vitals, normal rumination, clear eyes",
    administeredBy: "Field Officer Varma",
    recordDate: "2026-08-25"
  },
  {
    id: "REC-2004",
    animalId: "ANM-1002",
    recordType: "vaccination",
    title: "HS + BQ Combined Vaccine",
    details: "Pre-monsoon prophylactic booster",
    administeredBy: "Dr. Sharma (VO)",
    recordDate: "2026-07-28"
  },
  {
    id: "REC-2005",
    animalId: "ANM-1002",
    recordType: "treatment",
    title: "Mild Indigestion Treatment",
    details: "Administered liver tonic & oral probiotics",
    administeredBy: "Dr. Sharma (VO)",
    recordDate: "2026-08-20"
  },
  {
    id: "REC-2006",
    animalId: "ANM-1003",
    recordType: "vaccination",
    title: "FMD Vaccination (Round 4)",
    details: "Scheduled FMD vaccination booster",
    administeredBy: "Dr. Sharma (VO)",
    recordDate: "2026-08-18"
  }
];

function toAppAnimal(row) {
  return {
    id: row.id,
    livestockId: row.livestock_id || null,
    nameTag: row.name_tag,
    species: row.species,
    breed: row.breed || "",
    ageYears: row.age_years ? Number(row.age_years) : null,
    sex: row.sex || "Female",
    ownerName: row.owner_name,
    village: row.village,
    createdAt: row.created_at ? row.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10)
  };
}

function toDbAnimal(a) {
  return {
    id: a.id,
    livestock_id: a.livestockId ? String(a.livestockId).trim() : null,
    name_tag: a.nameTag,
    species: a.species,
    breed: a.breed || null,
    age_years: a.ageYears ? Number(a.ageYears) : null,
    sex: a.sex || "Female",
    owner_name: a.ownerName,
    village: a.village
  };
}

function toAppRecord(row) {
  return {
    id: row.id,
    animalId: row.animal_id,
    recordType: row.record_type,
    title: row.title,
    details: row.details || "",
    administeredBy: row.administered_by || "",
    recordDate: row.record_date
  };
}

function toDbRecord(r) {
  return {
    id: r.id,
    animal_id: r.animalId,
    record_type: r.recordType,
    title: r.title,
    details: r.details || null,
    administered_by: r.administeredBy || null,
    record_date: r.recordDate || new Date().toISOString().slice(0, 10)
  };
}

export function validateLivestockId(livestockId, existingAnimals = [], currentAnimalId = null) {
  if (!livestockId) {
    return { valid: true }; // optional if untagged
  }

  const cleaned = String(livestockId).trim();

  // Validate exactly 12 numeric digits
  if (!/^\d{12}$/.test(cleaned)) {
    return {
      valid: false,
      error: "Livestock ID must contain exactly 12 numeric digits (e.g. 100234567891)."
    };
  }

  // Prevent duplicate IDs
  const duplicate = existingAnimals.find(
    a => a.livestockId === cleaned && a.id !== currentAnimalId
  );

  if (duplicate) {
    return {
      valid: false,
      error: `Livestock ID ${cleaned} is already registered to animal "${duplicate.nameTag}" (${duplicate.id}).`
    };
  }

  return { valid: true, cleaned };
}

export async function loadAnimals() {
  if (!supabase) {
    const saved = localStorage.getItem(LOCAL_KEY_ANIMALS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local animals:", e);
      }
    }
    localStorage.setItem(LOCAL_KEY_ANIMALS, JSON.stringify(initialAnimals));
    return initialAnimals;
  }

  try {
    const { data, error } = await supabase
      .from("animals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      return initialAnimals;
    }
    return data.map(toAppAnimal);
  } catch (err) {
    console.warn("Supabase loadAnimals failed, falling back to local:", err);
    const saved = localStorage.getItem(LOCAL_KEY_ANIMALS);
    return saved ? JSON.parse(saved) : initialAnimals;
  }
}

export async function saveAnimal(animal, existingAnimals = []) {
  // Validate 12-digit Livestock ID
  if (animal.livestockId) {
    const val = validateLivestockId(animal.livestockId, existingAnimals, animal.id);
    if (!val.valid) {
      throw new Error(val.error);
    }
  }

  const toSave = {
    ...animal,
    id: animal.id || `ANM-${Math.floor(1000 + Math.random() * 9000)}`
  };

  // Always sync to local storage
  const current = JSON.parse(localStorage.getItem(LOCAL_KEY_ANIMALS) || "[]");
  const filtered = current.filter(a => a.id !== toSave.id);
  localStorage.setItem(LOCAL_KEY_ANIMALS, JSON.stringify([toSave, ...filtered]));

  if (supabase) {
    try {
      const { error } = await supabase
        .from("animals")
        .upsert(toDbAnimal(toSave), { onConflict: "id" });
      if (error) console.warn("Supabase saveAnimal notice:", error.message);
    } catch (err) {
      console.warn("Supabase saveAnimal network error, saved locally:", err);
    }
  }

  return toSave;
}

export async function loadHealthRecords(animalId = null) {
  if (!supabase) {
    const saved = localStorage.getItem(LOCAL_KEY_HEALTH_RECORDS);
    let records = saved ? JSON.parse(saved) : initialHealthRecords;
    if (!saved) {
      localStorage.setItem(LOCAL_KEY_HEALTH_RECORDS, JSON.stringify(initialHealthRecords));
    }
    return animalId ? records.filter(r => r.animalId === animalId) : records;
  }

  try {
    let query = supabase.from("animal_health_records").select("*").order("record_date", { ascending: false });
    if (animalId) {
      query = query.eq("animal_id", animalId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) {
      const saved = localStorage.getItem(LOCAL_KEY_HEALTH_RECORDS);
      let records = saved ? JSON.parse(saved) : initialHealthRecords;
      return animalId ? records.filter(r => r.animalId === animalId) : records;
    }
    return data.map(toAppRecord);
  } catch (err) {
    console.warn("Supabase loadHealthRecords fallback:", err);
    const saved = localStorage.getItem(LOCAL_KEY_HEALTH_RECORDS);
    let records = saved ? JSON.parse(saved) : initialHealthRecords;
    return animalId ? records.filter(r => r.animalId === animalId) : records;
  }
}

export async function saveHealthRecord(record) {
  const toSave = {
    ...record,
    id: record.id || `REC-${Math.floor(2000 + Math.random() * 8000)}`,
    recordDate: record.recordDate || new Date().toISOString().slice(0, 10)
  };

  const current = JSON.parse(localStorage.getItem(LOCAL_KEY_HEALTH_RECORDS) || "[]");
  const filtered = current.filter(r => r.id !== toSave.id);
  localStorage.setItem(LOCAL_KEY_HEALTH_RECORDS, JSON.stringify([toSave, ...filtered]));

  if (supabase) {
    try {
      const { error } = await supabase
        .from("animal_health_records")
        .upsert(toDbRecord(toSave), { onConflict: "id" });
      if (error) console.warn("Supabase saveHealthRecord notice:", error.message);
    } catch (err) {
      console.warn("Supabase saveHealthRecord network error, saved locally:", err);
    }
  }

  return toSave;
}
