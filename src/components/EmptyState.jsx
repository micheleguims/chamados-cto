// ==========================================
// EMPTY STATE
// src/components/EmptyState.jsx
// ==========================================

import React from "react";
import { HelpCircle } from "lucide-react";

export default function EmptyState({
  message,
  icon: Icon = HelpCircle
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 px-4 text-slate-400">
      <Icon className="w-10 h-10 mb-3 opacity-60" />

      <p className="text-sm font-medium">
        {message}
      </p>
    </div>
  );
}