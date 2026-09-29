import React, { useState } from "react";
import {
  Calendar, CheckCircle2, Clock, AlertTriangle, Bell,
  Syringe, Stethoscope, PawPrint, Filter, Plus, ShieldCheck, Check
} from "lucide-react";
import { YellowTag } from "./YellowTag";
import { t, formatDate } from "../lib/i18n";

export function ComplianceTracker({
  animals = [],
  healthRecords = [],
  role = "farmer",
  onSaveHealthRecord,
  notify
}) {
  const [filterType, setFilterType] = useState("all");
  const [selectedAnimalFilter, setSelectedAnimalFilter] = useState("all");

  // Initial national livestock vaccination schedules (NADCP verified)
  const [complianceSchedules, setComplianceSchedules] = useState([
    {
      id: "SCH-001",
      animalId: "ANM-1001",
      animalName: "Gauri (Tag #42)",
      livestockId: "100234567891",
      species: "Cattle",
      protocol: "FMD Booster Immunization (Round 5)",
      dueDate: "2026-10-15",
      status: "upcoming", // upcoming, overdue, completed
      source: "National Animal Disease Control Programme (NADCP)",
      type: "vaccination",
      notes: "Bi-annual Foot and Mouth Disease mandatory booster."
    },
    {
      id: "SCH-002",
      animalId: "ANM-1002",
      animalName: "Bhima (Tag #18)",
      livestockId: "100234567892",
      species: "Buffalo",
      protocol: "Hemorrhagic Septicemia (HS) Annual Dose",
      dueDate: "2026-09-20",
      status: "overdue",
      source: "DAHD Pre-monsoon Schedule",
      type: "vaccination",
      notes: "Delayed booster; high priority for monsoon belt."
    },
    {
      id: "SCH-003",
      animalId: "ANM-1001",
      animalName: "Gauri (Tag #42)",
      livestockId: "100234567891",
      species: "Cattle",
      protocol: "Quarterly Broad-Spectrum Deworming",
      dueDate: "2026-10-05",
      status: "upcoming",
      source: "Veterinary Officer Clinical Recommendation",
      type: "preventive",
      notes: "Administer prescribed albendazole bolus with feed."
    },
    {
      id: "SCH-004",
      animalId: "ANM-1003",
      animalName: "Kaveri (Tag #77)",
      livestockId: "100234567893",
      species: "Cattle",
      protocol: "Post-Treatment Clinical Re-examination",
      dueDate: "2026-10-02",
      status: "upcoming",
      source: "Dr. Sharma (VO) Follow-up",
      type: "followup",
      notes: "Verify lung auscultation and recovery from cough."
    },
    {
      id: "SCH-005",
      animalId: "ANM-1004",
      animalName: "Rani (Tag #09)",
      livestockId: null,
      species: "Goat",
      protocol: "PPR (Peste des Petits Ruminants) Vaccine",
      dueDate: "2026-11-01",
      status: "upcoming",
      source: "National Goat Health Mission",
      type: "vaccination",
      notes: "Protective immunisation against goat plague."
    }
  ]);

  // Mark completion by authorized user
  const handleMarkCompleted = (sch) => {
    const confirmDone = window.confirm(
      `Confirm completion of '${sch.protocol}' for ${sch.animalName}?\nThis will create an official clinical audit record.`
    );
    if (!confirmDone) return;

    // Update status in schedule
    setComplianceSchedules((prev) =>
      prev.map((item) =>
        item.id === sch.id
          ? { ...item, status: "completed", completedAt: new Date().toISOString().split("T")[0] }
          : item
      )
    );

    // Append to official health records if callback provided
    if (onSaveHealthRecord) {
      onSaveHealthRecord({
        id: `REC-${Date.now().toString().slice(-4)}`,
        animalId: sch.animalId,
        recordType: sch.type === "vaccination" ? "vaccination" : "treatment",
        title: sch.protocol,
        details: `${sch.notes} (Verified under compliance tracker)`,
        administeredBy: role === "vet" ? "Dr. Sharma (VO)" : "Field Officer",
        recordDate: new Date().toISOString().split("T")[0]
      });
    }

    if (notify) {
      notify(`✓ Compliance recorded: ${sch.protocol} marked as completed.`);
    }
  };

  const filtered = complianceSchedules.filter((item) => {
    const matchesType =
      filterType === "all" || item.status === filterType || item.type === filterType;
    const matchesAnimal =
      selectedAnimalFilter === "all" || item.animalId === selectedAnimalFilter;
    return matchesType && matchesAnimal;
  });

  const overdueCount = complianceSchedules.filter((s) => s.status === "overdue").length;
  const upcomingCount = complianceSchedules.filter((s) => s.status === "upcoming").length;
  const completedCount = complianceSchedules.filter((s) => s.status === "completed").length;

  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">PREVENTIVE CARE & VACCINATION (USP 4)</div>
          <h1>Treatment & Vaccination Compliance Tracker</h1>
          <p>
            Track mandatory immunization schedules, veterinary follow-up appointments, and prevent lapses in herd protection.
          </p>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="stats" style={{ marginBottom: "20px" }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fee2e2", color: "#dc2626" }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="stat-value">{overdueCount}</div>
            <div className="stat-label">Overdue Immunizations</div>
            <div className="stat-hint">Immediate follow-up required</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <Clock size={20} />
          </div>
          <div>
            <div className="stat-value">{upcomingCount}</div>
            <div className="stat-label">Upcoming Scheduled Care</div>
            <div className="stat-hint">Within next 30 days</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dcfce7", color: "#166534" }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label">Completed Vaccinations</div>
            <div className="stat-hint">Verified clinical audit records</div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {["all", "overdue", "upcoming", "completed"].map((f) => (
            <button
              key={f}
              type="button"
              className={filterType === f ? "primary small" : "secondary small"}
              onClick={() => setFilterType(f)}
              style={{ textTransform: "capitalize" }}
            >
              {f === "overdue" && "⚠️ "}
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PawPrint size={16} />
          <select
            value={selectedAnimalFilter}
            onChange={(e) => setSelectedAnimalFilter(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "12px" }}
          >
            <option value="all">All Animals</option>
            {animals.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nameTag} {a.livestockId ? `(#${a.livestockId.slice(-4)})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* COMPLIANCE TABLE */}
      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Animal & Tag</th>
              <th>Preventive Protocol</th>
              <th>Official Source / Authority</th>
              <th>Due Date</th>
              <th>Compliance Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.animalName}</strong>
                  <br />
                  {item.livestockId ? (
                    <YellowTag id={item.livestockId} />
                  ) : (
                    <small style={{ color: "#9ca3af" }}>Untagged</small>
                  )}
                </td>

                <td>
                  <strong style={{ color: "#166534" }}>{item.protocol}</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#4b5563" }}>
                    {item.notes}
                  </p>
                </td>

                <td style={{ fontSize: "12px", color: "#374151" }}>
                  {item.source}
                </td>

                <td>
                  <strong>{item.dueDate}</strong>
                </td>

                <td>
                  {item.status === "overdue" && (
                    <span className="risk-pill risk-high" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <AlertTriangle size={12} /> Overdue
                    </span>
                  )}
                  {item.status === "upcoming" && (
                    <span className="risk-pill risk-medium" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} /> Scheduled Due
                    </span>
                  )}
                  {item.status === "completed" && (
                    <span className="risk-pill" style={{ background: "#dcfce7", color: "#166534", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle2 size={12} /> Completed ({item.completedAt})
                    </span>
                  )}
                </td>

                <td>
                  {item.status !== "completed" ? (
                    <button
                      type="button"
                      className="primary small"
                      onClick={() => handleMarkCompleted(item)}
                      title="Record this vaccination/treatment as administered"
                    >
                      <Check size={13} /> Record Done
                    </button>
                  ) : (
                    <span style={{ fontSize: "11px", color: "#166534", fontWeight: "700" }}>
                      ✓ Audited
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
