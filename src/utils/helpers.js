// ==========================================
// FUNÇÕES AUXILIARES
// src/utils/helpers.js
// ==========================================

import { PRIORITIES } from "../config/constants";

// ------------------------------------------
// STATUS
// ------------------------------------------

export const getStatusColor = (status) => {
  switch (status) {
    case "Aberto":
      return "bg-blue-100 text-blue-800 border-blue-200";

    case "Em análise":
      return "bg-amber-100 text-amber-800 border-amber-200";

    case "Encaminhado":
      return "bg-purple-100 text-purple-800 border-purple-200";

    case "Em atendimento":
      return "bg-orange-100 text-orange-800 border-orange-200";

    case "Reiterado":
      return "bg-red-100 text-red-800 border-red-200";

    case "Aguardando retorno":
      return "bg-slate-100 text-slate-800 border-slate-200";

    case "Resolvido":
      return "bg-green-100 text-green-800 border-green-200";

    case "Encerrado":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";

    case "Cancelado":
      return "bg-gray-200 text-gray-700 border-gray-300";

    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

// ------------------------------------------
// PRIORIDADE
// ------------------------------------------

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "Crítica":
      return "bg-red-100 text-red-800 border-red-200";

    case "Alta":
      return "bg-orange-100 text-orange-800 border-orange-200";

    case "Média":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";

    case "Baixa":
      return "bg-green-100 text-green-800 border-green-200";

    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

// ------------------------------------------
// DATAS
// ------------------------------------------

export const formatCommentDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleString("pt-BR");
};

// ------------------------------------------
// TEMPO DECORRIDO
// ------------------------------------------

export const getHoursOpen = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();

  return Math.floor(
    (now - created) / (1000 * 60 * 60)
  );
};

export const getDaysOpen = (createdAt) => {
  return Math.floor(
    getHoursOpen(createdAt) / 24
  );
};

// ------------------------------------------
// SLA
// ------------------------------------------

export const getSlaInfo = (
  createdAt,
  priority,
  currentStatus
) => {

  if (
    currentStatus === "Resolvido" ||
    currentStatus === "Encerrado" ||
    currentStatus === "Cancelado"
  ) {
    return null;
  }

  const priorityConfig =
    PRIORITIES.find(
      p => p.name === priority
    );

  if (!priorityConfig) return null;

  const elapsedHours =
    getHoursOpen(createdAt);

  const limit =
    priorityConfig.slaHours;

  const remaining =
    limit - elapsedHours;

  // SLA estourado

  if (remaining < 0) {
    return {
      type: "expired",
      text: `SLA vencido há ${Math.abs(
        remaining
      )}h`,
      classes:
        "bg-red-50 text-red-700 border-red-200 font-bold"
    };
  }

  // Menos de 25% restante

  if (
    remaining <=
    Math.max(
      1,
      Math.floor(limit * 0.25)
    )
  ) {
    return {
      type: "warning",
      text: `${remaining}h restantes`,
      classes:
        "bg-yellow-50 text-yellow-700 border-yellow-200 font-semibold"
    };
  }

  return {
    type: "ok",
    text: `${remaining}h restantes`,
    classes:
      "bg-green-50 text-green-700 border-green-200"
  };
};

// ------------------------------------------
// COLUNA KANBAN
// ------------------------------------------

export const getStatusColumnStyle = (
  status
) => {
  switch (status) {

    case "Aberto":
      return
      "bg-blue-50 border-blue-200";

    case "Em análise":
      return
      "bg-amber-50 border-amber-200";

    case "Encaminhado":
      return
      "bg-purple-50 border-purple-200";

    case "Em atendimento":
      return
      "bg-orange-50 border-orange-200";

    case "Reiterado":
      return
      "bg-red-50 border-red-200";

    case "Aguardando retorno":
      return
      "bg-slate-50 border-slate-200";

    case "Resolvido":
      return
      "bg-green-50 border-green-200";

    case "Encerrado":
      return
      "bg-emerald-50 border-emerald-200";

    default:
      return
      "bg-slate-50 border-slate-200";
  }
};

// ------------------------------------------
// NÚMERO DO CHAMADO
// INF-AAAA-NNNNNN
// ------------------------------------------

export const generateTicketNumber =
  (sequence = 1) => {

  const year =
    new Date().getFullYear();

  return `INF-${year}-${String(
    sequence
  ).padStart(6, "0")}`;
};