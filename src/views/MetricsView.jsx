// ==========================================
// 7. PAINEL DE MÉTRICAS (ADMIN)
// Arquivo Futuro Sugerido: src/views/MetricsView.jsx
// ==========================================

import React, { useMemo } from 'react';
import { CATEGORIES } from '../config/constants';
import { 
  BarChart2, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  PieChart 
} from 'lucide-react';

export default function MetricsView ({ tickets, onNavigateWithFilter }) {
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'Aguardando fila').length;
    const progress = tickets.filter(t => t.status === 'Em andamento').length;
    const resolved = tickets.filter(t => t.status === 'Resolvido' || t.status === 'Encerrado').length;

    const categoriesCount = tickets.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    return { total, open, progress, resolved, categoriesCount };
  }, [tickets]);

  const lineChartData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const data = [0, 0, 0, 0, 0, 0]; 
    tickets.forEach(t => {
      if (t.status === 'Resolvido' || t.status === 'Encerrado') {
        const monthIndex = new Date(t.createdAt).getMonth(); 
        if(monthIndex >= 0 && monthIndex < 6) data[monthIndex]++;
      }
    });
    const maxVal = Math.max(...data, 5); 
    const points = data.map((val, idx) => `${(idx / 5) * 100},${100 - (val / maxVal) * 100}`).join(' ');
    return { data, points, maxVal, months };
  }, [tickets]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center">
        <BarChart2 className="mr-2 text-[#13335a]" /> Dashboard de Desempenho
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', val: stats.total, color: 'text-[#13335a]', bg: 'bg-white', filter: '' },
          { label: 'Aguardando', val: stats.open, color: 'text-red-700', bg: 'bg-red-50', filter: 'Aguardando fila' },
          { label: 'Em Andamento', val: stats.progress, color: 'text-yellow-700', bg: 'bg-yellow-50', filter: 'Em andamento' },
          { label: 'Resolvidos', val: stats.resolved, color: 'text-green-700', bg: 'bg-green-50', filter: 'Resolvido' }
        ].map(card => (
          <button 
            key={card.label} 
            onClick={() => onNavigateWithFilter(card.filter)}
            className={`${card.bg} p-4 rounded-xl border border-slate-200 shadow-sm text-center hover:shadow-md hover:scale-105 transition transform cursor-pointer`}
          >
            <p className={`text-xs font-semibold uppercase opacity-80 ${card.color}`}>{card.label}</p>
            <p className={`text-3xl font-extrabold mt-2 ${card.color}`}>{card.val}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
          <h3 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-wider self-start flex items-center">
            <PieChart className="w-4 h-4 mr-2 text-[#13335a]" /> Distribuição
          </h3>
          <div className="relative w-48 h-48 rounded-full mb-6" style={{
            background: `conic-gradient(
              #ef4444 0% ${stats.total ? (stats.open/stats.total)*100 : 0}%, 
              #f59e0b 0% ${stats.total ? ((stats.open+stats.progress)/stats.total)*100 : 0}%, 
              #10b981 0% 100%
            )`
          }}>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-slate-700">{stats.total}</span>
            </div>
          </div>
          <div className="flex gap-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span> Fila</span>
            <span className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span> Andam.</span>
            <span className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span> Concluído</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Por Categoria</h3>
          <div className="space-y-3">
            {CATEGORIES.map(category => {
              const count = stats.categoriesCount[category] || 0;
              const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>{category} ({count})</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-[#13335a] h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-wider flex items-center">
             <TrendingUp className="w-4 h-4 mr-2 text-[#13335a]"/> Resoluções (Semestre)
          </h3>
          <div className="relative h-40 w-full mt-4">
            <svg viewBox="0 -10 100 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="100" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <polyline points={lineChartData.points} fill="none" stroke="#66b6e3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {lineChartData.data.map((val, idx) => (
                <circle key={idx} cx={(idx / 5) * 100} cy={100 - (val / lineChartData.maxVal) * 100} r="2.5" fill="#13335a" />
              ))}
            </svg>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
              {lineChartData.months.map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};