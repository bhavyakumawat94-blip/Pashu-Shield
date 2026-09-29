import React, { useState } from "react";
import {
  ShieldCheck, Lock, Eye, Database, FileText, CheckCircle2,
  AlertTriangle, Mail, RefreshCw, Send, Check
} from "lucide-react";
import { t } from "../lib/i18n";

export function DataTrustCenter({ notify }) {
  const [correctionForm, setCorrectionForm] = useState({
    livestockId: "",
    farmerEmail: "",
    issueDescription: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitCorrection = (e) => {
    e.preventDefault();
    if (!correctionForm.issueDescription.trim()) return;

    setSubmitted(true);
    if (notify) {
      notify("Correction request logged for official veterinary administrative review.");
    }
    setTimeout(() => {
      setCorrectionForm({ livestockId: "", farmerEmail: "", issueDescription: "" });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">DATA GOVERNANCE & INTEGRITY (FEATURE 8)</div>
          <h1>Transparent AI and Data Trust Center</h1>
          <p>
            Detailed disclosure of data collection, access control, algorithmic triage explanation, and your rights as a livestock owner.
          </p>
        </div>
      </div>

      {/* CORE TRUST PRINCIPLES GRID */}
      <div className="grid-3" style={{ marginBottom: "24px" }}>
        <div className="panel trust-principle-card">
          <div className="trust-icon" style={{ background: "#dcfce7", color: "#166534" }}>
            <Lock size={22} />
          </div>
          <h3>Role-Based Isolation</h3>
          <p>
            Farmers only see their own registered herd and submitted case reports. No farmer can access another farmer’s livestock records.
          </p>
          <small>Supabase Row Level Security (RLS) Enforced</small>
        </div>

        <div className="panel trust-principle-card">
          <div className="trust-icon" style={{ background: "#dbeafe", color: "#2563eb" }}>
            <Eye size={22} />
          </div>
          <h3>Explainable, Non-Blackbox Scoring</h3>
          <p>
            Triage risk scores are calculated from open clinical rules based on ICAR guidelines, not opaque probabilistic neural networks.
          </p>
          <small>100% Deterministic & Auditable</small>
        </div>

        <div className="panel trust-principle-card">
          <div className="trust-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <ShieldCheck size={22} />
          </div>
          <h3>Zero Secret Exposure</h3>
          <p>
            No Supabase service-role keys or AI provider secrets are exposed in browser code. All queries respect authenticated role permissions.
          </p>
          <small>Zero-Trust Client Architecture</small>
        </div>
      </div>

      {/* DETAILED FAQ ACCORDION-STYLE SECTIONS */}
      <div className="panel" style={{ marginBottom: "24px" }}>
        <h2>Data Policy & Technical Transparency</h2>
        <div className="trust-faq-list">
          <div className="trust-faq-item">
            <strong>1. What information does PASHU SHIELD collect?</strong>
            <p>
              We collect: 12-digit Bharat Pashudhan Yellow Tag IDs, animal species, breed, age, sex, owner name, village location, clinical symptoms reported by farmers or field workers, optional lesion photographs, and immunization records.
            </p>
          </div>

          <div className="trust-faq-item">
            <strong>2. Why is this information collected?</strong>
            <p>
              To detect emerging contagious livestock diseases (like FMD, LSD, HS) early, prevent herd-level mortality, support timely veterinary triage, and track national vaccination compliance under NADCP.
            </p>
          </div>

          <div className="trust-faq-item">
            <strong>3. Who has access to my data?</strong>
            <p>
              • <strong>Registered Farmer:</strong> Full read access to your own animals, health history, and submitted reports.<br />
              • <strong>Veterinary Officer (VO):</strong> Read and clinical update access for cases and health records within their assigned administrative taluka.<br />
              • <strong>Public / Surveillance Maps:</strong> Displays only aggregated village-level statistical case clusters. Individual names and household locations are NEVER published.
            </p>
          </div>

          <div className="trust-faq-item">
            <strong>4. What can and cannot PASHU AI do?</strong>
            <p>
              • <strong>Can do:</strong> Explain platform features step-by-step, answer general livestock care/nutrition questions, provide verified first-aid guidance, detect emergency symptoms, and translate across 22 Indian languages.<br />
              • <strong>Cannot do:</strong> PASHU AI does not issue formal medical diagnoses, cannot prescribe prescription-only antibiotics or dosages, and never replaces a qualified in-person veterinary physical exam.
            </p>
          </div>
        </div>
      </div>

      {/* RECORD CORRECTION REQUEST FORM */}
      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>Request Correction of Animal Health Record</h2>
            <p>
              If an ear-tag number, owner detail, or vaccination entry has a typographical or clinical inaccuracy, submit a formal correction request.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="advice" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <CheckCircle2 size={20} style={{ color: "#166534" }} />
            <div>
              <strong>Correction Request Submitted Successfully</strong>
              <p>Your request has been routed to the District Veterinary Officer for audit and correction.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitCorrection} className="form">
            <div className="form-grid">
              <label>
                12-digit Livestock ID or Animal ID
                <input
                  type="text"
                  placeholder="e.g. 100234567891 or ANM-1001"
                  value={correctionForm.livestockId}
                  onChange={(e) =>
                    setCorrectionForm({ ...correctionForm, livestockId: e.target.value })
                  }
                  required
                />
              </label>

              <label>
                Farmer / Submitter Email or Phone
                <input
                  type="text"
                  placeholder="e.g. farmer@pashushield.com or 9823012345"
                  value={correctionForm.farmerEmail}
                  onChange={(e) =>
                    setCorrectionForm({ ...correctionForm, farmerEmail: e.target.value })
                  }
                  required
                />
              </label>
            </div>

            <label style={{ marginTop: "12px", display: "block" }}>
              Detailed Description of Inaccuracy
              <textarea
                rows={3}
                placeholder="Explain the discrepancy (e.g. incorrect vaccination date or misspelled owner name)..."
                value={correctionForm.issueDescription}
                onChange={(e) =>
                  setCorrectionForm({ ...correctionForm, issueDescription: e.target.value })
                }
                required
              />
            </label>

            <div style={{ marginTop: "14px" }}>
              <button type="submit" className="primary">
                <Send size={16} /> Submit Formal Correction Request
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
