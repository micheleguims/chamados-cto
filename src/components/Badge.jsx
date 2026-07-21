// src/components/Badge.jsx

import React from 'react';

export default function Badge({ children, colorClass }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {children}
    </span>
  );
}