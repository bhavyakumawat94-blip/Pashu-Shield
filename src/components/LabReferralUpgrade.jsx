import React, { useState } from "react";
import {
  Syringe, Stethoscope, Clock, CheckCircle2, AlertTriangle,
  Building, User, FileText, ArrowRight, Bell, Calendar
} from "lucide-react";
import { YellowTag } from "./YellowTag";
import { t, formatDate } from "../lib/i18n";

export function LabReferralUpgrade({ cases = [], role = "vet", notify }) {
  // Enhanced referral pipeline state
  const [referrals, setReferrals] = useState([
    {
      caseId: "PS-1024",
      livestockId: "100234567891",
      animalId: "ANM-1001",
      species: "Cattle",
      village: "Village A",
      priority: "Urgent",
      assignedVet: "Dr. Sharma (VO - Taluka Clinic)",
      stage: "collection_pending", // requested, collection_pending, in_transit, analyzing, results_available
      sampleType: "Nasal Swab & Serum",
      labName: "Regional Disease Diagnostic Laboratory (RDDL)",
      requestDate: "09 Sep 2026",
      collectionDate: null,
      resultsDate: null,
      history: [
        { time: "09 Sep 2026 10:15 AM", note: "Referral initiated by Dr. Sharma due to fever & nasal discharge cluster." },
        { time: "09 Sep 2026 11:30 AM", note: "Lab request registered. Sample collection kit assigned to Field Paravet." }
      ]
    },
    {
      caseId: "PS-1021",
      livestockId: "100234567893",
      animalId: "ANM-1003",
      species: "Cattle",
      village: "Village C",
      priority: "High",
      assignedVet: "Dr. Sharma (VO)",
      stage: "in_transit",
      sampleType: "Blood smear & EDTA Blood",
      labName: "District Veterinary Polyclinic Lab",
      requestDate: "08 Sep 2026",
      collectionDate: "09 Sep 2026",
      resultsDate: null,
      history: [
        { time: "08 Sep 2026 03:00 PM", note: "Suspected tick-borne hemoprotozoan infection referred." },
        { time: "09 Sep 2026 09:00 AM", note: "Venous blood sample collected by Field Assistant under cold chain." },
        { time: "09 Sep 2026 01:20 PM", note: "Dispatched in thermal box to District Polyclinic Lab." }
      ]
    }
  ]);

  const [selectedCaseForNew, setSelectedCaseForNew] = useState("");
  const [selectedSampleType, setSelectedSampleType] = useState("Nasal & Oral Swabs");

  // Advance referral status (vet authorization only)
  const advanceStage = (caseId) => {
    setReferrals((prev) =>
      prev.map((ref) => {
        if (ref.caseId !== caseId) return ref;

        let nextStage = ref.stage;
        let note = "";

        if (ref.stage === "collection_pending") {
          nextStage = "in_transit";
          note = "Sample collected from animal under sterile protocol. Dispatched to diagnostic lab.";
        } else if (ref.stage === "in_transit") {
          nextStage = "analyzing";
          note = "Sample received at laboratory. PCR / ELISA testing underway.";
        } else if (ref.stage === "analyzing") {
          nextStage = "results_available";
          note = "Laboratory testing completed. Official diagnostic report issued by Pathologist.";
        }

        const updatedHistory = [
          ...ref.history,
          {
            time: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
            note
          }
        ];

        return {
          ...ref,
          stage: nextStage,
          history: updatedHistory
        };
      })
    );

    if (notify) notify(`Referral status advanced for Case ${caseId}.`);
  };

  const handleCreateReferral = (c) => {
    const newRef = {
      caseId: c.id,
      livestockId: c.livestockId || null,
      animalId: c.animalId || null,
      species: c.species,
      village: c.village,
      priority: c.score >= 80 ? "Urgent" : "High",
      assignedVet: "Dr. Sharma (VO)",
      stage: "collection_pending",
      sampleType: selectedSampleType,
      labName: "Regional Disease Diagnostic Laboratory (RDDL)",
      requestDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      collectionDate: null,
      resultsDate: null,
      history: [
        {
          time: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          note: `Lab referral initiated for suspected ${c.species} symptoms in ${c.village}.`
        }
      ]
    };

    setReferrals((prev) => [newRef, ...prev.filter((x) => x.caseId !== c.id)]);
    if (notify) notify(`Lab referral successfully generated for ${c.id}.`);
  };

  const getStageLabel = (stage) => {
    switch (stage) {
      case "requested": return "Request Registered";
      case "collection_pending": return "Sample Collection Pending";
      case "in_transit": return "In Transit to Lab (Cold Chain)";
      case "analyzing": return "Laboratory Analysis Underway";
      case "results_available": return "Results Ready (Confirmed)";
      default: return stage;
    }
  };

  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">TRUSTED CLINICAL ESCALATION (FEATURE 6)</div>
          <h1>Lab Referral & Diagnostic Tracking</h1>
          <p>
            End-to-end transparent cold-chain sample tracking, assigned veterinarian coordination, and confirmatory laboratory reports.
          </p>
        </div>
      </div>

      {/* ACTIVE REFERRALS CARDS */}
      <div className="referral-list">
        {referrals.map((ref) => (
          <div key={ref.caseId} className="panel referral-card" style={{ marginBottom: "20px" }}>
            <div className="referral-card-head" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "14px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ margin: 0 }}>Referral for Case {ref.caseId}</h3>
                  <span className={`risk-pill risk-${ref.priority === "Urgent" ? "high" : "medium"}`}>
                    {ref.priority} Priority
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                  {ref.village} • {ref.species} • Assigned: <b>{ref.assignedVet}</b>
                </span>
                <div style={{ marginTop: "4px" }}>
                  {ref.livestockId ? <YellowTag id={ref.livestockId} /> : <small style={{ color: "#9ca3af" }}>Untagged Animal</small>}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", fontWeight: "700" }}>
                  Diagnostic Facility
                </span>
                <div style={{ fontWeight: "600", color: "#166534" }}>{ref.labName}</div>
                <small style={{ color: "#4b5563" }}>Sample: {ref.sampleType}</small>
              </div>
            </div>

            {/* STAGES PROGRESSION BAR */}
            <div className="referral-stepper">
              {[
                ["collection_pending", "1. Collection"],
                ["in_transit", "2. Cold Chain Transit"],
                ["analyzing", "3. Lab Analysis"],
                ["results_available", "4. Results Issued"]
              ].map(([stg, lbl], idx) => {
                const stagesOrder = ["collection_pending", "in_transit", "analyzing", "results_available"];
                const currentIdx = stagesOrder.indexOf(ref.stage);
                const isCompleted = stagesOrder.indexOf(stg) <= currentIdx;
                const isCurrent = ref.stage === stg;

                return (
                  <div key={stg} className={`stepper-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}>
                    <div className="stepper-circle">
                      {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                    </div>
                    <span>{lbl}</span>
                  </div>
                );
              })}
            </div>

            {/* ESCALATION HISTORY LOG */}
            <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "12px", marginTop: "16px" }}>
              <strong style={{ fontSize: "11px", textTransform: "uppercase", color: "#374151" }}>
                Audit & Escalation History:
              </strong>
              <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {ref.history.map((h, hi) => (
                  <div key={hi} style={{ fontSize: "12px", color: "#4b5563", display: "flex", gap: "8px" }}>
                    <span style={{ color: "#166534", fontWeight: "600", minWidth: "140px" }}>{h.time}</span>
                    <span>{h.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* VET ACTION BAR */}
            {role === "vet" && ref.stage !== "results_available" && (
              <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="primary small"
                  onClick={() => advanceStage(ref.caseId)}
                >
                  Advance Diagnostic Stage: Next Step →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CASES ELIGIBLE FOR LAB REFERRAL */}
      <div className="panel" style={{ marginTop: "24px" }}>
        <div className="panel-head">
          <div>
            <h2>High-Risk Cases Awaiting Lab Referral</h2>
            <p>Cases with triage scores requiring laboratory confirmation.</p>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Animal Tag</th>
                <th>Location</th>
                <th>Symptoms</th>
                <th>Triage Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cases
                .filter((c) => c.status === "High" && !referrals.some((r) => r.caseId === c.id))
                .map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.id}</strong></td>
                    <td>{c.livestockId ? <YellowTag id={c.livestockId} /> : <small>Untagged</small>}</td>
                    <td>{c.village}</td>
                    <td>{(c.symptoms || []).join(", ")}</td>
                    <td><strong style={{ color: "#dc2626" }}>{c.score}%</strong></td>
                    <td>
                      <button
                        type="button"
                        className="primary small"
                        onClick={() => handleCreateReferral(c)}
                      >
                        Initiate Referral
                      </button>
                    </td>
                  </tr>
                ))}
              {cases.filter((c) => c.status === "High" && !referrals.some((r) => r.caseId === c.id)).length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#6b7280", padding: "16px" }}>
                    All high-priority cases have active lab referrals.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
