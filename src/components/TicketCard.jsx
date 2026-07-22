// ==========================================
// TICKET CARD
// src/components/TicketCard.jsx
// ==========================================

import React from "react";

import {
  School,
  Building2,
  MapPin,
  Clock,
  Wrench,
  AlertTriangle,
  Eye
} from "lucide-react";

import Badge from "./Badge";

import {
  getStatusColor,
  getPriorityColor,
  getSlaInfo
} from "../utils/helpers";

export default function TicketCard({
  ticket,
  onClick,
  draggable = false,
  onDragStart
}) {
  const school =
    ticket?.school || {};

  const agency =
    ticket?.externalAction?.agency;

  const protocol =
    ticket?.externalAction?.protocol;

  const slaInfo =
    getSlaInfo(
      ticket.createdAt,
      ticket.priority,
      ticket.status
    );

  const getOpenedLabel = (
    createdAt
  ) => {

    const created =
      new Date(createdAt);

    const now =
      new Date();

    const diffHours =
      Math.floor(
        (now - created) /
          (1000 * 60 * 60)
      );

    if (diffHours < 1)
      return "Aberto agora";

    if (diffHours < 24)
      return `${diffHours}h aberto`;

    const days =
      Math.floor(
        diffHours / 24
      );

    return `${days} ${
      days === 1
        ? "dia"
        : "dias"
    } aberto`;
  };

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={() => onClick?.(ticket)}
      className="
        bg-white
        p-4
        rounded-xl
        border
        border-slate-200
        shadow-sm
        cursor-pointer
        transition-all
        hover:shadow-md
        hover:border-[#66b6e3]
        group
      "
    >

      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">

        <div>
          <div className="font-mono text-xs font-bold text-[#13335a]">
            {ticket.id}
          </div>
        </div>

        <Eye className="w-4 h-4 text-slate-300 group-hover:text-[#13335a] transition" />

      </div>

      {/* TÍTULO */}
      <h3 className="font-bold text-slate-800 text-sm leading-snug mb-3">
        {ticket.title}
      </h3>

      {/* ESCOLA */}
      <div className="space-y-1 mb-3">

        <div className="text-xs text-slate-700 flex items-start">
          <School className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-[#13335a] flex-shrink-0" />

          <span>
            {school.name ||
              "Unidade não informada"}
          </span>
        </div>

        {school.cre && (
          <div className="text-xs text-slate-500 flex items-center">
            <Building2 className="w-3.5 h-3.5 mr-1.5" />

            {school.cre}
          </div>
        )}

        {school.neighborhood && (
          <div className="text-xs text-slate-500 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1.5" />

            {school.neighborhood}
          </div>
        )}

      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mb-3">

        <Badge
          colorClass={getStatusColor(
            ticket.status
          )}
        >
          {ticket.status}
        </Badge>

        {ticket.priority && (
          <Badge
            colorClass={getPriorityColor(
              ticket.priority
            )}
          >
            {ticket.priority}
          </Badge>
        )}

      </div>

      {/* CATEGORIA */}
      <div className="text-xs text-slate-600 mb-2">

        <span className="font-semibold">
          {ticket.category}
        </span>

        {ticket.subcategory &&
          ` • ${ticket.subcategory}`}
      </div>

      {/* IMPACTO */}
      {ticket.impact && (
        <div className="text-xs text-slate-500 mb-2">
          Impacto: {ticket.impact}
        </div>
      )}

      {/* SLA */}
      {slaInfo && (
        <div
          className={`
            inline-flex
            items-center
            px-2
            py-1
            rounded
            border
            text-xs
            mb-3
            ${slaInfo.classes}
          `}
        >
          <AlertTriangle className="w-3 h-3 mr-1" />

          {slaInfo.text}
        </div>
      )}

      {/* ÓRGÃO */}
      {agency && (
        <div className="text-xs text-slate-500 mb-2 flex items-center">
          <Wrench className="w-3.5 h-3.5 mr-1.5" />
          {agency}
        </div>
      )}

      {/* PROTOCOLO */}
      {protocol && (
        <div className="text-[11px] text-slate-600 mb-2 font-mono bg-slate-50 rounded px-2 py-1 border">
          Protocolo: {protocol}
        </div>
      )}

      {/* RODAPÉ */}
      <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-400">

        <Clock className="w-3 h-3 mr-1" />

        {getOpenedLabel(
          ticket.createdAt
        )}

      </div>

    </div>
  );
}