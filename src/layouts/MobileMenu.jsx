// ==========================================
// MOBILE MENU
// ==========================================

import React from "react";

export default function MobileMenu({
  open,
  children
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
      <div className="bg-[#13335a] w-72 h-full">
        {children}
      </div>
    </div>
  );
}