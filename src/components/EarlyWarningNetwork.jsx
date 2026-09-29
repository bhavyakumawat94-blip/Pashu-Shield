import React, { useState, useMemo } from "react";
import {
  AlertTriangle, ShieldCheck, MapPin, TrendingUp, Users,
  Activity, CloudRain, Wind, Filter, CheckCircle2, AlertCircle,
  Eye, Bell, RefreshCw
} from "lucide-react";
import { t, formatDate } from "../lib/i18n";

export function EarlyWarningNetwork({ cases = [], onNotify }) {
  const [selectedVillage, setSelectedVillage] = useState("All");
  const [timeFilter, setTimeFilter] = useState("7d");

  // Environmental context for seasonal surveillance
  const environmentalData = {
    season: "Post-Monsoon Transition",
    humidity: "78% (Elevated)",
    temperature: "31°C",
    vectorRisk: "Moderate to High (Culicoides & Stomoxys active)",
    fmdRiskIndex: "Elevated due to seasonal livestock market movement"
  };

  // Aggregated village cluster analysis (Protecting farmer privacy: no personal names)
  const clusterAnalysis = useMemo(() => {
    const villageGroups = {};

    cases.forEach((c) => {
      const v = c.village || "Unknown Area";
      if (!villageGroups[v]) {
        villageGroups[v] = {
          village: v,
          totalCases: 0,
          totalAffected: 0,
          totalMortality: 0,
          symptomsCount: {},
          speciesCount: {},
          maxScore: 0,
          dates: []
        };
      }

      villageGroups[v].totalCases += 1;
      villageGroups[v].totalAffected += Number(c.affected || 1);
      villageGroups[v].totalMortality += Number(c.mortality || 0);
      villageGroups[v].maxScore = Math.max(villageGroups[v].maxScore, c.score || 0);
      if (c.date) villageGroups[v].dates.push(c.date);

      (c.symptoms || []).forEach((sym) => {
        villageGroups[v].symptomsCount[sym] = (villageGroups[v].symptomsCount[sym] || 0) + 1;
      });

      const sp = c.species || "Cattle";
      villageGroups[v].speciesCount[sp] = (villageGroups[v].speciesCount[sp] || 0) + 1;
    });

    return Object.values(villageGroups).map((vg) => {
      // Determine dominant symptoms
      const topSymptoms = Object.entries(vg.symptomsCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([sym]) => sym);

      // Determine confidence / anomaly level
      let confidenceLevel = "Low Signal";
      let statusType = "isolated";
      let recommendedAction = "Maintain routine syndromic observation.";

      if (vg.totalMortality > 0 || vg.totalAffected >= 5 || vg.totalCases >= 2) {
        if (vg.maxScore >= 75) {
          confidenceLevel = "High Spatial Anomaly (Early Warning)";
          statusType = "anomaly";
          recommendedAction =
            "Deploy rapid veterinary field inspection team. Implement 5km movement restriction advisory and coordinate confirmatory laboratory swab collection.";
        } else {
          confidenceLevel = "Moderate Cluster Signal";
          statusType = "cluster";
          recommendedAction =
            "Alert local Livestock Development Officer (LDO). Monitor herd water troughs and review biosecurity.";
        }
      }

      return {
        ...vg,
        topSymptoms,
        confidenceLevel,
        statusType,
        recommendedAction,
        isConfirmedOutbreak: false // Strictly separated: early warning vs lab confirmed
      };
    });
  }, [cases]);

  const filteredClusters =
    selectedVillage === "All"
      ? clusterAnalysis
      : clusterAnalysis.filter((c) => c.village === selectedVillage);

  return (
    <section>
      <div className="page-head">
        <div>
          <div className="eyebrow">DISEASE SURVEILLANCE USP 2</div>
          <h1>Livestock Disease Early-Warning Network</h1>
          <p>
            Automated syndromic anomaly detection, spatial clustering, and environmental correlation to prevent outbreaks before they spread.
          </p>
        </div>
        <button
          className="secondary"
          onClick={() => onNotify("Early-warning spatial surveillance signals re-evaluated.")}
        >
          <RefreshCw size={16} /> Refresh Surveillance
        </button>
      </div>

      {/* SURVEILLANCE & ENVIRONMENTAL SUMMARY TILES */}
      <div className="grid-3" style={{ marginBottom: "20px" }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="stat-value">
              {clusterAnalysis.filter((c) => c.statusType === "anomaly").length}
            </div>
            <div className="stat-label">Active Anomaly Clusters</div>
            <div className="stat-hint">Aggregated village-level signals</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dbeafe", color: "#2563eb" }}>
            <Activity size={22} />
          </div>
          <div>
            <div className="stat-value">
              {cases.reduce((sum, c) => sum + Number(c.affected || 1), 0)}
            </div>
            <div className="stat-label">Total Monitored Morbidity</div>
            <div className="stat-hint">Across all monitored talukas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dcfce7", color: "#166534" }}>
            <CloudRain size={22} />
          </div>
          <div>
            <div className="stat-value">{environmentalData.season}</div>
            <div className="stat-label">Environmental Climate Index</div>
            <div className="stat-hint">Humidity: {environmentalData.humidity}</div>
          </div>
        </div>
      </div>

      {/* SCIENTIFIC DISCLAIMER BANNER */}
      <div
        className="advice"
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "8px",
          padding: "14px",
          marginBottom: "20px",
          display: "flex",
          gap: "12px",
          alignItems: "flex-start"
        }}
      >
        <ShieldCheck size={20} style={{ color: "#166534", marginTop: "2px", flexShrink: 0 }} />
        <div style={{ fontSize: "12px", color: "#14532d", lineHeight: "1.5" }}>
          <strong>Epidemiological Surveillance Notice & Privacy Protection:</strong>
          <br />
          Individual farmer names and exact farm locations are intentionally aggregated into village-level clusters to protect privacy.
          Early-warning clusters represent <em>suspected syndromic reporting patterns</em>, not lab-confirmed outbreaks. Official declaration of an outbreak requires laboratory confirmation (ELISA / PCR) per national disease guidelines.
        </div>
      </div>

      {/* CLUSTERS OVERVIEW */}
      <div className="panel" style={{ marginBottom: "24px" }}>
        <div className="panel-head">
          <div>
            <h2>Detected Geographic Syndromic Clusters</h2>
            <p>Aggregated case concentration and symptom co-occurrence signals.</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "12px" }}
            >
              <option value="All">All Village Zones</option>
              {clusterAnalysis.map((c) => (
                <option key={c.village} value={c.village}>
                  {c.village}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Geographic Area</th>
                <th>Aggregated Reports</th>
                <th>Morbidity / Mortality</th>
                <th>Observed Symptoms</th>
                <th>Surveillance Signal</th>
                <th>Confirmed Outbreak?</th>
                <th>Recommended Protocol</th>
              </tr>
            </thead>
            <tbody>
              {filteredClusters.map((cluster) => (
                <tr key={cluster.village}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin size={16} style={{ color: "#166534" }} />
                      <strong>{cluster.village}</strong>
                    </div>
                    <small style={{ color: "#6b7280" }}>Monitored Village Zone</small>
                  </td>

                  <td>
                    <strong>{cluster.totalCases} Reports</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>
                      Peak score: {cluster.maxScore}%
                    </small>
                  </td>

                  <td>
                    <span style={{ fontWeight: "700", color: "#dc2626" }}>
                      {cluster.totalAffected} Affected
                    </span>
                    <br />
                    <small>
                      {cluster.totalMortality > 0 ? (
                        <b style={{ color: "#991b1b" }}>⚠️ {cluster.totalMortality} Deaths</b>
                      ) : (
                        "0 Deaths"
                      )}
                    </small>
                  </td>

                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {cluster.topSymptoms.map((sym, i) => (
                        <span key={i} className="symptom-tag">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`risk-badge ${
                        cluster.statusType === "anomaly"
                          ? "risk-high"
                          : cluster.statusType === "cluster"
                          ? "risk-medium"
                          : "risk-low"
                      }`}
                    >
                      {cluster.confidenceLevel}
                    </span>
                  </td>

                  <td>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        background: "#f3f4f6",
                        color: "#4b5563"
                      }}
                    >
                      Suspected (Pending Lab)
                    </span>
                  </td>

                  <td style={{ maxWidth: "260px", fontSize: "12px", lineHeight: "1.4" }}>
                    <p style={{ margin: 0, color: "#1f2937" }}>{cluster.recommendedAction}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
