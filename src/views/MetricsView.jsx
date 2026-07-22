// ==========================================
// DASHBOARD DE INFRAESTRUTURA ESCOLAR
// src/views/MetricsView.jsx
// ==========================================

import React, { useMemo } from "react";

import {
  CATEGORIES,
  CRES,
  PRIORITIES,
  STATUS,
  AGENCIES
} from "../config/constants";

import { getSlaInfo } from "../utils/helpers";

import {
  BarChart3,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  School,
  Building2,
  Wrench,
  Flag,
  Layers,
  TrendingUp
} from "lucide-react";

export default function MetricsView({
  tickets,
  onNavigateWithFilter
}) {

  const metrics = useMemo(() => {

    const total = tickets.length;

    const pending = tickets.filter(
      t =>
        ![
          "Resolvido",
          "Encerrado",
          "Cancelado"
        ].includes(t.status)
    ).length;

    const resolved = tickets.filter(
      t =>
        t.status === "Resolvido" ||
        t.status === "Encerrado"
    ).length;

    const slaExpired = tickets.filter(t => {
      const sla = getSlaInfo(
        t.createdAt,
        t.priority,
        t.status
      );

      return sla?.type === "expired";
    }).length;

    const byStatus = {};
    const byCategory = {};
    const byPriority = {};
    const byCre = {};
    const byAgency = {};
    const bySchool = {};

    tickets.forEach(ticket => {

      byStatus[ticket.status] =
        (byStatus[ticket.status] || 0) + 1;

      if (ticket.category) {
        byCategory[ticket.category] =
          (byCategory[ticket.category] || 0) + 1;
      }

      if (ticket.priority) {
        byPriority[ticket.priority] =
          (byPriority[ticket.priority] || 0) + 1;
      }

      const cre =
        ticket?.school?.cre ||
        ticket?.sector ||
        "Não informada";

      byCre[cre] =
        (byCre[cre] || 0) + 1;

      const agency =
        ticket?.externalAction?.agency ||
        "Sem acionamento";

      byAgency[agency] =
        (byAgency[agency] || 0) + 1;

      const school =
        ticket?.school?.name ||
        "Unidade não informada";

      bySchool[school] =
        (bySchool[school] || 0) + 1;
    });

    const recurringCount =
      tickets.filter(
        t => t?.recurrence?.isRecurring
      ).length;

    return {
      total,
      pending,
      resolved,
      slaExpired,
      recurringCount,
      byStatus,
      byCategory,
      byPriority,
      byCre,
      byAgency,
      bySchool
    };

  }, [tickets]);

  const renderHorizontalChart = (
    dataObj,
    colorClass = "bg-[#13335a]"
  ) => {

    const entries = Object.entries(dataObj);

    const max =
      Math.max(
        ...entries.map(item => item[1]),
        1
      );

    return (
      <div className="space-y-3">
        {entries.map(([label, value]) => {

          const width =
            (value / max) * 100;

          return (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700 truncate mr-3">
                  {label}
                </span>

                <span className="font-semibold text-slate-800">
                  {value}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                <div
                  className={`${colorClass} h-full`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const schoolRanking = Object.entries(
    metrics.bySchool
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="space-y-6">

      {/* CABEÇALHO */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <BarChart3 className="mr-2 text-[#13335a]" />
          Dashboard de Infraestrutura Escolar
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Visão operacional e executiva das ocorrências da rede.
        </p>
      </div>

      {/* CARDS PRINCIPAIS */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">

        <button
          onClick={() =>
            onNavigateWithFilter?.("")
          }
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center hover:shadow-md transition"
        >
          <ClipboardList className="mx-auto mb-2 text-[#13335a]" />
          <div className="text-xs text-slate-500">
            Total
          </div>
          <div className="text-3xl font-bold text-[#13335a]">
            {metrics.total}
          </div>
        </button>

        <button
          onClick={() =>
            onNavigateWithFilter?.("Aberto")
          }
          className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-center"
        >
          <Clock3 className="mx-auto mb-2 text-blue-700" />
          <div className="text-xs text-blue-700">
            Pendentes
          </div>
          <div className="text-3xl font-bold text-blue-800">
            {metrics.pending}
          </div>
        </button>

        <button
          onClick={() =>
            onNavigateWithFilter?.("Resolvido")
          }
          className="bg-green-50 p-5 rounded-xl border border-green-100 text-center"
        >
          <CheckCircle2 className="mx-auto mb-2 text-green-700" />
          <div className="text-xs text-green-700">
            Resolvidos
          </div>
          <div className="text-3xl font-bold text-green-800">
            {metrics.resolved}
          </div>
        </button>

        <div className="bg-red-50 p-5 rounded-xl border border-red-100 text-center">
          <AlertTriangle className="mx-auto mb-2 text-red-700" />
          <div className="text-xs text-red-700">
            SLA Vencido
          </div>
          <div className="text-3xl font-bold text-red-800">
            {metrics.slaExpired}
          </div>
        </div>

        <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 text-center">
          <TrendingUp className="mx-auto mb-2 text-purple-700" />
          <div className="text-xs text-purple-700">
            Recorrências
          </div>
          <div className="text-3xl font-bold text-purple-800">
            {metrics.recurringCount}
          </div>
        </div>

      </div>

      {/* GRID CENTRAL */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <School className="w-4 h-4 mr-2 text-[#13335a]" />
            Distribuição por CRE
          </h3>

          {renderHorizontalChart(
            metrics.byCre,
            "bg-blue-500"
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Layers className="w-4 h-4 mr-2 text-[#13335a]" />
            Distribuição por Categoria
          </h3>

          {renderHorizontalChart(
            metrics.byCategory,
            "bg-emerald-500"
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Flag className="w-4 h-4 mr-2 text-[#13335a]" />
            Distribuição por Prioridade
          </h3>

          {renderHorizontalChart(
            metrics.byPriority,
            "bg-orange-500"
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <ClipboardList className="w-4 h-4 mr-2 text-[#13335a]" />
            Distribuição por Status
          </h3>

          {renderHorizontalChart(
            metrics.byStatus,
            "bg-purple-500"
          )}
        </div>
      </div>

      {/* ÓRGÃOS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
          <Wrench className="w-4 h-4 mr-2 text-[#13335a]" />
          Acionamentos por Órgão / Concessionária
        </h3>

        {renderHorizontalChart(
          metrics.byAgency,
          "bg-indigo-500"
        )}
      </div>

      {/* TOP ESCOLAS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
          <Building2 className="w-4 h-4 mr-2 text-[#13335a]" />
          Unidades com Mais Ocorrências
        </h3>

        <div className="space-y-3">
          {schoolRanking.map(
            ([school, total], index) => (
              <div
                key={school}
                className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-4 py-3"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-[#13335a] text-white flex items-center justify-center text-xs font-bold mr-3">
                    {index + 1}
                  </span>

                  <span className="font-medium text-slate-700">
                    {school}
                  </span>
                </div>

                <span className="font-bold text-[#13335a]">
                  {total}
                </span>
              </div>
            )
          )}
        </div>
      </div>

    </div>
  );
}