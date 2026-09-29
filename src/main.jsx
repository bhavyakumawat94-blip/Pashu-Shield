import React, { useMemo, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, AlertTriangle, Bell, CheckCircle2, ClipboardList, CloudOff,
  FileText, HeartPulse, Home, Languages, MapPin, Menu, PawPrint,
  Search, ShieldCheck, Stethoscope, Syringe, TrendingUp, Upload, UserRound,
  Wifi, WifiOff, X, Tag, Bot, Sparkles, BookOpen, Clock, Lock,
  PhoneCall, ArrowRight, Check
} from "lucide-react";
import "./styles.css";
import { loadCases, saveCase, saveCasesLocal } from "./lib/casesDb";
import { supabase } from "./lib/supabaseClient";
import { YellowTag } from "./components/YellowTag";
import { computeTriageBreakdown, ExplainableTriageBox } from "./components/ExplainableTriage";
import { VoiceReporting, extractSymptomKeywords } from "./components/VoiceReporting";
import { AnimalRecords } from "./components/AnimalRecords";
import { OfflineSyncBadge } from "./components/OfflineSyncBadge";
import { LanguageSelector } from "./components/LanguageSelector";
import { PashuAiAssistant, FloatingAiButton } from "./components/PashuAiAssistant";
import { DigitalHealthPassport } from "./components/DigitalHealthPassport";
import { EarlyWarningNetwork } from "./components/EarlyWarningNetwork";
import { RiskTimeline } from "./components/RiskTimeline";
import { ComplianceTracker } from "./components/ComplianceTracker";
import { KnowledgeHub } from "./components/KnowledgeHub";
import { LabReferralUpgrade } from "./components/LabReferralUpgrade";
import { FarmerAccessibilityMode } from "./components/FarmerAccessibilityMode";
import { DataTrustCenter } from "./components/DataTrustCenter";
import {
  t,
  getLanguage,
  subscribeLanguage,
  formatNumber,
  formatDate
} from "./lib/i18n";
import {
  loadAnimals,
  saveAnimal,
  loadHealthRecords,
  saveHealthRecord,
  initialAnimals,
  initialHealthRecords,
  validateLivestockId
} from "./lib/animalsDb";
import {
  savePendingReport,
  getPendingReports,
  syncPendingReports,
  subscribeConnectivity
} from "./lib/offlineSync";

const initialCases = [
  {
    id: "PS-1024",
    village: "Village A",
    species: "Cattle",
    affected: 5,
    mortality: 1,
    score: 82,
    status: "High",
    symptoms: ["Fever", "Nasal discharge", "Reduced appetite"],
    date: "09 Sep 2026",
    animalId: "ANM-1001",
    livestockId: "100234567891",
    voiceLang: "en-IN",
    transcription: "Cow has high fever and thick nasal discharge for past two days, not taking feed."
  },
  {
    id: "PS-1021",
    village: "Village C",
    species: "Cattle",
    affected: 3,
    mortality: 0,
    score: 76,
    status: "High",
    symptoms: ["Fever", "Cough"],
    date: "09 Sep 2026",
    animalId: "ANM-1003",
    livestockId: "100234567893",
    voiceLang: "hi-IN",
    transcription: "गाय को तेज बुखार है और लगातार खांसी आ रही है।"
  },
  {
    id: "PS-1019",
    village: "Village B",
    species: "Buffalo",
    affected: 7,
    mortality: 0,
    score: 54,
    status: "Medium",
    symptoms: ["Reduced appetite", "Lethargy"],
    date: "08 Sep 2026",
    animalId: "ANM-1002",
    livestockId: "100234567892",
    voiceLang: "mr-IN",
    transcription: "म्हशीला चारा खाण्याची इच्छा नाही आणि ती खूप सुस्त दिसत आहे."
  }
];

const scoreCase = ({ fever, nasal, cough, appetite, lethargy, affected, mortality }) => {
  let score = 0;
  if (fever) score += 20;
  if (nasal) score += 16;
  if (cough) score += 12;
  if (appetite) score += 10;
  if (lethargy) score += 8;
  score += Math.min(Number(affected || 0) * 3, 18);
  score += Math.min(Number(mortality || 0) * 12, 24);
  return Math.min(score, 100);
};

function RiskBadge({ status }) {
  return <span className={`risk risk-${status.toLowerCase()}`}>{status}</span>;
}

function Stat({ icon: Icon, label, value, hint }) {
  return (
    <div className="stat-card">
      <div className="stat-icon"><Icon size={20}/></div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        <div className="stat-hint">{hint}</div>
      </div>
    </div>
  );
}

