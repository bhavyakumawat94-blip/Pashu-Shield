import React, { useMemo, useState, useEffect } from "react";import { createRoot } from "react-dom/client";
import {
  Activity, AlertTriangle, Bell, CheckCircle2, ClipboardList, CloudOff,
  FileText, HeartPulse, Home, Languages, MapPin, Menu, PawPrint,
  Search, ShieldCheck, Stethoscope, Syringe, TrendingUp, Upload, UserRound,
  Wifi, X
} from "lucide-react";
import "./styles.css";
import { loadCases, saveCase, saveCasesLocal } from "./lib/casesDb";
import { supabase } from "./lib/supabaseClient";
const initialCases = [
  { id: "PS-1024", village: "Village A", species: "Cattle", affected: 5, mortality: 1, score: 82, status: "High", symptoms: ["Fever", "Nasal discharge", "Reduced appetite"], date: "09 Sep 2026" },
  { id: "PS-1021", village: "Village C", species: "Cattle", affected: 3, mortality: 0, score: 76, status: "High", symptoms: ["Fever", "Cough"], date: "09 Sep 2026" },
  { id: "PS-1019", village: "Village B", species: "Buffalo", affected: 7, mortality: 0, score: 54, status: "Medium", symptoms: ["Reduced appetite", "Lethargy"], date: "08 Sep 2026" }
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
      <div><div className="stat-value">{value}</div><div className="stat-label">{label}</div><div className="stat-hint">{hint}</div></div>
    </div>
  );
}

