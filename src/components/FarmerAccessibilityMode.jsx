import React from "react";
import {
  Mic, HeartPulse, PawPrint, PhoneCall, ShieldCheck,
  BookOpen, Wifi, WifiOff, Bell, ArrowRight, Languages
} from "lucide-react";
import { t } from "../lib/i18n";
import { LanguageSelector } from "./LanguageSelector";

export function FarmerAccessibilityMode({
  setPage,
  isOnline = true,
  pendingCount = 0,
  onOpenAiAssistant
}) {
  const emergencyContacts = [
    { title: "Taluka Veterinary Dispensary", phone: "1800-180-1551", available: "24x7 Toll-Free" },
    { title: "Dr. Sharma (Veterinary Officer)", phone: "+91 98230 12345", available: "Day Shift (8 AM - 6 PM)" }
  ];

  return (
    <div className="farmer-accessibility-container">
      {/* ACCESSIBLE BANNER */}
      <div className="accessibility-header-banner">
        <div>
          <span className="access-chip">♿ {t("accessibilityTitle")}</span>
          <h1>{t("appTitle")}</h1>
          <p style={{ fontSize: "16px", color: "#14532d", margin: "4px 0 0" }}>
            {t("detectProtect")}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <LanguageSelector variant="compact" />
          <div className={`access-status-pill ${isOnline ? "online" : "offline"}`}>
            {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
            <span>{isOnline ? "Connected" : `${pendingCount} Saved Offline`}</span>
          </div>
        </div>
      </div>

      {/* BIG ACCESSIBLE ACTION BUTTONS (2x2 GRID) */}
      <div className="accessibility-action-grid">
        {/* BUTTON 1: VOICE REPORT */}
        <button
          type="button"
          className="access-big-btn btn-voice"
          onClick={() => setPage("report")}
        >
          <div className="access-btn-icon">
            <Mic size={36} />
          </div>
          <div className="access-btn-content">
            <h2>{t("navReportIssue")}</h2>
            <p>बोलकर या फॉर्म से बीमारी बताएं (Voice or Form)</p>
          </div>
          <ArrowRight size={28} className="access-btn-arrow" />
        </button>

        {/* BUTTON 2: MY ANIMALS & RECORDS */}
        <button
          type="button"
          className="access-big-btn btn-animals"
          onClick={() => setPage("animals")}
        >
          <div className="access-btn-icon">
            <PawPrint size={36} />
          </div>
          <div className="access-btn-content">
            <h2>{t("navMyHerd")}</h2>
            <p>12-अंकीय टैग और स्वास्थ्य पासपोर्ट देखें</p>
          </div>
          <ArrowRight size={28} className="access-btn-arrow" />
        </button>

        {/* BUTTON 3: KNOWLEDGE & GUIDES */}
        <button
          type="button"
          className="access-big-btn btn-knowledge"
          onClick={() => setPage("knowledge")}
        >
          <div className="access-btn-icon">
            <BookOpen size={36} />
          </div>
          <div className="access-btn-content">
            <h2>{t("navKnowledgeHub")}</h2>
            <p>रोग रोकथाम, चारा और सरकारी योजनाएं</p>
          </div>
          <ArrowRight size={28} className="access-btn-arrow" />
        </button>

        {/* BUTTON 4: AI HEALTH COMPANION */}
        <button
          type="button"
          className="access-big-btn btn-ai"
          onClick={onOpenAiAssistant}
        >
          <div className="access-btn-icon">
            <ShieldCheck size={36} />
          </div>
          <div className="access-btn-content">
            <h2>पशु एआई सहायक (PASHU AI)</h2>
            <p>सवाल पूछें और तुरंत सलाह पाएं (Ask PASHU AI)</p>
          </div>
          <ArrowRight size={28} className="access-btn-arrow" />
        </button>
      </div>

      {/* QUICK EMERGENCY DOCTOR HELPLINE */}
      <div className="panel accessibility-helpline-panel">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <PhoneCall size={24} style={{ color: "#dc2626" }} />
          <div>
            <h3 style={{ margin: 0, color: "#991b1b" }}>आपातकालीन पशु चिकित्सा हेल्पलाइन (Emergency Contacts)</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#4b5563" }}>
              गंभीर बीमारी या आपातकाल में तुरंत संपर्क करें।
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
          {emergencyContacts.map((c, i) => (
            <div key={i} className="helpline-card">
              <div>
                <strong>{c.title}</strong>
                <span style={{ display: "block", fontSize: "12px", color: "#6b7280" }}>{c.available}</span>
              </div>
              <a href={`tel:${c.phone}`} className="helpline-call-btn">
                <PhoneCall size={16} /> {c.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
