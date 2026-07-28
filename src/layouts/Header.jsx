// ==========================================
// HEADER
// ==========================================

import React from "react";
import { Menu } from "lucide-react";

export default function Header({
  title,
  onOpenMenu
}) {
  return (
    <header className="lg:hidden bg-[#13335a] text-white px-4 py-3 flex items-center justify-between shadow">
      <button
        onClick={onOpenMenu}
        className="p-2"
      >
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="font-bold text-sm">
        {title}
      </h1>
      <div className="w-6" />
    </header>
  );
}