function App() {
  const [role, setRole] = useState("vet");
  const [page, setPage] = useState("dashboard");
  const [cases, setCases] = useState(initialCases);
  const [dbReady, setDbReady] = useState(false);
  const [session, setSession] = useState(null);
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

  React.useEffect(() => {
    let cancelled = false;
    loadCases(initialCases)
      .then(saved => {
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
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    if (dbReady) saveCasesLocal(cases);
  }, [cases, dbReady]);

  const high = cases.filter(c => c.status === "High").length;
  const medium = cases.filter(c => c.status === "Medium").length;
  const low = cases.filter(c => c.status === "Low").length;
const handleLogin = async (e) => {
  e.preventDefault();
  setLoginError("");

  if (!supabase) {
    setLoginError("Supabase is not configured.");
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
  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const nav = role === "vet" ? [
    ["dashboard", "Dashboard", Home],
    ["cases", "Priority Cases", ClipboardList],
    ["map", "Risk Map", MapPin],
    ["forecast", "Forecast", TrendingUp],
    ["lab", "Lab Referral", Syringe],
    ["alerts", "Alerts", Bell],
  ] : [
    ["farmer", "My Dashboard", Home],
    ["report", "Report Issue", HeartPulse],
    ["herd", "My Herd", PawPrint],
    ["records", "Health Records", FileText],
    ["advisories", "Advisories", Bell],
  ];
const handleLogout = async () => {
  if (supabase) {
    await supabase.auth.signOut();
  }
};
  const switchRole = () => {
    const next = role === "vet" ? "farmer" : "vet";
    setRole(next);
    setPage(next === "vet" ? "dashboard" : "farmer");
  };

  if (!session) {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-mark">
          <ShieldCheck size={32} />
        </div>

        <h1>PASHU SHIELD</h1>
        <p>Livestock Health Surveillance System</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {loginError && (
            <div className="login-error">{loginError}</div>
          )}

          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}
  return (
    <div className="app">
      <aside className={`sidebar ${sidebar ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={25}/></div>
          <div><strong>PASHU SHIELD</strong><small>Livestock Health Surveillance</small></div>
        </div>
        <div className="role-pill">
          <span>{role === "vet" ? "Veterinary Officer" : "Farmer / Field Worker"}</span>
          <button onClick={switchRole}>Switch</button>
        </div>

<button className="logout-button" onClick={handleLogout}>
  Sign Out
</button>

<nav>
        
        {nav.map(([id, label, Icon]) =>
          <button key={id} className={page === id ? "nav-active" : ""} onClick={() => {setPage(id);setSidebar(false)}}>
            <Icon size={18}/>{label}
          </button>
        )}</nav>
        <div className="offline"><Wifi size={16}/><span>Online • Sync enabled</span></div>
        <div className="side-note"><CloudOff size={16}/><span>Offline mode ready for low-connectivity areas</span></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="menu" onClick={() => setSidebar(!sidebar)}><Menu/></button>
          <div className="crumb">SIH 2026 • PASHU SHIELD {dbReady ? "• Data ready" : "• Connecting data…"}</div>
          <div className="top-actions">
            <button className="icon-btn" onClick={() => notify("No new critical alerts.")}><Bell size={19}/></button>
            <div className="user"><div className="avatar"><UserRound size={17}/></div><span>{role === "vet" ? "Dr. Sharma" : "Farmer Account"}</span></div>
          </div>
        </header>

        <div className="content">
          {role === "vet" && page === "dashboard" && <VetDashboard cases={cases} high={high} medium={medium} low={low} setPage={setPage} setSelectedCase={setSelectedCase}/>}
          {role === "vet" && page === "cases" && <Cases cases={cases} setSelectedCase={setSelectedCase} setPage={setPage}/>}
          {role === "vet" && page === "map" && <RiskMap cases={cases}/>}
          {role === "vet" && page === "forecast" && <Forecast/>}
          {role === "vet" && page === "lab" && <Lab cases={cases} notify={notify}/>}
          {role === "vet" && page === "alerts" && <Alerts notify={notify}/>}
          {role === "farmer" && page === "farmer" && <FarmerHome setPage={setPage}/>}
          {role === "farmer" && page === "report" && <ReportForm onSubmit={(c) => {
            saveCase(c)
              .then(saved => {
                setCases(prev => [saved, ...prev.filter(x => x.id !== saved.id)]);
                setSelectedCase(saved); setPage("dashboard"); setRole("vet");
                notify("Report saved to the database and escalated to veterinary dashboard.");
              })
              .catch(() => notify("Could not save to the database. The report is kept locally."));
          }}/>}
          {role === "farmer" && page === "herd" && <SimplePage title="My Herd" icon={PawPrint}><Herd/></SimplePage>}
          {role === "farmer" && page === "records" && <SimplePage title="Health Records" icon={FileText}><Records/></SimplePage>}
          {role === "farmer" && page === "advisories" && <SimplePage title="Alerts & Advisories" icon={Bell}><Advisories/></SimplePage>}
        </div>
        {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
      </main>
    </div>
  );
}

function VetDashboard({cases, high, medium, low, setPage, setSelectedCase}) {
  return <section>
    <div className="page-head">
      <div><div className="eyebrow">VETERINARY DECISION DASHBOARD</div><h1>Livestock Health Overview</h1><p>Prioritize suspected cases and respond to emerging disease risk.</p></div>
      <button className="primary" onClick={() => setPage("cases")}><ClipboardList size={17}/> View priority cases</button>
    </div>
    <div className="stats">
      <Stat icon={Activity} label="Active Cases" value={cases.length} hint="Across monitored villages"/>
      <Stat icon={AlertTriangle} label="High Risk" value={high} hint="Immediate review"/>
      <Stat icon={TrendingUp} label="Medium Risk" value={medium} hint="Monitor closely"/>
      <Stat icon={CheckCircle2} label="Low Risk" value={low} hint="Routine follow-up"/>
    </div>
    <div className="grid-2">
      <div className="panel">
        <div className="panel-head"><h2>🔴 High Priority Cases</h2><button className="text-btn" onClick={() => setPage("cases")}>View all</button></div>
        {cases.filter(c=>c.status==="High").map(c => <CaseRow key={c.id} c={c} onClick={()=>{setSelectedCase(c);setPage("cases")}}/>)}
      </div>
      <div className="panel">
        <div className="panel-head"><h2>Risk Distribution</h2></div>
        <div className="donut-wrap"><div className="donut"><div><strong>{cases.length}</strong><span>Total</span></div></div>
          <div className="legend"><span><i className="dot high"></i>High <b>{high}</b></span><span><i className="dot medium"></i>Medium <b>{medium}</b></span><span><i className="dot low"></i>Low <b>{low}</b></span></div>
        </div>
      </div>
    </div>
    <div className="panel map-preview">
      <div className="panel-head"><div><h2>Disease Risk Map</h2><p>Cluster view of reported livestock health cases.</p></div><button className="secondary" onClick={()=>setPage("map")}><MapPin size={16}/> Open map</button></div>
      <MapGraphic cases={cases}/>
    </div>
  </section>
}

function CaseRow({c,onClick}) {
  return <button className="case-row" onClick={onClick}>
    <div className="case-icon"><HeartPulse size={18}/></div>
    <div className="case-main"><strong>{c.id} • {c.village}</strong><span>{c.species} • {c.affected} affected • {c.mortality} mortality</span></div>
    <div className="case-risk"><RiskBadge status={c.status}/><b>{c.score}%</b></div>
  </button>
}

function Cases({cases,setSelectedCase,setPage}) {
  const [query,setQuery] = useState("");
  const filtered = cases.filter(c => `${c.id} ${c.village} ${c.species}`.toLowerCase().includes(query.toLowerCase()));
  return <section>
    <div className="page-head"><div><div className="eyebrow">CASE MANAGEMENT</div><h1>Priority Cases</h1><p>Review reports, triage risk and escalate cases.</p></div></div>
    <div className="searchbar"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search case, village or species..."/></div>
    <div className="panel table-panel"><table><thead><tr><th>Case</th><th>Location</th><th>Animals</th><th>Symptoms</th><th>Risk</th><th></th></tr></thead>
    <tbody>{filtered.map(c=><tr key={c.id}><td><strong>{c.id}</strong><small>{c.date}</small></td><td>{c.village}</td><td>{c.affected} affected<br/>{c.mortality} mortality</td><td>{c.symptoms.join(", ")}</td><td><RiskBadge status={c.status}/><strong className="score">{c.score}%</strong></td><td><button className="secondary small" onClick={()=>{setSelectedCase(c);setPage("cases")}}>Review</button></td></tr>)}</tbody></table></div>
    <CaseDetail c={cases[0]}/>
  </section>
}

function CaseDetail({c}) {
  if (!c) return null;
  return <div className="panel detail"><div className="panel-head"><div><div className="eyebrow">SELECTED CASE</div><h2>{c.id} • {c.village}</h2></div><RiskBadge status={c.status}/></div>
    <div className="detail-grid"><div><span>Risk score</span><strong className="big-score">{c.score}%</strong></div><div><span>Species</span><strong>{c.species}</strong></div><div><span>Affected</span><strong>{c.affected}</strong></div><div><span>Mortality</span><strong>{c.mortality}</strong></div></div>
    <div className="advice"><Stethoscope size={19}/><div><strong>Recommended action</strong><p>Prioritize veterinary review and consider sample collection. AI-assisted triage is decision support; veterinary confirmation remains final.</p></div></div>
  </div>
}

function RiskMap({cases}) {
  return <section><div className="page-head"><div><div className="eyebrow">GEO-SPATIAL SURVEILLANCE</div><h1>Disease Risk Map</h1><p>Visualize reported cases and emerging clusters.</p></div></div><div className="panel"><MapGraphic cases={cases} large/></div></section>
}

function MapGraphic({cases,large=false}) {
  const points = [[22,38],[34,55],[46,28],[55,60],[68,42],[77,67],[82,28],[29,76],[60,18]];
  return <div className={`map ${large?"large":""}`}><div className="map-label">DEMO SURVEILLANCE MAP</div><div className="roads"></div>
    {points.slice(0, Math.max(5,cases.length+2)).map((p,i)=><div key={i} className={`map-pin ${i<2?"pin-high":i<4?"pin-medium":"pin-low"}`} style={{left:`${p[0]}%`,top:`${p[1]}%`}} title={cases[i]?.village || "Monitored area"}><MapPin size={25}/></div>)}
    <div className="map-legend"><span><i className="dot high"></i>High risk</span><span><i className="dot medium"></i>Medium</span><span><i className="dot low"></i>Low</span></div>
  </div>
}

function Forecast() {
  const bars=[38,46,43,55,62,68,79,73,88,92];
  return <section><div className="page-head"><div><div className="eyebrow">DISEASE FORECASTING</div><h1>Emerging Risk Trends</h1><p>Demo trend based on historical cases, seasonality and reported signals.</p></div></div>
    <div className="grid-2"><div className="panel chart-panel"><div className="panel-head"><h2>Reported risk index</h2><span className="trend-up">↑ 18% trend</span></div><div className="bars">{bars.map((v,i)=><div key={i} className="bar-col"><div className="bar" style={{height:`${v}%`}}></div><small>W{i+1}</small></div>)}</div></div>
    <div className="panel"><h2>Early-warning interpretation</h2><div className="forecast-box"><TrendingUp size={22}/><div><strong>Elevated emerging risk</strong><p>Recent reports show increasing risk signals. Veterinary teams should review high-priority clusters and verify suspected cases.</p></div></div><div className="note">Prototype note: forecasting is demonstrated with simulated data and should be trained/validated on verified historical datasets before deployment.</div></div></div>
  </section>
}

function Lab({cases,notify}) {
  const [requested,setRequested]=useState({});
  return <section><div className="page-head"><div><div className="eyebrow">CASE ESCALATION</div><h1>Lab Referral</h1><p>Coordinate sample collection and laboratory testing.</p></div></div>
    <div className="panel table-panel"><table><thead><tr><th>Case</th><th>Risk</th><th>Suggested sample</th><th>Status</th><th></th></tr></thead><tbody>
      {cases.filter(c=>c.status==="High").map(c=><tr key={c.id}><td><strong>{c.id}</strong><small>{c.village} • {c.species}</small></td><td><RiskBadge status={c.status}/></td><td>Clinical sample / swab</td><td>{requested[c.id]?"Request submitted":"Pending"}</td><td><button className="primary small" onClick={()=>{setRequested({...requested,[c.id]:true});notify(`Sample request created for ${c.id}.`)}}>{requested[c.id]?"Submitted":"Request sample"}</button></td></tr>)}
    </tbody></table></div>
  </section>
}

function Alerts({notify}) {
  const alerts=[["High-risk cluster detected","Village A has multiple reports requiring veterinary review.","High Risk"],["Preventive advisory","Review vaccination and biosecurity guidance for monitored herds.","Advisory"],["Sync complete","12 offline reports synchronized successfully.","System"]];
  return <section><div className="page-head"><div><div className="eyebrow">COMMUNICATION</div><h1>Alerts & Advisories</h1><p>Keep farmers and veterinary stakeholders informed.</p></div><button className="secondary" onClick={()=>notify("Demo alert broadcast prepared.")}><Languages size={16}/> Prepare multilingual alert</button></div>
  <div className="alert-list">{alerts.map((a,i)=><div className="panel alert-card" key={i}><div className="alert-icon"><Bell size={18}/></div><div><strong>{a[0]}</strong><p>{a[1]}</p><span>{a[2]} • Today</span></div></div>)}</div></section>
}

function FarmerHome({setPage}) {
  return <section><div className="page-head"><div><div className="eyebrow">FARMER / FIELD WORKER</div><h1>Namaste 👋</h1><p>Report animal health concerns early and get preventive guidance.</p></div><button className="primary" onClick={()=>setPage("report")}><HeartPulse size={17}/> Report health issue</button></div>
    <div className="farmer-banner"><div><ShieldCheck size={30}/><div><h2>Early reporting protects your herd</h2><p>Use voice, photo or simple symptom selection. Reports can be saved offline and synced later.</p></div></div><div className="sync-chip"><Wifi size={15}/> Synced</div></div>
    <div className="stats"><Stat icon={PawPrint} label="Animals in herd" value="18" hint="3 species"/><Stat icon={Syringe} label="Vaccinations due" value="3" hint="Next 30 days"/><Stat icon={Bell} label="New advisories" value="2" hint="Review today"/></div>
  </section>
}

function ReportForm({onSubmit}) {
  const [form,setForm]=useState({species:"Cattle",village:"Village A",affected:5,mortality:1,fever:true,nasal:true,cough:false,appetite:true,lethargy:false});
  const [result,setResult]=useState(null);
  const update=(k,v)=>setForm({...form,[k]:v});
  const submit=(e)=>{e.preventDefault();const score=scoreCase(form);const status=score>=61?"High":score>=31?"Medium":"Low";const symptoms=[form.fever&&"Fever",form.nasal&&"Nasal discharge",form.cough&&"Cough",form.appetite&&"Reduced appetite",form.lethargy&&"Lethargy"].filter(Boolean);const c={id:`PS-${1025+Math.floor(Math.random()*100)}`,village:form.village,species:form.species,affected:Number(form.affected),mortality:Number(form.mortality),score,status,symptoms,date:"09 Sep 2026"};setResult(c);};
  if(result) return <section><div className="page-head"><div><div className="eyebrow">AI-ASSISTED TRIAGE RESULT</div><h1>Report assessed</h1><p>Your report has been converted into a priority case.</p></div></div><div className="result-card"><div className={`result-ring ${result.status.toLowerCase()}`}><strong>{result.score}%</strong><span>Risk score</span></div><div><RiskBadge status={result.status}/><h2>{result.status === "High" ? "Veterinary review recommended" : "Continue monitoring"}</h2><p>{result.symptoms.join(" • ")} • {result.affected} affected • {result.mortality} mortality</p><div className="advice"><Stethoscope size={19}/><div><strong>Next step</strong><p>For prototype demonstration, this case is escalated to the veterinary dashboard. The system supports decision-making and does not replace veterinary diagnosis.</p></div></div><button className="primary" onClick={()=>onSubmit(result)}>Send to veterinary dashboard</button></div></div></section>;
  return <section><div className="page-head"><div><div className="eyebrow">SYMPTOM & MORTALITY REPORTING</div><h1>Report Animal Health Issue</h1><p>Enter simple field-level observations. Required fields are marked in the form.</p></div></div>
    <form className="panel form" onSubmit={submit}><div className="form-grid"><label>Species<select value={form.species} onChange={e=>update("species",e.target.value)}><option>Cattle</option><option>Buffalo</option><option>Goat</option><option>Sheep</option><option>Poultry</option></select></label><label>Village / location<input value={form.village} onChange={e=>update("village",e.target.value)}/></label><label>Animals affected<input type="number" min="1" value={form.affected} onChange={e=>update("affected",e.target.value)}/></label><label>Mortality<input type="number" min="0" value={form.mortality} onChange={e=>update("mortality",e.target.value)}/></label></div>
    <h3>Observed symptoms</h3><div className="checks">{[["fever","Fever"],["nasal","Nasal discharge"],["cough","Cough"],["appetite","Reduced appetite"],["lethargy","Lethargy"]].map(([k,l])=><label className="check" key={k}><input type="checkbox" checked={form[k]} onChange={e=>update(k,e.target.checked)}/><span>{l}</span></label>)}</div>
    <div className="upload"><Upload size={20}/><div><strong>Photo evidence (optional)</strong><p>Prototype placeholder for animal/lesion photo upload.</p></div><button type="button" className="secondary">Choose photo</button></div>
    <div className="voice"><span className="mic">🎙️</span><div><strong>Voice reporting</strong><p>Web Speech API can be connected here for Marathi/Hindi/English symptom entry.</p></div></div>
    <div className="form-footer"><div className="offline"><Wifi size={15}/> Can be saved offline</div><button className="primary" type="submit"><Activity size={17}/> Assess risk</button></div></form>
  </section>
}

function Herd(){return <div className="herd-grid">{["Cattle • 12","Buffalo • 4","Goat • 2"].map((x,i)=><div className="animal-card" key={i}><PawPrint size={22}/><strong>{x}</strong><span>{i===0?"2 vaccinations due":"Healthy • monitored"}</span></div>)}</div>}
function Records(){return <div className="record-list">{["Vaccination: FMD • 15 Aug 2026","Treatment: Fever case • 28 Jul 2026","Health check: Routine • 10 Jul 2026"].map((x,i)=><div className="record" key={i}><FileText size={18}/><span>{x}</span><CheckCircle2 size={17}/></div>)}</div>}
function Advisories(){return <div className="record-list">{["Maintain clean drinking water and feeding areas.","Isolate visibly sick animals and contact a veterinarian.","Keep vaccination records updated."].map((x,i)=><div className="record" key={i}><Bell size={18}/><span>{x}</span></div>)}</div>}
function SimplePage({title,icon:Icon,children}){return <section><div className="page-head"><div><div className="eyebrow">PASHU SHIELD</div><h1>{title}</h1><p>Accessible livestock health information for rural users.</p></div></div><div className="panel">{children}</div></section>}

createRoot(document.getElementById("root")).render(<App />);