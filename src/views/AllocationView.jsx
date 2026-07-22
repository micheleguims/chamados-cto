// ==========================================
// KANBAN OPERACIONAL - INFRAESTRUTURA ESCOLAR
// src/views/AllocationView.jsx
// ==========================================

import React, { useMemo, useState } from "react";

import {
  STATUS,
  OPEN_STATUSES,
  CRES,
  PRIORITIES,
  CATEGORIES,
  AGENCIES
} from "../config/constants";

import {
  getStatusColor,
  getStatusColumnStyle,
  getPriorityColor,
  getSlaInfo
} from "../utils/helpers";

import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";

import {
  LayoutDashboard,
  Layers,
  School,
  MapPin,
  Flag,
  Wrench,
  Search,
  FilterX,
  Eye,
  Clock,
  AlertTriangle,
  ArrowDownUp,
  ClipboardList,
  KanbanSquare,
  Building2,
  Gauge,
  History,
  MoveRight,
  RefreshCcw
} from "lucide-react";

export default function AllocationView({
  tickets,
  onUpdateTicket,
  onBulkUpdateTickets,
  onViewTicket
}) {
  const [viewLayout, setViewLayout] = useState("status");
  const [sortMode, setSortMode] = useState("sla");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCre, setFilterCre] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [includeClosed, setIncludeClosed] = useState(false);

  const normalizeText = (value) => {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const isClosedStatus = (status) => {
    return ["Resolvido", "Encerrado", "Cancelado"].includes(status);
  };

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

  const getTicketAgency = (ticket) => {
    return ticket?.externalAction?.agency || "";
  };

  const getTicketProtocol = (ticket) => {
    return ticket?.externalAction?.protocol || "";
  };

  const getPriorityWeight = (priority) => {
    const map = {
      Crítica: 1,
      Alta: 2,
      Média: 3,
      Baixa: 4
    };

    return map[priority] || 99;
  };

  const getSlaWeight = (ticket) => {
    const sla = getSlaInfo(ticket.createdAt, ticket.priority, ticket.status);

    if (!sla) return 999;

    if (sla.type === "expired") return 1;
    if (sla.type === "warning") return 2;
    if (sla.type === "ok") return 3;

    return 999;
  };

  const getOpenedLabel = (dateString) => {
    if (!dateString) return "-";

    const created = new Date(dateString);
    const now = new Date();

    const diffHours = Math.floor((now - created) / (1000 * 60 * 60));

    if (diffHours < 1) return "Aberto agora";
    if (diffHours < 24) return `${diffHours}h aberto`;

    const days = Math.floor(diffHours / 24);
    return `${days} ${days === 1 ? "dia" : "dias"} aberto`;
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

  const getCurrentUserLabel = () => {
    return "Operador";
  };

  const createHistoryEntry = (type, message) => {
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type,
      message,
      date: new Date().toISOString()
    };
  };

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        const ticketStatus = ticket.status || "";

        if (!includeClosed && isClosedStatus(ticketStatus)) {
          return false;
        }

        const searchableText = normalizeText(
          [
            ticket.id,
            ticket.title,
            getTicketSchoolName(ticket),
            getTicketSchoolCode(ticket),
            getTicketNeighborhood(ticket),
            getTicketCre(ticket),
            ticket.category,
            ticket.subcategory,
            ticket.priority,
            ticket.status,
            ticket.impact,
            getTicketAgency(ticket),
            getTicketProtocol(ticket),
            ticket.description
          ].join(" ")
        );

        const matchSearch = searchableText.includes(normalizeText(searchTerm));

        const matchCre = filterCre ? getTicketCre(ticket) === filterCre : true;

        const matchCategory = filterCategory
          ? ticket.category === filterCategory
          : true;

        const matchPriority = filterPriority
          ? ticket.priority === filterPriority
          : true;

        return matchSearch && matchCre && matchCategory && matchPriority;
      })
      .sort((a, b) => {
        if (sortMode === "sla") {
          const slaDiff = getSlaWeight(a) - getSlaWeight(b);
          if (slaDiff !== 0) return slaDiff;

          const priorityDiff =
            getPriorityWeight(a.priority) - getPriorityWeight(b.priority);

          if (priorityDiff !== 0) return priorityDiff;

          return new Date(a.createdAt) - new Date(b.createdAt);
        }

        if (sortMode === "priority") {
          const priorityDiff =
            getPriorityWeight(a.priority) - getPriorityWeight(b.priority);

          if (priorityDiff !== 0) return priorityDiff;

          return new Date(a.createdAt) - new Date(b.createdAt);
        }

        if (sortMode === "date_asc") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }

        if (sortMode === "date_desc") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }

        return 0;
      });
  }, [
    tickets,
    includeClosed,
    searchTerm,
    filterCre,
    filterCategory,
    filterPriority,
    sortMode
  ]);

  const columns = useMemo(() => {
    if (viewLayout === "status") {
      return STATUS.map((status) => ({
        id: status,
        label: status,
        type: "status",
        icon: Layers
      }));
    }

    if (viewLayout === "cre") {
      const extraCres = Array.from(
        new Set(
          filteredTickets
            .map((ticket) => getTicketCre(ticket))
            .filter(Boolean)
            .filter((cre) => !CRES.includes(cre))
        )
      );

      return [...CRES, ...extraCres, "CRE não informada"].map((cre) => ({
        id: cre,
        label: cre,
        type: "cre",
        icon: School
      }));
    }

    if (viewLayout === "priority") {
      return [
        ...PRIORITIES.map((priority) => ({
          id: priority.name,
          label: priority.name,
          type: "priority",
          icon: Flag
        })),
        {
          id: "Sem prioridade",
          label: "Sem prioridade",
          type: "priority",
          icon: Flag
        }
      ];
    }

    if (viewLayout === "agency") {
      const extraAgencies = Array.from(
        new Set(
          filteredTickets
            .map((ticket) => getTicketAgency(ticket))
            .filter(Boolean)
            .filter((agency) => !AGENCIES.includes(agency))
        )
      );

      return ["Sem acionamento", ...AGENCIES, ...extraAgencies].map(
        (agency) => ({
          id: agency,
          label: agency,
          type: "agency",
          icon: Wrench
        })
      );
    }

    return [];
  }, [viewLayout, filteredTickets]);

  const getCardsForColumn = (column) => {
    return filteredTickets.filter((ticket) => {
      if (column.type === "status") {
        return ticket.status === column.id;
      }

      if (column.type === "cre") {
        const ticketCre = getTicketCre(ticket) || "CRE não informada";
        return ticketCre === column.id;
      }

      if (column.type === "priority") {
        const ticketPriority = ticket.priority || "Sem prioridade";
        return ticketPriority === column.id;
      }

      if (column.type === "agency") {
        const ticketAgency = getTicketAgency(ticket) || "Sem acionamento";
        return ticketAgency === column.id;
      }

      return false;
    });
  };

  const getColumnStyle = (column) => {
    if (column.type === "status") {
      return getStatusColumnStyle(column.id);
    }

    if (column.type === "priority") {
      switch (column.id) {
        case "Crítica":
          return "bg-red-50 border-red-200";
        case "Alta":
          return "bg-orange-50 border-orange-200";
        case "Média":
          return "bg-yellow-50 border-yellow-200";
        case "Baixa":
          return "bg-green-50 border-green-200";
        default:
          return "bg-slate-50 border-slate-200";
      }
    }

    if (column.type === "agency") {
      return column.id === "Sem acionamento"
        ? "bg-slate-50 border-slate-200"
        : "bg-purple-50 border-purple-200";
    }

    if (column.type === "cre") {
      return column.id === "CRE não informada"
        ? "bg-slate-50 border-slate-200"
        : "bg-blue-50 border-blue-200";
    }

    return "bg-white border-slate-200";
  };

  const getColumnBadgeClass = (column) => {
    if (column.type === "status") {
      return getStatusColor(column.id);
    }

    if (column.type === "priority") {
      return getPriorityColor(column.id);
    }

    if (column.type === "agency") {
      return column.id === "Sem acionamento"
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : "bg-purple-100 text-purple-800 border-purple-200";
    }

    if (column.type === "cre") {
      return column.id === "CRE não informada"
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : "bg-blue-100 text-blue-800 border-blue-200";
    }

    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const handleDragStart = (e, ticketId) => {
    e.dataTransfer.setData("ticketId", ticketId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropToColumn = (e, column) => {
    e.preventDefault();

    const ticketId = e.dataTransfer.getData("ticketId");
    const ticket = tickets.find((item) => item.id === ticketId);

    if (!ticket) return;

    const now = new Date().toISOString();

    let updatedTicket = {
      ...ticket,
      updatedAt: now
    };

    let message = "";

    if (column.type === "status") {
      const oldStatus = ticket.status;
      const newStatus = column.id;

      if (oldStatus === newStatus) return;

      updatedTicket.status = newStatus;

      if (newStatus === "Resolvido") {
        updatedTicket.resolution = {
          ...(ticket.resolution || {}),
          resolvedAt: ticket?.resolution?.resolvedAt || now
        };
      }

      if (newStatus === "Encerrado") {
        updatedTicket.resolution = {
          ...(ticket.resolution || {}),
          closedAt: ticket?.resolution?.closedAt || now,
          closedBy:
            ticket?.resolution?.closedBy ||
            getCurrentUserLabel()
        };
      }

      message = `Status alterado via Kanban de [${oldStatus}] para [${newStatus}].`;
    }

    if (column.type === "cre") {
      const oldCre = getTicketCre(ticket) || "CRE não informada";
      const newCre = column.id === "CRE não informada" ? "" : column.id;

      if (oldCre === column.id) return;

      updatedTicket.school = {
        ...(ticket.school || {}),
        cre: newCre
      };

      updatedTicket.sector = newCre;

      message = `CRE alterada via Kanban de [${oldCre}] para [${
        newCre || "CRE não informada"
      }].`;
    }

    if (column.type === "priority") {
      const oldPriority = ticket.priority || "Sem prioridade";
      const newPriority = column.id === "Sem prioridade" ? "" : column.id;

      if (oldPriority === column.id) return;

      updatedTicket.priority = newPriority;

      message = `Prioridade alterada via Kanban de [${oldPriority}] para [${
        newPriority || "Sem prioridade"
      }].`;
    }

    if (column.type === "agency") {
      const oldAgency = getTicketAgency(ticket) || "Sem acionamento";
      const newAgency = column.id === "Sem acionamento" ? "" : column.id;

      if (oldAgency === column.id) return;

      updatedTicket.externalAction = {
        ...(ticket.externalAction || {}),
        agency: newAgency
      };

      if (
        newAgency &&
        ["Aberto", "Em análise"].includes(ticket.status)
      ) {
        updatedTicket.status = "Encaminhado";

        message = `Órgão/concessionária alterado via Kanban de [${oldAgency}] para [${newAgency}]. Status atualizado automaticamente para [Encaminhado].`;
      } else {
        message = `Órgão/concessionária alterado via Kanban de [${oldAgency}] para [${
          newAgency || "Sem acionamento"
        }].`;
      }
    }

    const logEntry = createHistoryEntry("kanban_movement", message);

    updatedTicket.history = [...(ticket.history || []), logEntry];

    onUpdateTicket(updatedTicket);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCre("");
    setFilterCategory("");
    setFilterPriority("");
  };

  const summary = useMemo(() => {
    const total = filteredTickets.length;
    const open = filteredTickets.filter((ticket) =>
      OPEN_STATUSES.includes(ticket.status)
    ).length;
    const critical = filteredTickets.filter(
      (ticket) => ticket.priority === "Crítica"
    ).length;
    const expired = filteredTickets.filter((ticket) => {
      const sla = getSlaInfo(ticket.createdAt, ticket.priority, ticket.status);
      return sla?.type === "expired";
    }).length;

    return {
      total,
      open,
      critical,
      expired
    };
  }, [filteredTickets]);

  const renderTicketCard = (ticket) => {
    const slaInfo = getSlaInfo(ticket.createdAt, ticket.priority, ticket.status);
    const schoolName = getTicketSchoolName(ticket);
    const cre = getTicketCre(ticket);
    const agency = getTicketAgency(ticket);
    const protocol = getTicketProtocol(ticket);

    return (
      <div
        key={ticket.id}
        draggable
        onDragStart={(e) => handleDragStart(e, ticket.id)}
        onClick={() => onViewTicket(ticket)}
        className="bg-white p-3 rounded-lg border border-slate-200 cursor-pointer shadow-sm transition-all hover:shadow-md hover:border-[#66b6e3] group"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="font-mono text-xs font-bold text-[#13335a]">
            {ticket.id}
          </div>

          <Eye className="w-4 h-4 text-slate-300 group-hover:text-[#13335a] transition" />
        </div>

        <h4 className="font-bold text-slate-800 text-sm leading-snug mb-2">
          {ticket.title || "Chamado de infraestrutura"}
        </h4>

        <div className="space-y-1 mb-3">
          <div className="text-xs text-slate-600 flex items-start">
            <School className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-[#13335a] flex-shrink-0" />
            <span className="line-clamp-2">{schoolName}</span>
          </div>

          <div className="text-xs text-slate-400 flex items-center">
            <Building2 className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
            <span>{cre || "CRE não informada"}</span>
          </div>

          {getTicketNeighborhood(ticket) && (
            <div className="text-xs text-slate-400 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              <span>{getTicketNeighborhood(ticket)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge colorClass={getStatusColor(ticket.status)}>
            {ticket.status}
          </Badge>

          {ticket.priority && (
            <Badge colorClass={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
          )}
        </div>

        <div className="text-xs text-slate-500 mb-2">
          <span className="font-semibold text-slate-700">
            {ticket.category || "-"}
          </span>
          {ticket.subcategory ? ` • ${ticket.subcategory}` : ""}
        </div>

        {ticket.impact && (
          <div className="text-xs text-slate-400 mb-2">
            Impacto: {ticket.impact}
          </div>
        )}

        {slaInfo && (
          <div
            className={`px-2 py-1 rounded border text-xs inline-flex items-center mb-2 ${slaInfo.classes}`}
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            {slaInfo.text}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {getOpenedLabel(ticket.createdAt)}
          </span>

          {agency ? (
            <span className="flex items-center max-w-[130px] truncate">
              <Wrench className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{agency}</span>
            </span>
          ) : (
            <span>Sem acionamento</span>
          )}
        </div>

        {protocol && (
          <div className="mt-2 text-[11px] text-slate-500 font-mono bg-slate-50 border border-slate-100 rounded px-2 py-1 truncate">
            Protocolo: {protocol}
          </div>
        )}

        <div className="mt-2 text-[10px] text-slate-300">
          Atualizado em {formatDateTime(ticket.updatedAt)}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-120px)] space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <KanbanSquare className="mr-2 text-[#13335a]" />
            Painel Operacional de Infraestrutura
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Organize chamados por status, CRE, prioridade ou órgão/concessionária.
            Arraste os cards entre colunas para atualizar o fluxo operacional.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 text-center">
            <div className="text-xs text-slate-500">Total</div>
            <div className="text-xl font-bold text-[#13335a]">
              {summary.total}
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-100 shadow-sm px-4 py-3 text-center">
            <div className="text-xs text-blue-700">Pendentes</div>
            <div className="text-xl font-bold text-blue-800">
              {summary.open}
            </div>
          </div>

          <div className="bg-red-50 rounded-xl border border-red-100 shadow-sm px-4 py-3 text-center">
            <div className="text-xs text-red-700">Críticos</div>
            <div className="text-xl font-bold text-red-800">
              {summary.critical}
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl border border-amber-100 shadow-sm px-4 py-3 text-center">
            <div className="text-xs text-amber-700">SLA vencido</div>
            <div className="text-xl font-bold text-amber-800">
              {summary.expired}
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setViewLayout("status")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center transition ${
                viewLayout === "status"
                  ? "bg-[#13335a] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Layers className="w-4 h-4 mr-1.5" />
              Por Status
            </button>

            <button
              type="button"
              onClick={() => setViewLayout("cre")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center transition ${
                viewLayout === "cre"
                  ? "bg-[#13335a] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <School className="w-4 h-4 mr-1.5" />
              Por CRE
            </button>

            <button
              type="button"
              onClick={() => setViewLayout("priority")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center transition ${
                viewLayout === "priority"
                  ? "bg-[#13335a] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Flag className="w-4 h-4 mr-1.5" />
              Por Prioridade
            </button>

            <button
              type="button"
              onClick={() => setViewLayout("agency")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center transition ${
                viewLayout === "agency"
                  ? "bg-[#13335a] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Wrench className="w-4 h-4 mr-1.5" />
              Por Órgão
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <label className="flex items-center text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded text-[#13335a] focus:ring-[#13335a] mr-2"
                checked={includeClosed}
                onChange={(e) => setIncludeClosed(e.target.checked)}
              />
              Incluir resolvidos/encerrados
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <FilterX className="w-4 h-4 mr-1.5" />
              Limpar filtros
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Busca geral
            </label>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />

              <input
                type="text"
                placeholder="Chamado, escola, bairro, protocolo..."
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
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center">
            <LayoutDashboard className="w-4 h-4 mr-1.5 text-[#13335a]" />
            Exibindo{" "}
            <strong className="mx-1 text-[#13335a]">
              {filteredTickets.length}
            </strong>
            chamado(s) no quadro.
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center">
              <ArrowDownUp className="w-4 h-4 mr-1" />
              Ordenar:
            </span>

            <select
              className="p-2 pr-8 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
            >
              <option value="sla">SLA e criticidade</option>
              <option value="priority">Prioridade</option>
              <option value="date_asc">Mais antigos</option>
              <option value="date_desc">Mais recentes</option>
            </select>
          </div>
        </div>
      </div>

      {/* QUADRO KANBAN */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start">
        {columns.map((column) => {
          const ColumnIcon = column.icon || ClipboardList;
          const columnTickets = getCardsForColumn(column);

          return (
            <div
              key={`${column.type}-${column.id}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropToColumn(e, column)}
              className={`rounded-xl border p-4 min-w-[320px] w-[320px] flex flex-col shadow-sm ${getColumnStyle(
                column
              )}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3 border-b border-white/60 pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center">
                    <ColumnIcon className="w-4 h-4 mr-2 text-[#13335a]" />
                    {column.label}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Arraste chamados para cá para atualizar este agrupamento.
                  </p>
                </div>

                <span
                  className={`px-2 py-1 rounded-full border text-xs font-bold ${getColumnBadgeClass(
                    column
                  )}`}
                >
                  {columnTickets.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 min-h-[220px]">
                {columnTickets.length === 0 ? (
                  <div className="mt-2">
                    <EmptyState
                      message="Sem chamados nesta coluna"
                      icon={MoveRight}
                    />
                  </div>
                ) : (
                  columnTickets.map((ticket) => renderTicketCard(ticket))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* RODAPÉ DE ORIENTAÇÃO */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-start">
          <Gauge className="w-4 h-4 mr-2 mt-0.5 text-[#13335a] flex-shrink-0" />
          <span>
            A visão por <strong>Status</strong> altera o ciclo do chamado.
            A visão por <strong>CRE</strong> altera a regional. A visão por{" "}
            <strong>Prioridade</strong> altera criticidade/SLA. A visão por{" "}
            <strong>Órgão</strong> atualiza o acionamento externo.
          </span>
        </div>

        <div className="flex items-center text-slate-400">
          <History className="w-4 h-4 mr-1" />
          Toda movimentação gera registro no histórico do chamado.
        </div>
      </div>
    </div>
  );
}