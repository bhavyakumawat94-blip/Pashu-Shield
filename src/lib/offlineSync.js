// Offline Reporting and Auto-Sync Service (USP 4)
// Stores pending livestock health reports in IndexedDB with localStorage fallback.
// Automatically syncs pending reports upon network reconnection with duplicate prevention.

const DB_NAME = "pashu_offline_db";
const STORE_NAME = "pending_reports";
const DB_VERSION = 1;
const FALLBACK_KEY = "pashu_pending_reports_fallback";

function openDb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.warn("IndexedDB open failed, fallback to localStorage:", request.error);
      resolve(null);
    };
  });
}

function getFallbackReports() {
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function setFallbackReports(reports) {
  try {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error("Failed to save to localStorage fallback:", e);
  }
}

export async function savePendingReport(report) {
  const pendingItem = {
    ...report,
    id: report.id || `PS-OFF-${Date.now()}`,
    clientSyncId: report.clientSyncId || `sync-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    queuedAt: new Date().toISOString(),
    syncStatus: "pending"
  };

  const db = await openDb();
  if (!db) {
    const current = getFallbackReports();
    const filtered = current.filter(r => r.id !== pendingItem.id);
    setFallbackReports([pendingItem, ...filtered]);
    return pendingItem;
  }

  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(pendingItem);
      req.onsuccess = () => resolve(pendingItem);
      req.onerror = () => {
        // Fallback
        const current = getFallbackReports();
        const filtered = current.filter(r => r.id !== pendingItem.id);
        setFallbackReports([pendingItem, ...filtered]);
        resolve(pendingItem);
      };
    } catch (e) {
      const current = getFallbackReports();
      setFallbackReports([pendingItem, ...current]);
      resolve(pendingItem);
    }
  });
}

export async function getPendingReports() {
  const db = await openDb();
  if (!db) {
    return getFallbackReports();
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const idbReports = req.result || [];
        const fallbackReports = getFallbackReports();
        // Merge without duplicates
        const map = new Map();
        [...fallbackReports, ...idbReports].forEach(r => map.set(r.id, r));
        resolve(Array.from(map.values()));
      };
      req.onerror = () => resolve(getFallbackReports());
    } catch (e) {
      resolve(getFallbackReports());
    }
  });
}

export async function removePendingReport(reportId) {
  // Remove from localStorage fallback
  const fallback = getFallbackReports().filter(r => r.id !== reportId);
  setFallbackReports(fallback);

  const db = await openDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(reportId);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    } catch (e) {
      resolve();
    }
  });
}

export async function syncPendingReports(saveCaseFn, onProgress = null) {
  const pending = await getPendingReports();
  if (!pending.length) {
    return { syncedCount: 0, failedCount: 0, errors: [] };
  }

  let syncedCount = 0;
  let failedCount = 0;
  const errors = [];

  for (const report of pending) {
    try {
      if (onProgress) {
        onProgress({ current: syncedCount + 1, total: pending.length, report });
      }

      // Save using existing saveCase function with duplicate prevention
      await saveCaseFn({
        ...report,
        syncStatus: "synced",
        syncClientId: report.clientSyncId
      });

      // Remove from pending store
      await removePendingReport(report.id);
      syncedCount++;
    } catch (err) {
      console.error(`Failed to sync report ${report.id}:`, err);
      failedCount++;
      errors.push({ id: report.id, error: err.message || "Sync failed" });
    }
  }

  return { syncedCount, failedCount, errors };
}

export function subscribeConnectivity(callback) {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}
