// ==========================================
// MAIN LAYOUT
// ==========================================

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import React from "react";

export default function MainLayout({
  sidebar,
  children
}) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {sidebar}

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}