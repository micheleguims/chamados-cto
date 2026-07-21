// src/components/EmptyState.jsx

import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function EmptyState({ message, icon: Icon = HelpCircle }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 w-full">
      <Icon className="w-8 h-8 text-slate-400 mb-2 stroke-[1.5]" />
      <p className="text-sm text-slate-500 font-medium max-w-xs">{message}</p>
    </div>
  );
}