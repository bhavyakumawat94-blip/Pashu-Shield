import React, { useState, useMemo } from "react";
import {
  PawPrint, Search, Plus, Filter, Calendar, Stethoscope, Syringe,
  CheckCircle2, AlertTriangle, FileText, QrCode, X, User, MapPin, Tag
} from "lucide-react";
import { YellowTag } from "./YellowTag";
import { generateQrSvg } from "../lib/qrCode";
import { validateLivestockId } from "../lib/animalsDb";

const SPECIES_ICONS = {
  Cattle: "🐄",
  Buffalo: "🐃",
  Goat: "🐐",
  Sheep: "🐑",
  Poultry: "🐔"
};

export function AnimalRecords({
  animals,
  healthRecords,
  cases,
  role,
  onSaveAnimal,
  onSaveHealthRecord,
  notify
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("All");
  const [activeAnimal, setActiveAnimal] = useState(null);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Filter animals based on search query and species
  const filteredAnimals = useMemo(() => {
    return animals.filter((a) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        a.id.toLowerCase().includes(q) ||
        (a.livestockId && a.livestockId.includes(q)) ||
        a.nameTag.toLowerCase().includes(q) ||
        a.ownerName.toLowerCase().includes(q) ||
        a.village.toLowerCase().includes(q) ||
        (a.breed && a.breed.toLowerCase().includes(q));

      const matchesSpecies =
        selectedSpecies === "All" || a.species === selectedSpecies;

      return matchesQuery && matchesSpecies;
    });
  }, [animals, searchQuery, selectedSpecies]);

  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">DIGITAL LIVESTOCK REGISTRY (USP 1 & 2)</div>
          <h1>Individual Animal Health Records</h1>
          <p>
            Digital profiles, 12-digit Bharat Pashudhan tag identification, vaccination history, and linked cases.
          </p>
        </div>
        <button
          className="primary"
          onClick={() => setShowRegisterModal(true)}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={16} />
          <span>Register New Animal</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div className="searchbar" style={{ flex: 1, minWidth: "260px", margin: 0 }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by 12-digit Livestock ID, Tag, Species, Owner, or Village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {["All", "Cattle", "Buffalo", "Goat", "Sheep"].map((sp) => (
            <button
              key={sp}
              type="button"
              className={selectedSpecies === sp ? "primary small" : "secondary small"}
              onClick={() => setSelectedSpecies(sp)}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* Animals Grid */}
      {filteredAnimals.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", padding: "40px" }}>
          <PawPrint size={40} style={{ color: "#9ca3af", margin: "0 auto 12px" }} />
          <h3>No animal records match your search</h3>
          <p style={{ color: "#6b7280", fontSize: "12px" }}>
            Try searching with a different 12-digit tag, name, or register a new animal.
          </p>
        </div>
      ) : (
        <div className="animal-grid">
          {filteredAnimals.map((animal) => {
            const animalCases = cases.filter(
              (c) => c.animalId === animal.id || (animal.livestockId && c.livestockId === animal.livestockId)
            );
            const animalRecordsList = healthRecords.filter((r) => r.animalId === animal.id);
            const lastVaccination = animalRecordsList.find((r) => r.recordType === "vaccination");

            return (
              <div
                key={animal.id}
                className="animal-card-item"
                onClick={() => setActiveAnimal(animal)}
              >
                <div className="animal-card-top">
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div className="animal-avatar">
                      {SPECIES_ICONS[animal.species] || "🐾"}
                    </div>
                    <div>
                      <strong style={{ fontSize: "14px", display: "block" }}>
                        {animal.nameTag}
                      </strong>
                      <span style={{ fontSize: "10px", color: "#6b7280" }}>
                        Internal ID: {animal.id}
                      </span>
                    </div>
                  </div>
                  <span className="risk risk-low" style={{ fontSize: "9px" }}>
                    {animal.species}
                  </span>
                </div>

                {/* 12-Digit Tag Badge */}
                <div>
                  {animal.livestockId ? (
                    <YellowTag id={animal.livestockId} />
                  ) : (
                    <span style={{ fontSize: "10px", color: "#9ca3af", fontStyle: "italic" }}>
                      Tag pending / Untagged
                    </span>
                  )}
                </div>

                <div className="animal-card-specs">
                  <div>
                    <span>Breed:</span>
                    <strong>{animal.breed || "Indigenous"}</strong>
                  </div>
                  <div>
                    <span>Age / Sex:</span>
                    <strong>{animal.ageYears ? `${animal.ageYears} yrs` : "—"} • {animal.sex}</strong>
                  </div>
                  <div>
                    <span>Owner:</span>
                    <strong>{animal.ownerName}</strong>
                  </div>
                  <div>
                    <span>Village:</span>
                    <strong>{animal.village}</strong>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #edf0ed", paddingTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "#65756a" }}>
                  <span>
                    💉 {lastVaccination ? lastVaccination.title : "No recent vaccine"}
                  </span>
                  {animalCases.length > 0 && (
                    <span style={{ color: "#dc2626", fontWeight: "700" }}>
                      ⚠️ {animalCases.length} case(s)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Animal Detail Modal (USP 1 & 2) */}
      {activeAnimal && (
        <AnimalDetailModal
          animal={activeAnimal}
          healthRecords={healthRecords.filter((r) => r.animalId === activeAnimal.id)}
          cases={cases.filter((c) => c.animalId === activeAnimal.id || (activeAnimal.livestockId && c.livestockId === activeAnimal.livestockId))}
          onClose={() => setActiveAnimal(null)}
          onOpenAddRecord={() => setShowAddRecordModal(true)}
        />
      )}

      {/* Add Health Record Modal */}
      {showAddRecordModal && activeAnimal && (
        <AddRecordModal
          animal={activeAnimal}
          onClose={() => setShowAddRecordModal(false)}
          onSave={async (record) => {
            await onSaveHealthRecord(record);
            setShowAddRecordModal(false);
            notify(`New ${record.recordType} record added for ${activeAnimal.nameTag}.`);
          }}
        />
      )}

      {/* Register Animal Modal */}
      {showRegisterModal && (
        <RegisterAnimalModal
          existingAnimals={animals}
          onClose={() => setShowRegisterModal(false)}
          onSave={async (newAnimal) => {
            const saved = await onSaveAnimal(newAnimal);
            setShowRegisterModal(false);
            notify(`Animal ${saved.nameTag} successfully registered.`);
            setActiveAnimal(saved);
          }}
        />
      )}
    </section>
  );
}

// Modal displaying detailed animal profile, yellow tag, QR code, and chronological timeline
function AnimalDetailModal({ animal, healthRecords, cases, onClose, onOpenAddRecord }) {
  const qrSvg = useMemo(() => {
    const qrData = `PASHU-SHIELD:${animal.id}:${animal.livestockId || "UNTAGGED"}:${animal.ownerName}`;
    return generateQrSvg(qrData, 140);
  }, [animal]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "28px" }}>{SPECIES_ICONS[animal.species] || "🐾"}</span>
            <div>
              <h2 style={{ margin: 0 }}>{animal.nameTag}</h2>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>
                Digital Health Passport • Internal ID: {animal.id}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Profile Card Header with 12-Digit Yellow Tag and QR Code */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", background: "#f8faf8", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8e2", marginBottom: "20px" }}>
          <div>
            <div style={{ marginBottom: "10px" }}>
              {animal.livestockId ? (
                <YellowTag id={animal.livestockId} large />
              ) : (
                <div style={{ display: "inline-block", background: "#f3f4f6", color: "#6b7280", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontStyle: "italic" }}>
                  ⚠️ Untagged (12-digit Livestock ID not assigned yet)
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", fontSize: "12px", marginTop: "12px" }}>
              <div>
                <span style={{ color: "#6b7280" }}>Species:</span>{" "}
                <strong>{animal.species}</strong>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Breed:</span>{" "}
                <strong>{animal.breed || "Indigenous"}</strong>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Age & Sex:</span>{" "}
                <strong>{animal.ageYears ? `${animal.ageYears} years` : "—"} • {animal.sex}</strong>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Owner / Farmer:</span>{" "}
                <strong>{animal.ownerName}</strong>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Location:</span>{" "}
                <strong>{animal.village}</strong>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Registered:</span>{" "}
                <strong>{animal.createdAt}</strong>
              </div>
            </div>
          </div>

          {/* Verification QR Code */}
          <div className="qr-container">
            <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <small>
              <QrCode size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
              Scan for Field Verification
            </small>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "15px" }}>
            Health History & Medical Timeline
          </h3>
          <button className="primary small" onClick={onOpenAddRecord}>
            <Plus size={14} />
            <span>Add Health Event</span>
          </button>
        </div>

        {/* Timeline Events */}
        {healthRecords.length === 0 && cases.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "#6b7280", fontSize: "12px" }}>
            No health records or cases logged yet for this animal.
          </div>
        ) : (
          <div className="timeline">
            {/* Show linked surveillance cases */}
            {cases.map((c) => (
              <div key={c.id} className="timeline-item case">
                <div className="timeline-header">
                  <span className="timeline-type case">Reported Health Case</span>
                  <span className="timeline-date">{c.date}</span>
                </div>
                <strong>Case {c.id} • Triage Score: {c.score}% ({c.status} Risk)</strong>
                <p style={{ margin: "4px 0", fontSize: "11px", color: "#4b5563" }}>
                  Symptoms: {c.symptoms.join(", ") || "General signs"} • {c.affected} affected • {c.mortality} mortality
                </p>
                {c.transcription && (
                  <div style={{ fontSize: "10px", color: "#6b7280", fontStyle: "italic", marginTop: "4px" }}>
                    Voice transcription: "{c.transcription}"
                  </div>
                )}
              </div>
            ))}

            {/* Show vaccinations, treatments, checkups */}
            {healthRecords.map((r) => (
              <div key={r.id} className={`timeline-item ${r.recordType}`}>
                <div className="timeline-header">
                  <span className={`timeline-type ${r.recordType}`}>{r.recordType}</span>
                  <span className="timeline-date">{r.recordDate}</span>
                </div>
                <strong>{r.title}</strong>
                {r.details && (
                  <p style={{ margin: "4px 0", fontSize: "11px", color: "#4b5563" }}>
                    {r.details}
                  </p>
                )}
                {r.administeredBy && (
                  <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "4px" }}>
                    Administered by: {r.administeredBy}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Modal for adding a new vaccination or treatment to an animal
function AddRecordModal({ animal, onClose, onSave }) {
  const [form, setForm] = useState({
    recordType: "vaccination",
    title: "",
    details: "",
    administeredBy: "Dr. Sharma (VO)",
    recordDate: new Date().toISOString().slice(0, 10)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      alert("Please enter a title for the health record.");
      return;
    }
    onSave({
      animalId: animal.id,
      recordType: form.recordType,
      title: form.title,
      details: form.details,
      administeredBy: form.administeredBy,
      recordDate: form.recordDate
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 110 }}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Add Health Record for {animal.nameTag}</h2>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "12px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700" }}>
              Record Type
              <select
                value={form.recordType}
                onChange={(e) => setForm({ ...form, recordType: e.target.value })}
                style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              >
                <option value="vaccination">Vaccination (FMD, Brucellosis, HS/BQ, etc.)</option>
                <option value="treatment">Treatment / Medication</option>
                <option value="checkup">Routine Health Checkup</option>
                <option value="lab_test">Laboratory Test / Sample</option>
              </select>
            </label>

            <label style={{ fontSize: "11px", fontWeight: "700" }}>
              Title / Vaccine Name *
              <input
                type="text"
                placeholder="e.g. FMD Bivalent Booster, Deworming, Antibiotic Course..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              >
              </input>
            </label>

            <label style={{ fontSize: "11px", fontWeight: "700" }}>
              Clinical Details / Notes
              <textarea
                rows={3}
                placeholder="Dosage, batch number, clinical response, observation..."
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #d1d5db" }}
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700" }}>
                Administered By
                <input
                  type="text"
                  value={form.administeredBy}
                  onChange={(e) => setForm({ ...form, administeredBy: e.target.value })}
                  style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
              </label>

              <label style={{ fontSize: "11px", fontWeight: "700" }}>
                Date Administered
                <input
                  type="date"
                  value={form.recordDate}
                  onChange={(e) => setForm({ ...form, recordDate: e.target.value })}
                  style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal for registering a new animal with strict 12-digit Livestock ID validation (USP 1 & 2)
function RegisterAnimalModal({ existingAnimals, onClose, onSave }) {
  const [form, setForm] = useState({
    nameTag: "",
    species: "Cattle",
    breed: "",
    ageYears: "",
    sex: "Female",
    livestockId: "",
    ownerName: "Ramesh Patel",
    village: "Village A"
  });

  const [idValidation, setIdValidation] = useState({ valid: true });

  const handleIdChange = (e) => {
    const raw = e.target.value;
    setForm({ ...form, livestockId: raw });
    if (raw.trim()) {
      setIdValidation(validateLivestockId(raw, existingAnimals));
    } else {
      setIdValidation({ valid: true });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nameTag) {
      alert("Please provide an animal name or ear tag label.");
      return;
    }

    if (form.livestockId) {
      const val = validateLivestockId(form.livestockId, existingAnimals);
      if (!val.valid) {
        alert(val.error);
        return;
      }
    }

    onSave({
      nameTag: form.nameTag,
      species: form.species,
      breed: form.breed,
      ageYears: form.ageYears ? Number(form.ageYears) : null,
      sex: form.sex,
      livestockId: form.livestockId.trim() || null,
      ownerName: form.ownerName,
      village: form.village
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Register Animal Profile (USP 1 & 2)</h2>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700" }}>
                Animal Name / Tag Label *
                <input
                  type="text"
                  placeholder="e.g. Gauri (Tag #45), Laxmi, Sheru"
                  value={form.nameTag}
                  onChange={(e) => setForm({ ...form, nameTag: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
              </label>

              <label style={{ fontSize: "11px", fontWeight: "700" }}>
                Species
                <select
                  value={form.species}
                  onChange={(e) => setForm({ ...form, species: e.target.value })}
                  style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                >
                  <option value="Cattle">Cattle (Cow)</option>
                  <option value="Buffalo">Buffalo</option>
                  <option value="Goat">Goat</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Poultry">Poultry</option>
                </select>
              </label>
            </div>

            {/* 12-Digit Yellow Card ID with live validation */}
            <div style={{ background: "#fefce8", border: "1px solid #fef08a", padding: "12px", borderRadius: "8px" }}>
              <label style={{ fontSize: "11px", fontWeight: "800", color: "#854d0e", display: "flex", justifyContent: "space-between" }}>
                <span>12-Digit Livestock ID / Yellow Card ID (USP 2)</span>
                <span>{form.livestockId.replace(/\D/g, "").length} / 12 digits</span>
              </label>
              <input
                type="text"
                maxLength={12}
                placeholder="e.g. 100234567894 (12 digits numeric)"
                value={form.livestockId}
                onChange={handleIdChange}
                style={{
                  width: "100%",
                  padding: "9px",
                  marginTop: "6px",
                  borderRadius: "6px",
                  border: idValidation.valid ? "1.5px solid #ca8a04" : "1.5px solid #dc2626",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  letterSpacing: "1px",
                  background: "white"
                }}
              />
              {!idValidation.valid && (
                <div style={{ color: "#dc2626", fontSize: "11px", marginTop: "4px", fontWeight: "600" }}>
                  ⚠️ {idValidation.error}
                </div>
              )}
              <small style={{ color: "#713f12", fontSize: "10px", display: "block", marginTop: "4px" }}>
                Standard Bharat Pashudhan / INAPH 12-digit ear tag. Unique ID required; leave blank if animal is untagged.
              </small>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700" }}>
                Breed
                <input
                  type="text"
                  placeholder="e.g. Sahiwal, Gir, Murrah"
                  value={form.breed}
                  onChange={(e) => setForm({ ...form, breed: e.target.value })}
                  style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
              </label>

              <label style={{ fontSize: "11px", fontWeight: "700" }}>
                Age (Years)
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="e.g. 3.5"
                  value={form.ageYears}
                  onChange={(e) => setForm({ ...form, ageYears: e.target.value })}
                  style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
              </label>

              <label style={{ fontSize: "11px", fontWeight: "700" }}>
                Sex
                <select
                  value={form.sex}
                  onChange={(e) => setForm({ ...form, sex: e.target.value })}
                  style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700" }}>
                Owner / Farmer Name *
                <input
                  type="text"
                  value={form.ownerName}
                  onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
              </label>

              <label style={{ fontSize: "11px", fontWeight: "700" }}>
                Village / Location *
                <input
                  type="text"
                  value={form.village}
                  onChange={(e) => setForm({ ...form, village: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="primary"
              disabled={!idValidation.valid}
            >
              Register Animal Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
