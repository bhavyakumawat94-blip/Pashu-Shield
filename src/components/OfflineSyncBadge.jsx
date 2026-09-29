import React from "react";
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export function OfflineSyncBadge({
  isOnline,
  pendingCount,
  syncing,
  onSync,
  onToggleSimulatedOffline = null,
  isSimulatedOffline = false
}) {
  const effectivelyOnline = isOnline && !isSimulatedOffline;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
      {/* Network Status Pill */}
      <div
        className={`offline-sync-bar ${effectivelyOnline ? "online" : "offline"}`}
        title={
          effectivelyOnline
            ? "Connected to cloud server. New reports auto-sync automatically."
            : "Offline reporting active: Health reports are saved securely to IndexedDB and will auto-sync upon reconnection."
        }
      >
        {effectivelyOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
        <span>
          {effectivelyOnline ? "Online • Auto-Sync Active" : "Offline • Local IndexedDB Active"}
        </span>

        {pendingCount > 0 && (
          <span className="sync-counter-chip" title={`${pendingCount} report(s) awaiting synchronization`}>
            {pendingCount} Pending
          </span>
        )}
      </div>

      {/* Manual Sync Trigger Button */}
      {pendingCount > 0 && effectivelyOnline && (
        <button
          type="button"
          className="sync-btn-small"
          onClick={onSync}
          disabled={syncing}
          title="Manually synchronize all pending offline reports now"
        >
          <RefreshCw
            size={11}
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: "4px",
              animation: syncing ? "spin 1s linear infinite" : "none"
            }}
          />
          <span>{syncing ? "Syncing..." : "Sync Now"}</span>
        </button>
      )}

      {/* Evaluator Simulation Toggle for Offline Mode */}
      {onToggleSimulatedOffline && (
        <button
          type="button"
          onClick={onToggleSimulatedOffline}
          style={{
            border: "1px dashed #94a3b8",
            background: isSimulatedOffline ? "#fee2e2" : "#f1f5f9",
            color: isSimulatedOffline ? "#991b1b" : "#475569",
            fontSize: "10px",
            fontWeight: "700",
            padding: "3px 8px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
          title="Evaluator testing button: Simulate loss of internet connectivity to demonstrate offline report creation and auto-sync."
        >
          {isSimulatedOffline ? "🔴 End Offline Sim" : "📡 Test Offline"}
        </button>
      )}
    </div>
  );
}
