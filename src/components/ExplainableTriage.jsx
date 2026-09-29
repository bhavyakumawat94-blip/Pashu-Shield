import React from "react";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, Sparkles, Stethoscope, TrendingUp } from "lucide-react";
import { computeTriageBreakdown } from "../lib/triageEngine";

export { computeTriageBreakdown };

export function ExplainableTriageBox({ breakdown }) {
  if (!breakdown) return null;
  const { score, status, factors, villageSignals, animalContext } = breakdown;

  return (
    <div className="triage-box">
      <div className="triage-box-header">
        <div>
          <div className="eyebrow" style={{ color: "#166534" }}>
            DECISION SUPPORT ENGINE
          </div>
          <h3 style={{ margin: "3px 0 0", fontSize: "15px" }}>
            Rule-Based Triage Risk Assessment ({score}%)
          </h3>
        </div>
        <span className={`risk risk-${status.toLowerCase()}`}>
          {status} Priority
        </span>
      </div>

      <p style={{ fontSize: "11px", color: "#647467", margin: "0 0 12px" }}>
        Risk score calculated from transparent clinical rules and field signals. Below are the contributing factors:
      </p>

      {/* Factor Breakdown */}
      <div className="triage-factor-list">
        {factors.map((f, i) => (
          <div key={i} className="triage-factor-item">
            <div className="triage-factor-left">
              <span className={`triage-category category-${f.category}`}>
                {f.category}
              </span>
              <div>
                <strong>{f.name}</strong>
                <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>
                  {f.desc}
                </div>
              </div>
            </div>
            <span className="factor-pts">+{f.points} pts</span>
          </div>
        ))}
      </div>

      {/* Nearby Village Cluster Signals */}
      {villageSignals && villageSignals.length > 0 && (
        <div style={{ marginTop: "14px", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px 12px", borderRadius: "8px", fontSize: "11px", color: "#166534" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold" }}>
            <TrendingUp size={15} />
            <span>Active Village Signal Detected</span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#14532d" }}>
            {villageSignals.length} recent {villageSignals[0].species} report(s) on file in this village. This increases epidemiological clustering priority.
          </p>
        </div>
      )}

      {/* Medical Disclaimer */}
      <div className="triage-disclaimer">
        <Stethoscope size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
        <div>
          <strong>Veterinary Decision-Support Notice:</strong>
          <div>
            This system provides rule-based triage and early warning decision support. It does not provide a definitive disease diagnosis. Final clinical diagnosis and treatment authority rest solely with a certified veterinary officer.
          </div>
        </div>
      </div>
    </div>
  );
}