function App() {
  const [role, setRole] = useState("vet");
  const [page, setPage] = useState("dashboard");
  const [cases, setCases] = useState(initialCases);
  const [animals, setAnimals] = useState(initialAnimals);
  const [healthRecords, setHealthRecords] = useState(initialHealthRecords);
  const [dbReady, setDbReady] = useState(false);
  const [session, setSession] = useState(null);

  // Multilingual reactive state
  const [activeLang, setActiveLang] = useState(getLanguage());
  useEffect(() => {
    return subscribeLanguage((newLang) => {
      setActiveLang(newLang);
    });
  }, []);

  // Offline and Auto-Sync State (USP 4)
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [pendingReports, setPendingReports] = useState([]);
  const [syncing, setSyncing] = useState(false);

  // New Production Feature States
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [activePassportAnimal, setActivePassportAnimal] = useState(null);
  const [isFarmerAccessibilityMode, setIsFarmerAccessibilityMode] = useState(false);

  // Supabase Auth and User Role
  useEffect(() => {
    if (!supabase) return;

    const loadUserRole = async (currentSession) => {
      setSession(currentSession);

      if (!currentSession) {
        setRole("vet");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentSession.user.id)
        .single();

      if (!error && data?.role) {
        setRole(data.role);
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      loadUserRole(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        loadUserRole(currentSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selectedCase, setSelectedCase] = useState(initialCases[0]);
  const [sidebar, setSidebar] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  // Load cases, animals, and health records
  useEffect(() => {
    let cancelled = false;

    // Load cases
    loadCases(initialCases)
      .then((saved) => {
        if (!cancelled && saved.length) {
          setCases(saved);
          setSelectedCase(saved[0]);
        }
        if (!cancelled) setDbReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          saveCasesLocal(cases);
          setDbReady(true);
        }
      });

    // Load digital animal profiles (USP 1 & 2)
    loadAnimals().then((savedAnimals) => {
      if (!cancelled && savedAnimals.length) {
        setAnimals(savedAnimals);
      }
    });

    // Load health records (USP 1)
    loadHealthRecords().then((savedRecords) => {
      if (!cancelled && savedRecords.length) {
        setHealthRecords(savedRecords);
      }
    });

    // Load pending offline reports (USP 4)
    getPendingReports().then((pending) => {
      if (!cancelled) setPendingReports(pending);
    });

    // Connectivity listener for auto-sync (USP 4)
    const unsubConnectivity = subscribeConnectivity((online) => {
      setIsOnline(online);
      if (online && !isSimulatedOffline) {
        triggerAutoSync();
      }
    });

    return () => {
      cancelled = true;
      unsubConnectivity();
    };
  }, []);

  // Sync cases to local storage whenever they change
  useEffect(() => {
    if (dbReady) saveCasesLocal(cases);
  }, [cases, dbReady]);

  // Auto-sync function (USP 4)
  const triggerAutoSync = async () => {
    setSyncing(true);
    try {
      const { syncedCount, failedCount } = await syncPendingReports(saveCase);
      if (syncedCount > 0) {
        notify(`Auto-sync complete: ${syncedCount} offline report(s) synchronized to cloud database.`);
        const updatedCases = await loadCases(cases);
        setCases(updatedCases);
      }
      const remaining = await getPendingReports();
      setPendingReports(remaining);
    } catch (err) {
      console.error("Auto-sync failed:", err);
    } finally {
      setSyncing(false);
    }
  };

  const high = cases.filter((c) => c.status === "High").length;
  const medium = cases.filter((c) => c.status === "Medium").length;
  const low = cases.filter((c) => c.status === "Low").length;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!supabase) {
      const isVet = email.toLowerCase().includes("vet");
      setRole(isVet ? "vet" : "farmer");
      setPage(isVet ? "dashboard" : "farmer");
      setSession({ user: { id: isVet ? "vet-evaluator" : "farmer-evaluator", email } });
      notify(`Signed in as ${isVet ? "Veterinary Officer (Dr. Sharma)" : "Farmer / Field Worker"}`);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError(error.message);
    }
  };

  // Upgraded Navigation incorporating all USPs and features
  const nav = role === "vet" ? [
    ["dashboard", t("navDashboard"), Home],
    ["cases", t("navCases"), ClipboardList],
    ["animals", t("navAnimals"), PawPrint],
    ["earlyWarning", t("navEarlyWarning"), AlertTriangle],
    ["compliance", t("navCompliance"), Syringe],
    ["timeline", "Risk Timeline", Activity],
    ["map", t("navMap"), MapPin],
    ["forecast", t("navForecast"), TrendingUp],
    ["lab", t("navLab"), Stethoscope],
    ["alerts", t("navAlerts"), Bell],
    ["trust", t("navDataTrust"), ShieldCheck]
  ] : [
    ["farmer", isFarmerAccessibilityMode ? t("navAccessibility") : t("navMyDashboard"), Home],
    ["report", t("navReportIssue"), HeartPulse],
    ["animals", t("navMyHerd"), PawPrint],
    ["compliance", t("navCompliance"), Syringe],
    ["knowledge", t("navKnowledgeHub"), BookOpen],
    ["advisories", t("navAdvisories"), Bell],
    ["accessMode", isFarmerAccessibilityMode ? "Standard Dashboard" : t("navAccessibility"), Sparkles],
    ["trust", t("navDataTrust"), ShieldCheck]
  ];

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  const switchRole = () => {
    const next = role === "vet" ? "farmer" : "vet";
    setRole(next);
    setPage(next === "vet" ? "dashboard" : "farmer");
  };

  // Case submission handler supporting offline queueing and auto-sync (USP 4)
  const handleCaseSubmit = async (newCase, newAnimalToRegister = null) => {
    if (newAnimalToRegister) {
      try {
        const savedAnm = await saveAnimal(newAnimalToRegister, animals);
        setAnimals((prev) => [savedAnm, ...prev.filter((x) => x.id !== savedAnm.id)]);
        newCase.animalId = savedAnm.id;
        newCase.livestockId = savedAnm.livestockId;
      } catch (e) {
        console.warn("Animal save error:", e);
      }
    }

    const effectivelyOnline = isOnline && !isSimulatedOffline;

    if (!effectivelyOnline) {
      try {
        const queued = await savePendingReport(newCase);
        const pendingList = await getPendingReports();
        setPendingReports(pendingList);
        setCases((prev) => [queued, ...prev.filter((x) => x.id !== queued.id)]);
        setSelectedCase(queued);
        setPage("cases");
        setRole("vet");
        notify("📡 Report saved locally in offline storage. It will auto-sync upon reconnection.");
      } catch (err) {
        console.error("Offline save failed:", err);
        notify("Error saving report offline.");
      }
      return;
    }

    try {
      const saved = await saveCase(newCase);
      setCases((prev) => [saved, ...prev.filter((x) => x.id !== saved.id)]);
      setSelectedCase(saved);
      setPage("cases");
      setRole("vet");
      notify("Report saved to database and escalated to veterinary dashboard.");
    } catch (err) {
      const queued = await savePendingReport(newCase);
      const pendingList = await getPendingReports();
      setPendingReports(pendingList);
      setCases((prev) => [queued, ...prev.filter((x) => x.id !== queued.id)]);
      setSelectedCase(queued);
      setPage("cases");
      setRole("vet");
      notify("Saved to local offline queue (Cloud sync pending).");
    }
  };

  // Handlers for Animal Records and Health Events (USP 1 & 2)
  const handleSaveAnimal = async (animalData) => {
    const saved = await saveAnimal(animalData, animals);
    setAnimals((prev) => [saved, ...prev.filter((x) => x.id !== saved.id)]);
    return saved;
  };

  const handleSaveHealthRecord = async (recordData) => {
    const saved = await saveHealthRecord(recordData);
    setHealthRecords((prev) => [saved, ...prev.filter((x) => x.id !== saved.id)]);
    return saved;
  };

  // Sign-in / Landing Page with Multilingual Selector
  if (!session) {
    const fillDemo = (demoEmail) => {
      setEmail(demoEmail);
      setPassword("12345678");
      setLoginError("");
    };

    return (
      <div className="login-page">
        {/* HEADER WITH LANGUAGE SELECTOR */}
        <header className="landing-header">
          <div className="landing-brand">
            <div className="landing-logo">
              <ShieldCheck size={30} />
            </div>
            <div>
              <strong>{t("appTitle")}</strong>
              <span>{t("appSubtitle")}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <LanguageSelector variant="landing" />
            <div className="landing-status">
              <span className="status-dot"></span>
              {t("crumbStage")}
            </div>
          </div>
        </header>

        {/* HERO + LOGIN */}
        <div className="landing-grid">
          {/* LEFT */}
          <section className="landing-hero">
            <div className="hero-badge">
              <Activity size={16} />
              SMART LIVESTOCK SURVEILLANCE
            </div>

            <h1>
              {t("detectProtect").split(".")[0]}.
              <br />
              <span>{t("detectProtect").split(".")[1] || "Protect Faster."}</span>
            </h1>

            <p className="hero-text">
              {t("landingHeroText")}
            </p>

            <div className="hero-features">
              <div>
                <div className="hero-feature-icon">
                  <HeartPulse size={21} />
                </div>
                <strong>Digital Animal Passport</strong>
                <span>12-digit Bharat Pashudhan tag & history</span>
              </div>

              <div>
                <div className="hero-feature-icon">
                  <TrendingUp size={21} />
                </div>
                <strong>Explainable Triage</strong>
                <span>Transparent decision support</span>
              </div>

              <div>
                <div className="hero-feature-icon">
                  <Stethoscope size={21} />
                </div>
                <strong>Offline & Voice Sync</strong>
                <span>22 Indian Languages + AI Companion</span>
              </div>
            </div>

            {/* VISUAL */}
            <div className="livestock-card">
              <div className="livestock-glow"></div>
              <div className="livestock-content">
                <div className="animal-icons">
                  <span>🐄</span>
                  <span>🐃</span>
                  <span>🐐</span>
                </div>
                <div>
                  <strong>Healthy Livestock</strong>
                  <p>Stronger herds • Safer communities</p>
                </div>
              </div>
              <div className="surveillance-ring">
                <ShieldCheck size={34} />
                <span>MONITOR</span>
              </div>
              <div className="grass">🌿 🌾 🌿 🌾 🌿</div>
            </div>

            <div className="hero-bottom">
              <span>DETECT</span>
              <b>→</b>
              <span>ASSESS</span>
              <b>→</b>
              <span>CONNECT</span>
              <b>→</b>
              <span>RESPOND</span>
            </div>
          </section>

          {/* LOGIN */}
          <section className="landing-login">
            <div className="login-top">
              <div className="login-shield">
                <ShieldCheck size={27} />
              </div>
              <span className="login-welcome">{t("welcomeBack")}</span>
              <h2>{t("signInToApp")}</h2>
              <p>{t("accessDashboard")}</p>
            </div>

            <form onSubmit={handleLogin}>
              <label className="login-label">{t("emailAddress")}</label>
              <div className="landing-input">
                <UserRound size={18} />
                <input
                  type="email"
                  placeholder={t("enterEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <label className="login-label">{t("password")}</label>
              <div className="landing-input">
                <ShieldCheck size={18} />
                <input
                  type="password"
                  placeholder={t("enterPassword")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {loginError && (
                <div className="login-error">
                  <AlertTriangle size={16} />
                  {loginError}
                </div>
              )}

              <button type="submit" className="landing-signin">
                {t("signInBtn")}
                <span>→</span>
              </button>
            </form>

            <div className="login-secure">
              <CheckCircle2 size={15} />
              {t("secureAccess")}
            </div>
          </section>
        </div>

        {/* EVALUATOR CREDENTIALS */}
        <section className="evaluator-section">
          <div className="evaluator-heading">
            <div className="evaluator-icon">
              <ClipboardList size={23} />
            </div>
            <div>
              <h3>
                {t("demoCredentials")}{" "}
                <span>{t("forEvaluators")}</span>
              </h3>
              <p>{t("evaluatorNotice")}</p>
            </div>
          </div>

          <div className="credential-grid">
            {/* FARMER */}
            <div className="credential-box farmer-credential">
              <div className="credential-role-icon">
                <PawPrint size={25} />
              </div>
              <div className="credential-details">
                <div className="credential-title">
                  <div>
                    <strong>{t("farmerFieldWorker")}</strong>
                    <span>Report health issues, view herd & sync offline</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillDemo("farmer@pashushield.com")}
                  >
                    {t("useAccount")}
                  </button>
                </div>
                <div className="credential-line">
                  <span>Email</span>
                  <strong>farmer@pashushield.com</strong>
                </div>
                <div className="credential-line">
                  <span>Password</span>
                  <strong>12345678</strong>
                </div>
              </div>
            </div>

            {/* VET */}
            <div className="credential-box vet-credential">
              <div className="credential-role-icon">
                <Stethoscope size={25} />
              </div>
              <div className="credential-details">
                <div className="credential-title">
                  <div>
                    <strong>{t("vetOfficer")}</strong>
                    <span>Monitor triage, animal records & lab referrals</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillDemo("vet@pashushield.com")}
                  >
                    {t("useAccount")}
                  </button>
                </div>
                <div className="credential-line">
                  <span>Email</span>
                  <strong>vet@pashushield.com</strong>
                </div>
                <div className="credential-line">
                  <span>Password</span>
                  <strong>12345678</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="evaluator-footer">
            <ShieldCheck size={16} />
            <span>{t("demoTagline")}</span>
          </div>
        </section>
      </div>
    );
  }

  // Authenticated App Shell
  const effectivelyOnline = isOnline && !isSimulatedOffline;

  return (
    <div className="app">
      <aside className={`sidebar ${sidebar ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={25} />
          </div>
          <div>
            <strong>{t("appTitle")}</strong>
            <small>{t("appSubtitle")}</small>
          </div>
        </div>

        <div className="role-pill">
          <span>{role === "vet" ? t("vetOfficer") : t("farmerFieldWorker")}</span>
          <button onClick={switchRole}>{t("switchRole")}</button>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          {t("signOut")}
        </button>

        <nav>
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              className={page === id ? "nav-active" : ""}
              onClick={() => {
                if (id === "accessMode") {
                  setIsFarmerAccessibilityMode((prev) => !prev);
                  setPage("farmer");
                } else {
                  setPage(id);
                }
                setSidebar(false);
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* Live Offline / Sync Indicator in Sidebar (USP 4) */}
        <div className="offline" style={{ color: effectivelyOnline ? "#bde2c8" : "#fca5a5" }}>
          {effectivelyOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
          <span>
            {effectivelyOnline ? t("onlineAutoSync") : t("offlineStorage")}
          </span>
          {pendingReports.length > 0 && (
            <span className="sync-counter-chip">
              {pendingReports.length}
            </span>
          )}
        </div>

        <div className="side-note">
          <CloudOff size={16} />
          <span>Offline reporting ready for low-connectivity rural belts</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="menu" onClick={() => setSidebar(!sidebar)}>
            <Menu />
          </button>
          <div className="crumb">
            {t("crumbStage")} {dbReady ? `• ${t("cloudReady")}` : `• ${t("connectingData")}`}
          </div>

          <div className="top-actions">
            {/* Multilingual Selector in Topbar */}
            <LanguageSelector variant="topbar" />

            {/* PASHU AI Trigger Button in Topbar */}
            <button
              type="button"
              className="secondary small"
              onClick={() => setShowAiAssistant(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f0fdf4", color: "#166534", borderColor: "#86efac" }}
              title="Open PASHU AI Assistant"
            >
              <Bot size={16} />
              <span>PASHU AI</span>
            </button>

            {/* Live Online/Offline Status Pill & Auto-Sync Trigger (USP 4) */}
            <OfflineSyncBadge
              isOnline={isOnline}
              isSimulatedOffline={isSimulatedOffline}
              pendingCount={pendingReports.length}
              syncing={syncing}
              onSync={triggerAutoSync}
              onToggleSimulatedOffline={() => {
                setIsSimulatedOffline((prev) => {
                  const next = !prev;
                  notify(next ? "📡 Evaluator mode: Simulated offline. New reports will queue in IndexedDB." : "🌐 Simulated online restored. Auto-sync triggered.");
                  return next;
                });
              }}
            />

            <button
              className="icon-btn"
              onClick={() => notify(pendingReports.length ? `${pendingReports.length} offline report(s) queued for sync.` : "All field systems operational. No critical outbreaks.")}
            >
              <Bell size={19} />
            </button>

            <div className="user">
              <div className="avatar">
                <UserRound size={17} />
              </div>
              <span>{role === "vet" ? t("drSharma") : t("farmerAccount")}</span>
            </div>
          </div>
        </header>

        <div className="content">
          {/* Veterinary Views */}
          {role === "vet" && page === "dashboard" && (
            <VetDashboard
              cases={cases}
              animalsCount={animals.length}
              high={high}
              medium={medium}
              low={low}
              setPage={setPage}
              setSelectedCase={setSelectedCase}
            />
          )}

          {role === "vet" && page === "cases" && (
            <Cases
              cases={cases}
              animals={animals}
              setSelectedCase={setSelectedCase}
              setPage={setPage}
              onViewPassport={(anm) => setActivePassportAnimal(anm)}
            />
          )}

          {/* Animal Health Records (USP 1 & 2) - Accessible to both Vet and Farmer */}
          {page === "animals" && (
            <AnimalRecords
              animals={animals}
              healthRecords={healthRecords}
              cases={cases}
              role={role}
              onSaveAnimal={handleSaveAnimal}
              onSaveHealthRecord={handleSaveHealthRecord}
              onOpenPassport={(anm) => setActivePassportAnimal(anm)}
              notify={notify}
            />
          )}

          {/* Exclusive USP Views */}
          {role === "vet" && page === "earlyWarning" && (
            <EarlyWarningNetwork cases={cases} onNotify={notify} />
          )}

          {page === "compliance" && (
            <ComplianceTracker
              animals={animals}
              healthRecords={healthRecords}
              role={role}
              onSaveHealthRecord={handleSaveHealthRecord}
              notify={notify}
            />
          )}

          {page === "timeline" && (
            <RiskTimeline
              animal={animals[0]}
              animals={animals}
              cases={cases}
              healthRecords={healthRecords}
            />
          )}

          {page === "knowledge" && (
            <KnowledgeHub onNotify={notify} />
          )}

          {role === "vet" && page === "map" && <RiskMap cases={cases} />}
          {role === "vet" && page === "forecast" && <Forecast />}

          {/* Lab Referral Upgrade (Feature 6) */}
          {role === "vet" && page === "lab" && (
            <LabReferralUpgrade cases={cases} role={role} notify={notify} />
          )}

          {role === "vet" && page === "alerts" && <Alerts notify={notify} />}

          {/* Data Trust Center (Feature 8) */}
          {page === "trust" && <DataTrustCenter notify={notify} />}

          {/* Farmer Views */}
          {role === "farmer" && page === "farmer" && (
            isFarmerAccessibilityMode ? (
              <FarmerAccessibilityMode
                setPage={setPage}
                isOnline={effectivelyOnline}
                pendingCount={pendingReports.length}
                onOpenAiAssistant={() => setShowAiAssistant(true)}
              />
            ) : (
              <FarmerHome
                setPage={setPage}
                animalsCount={animals.length}
                pendingCount={pendingReports.length}
                onOpenAiAssistant={() => setShowAiAssistant(true)}
                onToggleAccessibility={() => setIsFarmerAccessibilityMode(true)}
              />
            )
          )}

          {role === "farmer" && page === "report" && (
            <ReportForm
              animals={animals}
              cases={cases}
              isOnline={effectivelyOnline}
              onSubmit={handleCaseSubmit}
            />
          )}

          {role === "farmer" && page === "advisories" && (
            <SimplePage title={t("navAdvisories")} icon={Bell}>
              <Advisories />
            </SimplePage>
          )}
        </div>

        {/* TOAST NOTIFICATION */}
        {toast && (
          <div className="toast">
            <CheckCircle2 size={17} />
            {toast}
          </div>
        )}

        {/* DIGITAL HEALTH PASSPORT MODAL (USP 1) */}
        {activePassportAnimal && (
          <DigitalHealthPassport
            animal={activePassportAnimal}
            healthRecords={healthRecords}
            cases={cases}
            role={role}
            onClose={() => setActivePassportAnimal(null)}
            onAddRecord={handleSaveHealthRecord}
            notify={notify}
          />
        )}

        {/* PASHU AI ASSISTANT MODAL (FEATURE 2) */}
        <PashuAiAssistant
          isOpen={showAiAssistant}
          onClose={() => setShowAiAssistant(false)}
        />

        {/* PASHU AI FLOATING BUTTON */}
        {!showAiAssistant && (
          <FloatingAiButton onClick={() => setShowAiAssistant(true)} />
        )}
      </main>
    </div>
  );
}

// Veterinary Dashboard Overview
function VetDashboard({ cases, animalsCount, high, medium, low, setPage, setSelectedCase }) {
  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">VETERINARY DECISION DASHBOARD</div>
          <h1>{t("livestockHealthOverview")}</h1>
          <p>{t("prioritizeSuspectedCases")}</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="secondary" onClick={() => setPage("animals")}>
            <PawPrint size={17} /> {t("navAnimals")} ({animalsCount})
          </button>
          <button className="secondary" onClick={() => setPage("earlyWarning")}>
            <AlertTriangle size={17} /> Early Warning Network
          </button>
          <button className="primary" onClick={() => setPage("cases")}>
            <ClipboardList size={17} /> {t("viewPriorityCases")}
          </button>
        </div>
      </div>

      <div className="stats">
        <Stat icon={Activity} label={t("activeCases")} value={cases.length} hint={t("acrossVillages")} />
        <Stat icon={AlertTriangle} label={t("highRisk")} value={high} hint={t("immediateReview")} />
        <Stat icon={TrendingUp} label={t("mediumRisk")} value={medium} hint={t("monitorClosely")} />
        <Stat icon={CheckCircle2} label={t("lowRisk")} value={low} hint={t("routineFollowup")} />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <h2>🔴 {t("highRisk")} {t("navCases")}</h2>
            <button className="text-btn" onClick={() => setPage("cases")}>
              View all
            </button>
          </div>
          {cases.filter((c) => c.status === "High").map((c) => (
            <CaseRow
              key={c.id}
              c={c}
              onClick={() => {
                setSelectedCase(c);
                setPage("cases");
              }}
            />
          ))}
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>{t("riskDistribution")}</h2>
          </div>
          <div className="donut-wrap">
            <div className="donut">
              <div>
                <strong>{cases.length}</strong>
                <span>{t("totalCases")}</span>
              </div>
            </div>
            <div className="legend">
              <span><i className="dot high"></i>{t("highRisk")} <b>{high}</b></span>
              <span><i className="dot medium"></i>{t("mediumRisk")} <b>{medium}</b></span>
              <span><i className="dot low"></i>{t("lowRisk")} <b>{low}</b></span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel map-preview">
        <div className="panel-head">
          <div>
            <h2>{t("navMap")}</h2>
            <p>Cluster view of reported livestock health cases.</p>
          </div>
          <button className="secondary" onClick={() => setPage("map")}>
            <MapPin size={16} /> Open map
          </button>
        </div>
        <MapGraphic cases={cases} />
      </div>
    </section>
  );
}

function CaseRow({ c, onClick }) {
  return (
    <button className="case-row" onClick={onClick}>
      <div className="case-icon"><HeartPulse size={18} /></div>
      <div className="case-main">
        <strong>{c.id} • {c.village}</strong>
        <span>
          {c.species} • {c.affected} {t("affected")} • {c.mortality} {t("mortality")}
          {c.livestockId && ` • Tag: ${c.livestockId}`}
        </span>
      </div>
      <div className="case-risk">
        <RiskBadge status={c.status} />
        <b>{c.score}%</b>
      </div>
    </button>
  );
}

// Case Management & Priority Cases (USPs 1, 2, 3, 4)
function Cases({ cases, animals, setPage, onViewPassport }) {
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || null);
  const [query, setQuery] = useState("");

  const filtered = cases.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.village.toLowerCase().includes(q) ||
      c.species.toLowerCase().includes(q) ||
      (c.livestockId && c.livestockId.includes(q)) ||
      (c.animalId && c.animalId.toLowerCase().includes(q))
    );
  });

  const selectedCase =
    cases.find((c) => c.id === selectedCaseId) || filtered[0] || cases[0] || null;

  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">CASE MANAGEMENT (USPs 1, 2 & 3)</div>
          <h1>{t("navCases")}</h1>
          <p>Review field reports, 12-digit tag history, explainable triage risk factors, and escalate cases.</p>
        </div>
      </div>

      <div className="searchbar">
        <Search size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
        />
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>{t("caseId")}</th>
              <th>{t("animalIdHeader")}</th>
              <th>{t("location")}</th>
              <th>{t("animals")}</th>
              <th>{t("symptoms")}</th>
              <th>{t("triageRisk")}</th>
              <th>{t("status")}</th>
              <th>{t("action")}</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                style={{
                  cursor: "pointer",
                  background:
                    selectedCaseId === c.id
                      ? "rgba(34, 197, 94, 0.08)"
                      : undefined,
                }}
              >
                <td>
                  <strong>{c.id}</strong>
                  <small>{c.date}</small>
                </td>

                <td>
                  {c.livestockId ? (
                    <YellowTag id={c.livestockId} />
                  ) : (
                    <span style={{ fontSize: "10px", color: "#9ca3af" }}>
                      {t("untagged")}
                    </span>
                  )}
                  {c.animalId && (
                    <small style={{ color: "#166534", fontWeight: "600" }}>
                      {c.animalId}
                    </small>
                  )}
                </td>

                <td>{c.village}</td>

                <td>
                  {c.affected} {t("affected")}
                  <br />
                  {c.mortality} {t("mortality")}
                </td>

                <td>{c.symptoms.join(", ")}</td>

                <td>
                  <RiskBadge status={c.status} />
                  <strong className="score">{c.score}%</strong>
                </td>

                <td>
                  {c.syncStatus === "pending" ? (
                    <span className="sync-counter-chip">Queued Offline</span>
                  ) : (
                    <span style={{ color: "#16a34a", fontSize: "10px", fontWeight: "700" }}>
                      ✓ Synced
                    </span>
                  )}
                </td>

                <td>
                  <button
                    className="secondary small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCaseId(c.id);
                    }}
                  >
                    {t("review")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCase && (
        <CaseDetail
          c={selectedCase}
          allCases={cases}
          animal={animals.find((a) => a.id === selectedCase.animalId || (selectedCase.livestockId && a.livestockId === selectedCase.livestockId))}
          onViewPassport={onViewPassport}
        />
      )}
    </section>
  );
}

// Case Detail View featuring 12-digit Livestock ID, Voice transcription, and Explainable Triage (USPs 2, 3, 5)
function CaseDetail({ c, allCases, animal, onViewPassport }) {
  if (!c) return null;

  const triageBreakdown = computeTriageBreakdown({
    form: {
      fever: c.symptoms?.includes("Fever"),
      nasal: c.symptoms?.includes("Nasal discharge"),
      cough: c.symptoms?.includes("Cough"),
      appetite: c.symptoms?.includes("Reduced appetite"),
      lethargy: c.symptoms?.includes("Lethargy"),
      affected: c.affected,
      mortality: c.mortality,
      village: c.village,
      species: c.species
    },
    cases: allCases.filter((x) => x.id !== c.id),
    animal
  });

  return (
    <div className="panel detail">
      {/* Farmer Voice Audio & Transcription (USP 5) */}
      {(c.voiceUrl || c.transcription) && (
        <div className="advice" style={{ background: "#f0fdf4", borderColor: "#bbf7d0", marginBottom: "16px" }}>
          <div style={{ width: "100%" }}>
            <strong style={{ display: "flex", alignItems: "center", gap: "6px", color: "#166534" }}>
              🎙️ {t("farmerVoiceTranscription")} (USP 5)
            </strong>
            {c.voiceUrl && (
              <audio controls src={c.voiceUrl} style={{ width: "100%", height: "36px", marginTop: "8px" }} />
            )}
            {c.transcription && (
              <p style={{ marginTop: "8px", fontStyle: "italic", color: "#14532d", fontSize: "12px", background: "white", padding: "8px 12px", borderRadius: "6px", border: "1px solid #dcfce7" }}>
                "{c.transcription}"
                <span style={{ display: "block", fontSize: "10px", color: "#6b7280", marginTop: "3px", fontStyle: "normal" }}>
                  {t("intakeLanguage")}: {c.voiceLang || "en-IN"}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Case Header with 12-digit Yellow Tag (USP 2) */}
      <div className="panel-head">
        <div>
          <div className="eyebrow">{t("selectedCaseDetails")}</div>
          <h2>{c.id} • {c.village}</h2>
          <div style={{ marginTop: "6px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            {c.livestockId && <YellowTag id={c.livestockId} />}
            {animal && (
              <button
                type="button"
                className="secondary small"
                onClick={() => onViewPassport && onViewPassport(animal)}
                style={{ padding: "3px 8px", fontSize: "11px" }}
              >
                📜 Open Health Passport: {animal.nameTag}
              </button>
            )}
          </div>
        </div>
        <RiskBadge status={c.status} />
      </div>

      <div className="detail-grid">
        <div>
          <span>{t("triageRiskScore")}</span>
          <strong className="big-score">{c.score}%</strong>
        </div>
        <div>
          <span>{t("species")}</span>
          <strong>{c.species}</strong>
        </div>
        <div>
          <span>{t("morbidity")}</span>
          <strong>{c.affected} {t("affected")}</strong>
        </div>
        <div>
          <span>{t("mortality")}</span>
          <strong>{c.mortality} dead</strong>
        </div>
      </div>

      {/* Explainable Decision Support (USP 3) */}
      <ExplainableTriageBox breakdown={triageBreakdown} />

      <div className="advice" style={{ marginTop: "16px" }}>
        <Stethoscope size={19} />
        <div>
          <strong>{t("vetRecommendation")}</strong>
          <p>
            {t("vetRecommendationText", { tag: c.livestockId ? `Livestock ID ${c.livestockId}` : "monitored herd" })}
          </p>
        </div>
      </div>
    </div>
  );
}

function RiskMap({ cases }) {
  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">GEO-SPATIAL SURVEILLANCE</div>
          <h1>{t("navMap")}</h1>
          <p>Visualize reported cases and emerging clusters.</p>
        </div>
      </div>
      <div className="panel">
        <MapGraphic cases={cases} large />
      </div>
    </section>
  );
}

function MapGraphic({ cases, large = false }) {
  const points = [[22, 38], [34, 55], [46, 28], [55, 60], [68, 42], [77, 67], [82, 28], [29, 76], [60, 18]];
  return (
    <div className={`map ${large ? "large" : ""}`}>
      <div className="map-label">DEMO SURVEILLANCE MAP</div>
      <div className="roads"></div>
      {points.slice(0, Math.max(5, cases.length + 2)).map((p, i) => (
        <div
          key={i}
          className={`map-pin ${i < 2 ? "pin-high" : i < 4 ? "pin-medium" : "pin-low"}`}
          style={{ left: `${p[0]}%`, top: `${p[1]}%` }}
          title={cases[i]?.village || "Monitored area"}
        >
          <MapPin size={25} />
        </div>
      ))}
      <div className="map-legend">
        <span><i className="dot high"></i>{t("highRisk")}</span>
        <span><i className="dot medium"></i>{t("mediumRisk")}</span>
        <span><i className="dot low"></i>{t("lowRisk")}</span>
      </div>
    </div>
  );
}

function Forecast() {
  const bars = [38, 46, 43, 55, 62, 68, 79, 73, 88, 92];
  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">DISEASE FORECASTING</div>
          <h1>{t("navForecast")}</h1>
          <p>Predictive signal based on historical cases, seasonality and reported symptoms.</p>
        </div>
      </div>
      <div className="grid-2">
        <div className="panel chart-panel">
          <div className="panel-head">
            <h2>Reported risk index</h2>
            <span className="trend-up">↑ 18% trend</span>
          </div>
          <div className="bars">
            {bars.map((v, i) => (
              <div key={i} className="bar-col">
                <div className="bar" style={{ height: `${v}%` }}></div>
                <small>W{i + 1}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>Early-warning interpretation</h2>
          <div className="forecast-box">
            <TrendingUp size={22} />
            <div>
              <strong>Elevated emerging risk</strong>
              <p>
                Recent reports show increasing risk signals. Veterinary teams should review high-priority clusters and verify suspected cases.
              </p>
            </div>
          </div>
          <div className="note">
            Surveillance note: Forecasting combines rule-based clinical metrics, seasonal climate trends, and village case clusters.
          </div>
        </div>
      </div>
    </section>
  );
}

function Alerts({ notify }) {
  const alerts = [
    ["High-risk cluster detected", "Village A has multiple cattle reports requiring veterinary review.", "High Risk"],
    ["Preventive advisory", "Review FMD booster vaccination and biosecurity for monitored herds.", "Advisory"],
    ["Offline sync status", "Offline reports successfully synchronized to cloud database.", "System"]
  ];
  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">COMMUNICATION</div>
          <h1>{t("navAlerts")}</h1>
          <p>Keep farmers and veterinary officers informed with actionable advisories.</p>
        </div>
        <button className="secondary" onClick={() => notify("Multilingual advisory broadcast prepared.")}>
          <Languages size={16} /> Broadcast Advisory
        </button>
      </div>
      <div className="alert-list">
        {alerts.map((a, i) => (
          <div className="panel alert-card" key={i}>
            <div className="alert-icon"><Bell size={18} /></div>
            <div>
              <strong>{a[0]}</strong>
              <p>{a[1]}</p>
              <span>{a[2]} • Today</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FarmerHome({ setPage, animalsCount, pendingCount, onOpenAiAssistant, onToggleAccessibility }) {
  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">FARMER / FIELD WORKER DASHBOARD</div>
          <h1>Namaste 👋</h1>
          <p>Digital livestock health monitoring, offline reporting, and veterinary guidance.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="secondary" onClick={onToggleAccessibility}>
            ♿ Farmer Accessible Mode
          </button>
          <button className="primary" onClick={() => setPage("report")}>
            <HeartPulse size={17} /> {t("navReportIssue")}
          </button>
        </div>
      </div>

      <div className="farmer-banner">
        <div>
          <ShieldCheck size={30} />
          <div>
            <h2>{t("detectProtect")}</h2>
            <p>
              Report via multilingual voice (22 Indian Languages) or form. Works completely offline with automatic sync.
            </p>
          </div>
        </div>
        <div className="sync-chip">
          <Wifi size={15} />
          <span>{pendingCount > 0 ? `${pendingCount} Offline Queued` : "Cloud Synced"}</span>
        </div>
      </div>

      <div className="stats">
        <Stat icon={PawPrint} label={t("registeredAnimals")} value={animalsCount} hint={t("withTagRegistry")} />
        <Stat icon={Syringe} label={t("vaccinationsLogged")} value="6" hint={t("fmdBrucellosis")} />
        <Stat icon={Bell} label={t("activeAdvisories")} value="2" hint={t("reviewGuidelines")} />
        <Stat icon={Activity} label={t("pendingSync")} value={pendingCount} hint={t("queuedInIndexedDb")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", marginTop: "20px" }}>
        <button className="secondary" onClick={() => setPage("animals")} style={{ padding: "14px", justifyContent: "center" }}>
          <PawPrint size={18} /> {t("navMyHerd")} →
        </button>
        <button className="secondary" onClick={() => setPage("compliance")} style={{ padding: "14px", justifyContent: "center" }}>
          <Syringe size={18} /> {t("navCompliance")} →
        </button>
        <button className="secondary" onClick={() => setPage("knowledge")} style={{ padding: "14px", justifyContent: "center" }}>
          <BookOpen size={18} /> {t("navKnowledgeHub")} →
        </button>
        <button className="primary" onClick={onOpenAiAssistant} style={{ padding: "14px", justifyContent: "center" }}>
          <Bot size={18} /> Ask PASHU AI Assistant →
        </button>
      </div>
    </section>
  );
}

// Upgraded ReportForm with Animal Selection, 12-digit ID, Multilingual Voice, and Explainable Triage (USPs 1-5)
function ReportForm({ animals, cases, isOnline, onSubmit }) {
  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  const [newAnimalName, setNewAnimalName] = useState("");
  const [newLivestockId, setNewLivestockId] = useState("");
  const [idValidation, setIdValidation] = useState({ valid: true });

  const [form, setForm] = useState({
    species: "Cattle",
    village: "Village A",
    affected: 1,
    mortality: 0,
    fever: true,
    nasal: true,
    cough: false,
    appetite: true,
    lethargy: false
  });

  const [voiceAudio, setVoiceAudio] = useState(null);
  const [voiceText, setVoiceText] = useState("");
  const [voiceLang, setVoiceLang] = useState("en-IN");
  const [triageResult, setTriageResult] = useState(null);

  const update = (k, v) => setForm({ ...form, [k]: v });

  const handleAnimalSelect = (id) => {
    setSelectedAnimalId(id);
    if (id) {
      const selectedAnm = animals.find((a) => a.id === id);
      if (selectedAnm) {
        setForm((prev) => ({
          ...prev,
          species: selectedAnm.species,
          village: selectedAnm.village
        }));
      }
    }
  };

  const handleVoiceText = (text, lang) => {
    setVoiceText(text);
    setVoiceLang(lang);

    const detected = extractSymptomKeywords(text);
    setForm((prev) => ({
      ...prev,
      fever: detected.fever || prev.fever,
      nasal: detected.nasal || prev.nasal,
      cough: detected.cough || prev.cough,
      appetite: detected.appetite || prev.appetite,
      lethargy: detected.lethargy || prev.lethargy
    }));
  };

  const handleNewLivestockIdChange = (e) => {
    const raw = e.target.value;
    setNewLivestockId(raw);
    if (raw.trim()) {
      setIdValidation(validateLivestockId(raw, animals));
    } else {
      setIdValidation({ valid: true });
    }
  };

  const handleAssessRisk = (e) => {
    e.preventDefault();

    if (!selectedAnimalId && newLivestockId && !idValidation.valid) {
      alert("Please correct the 12-digit Livestock ID before proceeding.");
      return;
    }

    const selectedAnm = animals.find((a) => a.id === selectedAnimalId);

    const breakdown = computeTriageBreakdown({
      form,
      cases,
      animal: selectedAnm
    });

    const caseId = `PS-${1025 + Math.floor(Math.random() * 900)}`;

    const caseObject = {
      id: caseId,
      village: form.village,
      species: form.species,
      affected: Number(form.affected),
      mortality: Number(form.mortality),
      score: breakdown.score,
      status: breakdown.status,
      symptoms: [
        form.fever && "Fever",
        form.nasal && "Nasal discharge",
        form.cough && "Cough",
        form.appetite && "Reduced appetite",
        form.lethargy && "Lethargy"
      ].filter(Boolean),
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      animalId: selectedAnimalId || null,
      livestockId: selectedAnm?.livestockId || newLivestockId.trim() || null,
      voiceLang,
      transcription: voiceText || null,
      riskBreakdown: breakdown.factors,
      syncClientId: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    };

    setTriageResult({
      caseObject,
      breakdown,
      newAnimalData: !selectedAnimalId && newAnimalName.trim()
        ? {
            nameTag: newAnimalName.trim(),
            species: form.species,
            livestockId: newLivestockId.trim() || null,
            village: form.village,
            ownerName: "Ramesh Patel"
          }
        : null
    });
  };

  if (triageResult) {
    const { caseObject, breakdown } = triageResult;
    return (
      <section>
        <div className="page-head">
          <div>
            <div className="eyebrow">DECISION SUPPORT TRIAGE RESULT (USP 3)</div>
            <h1>{t("triageAssessmentComplete")}</h1>
            <p>{t("ruleBasedAssessmentNotice")}</p>
          </div>
        </div>

        <div className="result-card" style={{ maxWidth: "960px", display: "block" }}>
          <div style={{ display: "flex", gap: "24px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
            <div className={`result-ring ${breakdown.status.toLowerCase()}`}>
              <strong>{breakdown.score}%</strong>
              <span>Risk Score</span>
            </div>

            <div>
              <RiskBadge status={breakdown.status} />
              <h2>{breakdown.status === "High" ? "Immediate Veterinary Review Escalated" : "Monitored Priority Level"}</h2>
              <p>
                {caseObject.symptoms.join(" • ")} • {caseObject.affected} affected • {caseObject.mortality} mortality
              </p>
              {caseObject.livestockId && (
                <div style={{ marginTop: "6px" }}>
                  <YellowTag id={caseObject.livestockId} />
                </div>
              )}
            </div>
          </div>

          <ExplainableTriageBox breakdown={breakdown} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
            <button
              type="button"
              className="secondary"
              onClick={() => setTriageResult(null)}
            >
              {t("editSymptoms")}
            </button>

            <button
              type="button"
              className="primary"
              onClick={() => onSubmit(caseObject, triageResult.newAnimalData)}
            >
              {isOnline ? t("sendToVetDashboard") : t("saveToOfflineQueue")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">SYMPTOM & HEALTH REPORTING (USPs 1-5)</div>
          <h1>{t("reportHealthIssue")}</h1>
          <p>{t("reportIssueDesc")}</p>
        </div>
      </div>

      <form className="panel form" onSubmit={handleAssessRisk}>
        {/* Animal Identification Section (USP 1 & 2) */}
        <div style={{ background: "#f8faf8", border: "1px solid #e1e8e1", borderRadius: "10px", padding: "16px", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <PawPrint size={18} style={{ color: "#166534" }} />
            <strong style={{ fontSize: "13px" }}>{t("linkToRegisteredProfile")} (USP 1 & 2)</strong>
          </div>

          <label style={{ fontSize: "11px", fontWeight: "700" }}>
            Select Animal from Registered Herd:
            <select
              value={selectedAnimalId}
              onChange={(e) => handleAnimalSelect(e.target.value)}
              style={{ marginTop: "4px" }}
            >
              <option value="">{t("chooseRegisteredAnimal")}</option>
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nameTag} ({a.species}) {a.livestockId ? `• Tag #${a.livestockId}` : "• Untagged"}
                </option>
              ))}
            </select>
          </label>

          {/* Unregistered Animal Inputs */}
          {!selectedAnimalId && (
            <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700" }}>
                Animal Name / Tag (Optional)
                <input
                  type="text"
                  placeholder="e.g. Laxmi #50"
                  value={newAnimalName}
                  onChange={(e) => setNewAnimalName(e.target.value)}
                />
              </label>

              <label style={{ fontSize: "11px", fontWeight: "700" }}>
                12-digit Livestock ID (Yellow Ear-Tag)
                <input
                  type="text"
                  maxLength={12}
                  placeholder="e.g. 100234567895 (12 digits)"
                  value={newLivestockId}
                  onChange={handleNewLivestockIdChange}
                  style={{
                    fontFamily: "monospace",
                    borderColor: idValidation.valid ? "#dce4dd" : "#dc2626"
                  }}
                />
                {!idValidation.valid && (
                  <span style={{ color: "#dc2626", fontSize: "10px", display: "block", marginTop: "3px" }}>
                    ⚠️ {idValidation.error}
                  </span>
                )}
              </label>
            </div>
          )}
        </div>

        {/* General Form Grid */}
        <div className="form-grid">
          <label>
            {t("species")}
            <select
              value={form.species}
              onChange={(e) => update("species", e.target.value)}
            >
              <option>Cattle</option>
              <option>Buffalo</option>
              <option>Goat</option>
              <option>Sheep</option>
              <option>Poultry</option>
            </select>
          </label>

          <label>
            {t("location")}
            <input
              value={form.village}
              onChange={(e) => update("village", e.target.value)}
              required
            />
          </label>

          <label>
            Animals affected
            <input
              type="number"
              min="1"
              value={form.affected}
              onChange={(e) => update("affected", e.target.value)}
              required
            />
          </label>

          <label>
            {t("mortality")}
            <input
              type="number"
              min="0"
              value={form.mortality}
              onChange={(e) => update("mortality", e.target.value)}
              required
            />
          </label>
        </div>

        <h3>{t("observedSymptoms")}</h3>
        <div className="checks">
          {[
            ["fever", t("fever")],
            ["nasal", t("nasalDischarge")],
            ["cough", t("cough")],
            ["appetite", t("reducedAppetite")],
            ["lethargy", t("lethargy")]
          ].map(([k, l]) => (
            <label className="check" key={k}>
              <input
                type="checkbox"
                checked={form[k]}
                onChange={(e) => update(k, e.target.checked)}
              />
              <span>{l}</span>
            </label>
          ))}
        </div>

        <div className="upload">
          <Upload size={20} />
          <div>
            <strong>{t("photoEvidence")}</strong>
            <p>Upload lesion or animal appearance image for veterinary verification.</p>
          </div>
          <button type="button" className="secondary">
            {t("choosePhoto")}
          </button>
        </div>

        {/* Multilingual Voice-Based Reporting (USP 5) */}
        <VoiceReporting
          onText={handleVoiceText}
          onAudio={setVoiceAudio}
          onLanguageChange={(code) => setVoiceLang(code)}
        />

        <div className="form-footer">
          <div className="offline">
            {isOnline ? <Wifi size={15} /> : <WifiOff size={15} />}
            <span>{isOnline ? "Cloud connected" : "Offline mode active (IndexedDB storage)"}</span>
          </div>

          <button className="primary" type="submit">
            <Activity size={17} /> {t("assessTriageRisk")}
          </button>
        </div>
      </form>
    </section>
  );
}

function Advisories() {
  return (
    <div className="record-list">
      {[
        "Maintain clean drinking water and clean feeding troughs for all animals.",
        "Isolate visibly sick cattle immediately to prevent cross-contamination.",
        "Keep FMD and Brucellosis vaccination cards updated with the 12-digit Livestock ID.",
        "Ensure prompt reporting of high fever or mouth/hoof lesions to the nearest Veterinary Dispensary."
      ].map((x, i) => (
        <div className="record" key={i}>
          <Bell size={18} />
          <span>{x}</span>
        </div>
      ))}
    </div>
  );
}

function SimplePage({ title, icon: Icon, children }) {
  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">PASHU SHIELD</div>
          <h1>{title}</h1>
          <p>Accessible livestock health information for rural farmers and field teams.</p>
        </div>
      </div>
      <div className="panel">{children}</div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);