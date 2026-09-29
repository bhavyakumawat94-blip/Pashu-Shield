import { createClient } from "@supabase/supabase-js";

function sanitizeUrl(raw) {
  if (!raw || typeof raw !== "string") return "";
  let clean = raw.trim().replace(/^["']|["']$/g, "").trim();
  if (!clean || clean.includes("your_project_url") || clean.includes("your-project-url")) {
    return "";
  }
  // Ensure http/https protocol
  if (!/^https?:\/\//i.test(clean)) {
    clean = `https://${clean}`;
  }
  // Strip trailing slashes to prevent double slashes in auth endpoints
  return clean.replace(/\/+$/, "");
}

function sanitizeKey(raw) {
  if (!raw || typeof raw !== "string") return "";
  const clean = raw.trim().replace(/^["']|["']$/g, "").trim();
  if (!clean || clean.includes("your_publishable_key") || clean.includes("your-anon-key")) {
    return "";
  }
  return clean;
}

// Direct static access so Vite replaces them at build time in Vercel
// Supports both VITE_SUPABASE_PUBLISHABLE_KEY and standard VITE_SUPABASE_ANON_KEY
const rawUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_URL) ||
  "";

const rawKey =
  (typeof import.meta !== "undefined" &&
    (import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY)) ||
  (typeof process !== "undefined" &&
    (process.env?.VITE_SUPABASE_PUBLISHABLE_KEY || process.env?.VITE_SUPABASE_ANON_KEY)) ||
  "";

export const supabaseUrl = sanitizeUrl(rawUrl);
export const supabasePublishableKey = sanitizeKey(rawKey);

export const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export const isSupabaseConfigured = Boolean(supabase);
