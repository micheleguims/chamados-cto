// ==========================================
// BADGE
// src/components/Badge.jsx
// ==========================================

import React from "react";

export default function Badge({ children, colorClass = "" }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        px-2.5
        py-1
        rounded-full
        border
        text-xs
        font-semibold
        whitespace-nowrap
        ${colorClass}
      `}
    >
      {children}
    </span>
  );
}