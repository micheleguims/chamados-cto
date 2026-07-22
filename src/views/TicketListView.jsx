// ==========================================
// LISTAGEM DE CHAMADOS DE INFRAESTRUTURA ESCOLAR
// src/views/TicketListView.jsx
// ==========================================

import React, { useMemo, useState } from "react";

import {
  OPEN_STATUSES,
  STATUS,
  CATEGORIES,
  PRIORITIES,
  CRES
} from "../config/constants";

import {
  getStatusColor,
  getPriorityColor,
  getSlaInfo
} from "../utils/helpers";

import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";

import {
  Search,
  ChevronRight,
  Clock,
  School,
  MapPin,
  AlertTriangle,
  ClipboardList,
  FilterX,
  CalendarDays,
  History,
  SlidersHorizontal
} from "lucide-react";

export default function TicketList({
  tickets,
  currentUser,
  onViewTicket,
  historyMode,
  setHistoryMode,
  filterStatus,
  setFilterStatus
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCre, setFilterCre] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterProtocol, setFilterProtocol] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const role = currentUser?.role || "";
  const currentUserCre = currentUser?.cre || currentUser?.sector || "";
  const currentUserSchoolCode = currentUser?.schoolCode || "";

  const isGlobalProfile = [
    "admin",
    "gestão",
    "gestao",
    "gestão executiva",
    "cor",
    "cto"
  ].includes(role.toLowerCase());

  const isCreProfile = role.toLowerCase() === "cre";
  const isSchoolProfile = role.toLowerCase() === "escola";

  const getTicketCre = (ticket) => {
    return ticket?.school?.cre || ticket?.sector || "";
  };

  const getTicketSchoolName = (ticket) => {
    return ticket?.school?.name || ticket?.title || "Unidade não informada";
  };

  const getTicketSchoolCode = (ticket) => {
    return ticket?.school?.code || "";
  };

  const getTicketNeighborhood = (ticket) => {
    return ticket?.school?.neighborhood || "";
  };

  const getTicketProtocol = (ticket) => {
    return ticket?.externalAction?.protocol || "";
  };

  const getTicketAgency = (ticket) => {
    return ticket?.externalAction?.agency || "";
  };

  const isClosedStatus = (status) => {
    return ["Resolvido", "Encerrado", "Cancelado"].includes(status);
  };

  const hasPermissionToView = (ticket) => {
    if (isGlobalProfile) return true;

    const ticketCre = getTicketCre(ticket);
    const ticketSchoolCode = getTicketSchoolCode(ticket);

    if (isCreProfile) {
      return ticketCre === currentUserCre;
    }

    if (isSchoolProfile && currentUserSchoolCode) {
      return ticketSchoolCode === currentUserSchoolCode;
    }

    // Compatibilidade com login antigo: user/admin
    if (role.toLowerCase() === "user") {
      return ticketCre === currentUserCre || ticket?.sector === currentUserCre;
    }

    return ticketCre === currentUserCre;
  };

  const normalizeText = (value) => {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const isWithinPeriod = (ticket) => {
    if (!startDate && !endDate) return true;

    const createdAt = new Date(ticket.createdAt);

    if (startDate) {
      const start = new Date(`${startDate}T00:00:00`);
      if (createdAt < start) return false;
    }

    if (endDate) {
      const end = new Date(`${endDate}T23:59:59`);
      if (createdAt > end) return false;
    }

    return true;
  };

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        if (!hasPermissionToView(ticket)) return false;

        const ticketStatus = ticket.status || "";
        const ticketCre = getTicketCre(ticket);
        const schoolName = getTicketSchoolName(ticket);
        const schoolCode = getTicketSchoolCode(ticket);
        const neighborhood = getTicketNeighborhood(ticket);
        const protocol = getTicketProtocol(ticket);
        const agency = getTicketAgency(ticket);

        const searchableText = normalizeText([
          ticket.id,
          ticket.title,
          schoolName,
          schoolCode,
          ticketCre,
          neighborhood,
          ticket.category,
          ticket.subcategory,
          ticket.priority,
          ticketStatus,
          protocol,
          agency,
          ticket.description
        ].join(" "));

        const matchSearch = searchableText.includes(
          normalizeText(searchTerm)
        );

        const matchCre = filterCre ? ticketCre === filterCre : true;

        const matchCategory = filterCategory
          ? ticket.category === filterCategory
          : true;

        const matchPriority = filterPriority
          ? ticket.priority === filterPriority
          : true;

        const matchProtocol = filterProtocol
          ? normalizeText(protocol).includes(normalizeText(filterProtocol))
          : true;

        let matchStatus = true;

        if (!historyMode) {
          if (filterStatus && OPEN_STATUSES.includes(filterStatus)) {
            matchStatus = ticketStatus === filterStatus;
          } else {
            matchStatus = OPEN_STATUSES.includes(ticketStatus);
          }
        } else if (filterStatus) {
          matchStatus = ticketStatus === filterStatus;
        }

        return (
          matchSearch &&
          matchCre &&
          matchCategory &&
          matchPriority &&
          matchProtocol &&
          matchStatus &&
          isWithinPeriod(ticket)
        );
      })
      .sort((a, b) => {
        const priorityWeight = {
          Crítica: 1,
          Alta: 2,
          Média: 3,
          Baixa: 4
        };

        const aClosed = isClosedStatus(a.status);
        const bClosed = isClosedStatus(b.status);

        if (aClosed !== bClosed) {
          return aClosed ? 1 : -1;
        }

        const priorityDiff =
          (priorityWeight[a.priority] || 99) -
          (priorityWeight[b.priority] || 99);

        if (priorityDiff !== 0) return priorityDiff;

        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [
    tickets,
    currentUser,
    searchTerm,
    filterCre,
    filterCategory,
    filterPriority,
    filterProtocol,
    filterStatus,
    historyMode,
    startDate,
    endDate
  ]);

  const displayedTickets = historyMode
    ? filteredTickets
    : filteredTickets.slice(0, 5);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCre("");
    setFilterCategory("");
    setFilterPriority("");
    setFilterProtocol("");
    setStartDate("");
    setEndDate("");
    setFilterStatus("");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getOpenedLabel = (dateString) => {
    if (!dateString) return "-";

    const created = new Date(dateString);
    const now = new Date();

    const diffHours = Math.floor(
      (now - created) / (1000 * 60 * 60)
    );

    if (diffHours < 1) return "Aberto agora";
    if (diffHours < 24) return `${diffHours}h aberto`;

    const days = Math.floor(diffHours / 24);
    return `${days} ${days === 1 ? "dia" : "dias"} aberto`;
  };

  return (
    <div className="space-y-6">
      {/* FRAME INFORMATIVO */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold text-slate-800 flex items-center">
              {historyMode ? (
                <History className="w-5 h-5 mr-2 text-[#13335a]" />
              ) : (
                <ClipboardList className="w-5 h-5 mr-2 text-[#13335a]" />
              )}

              {historyMode
                ? "Histórico Completo de Chamados"
                : "Chamados Abertos e Pendentes"}
            </h4>

            <p className="text-sm text-slate-500 mt-1">
              Acompanhe ocorrências de infraestrutura por unidade escolar,
              CRE, prioridade, status, protocolo e prazo de atendimento.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                setHistoryMode(!historyMode);
                setFilterStatus("");
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center ${
                historyMode
                  ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  : "bg-[#13335a] text-white hover:opacity-90"
              }`}
            >
              <History className="w-4 h-4 mr-2" />

              {historyMode
                ? "Voltar aos Pendentes"
                : "Ver Histórico Completo"}
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Limpar filtros
            </button>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center mb-4">
          <SlidersHorizontal className="w-4 h-4 mr-2 text-[#13335a]" />
          <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">
            Filtros de Consulta
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Busca geral
            </label>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />

              <input
                type="text"
                placeholder="Número, escola, bairro, protocolo..."
                className="w-full p-2 pl-8 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              CRE
            </label>

            <select
              className="w-full p-2 pr-8 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
              value={filterCre}
              onChange={(e) => setFilterCre(e.target.value)}
            >
              <option value="">Todas</option>

              {CRES.map((cre) => (
                <option key={cre} value={cre}>
                  {cre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Categoria
            </label>

            <select
              className="w-full p-2 pr-8 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Todas</option>

              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Prioridade
            </label>

            <select
              className="w-full p-2 pr-8 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">Todas</option>

              {PRIORITIES.map((priority) => (
                <option key={priority.name} value={priority.name}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Status
            </label>

            <select
              className="w-full p-2 pr-8 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {!historyMode ? (
                <>
                  <option value="">Todos os pendentes</option>

                  {OPEN_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </>
              ) : (
                <>
                  <option value="">Todos os status</option>

                  {STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Protocolo
            </label>

            <input
              type="text"
              placeholder="Ex: AR-2026"
              className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
              value={filterProtocol}
              onChange={(e) => setFilterProtocol(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Data inicial
            </label>

            <div className="relative">
              <CalendarDays className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />

              <input
                type="date"
                className="w-full p-2 pl-8 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Data final
            </label>

            <div className="relative">
              <CalendarDays className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />

              <input
                type="date"
                className="w-full p-2 pl-8 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Exibindo{" "}
          <strong className="text-[#13335a]">{displayedTickets.length}</strong>{" "}
          de{" "}
          <strong className="text-[#13335a]">{filteredTickets.length}</strong>{" "}
          chamado(s) encontrado(s).
          {!historyMode && filteredTickets.length > 5 && (
            <span className="ml-1">
              Apenas os 5 primeiros pendentes são exibidos neste modo.
            </span>
          )}
        </div>
      </div>

      {/* TABELA DESKTOP */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Chamado</th>
              <th className="px-4 py-3">Unidade Escolar</th>
              <th className="px-4 py-3">Classificação</th>
              <th className="px-4 py-3">Prioridade / SLA</th>
              <th className="px-4 py-3">Protocolo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {displayedTickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8">
                  <EmptyState
                    message="Nenhum chamado encontrado para os filtros selecionados."
                    icon={Search}
                  />
                </td>
              </tr>
            ) : (
              displayedTickets.map((ticket) => {
                const slaInfo = getSlaInfo(
                  ticket.createdAt,
                  ticket.priority,
                  ticket.status
                );

                return (
                  <tr
                    key={ticket.id}
                    onClick={() => onViewTicket(ticket)}
                    className="hover:bg-slate-50 cursor-pointer transition group"
                  >
                    <td className="px-4 py-4 align-top">
                      <div className="font-mono font-bold text-[#13335a]">
                        {ticket.id}
                      </div>

                      <div className="text-xs text-slate-500 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {getOpenedLabel(ticket.createdAt)}
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1">
                        Aberto em {formatDateTime(ticket.createdAt)}
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="font-semibold text-slate-800 flex items-start">
                        <School className="w-4 h-4 mr-2 mt-0.5 text-[#13335a] flex-shrink-0" />
                        <span>{getTicketSchoolName(ticket)}</span>
                      </div>

                      <div className="text-xs text-slate-500 mt-1 ml-6">
                        {getTicketCre(ticket)}
                        {getTicketSchoolCode(ticket)
                          ? ` • Código ${getTicketSchoolCode(ticket)}`
                          : ""}
                      </div>

                      {getTicketNeighborhood(ticket) && (
                        <div className="text-xs text-slate-400 mt-1 ml-6 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {getTicketNeighborhood(ticket)}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="font-medium text-slate-800">
                        {ticket.category || "-"}
                      </div>

                      <div className="text-xs text-slate-500 mt-1">
                        {ticket.subcategory || ticket.classification || "-"}
                      </div>

                      {ticket.impact && (
                        <div className="text-xs text-slate-400 mt-1">
                          Impacto: {ticket.impact}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top">
                      {ticket.priority ? (
                        <Badge colorClass={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Não definida
                        </span>
                      )}

                      {slaInfo && (
                        <div
                          className={`mt-2 px-2 py-1 rounded border text-xs inline-flex items-center ${slaInfo.classes}`}
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {slaInfo.text}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top">
                      {getTicketProtocol(ticket) ? (
                        <>
                          <div className="font-mono text-xs text-slate-700">
                            {getTicketProtocol(ticket)}
                          </div>

                          <div className="text-xs text-slate-400 mt-1">
                            {getTicketAgency(ticket)}
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Sem protocolo
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <Badge colorClass={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 align-middle text-right">
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#13335a] transition" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CARDS MOBILE / TABLET */}
      <div className="lg:hidden space-y-4">
        {displayedTickets.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <EmptyState
              message="Nenhum chamado encontrado para os filtros selecionados."
              icon={Search}
            />
          </div>
        ) : (
          displayedTickets.map((ticket) => {
            const slaInfo = getSlaInfo(
              ticket.createdAt,
              ticket.priority,
              ticket.status
            );

            return (
              <button
                key={ticket.id}
                type="button"
                onClick={() => onViewTicket(ticket)}
                className="w-full text-left bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:border-[#66b6e3] hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono font-bold text-[#13335a]">
                      {ticket.id}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      {getOpenedLabel(ticket.createdAt)}
                    </div>
                  </div>

                  <Badge colorClass={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>

                <div className="mt-3">
                  <div className="font-semibold text-slate-800 flex items-start">
                    <School className="w-4 h-4 mr-2 mt-0.5 text-[#13335a] flex-shrink-0" />
                    <span>{getTicketSchoolName(ticket)}</span>
                  </div>

                  <div className="text-xs text-slate-500 mt-1 ml-6">
                    {getTicketCre(ticket)}
                    {getTicketSchoolCode(ticket)
                      ? ` • ${getTicketSchoolCode(ticket)}`
                      : ""}
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-700">
                  <strong>{ticket.category || "-"}</strong>
                  {ticket.subcategory ? ` • ${ticket.subcategory}` : ""}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {ticket.priority && (
                    <Badge colorClass={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  )}

                  {slaInfo && (
                    <span
                      className={`px-2 py-1 rounded border text-xs inline-flex items-center ${slaInfo.classes}`}
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {slaInfo.text}
                    </span>
                  )}
                </div>

                {getTicketProtocol(ticket) && (
                  <div className="mt-3 text-xs text-slate-500">
                    Protocolo:{" "}
                    <span className="font-mono text-slate-700">
                      {getTicketProtocol(ticket)}
                    </span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}