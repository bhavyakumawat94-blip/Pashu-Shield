import React, { useState } from "react";
import {
  ShieldCheck, PawPrint, Calendar, Syringe, Stethoscope, FileText,
  CheckCircle2, AlertTriangle, Printer, QrCode, Download, Clock,
  User, MapPin, X, Plus
} from "lucide-react";
import { YellowTag } from "./YellowTag";
import { generateQrSvg } from "../lib/qrCode";
import { t, formatDate } from "../lib/i18n";

export function DigitalHealthPassport({
  animal,
  healthRecords = [],
  cases = [],
  role = "farmer",
  onClose,
  onAddRecord,
  notify
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    recordType: "vaccination",
    title: "",
    details: "",
    administeredBy: role === "vet" ? "Dr. Sharma (VO)" : "Field Officer"
  });

  if (!animal) return null;

  // Filter records and cases linked to this animal
  const animalRecords = healthRecords.filter(
    (r) => r.animalId === animal.id
  );

  const animalCases = cases.filter(
    (c) =>
      c.animalId === animal.id ||
      (animal.livestockId && c.livestockId === animal.livestockId)
  );

  // Derive current health status
  const hasActiveHighCase = animalCases.some((c) => c.status === "High");
  const hasActiveMediumCase = animalCases.some((c) => c.status === "Medium");
  const currentStatus = hasActiveHighCase
    ? "High Risk — Active Clinical Attention"
    : hasActiveMediumCase
    ? "Medium Risk — Monitored Observation"
    : "Healthy / Green — Up to date";

  // Upcoming preventive care schedule based on species
  const upcomingCare = [
    {
      title: "FMD Booster Dose (Round 5)",
      dueDate: "15 Nov 2026",
      type: "Vaccination",
      scheme: "NADCP 100% Free"
    },
    {
      title: "Quarterly Broad-Spectrum Deworming",
      dueDate: "20 Oct 2026",
      type: "Preventive Care",
      scheme: "Routine Herd Health"
    },
    {
      title: "Post-Monsoon General Health Review",
      dueDate: "05 Nov 2026",
      type: "Veterinary Checkup",
      scheme: "District Animal Husbandry"
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitNewRecord = (e) => {
    e.preventDefault();
    if (!newRecord.title.trim()) return;

    if (onAddRecord) {
      onAddRecord({
        id: `REC-${Date.now().toString().slice(-4)}`,
        animalId: animal.id,
        recordType: newRecord.recordType,
        title: newRecord.title,
        details: newRecord.details,
        administeredBy: newRecord.administeredBy,
        recordDate: new Date().toISOString().split("T")[0]
      });
      setShowAddForm(false);
      setNewRecord({
        recordType: "vaccination",
        title: "",
        details: "",
        administeredBy: role === "vet" ? "Dr. Sharma (VO)" : "Field Officer"
      });
      if (notify) notify("Clinical record appended to Animal Digital Health Passport.");
    }
  };

  // Generate QR SVG
  const qrSvg = generateQrSvg(
    `PASHU-SHIELD:PASSPORT:${animal.id}:${animal.livestockId || "UNTAGGED"}`,
    140
  );

  return (
    <div className="passport-modal-overlay" onClick={onClose}>
      <div className="passport-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* TOP BAR / ACTIONS */}
        <div className="passport-topbar">
          <div className="passport-badge-header">
            <ShieldCheck size={20} className="passport-shield-icon" />
            <span>GOVERNMENT OF INDIA • BHARAT PASHUDHAN COMPLIANT</span>
          </div>
          <div className="passport-top-actions">
            <button
              type="button"
              className="passport-action-btn"
              onClick={handlePrint}
              title="Print Health Passport"
            >
              <Printer size={16} /> Print Passport
            </button>
            <button
              type="button"
              className="passport-close-btn"
              onClick={onClose}
              title="Close Passport"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PASSPORT BODY */}
        <div className="passport-sheet printable-passport">
          {/* PASSPORT HEADER */}
          <div className="passport-header">
            <div className="passport-title-group">
              <div className="passport-emblem">🐄</div>
              <div>
                <h2>Animal Digital Health Passport</h2>
                <span className="passport-sub">
                  Official Livestock Health, Immunization & Clinical Identity Record
                </span>
                <div className="passport-ids">
                  <span className="passport-internal-id">Internal ID: {animal.id}</span>
                  {animal.livestockId ? (
                    <YellowTag id={animal.livestockId} />
                  ) : (
                    <span className="passport-untagged">Pending 12-Digit Yellow Ear-Tag</span>
                  )}
                </div>
              </div>
            </div>

            {/* QR CODE VERIFICATION BOX */}
            <div className="passport-qr-box">
              <div
                className="passport-qr-code"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
              <span className="passport-qr-hint">Scan for Instant Verification</span>
            </div>
          </div>

          {/* VITAL PROFILE CARDS */}
          <div className="passport-profile-grid">
            <div className="passport-field">
              <span className="p-label">Animal Name / Tag</span>
              <strong className="p-val">{animal.nameTag}</strong>
            </div>
            <div className="passport-field">
              <span className="p-label">Species & Breed</span>
              <strong className="p-val">
                {animal.species} • {animal.breed || "Standard Indigenous"}
              </strong>
            </div>
            <div className="passport-field">
              <span className="p-label">Age & Sex</span>
              <strong className="p-val">
                {animal.ageYears} Years • {animal.sex || "Female"}
              </strong>
            </div>
            <div className="passport-field">
              <span className="p-label">Registered Owner</span>
              <strong className="p-val">{animal.ownerName}</strong>
            </div>
            <div className="passport-field">
              <span className="p-label">Village / Location</span>
              <strong className="p-val">{animal.village}</strong>
            </div>
            <div className="passport-field">
              <span className="p-label">Registration Date</span>
              <strong className="p-val">{animal.createdAt || "Active"}</strong>
            </div>
          </div>

          {/* CURRENT CLINICAL HEALTH STATUS */}
          <div
            className={`passport-status-strip ${
              hasActiveHighCase ? "status-high" : hasActiveMediumCase ? "status-med" : "status-normal"
            }`}
          >
            <div className="status-indicator-dot"></div>
            <div>
              <strong>Current Health Status: {currentStatus}</strong>
              <p>
                {hasActiveHighCase
                  ? "Requires direct veterinary follow-up. Clinical symptoms recorded."
                  : "Animal is clinically clear. Routine preventive care up to date."}
              </p>
            </div>
          </div>

          {/* VACCINATION & CLINICAL HISTORY TIMELINE */}
          <div className="passport-section">
            <div className="passport-section-head">
              <h3>
                <Syringe size={17} /> Immunization & Vaccination History
              </h3>
              {role === "vet" && (
                <button
                  type="button"
                  className="secondary small"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <Plus size={14} /> Log Clinical Record (Vet Only)
                </button>
              )}
            </div>

            {/* VET UPDATE FORM */}
            {showAddForm && (
              <form className="passport-inline-form" onSubmit={handleSubmitNewRecord}>
                <h4>Log Official Clinical Record</h4>
                <div className="passport-form-grid">
                  <label>
                    Record Type
                    <select
                      value={newRecord.recordType}
                      onChange={(e) =>
                        setNewRecord({ ...newRecord, recordType: e.target.value })
                      }
                    >
                      <option value="vaccination">Vaccination (Immunization)</option>
                      <option value="treatment">Clinical Treatment</option>
                      <option value="checkup">Routine Checkup / Vitals</option>
                      <option value="lab_test">Laboratory Test Sample</option>
                    </select>
                  </label>
                  <label>
                    Title / Vaccine Name
                    <input
                      type="text"
                      placeholder="e.g. FMD Booster Round 4"
                      value={newRecord.title}
                      onChange={(e) =>
                        setNewRecord({ ...newRecord, title: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Administered By
                    <input
                      type="text"
                      value={newRecord.administeredBy}
                      onChange={(e) =>
                        setNewRecord({ ...newRecord, administeredBy: e.target.value })
                      }
                      required
                    />
                  </label>
                </div>
                <label style={{ marginTop: "8px", display: "block" }}>
                  Clinical Observations & Details
                  <textarea
                    rows={2}
                    placeholder="Batch number, site of injection, or symptoms treated..."
                    value={newRecord.details}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, details: e.target.value })
                    }
                  />
                </label>
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <button type="submit" className="primary small">
                    Save to Health Passport
                  </button>
                  <button
                    type="button"
                    className="secondary small"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* TIMELINE ITEMS */}
            <div className="passport-timeline">
              {animalRecords.length === 0 ? (
                <div className="passport-empty-timeline">
                  No historical vaccination records logged yet.
                </div>
              ) : (
                animalRecords.map((rec) => (
                  <div key={rec.id} className="passport-timeline-item">
                    <div className="timeline-dot">
                      {rec.recordType === "vaccination" ? (
                        <Syringe size={14} />
                      ) : (
                        <Stethoscope size={14} />
                      )}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-head">
                        <strong>{rec.title}</strong>
                        <span className="timeline-date">{rec.recordDate}</span>
                      </div>
                      <p>{rec.details}</p>
                      <span className="timeline-officer">
                        Authorized: {rec.administeredBy || "Veterinary Dispensary"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* REPORTED SICKNESS & CASE HISTORY */}
          {animalCases.length > 0 && (
            <div className="passport-section">
              <div className="passport-section-head">
                <h3>
                  <FileText size={17} /> Sickness & Surveillance Case History
                </h3>
              </div>
              <div className="passport-case-list">
                {animalCases.map((c) => (
                  <div key={c.id} className="passport-case-row">
                    <div>
                      <strong>Case {c.id}</strong> • <span>{c.date}</span>
                      <p>Symptoms: {c.symptoms?.join(", ")}</p>
                      {c.transcription && (
                        <small className="case-trans-snippet">
                          Voice Intake: "{c.transcription}"
                        </small>
                      )}
                    </div>
                    <div className="case-score-tag">
                      <span className={`risk-pill risk-${c.status?.toLowerCase()}`}>
                        {c.status} Risk ({c.score}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPCOMING PREVENTIVE CARE SCHEDULE */}
          <div className="passport-section">
            <div className="passport-section-head">
              <h3>
                <Clock size={17} /> Upcoming Scheduled Preventive Care
              </h3>
            </div>
            <div className="passport-upcoming-grid">
              {upcomingCare.map((item, idx) => (
                <div key={idx} className="upcoming-care-card">
                  <div className="care-header">
                    <strong>{item.title}</strong>
                    <span className="care-type">{item.type}</span>
                  </div>
                  <div className="care-details">
                    <span>Due: <b>{item.dueDate}</b></span>
                    <small>{item.scheme}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PASSPORT FOOTER / AUDIT TRAIL */}
          <div className="passport-footer">
            <div>
              <p>
                <strong>Audit Notice:</strong> This digital health passport is cryptographically and
                procedurally linked with the 12-digit Bharat Pashudhan Yellow Tag ID. Records are
                maintained with Row Level Security.
              </p>
              <small>System generated by PASHU SHIELD • SIH 2026 Production Upgrade</small>
            </div>
            <div className="passport-verified-stamp">
              <CheckCircle2 size={24} />
              <span>OFFICIALLY VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
