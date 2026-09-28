import React from "react";
import { Tag } from "lucide-react";

export function YellowTag({ id, large = false }) {
  if (!id) return null;
  // Format 12-digit ID with spaces as XXXX XXXX XXXX
  const clean = String(id).replace(/\D/g, "");
  const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1 ");

  return (
    <div
      className={`yellow-tag-badge ${large ? "large" : ""}`}
      title="12-digit Livestock ID (Bharat Pashudhan / INAPH Yellow Ear-Tag)"
    >
      <span className="tag-dot"></span>
      <Tag size={large ? 15 : 12} />
      <span>TAG: {formatted || id}</span>
    </div>
  );
}
