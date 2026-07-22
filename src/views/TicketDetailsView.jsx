// ==========================================
// DETALHES DO CHAMADO DE INFRAESTRUTURA ESCOLAR
// src/views/TicketDetailsView.jsx
// ==========================================

import React, { useRef, useState } from "react";

import {
  STATUS,
  PRIORITIES,
  IMPACTS,
  AGENCIES
} from "../config/constants";

import {
  getStatusColor,
  getPriorityColor,
  getSlaInfo,
  formatCommentDate
} from "../utils/helpers";

import Badge from "../components/Badge";

import {
  X,
  Send,
  Paperclip,
  MessageSquare,
  User,
  Trash2,
  ImageIcon,
  FileIcon,
  AlertTriangle,
  Download,
  History,
  Eye,
  School,
  MapPin,
  Phone,
  ClipboardList,
  Clock,
  Siren,
  Wrench,
  CheckCircle,
  RotateCcw,
  ShieldAlert,
  Building2,
  Save,
  FileText,
  Link,
  CheckCircle2,
  Ban,
  RefreshCcw
} from "lucide-react";

export default function TicketDetailsView({
  ticket,
  currentUser,
  onBack,
  onUpdateTicket
}) {
  const fileInputRef = useRef(null);

  const [newComment, setNewComment] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);

  const [externalDraft, setExternalDraft] = useState({
    agency: ticket?.externalAction?.agency || "",
    protocol: ticket?.externalAction?.protocol || "",
    triggeredAt: ticket?.externalAction?.triggeredAt
      ? ticket.externalAction.triggeredAt.slice(0, 16)
      : "",
    responsible: ticket?.externalAction?.responsible || ""
  });

  const [resolutionDraft, setResolutionDraft] = useState({
    solutionApplied: ticket?.resolution?.solutionApplied || "",
    resolvedAt: ticket?.resolution?.resolvedAt
      ? ticket.resolution.resolvedAt.slice(0, 16)
      : "",
    confirmedBySchool: ticket?.resolution?.confirmedBySchool || false,
    closedAt: ticket?.resolution?.closedAt
      ? ticket.resolution.closedAt.slice(0, 16)
      : "",
    closedBy: ticket?.resolution?.closedBy || ""
  });

  const [recurrenceDraft, setRecurrenceDraft] = useState({
    isRecurring: ticket?.recurrence?.isRecurring || false,
    linkedTicketId: ticket?.recurrence?.linkedTicketId || ""
  });

  const role = String(currentUser?.role || "").toLowerCase();

  const isAdmin = role === "admin";
  const isCre = role === "cre";
  const isCor = role === "cor";
  const isCto = role === "cto";
  const isGestao =
    role === "gestão" ||
    role === "gestao" ||
    role === "gestão executiva";
  const isSchool = role === "escola";

  const canOperate =
    isAdmin ||
    isCre ||
    isCor ||
    isCto ||
    isGestao;

  const canEditTriage =
    isAdmin ||
    isCre ||
    isCor ||
    isCto;

  const canEditExternalAction =
    isAdmin ||
    isCto ||
    isCor ||
    isCre;

  const canConfirmSchoolResolution =
    isAdmin ||
    isSchool ||
    isCre;

  const canCloseTicket =
    isAdmin ||
    isCre ||
    isCto ||
    isCor;

  const localHistory = ticket?.history || [];
  const attachments = ticket?.attachments || [];
  const comments = ticket?.comments || [];
  const resolution = ticket?.resolution || {};
  const externalAction = ticket?.externalAction || {};
  const recurrence = ticket?.recurrence || {};

  const school = ticket?.school || {
    cre: ticket?.sector || "",
    code: "",
    name: ticket?.title || "Unidade não informada",
    address: "",
    neighborhood: "",
    phone: ""
  };

  const isClosedStatus = ["Resolvido", "Encerrado", "Cancelado"].includes(
    ticket.status
  );

  const slaInfo = getSlaInfo(
    ticket.createdAt,
    ticket.priority,
    ticket.status
  );

  const createHistoryEntry = (type, message) => ({
    id: Date.now() + Math.floor(Math.random() * 1000),
    type,
    message,
    date: new Date().toISOString()
  });

  const updateTicket = (partialTicket, historyEntry = null) => {
    const updatedTicket = {
      ...ticket,
      ...partialTicket,
      updatedAt: new Date().toISOString(),
      history: historyEntry
        ? [...localHistory, historyEntry]
        : localHistory
    };

    onUpdateTicket(updatedTicket);
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

  const handleAddComment = (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    const now = new Date().toISOString();

    const newCommentObj = {
      id: Date.now(),
      author:
        currentUser?.username ||
        currentUser?.name ||
        currentUser?.role ||
        "Usuário",
      text: newComment.trim(),
      date: now
    };

    const logEntry = createHistoryEntry(
      "comment",
      `Comentário adicionado por ${newCommentObj.author}.`
    );

    updateTicket(
      {
        comments: [...comments, newCommentObj]
      },
      logEntry
    );

    setNewComment("");
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus === ticket.status) return;

    const logEntry = createHistoryEntry(
      "status",
      `Status alterado de [${ticket.status}] para [${newStatus}] por ${
        currentUser?.username || currentUser?.role || "Usuário"
      }.`
    );

    const partialUpdate = {
      status: newStatus
    };

    if (newStatus === "Resolvido" && !resolution?.resolvedAt) {
      partialUpdate.resolution = {
        ...resolution,
        resolvedAt: new Date().toISOString()
      };

      setResolutionDraft(prev => ({
        ...prev,
        resolvedAt: new Date().toISOString().slice(0, 16)
      }));
    }

    updateTicket(partialUpdate, logEntry);
  };

  const handlePriorityChange = (newPriority) => {
    if (newPriority === ticket.priority) return;

    const logEntry = createHistoryEntry(
      "priority",
      `Prioridade alterada de [${
        ticket.priority || "Não definida"
      }] para [${newPriority}] por ${
        currentUser?.username || currentUser?.role || "Usuário"
      }.`
    );

    updateTicket(
      {
        priority: newPriority
      },
      logEntry
    );
  };

  const handleImpactChange = (newImpact) => {
    if (newImpact === ticket.impact) return;

    const logEntry = createHistoryEntry(
      "impact",
      `Impacto operacional alterado de [${
        ticket.impact || "Não definido"
      }] para [${newImpact}] por ${
        currentUser?.username || currentUser?.role || "Usuário"
      }.`
    );

    updateTicket(
      {
        impact: newImpact
      },
      logEntry
    );
  };

  const handleSaveExternalAction = () => {
    const newExternalAction = {
      agency: externalDraft.agency,
      protocol: externalDraft.protocol,
      triggeredAt: externalDraft.triggeredAt
        ? new Date(externalDraft.triggeredAt).toISOString()
        : null,
      responsible: externalDraft.responsible
    };

    const protocolText = externalDraft.protocol
      ? ` com protocolo [${externalDraft.protocol}]`
      : "";

    const logEntry = createHistoryEntry(
      "external_action",
      `Acionamento externo atualizado para [${
        externalDraft.agency || "Órgão/concessionária não informado"
      }]${protocolText}.`
    );

    updateTicket(
      {
        externalAction: newExternalAction
      },
      logEntry
    );
  };

  const handleRegisterReiteration = () => {
    const logEntry = createHistoryEntry(
      "reiteration",
      `Demanda reiterada por ${
        currentUser?.username || currentUser?.role || "Usuário"
      }.`
    );

    updateTicket(
      {
        status: "Reiterado"
      },
      logEntry
    );
  };

  const handleSaveRecurrence = () => {
    const newRecurrence = {
      isRecurring: recurrenceDraft.isRecurring,
      linkedTicketId: recurrenceDraft.linkedTicketId.trim() || null
    };

    const logEntry = createHistoryEntry(
      "recurrence",
      recurrenceDraft.isRecurring
        ? `Chamado marcado como recorrente${
            recurrenceDraft.linkedTicketId
              ? ` e vinculado ao chamado [${recurrenceDraft.linkedTicketId}]`
              : ""
          }.`
        : "Marcação de recorrência removida."
    );

    updateTicket(
      {
        recurrence: newRecurrence
      },
      logEntry
    );
  };

  const handleSaveResolution = () => {
    const newResolution = {
      ...resolution,
      solutionApplied: resolutionDraft.solutionApplied,
      resolvedAt: resolutionDraft.resolvedAt
        ? new Date(resolutionDraft.resolvedAt).toISOString()
        : resolution?.resolvedAt || null,
      confirmedBySchool: resolutionDraft.confirmedBySchool,
      closedAt: resolutionDraft.closedAt
        ? new Date(resolutionDraft.closedAt).toISOString()
        : resolution?.closedAt || null,
      closedBy: resolutionDraft.closedBy || resolution?.closedBy || ""
    };

    const logEntry = createHistoryEntry(
      "resolution",
      `Informações de resolução atualizadas por ${
        currentUser?.username || currentUser?.role || "Usuário"
      }.`
    );

    updateTicket(
      {
        resolution: newResolution
      },
      logEntry
    );
  };

  const handleMarkAsResolved = () => {
    if (!resolutionDraft.solutionApplied.trim()) {
      alert("Informe a solução aplicada antes de marcar como resolvido.");
      return;
    }

    const now = new Date().toISOString();

    const newResolution = {
      ...resolution,
      solutionApplied: resolutionDraft.solutionApplied,
      resolvedAt: resolutionDraft.resolvedAt
        ? new Date(resolutionDraft.resolvedAt).toISOString()
        : now,
      confirmedBySchool: resolutionDraft.confirmedBySchool,
      closedAt: resolution?.closedAt || null,
      closedBy: resolution?.closedBy || ""
    };

    const logEntry = createHistoryEntry(
      "resolved",
      `Chamado marcado como resolvido. Solução registrada: [${resolutionDraft.solutionApplied}].`
    );

    updateTicket(
      {
        status: "Resolvido",
        resolution: newResolution
      },
      logEntry
    );

    setResolutionDraft(prev => ({
      ...prev,
      resolvedAt: prev.resolvedAt || now.slice(0, 16)
    }));
  };

  const handleConfirmBySchool = () => {
    const newResolution = {
      ...resolution,
      solutionApplied: resolutionDraft.solutionApplied || resolution.solutionApplied || "",
      resolvedAt: resolutionDraft.resolvedAt
        ? new Date(resolutionDraft.resolvedAt).toISOString()
        : resolution?.resolvedAt || null,
      confirmedBySchool: true,
      closedAt: resolution?.closedAt || null,
      closedBy: resolution?.closedBy || ""
    };

    const logEntry = createHistoryEntry(
      "school_confirmation",
      `Unidade escolar confirmou ciência/validação da resolução por ${
        currentUser?.username || currentUser?.role || "Usuário"
      }.`
    );

    updateTicket(
      {
        resolution: newResolution
      },
      logEntry
    );

    setResolutionDraft(prev => ({
      ...prev,
      confirmedBySchool: true
    }));
  };

  const handleCloseTicket = () => {
    const effectiveSolution =
      resolutionDraft.solutionApplied ||
      resolution?.solutionApplied ||
      "";

    const effectiveResolvedAt =
      resolutionDraft.resolvedAt ||
      resolution?.resolvedAt ||
      "";

    const effectiveConfirmed =
      resolutionDraft.confirmedBySchool ||
      resolution?.confirmedBySchool;

    if (!effectiveSolution.trim()) {
      alert("Não é possível encerrar sem registrar a solução aplicada.");
      return;
    }

    if (!effectiveResolvedAt) {
      alert("Não é possível encerrar sem data/hora de resolução.");
      return;
    }

    if (!effectiveConfirmed) {
      alert("Não é possível encerrar sem confirmação/ciência da unidade escolar.");
      return;
    }

    const now = new Date().toISOString();

    const closer =
      currentUser?.username ||
      currentUser?.name ||
      currentUser?.role ||
      "Usuário";

    const newResolution = {
      ...resolution,
      solutionApplied: effectiveSolution,
      resolvedAt: resolutionDraft.resolvedAt
        ? new Date(resolutionDraft.resolvedAt).toISOString()
        : resolution.resolvedAt,
      confirmedBySchool: true,
      closedAt: now,
      closedBy: closer
    };

    const logEntry = createHistoryEntry(
      "close",
      `Chamado encerrado formalmente por ${closer}.`
    );

    updateTicket(
      {
        status: "Encerrado",
        resolution: newResolution
      },
      logEntry
    );

    setResolutionDraft(prev => ({
      ...prev,
      closedAt: now.slice(0, 16),
      closedBy: closer
    }));
  };

  const handleCancelTicket = () => {
    const logEntry = createHistoryEntry(
      "cancel",
      `Chamado cancelado por ${
        currentUser?.username || currentUser?.role || "Usuário"
      }.`
    );

    updateTicket(
      {
        status: "Cancelado"
      },
      logEntry
    );
  };

  const handleReopenTicket = () => {
    const logEntry = createHistoryEntry(
      "reopen",
      `Chamado reaberto por ${
        currentUser?.username || currentUser?.role || "Usuário"
      }.`
    );

    updateTicket(
      {
        status: "Em análise"
      },
      logEntry
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const newAttachment = {
      id: Date.now(),
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      url: URL.createObjectURL(file)
    };

    const logEntry = createHistoryEntry(
      "upload",
      `Arquivo [${file.name}] anexado por ${
        currentUser?.username || currentUser?.role || "Usuário"
      }.`
    );

    updateTicket(
      {
        attachments: [...attachments, newAttachment]
      },
      logEntry
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const confirmDeleteFile = (id) => {
    const targetFile = attachments.find(att => att.id === id);

    const logEntry = createHistoryEntry(
      "delete_file",
      `Arquivo [${
        targetFile?.name || "Inominado"
      }] removido por ${
        currentUser?.username || currentUser?.role || "Usuário"
      }.`
    );

    updateTicket(
      {
        attachments: attachments.filter(att => att.id !== id)
      },
      logEntry
    );

    setFileToDelete(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-6">
        {/* COLUNA PRINCIPAL */}
        <div className="flex-1 space-y-6">
          <button
            onClick={onBack}
            className="text-[#13335a] hover:text-[#66b6e3] transition flex items-center text-sm font-medium"
          >
            ← Voltar para listagem
          </button>

          {/* CABEÇALHO DO CHAMADO */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge colorClass={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>

                  {ticket.priority && (
                    <Badge colorClass={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  )}

                  {recurrence?.isRecurring && (
                    <span className="px-2 py-1 rounded border text-xs bg-purple-50 text-purple-700 border-purple-200 font-semibold inline-flex items-center">
                      <RefreshCcw className="w-3 h-3 mr-1" />
                      Recorrente
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-slate-800">
                  {ticket.title || "Chamado de infraestrutura"}
                </h1>

                <p className="text-slate-500 font-mono text-sm mt-1">
                  {ticket.id}
                </p>
              </div>

              <div className="text-sm text-slate-500 lg:text-right">
                <div className="flex lg:justify-end items-center">
                  <Clock className="w-4 h-4 mr-1 text-slate-400" />
                  {getOpenedLabel(ticket.createdAt)}
                </div>

                <div className="text-xs mt-1">
                  Aberto em {formatDateTime(ticket.createdAt)}
                </div>

                <div className="text-xs mt-1">
                  Atualizado em {formatDateTime(ticket.updatedAt)}
                </div>
              </div>
            </div>

            {slaInfo && (
              <div
                className={`mb-5 px-3 py-2 rounded-lg border text-sm inline-flex items-center ${slaInfo.classes}`}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                {slaInfo.text}
              </div>
            )}

            {/* DADOS DA UNIDADE */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 mb-5">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center">
                <School className="w-4 h-4 mr-2 text-[#13335a]" />
                Unidade Escolar
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="md:col-span-2">
                  <span className="block text-slate-500">Nome da unidade</span>
                  <span className="font-semibold text-slate-800">
                    {school.name || "Não informado"}
                  </span>
                </div>

                <div>
                  <span className="block text-slate-500">CRE</span>
                  <span className="font-semibold text-slate-800">
                    {school.cre || ticket.sector || "Não informada"}
                  </span>
                </div>

                <div>
                  <span className="block text-slate-500">Código</span>
                  <span className="font-semibold text-slate-800">
                    {school.code || "Não informado"}
                  </span>
                </div>

                <div>
                  <span className="block text-slate-500">Bairro</span>
                  <span className="font-semibold text-slate-800">
                    {school.neighborhood || "Não informado"}
                  </span>
                </div>

                <div>
                  <span className="block text-slate-500">Telefone da direção</span>
                  <span className="font-semibold text-slate-800 flex items-center">
                    <Phone className="w-3 h-3 mr-1 text-slate-400" />
                    {school.phone || "Não informado"}
                  </span>
                </div>

                <div className="md:col-span-3">
                  <span className="block text-slate-500">Endereço</span>
                  <span className="font-semibold text-slate-800 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                    {school.address || "Não informado"}
                  </span>
                </div>
              </div>
            </div>

            {/* CLASSIFICAÇÃO */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-sm">
              <div>
                <span className="block text-slate-500">Categoria</span>
                <span className="font-semibold text-slate-800">
                  {ticket.category || "-"}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">Subcategoria</span>
                <span className="font-semibold text-slate-800">
                  {ticket.subcategory || "-"}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">Impacto</span>
                <span className="font-semibold text-slate-800">
                  {ticket.impact || "-"}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">Origem</span>
                <span className="font-semibold text-slate-800">
                  {ticket.origin || "-"}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">Local afetado</span>
                <span className="font-semibold text-slate-800">
                  {ticket.affectedLocation || "-"}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">Abrangência</span>
                <span className="font-semibold text-slate-800">
                  {ticket.scope || "-"}
                </span>
              </div>

              <div className="md:col-span-2">
                <span className="block text-slate-500">
                  E-mails de notificação
                </span>
                <span className="font-semibold text-[#13335a]">
                  {(ticket.requesterEmails || []).join(", ") || "Nenhum"}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="font-semibold text-slate-800 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-[#13335a]" />
                Descrição da ocorrência
              </h3>

              <div className="bg-slate-50 p-4 rounded text-slate-700 whitespace-pre-wrap text-sm border border-slate-100">
                {ticket.description || "Sem descrição informada."}
              </div>
            </div>
          </div>

          {/* TRIGEM / OPERAÇÃO */}
          {canEditTriage && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center">
                <ShieldAlert className="w-4 h-4 mr-2 text-[#13335a]" />
                Triagem e Controle Operacional
              </h3>

              <div>
                <h4 className="font-semibold text-slate-700 mb-2 text-sm">
                  Status do chamado
                </h4>

                <div className="flex flex-wrap gap-2">
                  {STATUS.map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(status)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                        ticket.status === status
                          ? "bg-[#13335a] text-white ring-2 ring-[#66b6e3]"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-2 text-sm">
                    Prioridade
                  </label>

                  <select
                    className="w-full p-2 pr-8 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                    value={ticket.priority || ""}
                    onChange={e => handlePriorityChange(e.target.value)}
                  >
                    <option value="">Selecione...</option>

                    {PRIORITIES.map(priority => (
                      <option key={priority.name} value={priority.name}>
                        {priority.name} — SLA {priority.slaHours}h
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-2 text-sm">
                    Impacto na operação escolar
                  </label>

                  <select
                    className="w-full p-2 pr-8 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                    value={ticket.impact || ""}
                    onChange={e => handleImpactChange(e.target.value)}
                  >
                    <option value="">Selecione...</option>

                    {IMPACTS.map(impact => (
                      <option key={impact} value={impact}>
                        {impact}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRegisterReiteration}
                  className="px-4 py-2 rounded bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-sm font-semibold flex items-center"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Registrar Reiteração
                </button>

                {isClosedStatus && (
                  <button
                    type="button"
                    onClick={handleReopenTicket}
                    className="px-4 py-2 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-sm font-semibold flex items-center"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reabrir Chamado
                  </button>
                )}

                {ticket.status !== "Cancelado" && (
                  <button
                    type="button"
                    onClick={handleCancelTicket}
                    className="px-4 py-2 rounded bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 text-sm font-semibold flex items-center"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ACIONAMENTO EXTERNO */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center">
                <Wrench className="w-4 h-4 mr-2 text-[#13335a]" />
                Acionamento Externo
              </h3>

              {externalAction.protocol && (
                <span className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-full font-mono">
                  Protocolo: {externalAction.protocol}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="block text-slate-500">Órgão/concessionária</span>
                <span className="font-semibold text-slate-800">
                  {externalAction.agency || "Não informado"}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">Protocolo</span>
                <span className="font-semibold text-slate-800">
                  {externalAction.protocol || "Não informado"}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">Data/hora</span>
                <span className="font-semibold text-slate-800">
                  {formatDateTime(externalAction.triggeredAt)}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">Responsável</span>
                <span className="font-semibold text-slate-800">
                  {externalAction.responsible || "Não informado"}
                </span>
              </div>
            </div>

            {canEditExternalAction && (
              <div className="pt-5 border-t border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-3 text-sm">
                  Atualizar acionamento
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Órgão/concessionária
                    </label>

                    <select
                      className="w-full p-2 pr-8 border rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                      value={externalDraft.agency}
                      onChange={e =>
                        setExternalDraft(prev => ({
                          ...prev,
                          agency: e.target.value
                        }))
                      }
                    >
                      <option value="">Selecione...</option>

                      {AGENCIES.map(agency => (
                        <option key={agency} value={agency}>
                          {agency}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Protocolo
                    </label>

                    <input
                      type="text"
                      className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                      value={externalDraft.protocol}
                      onChange={e =>
                        setExternalDraft(prev => ({
                          ...prev,
                          protocol: e.target.value
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Data/hora
                    </label>

                    <input
                      type="datetime-local"
                      className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                      value={externalDraft.triggeredAt}
                      onChange={e =>
                        setExternalDraft(prev => ({
                          ...prev,
                          triggeredAt: e.target.value
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Responsável
                    </label>

                    <input
                      type="text"
                      className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                      value={externalDraft.responsible}
                      onChange={e =>
                        setExternalDraft(prev => ({
                          ...prev,
                          responsible: e.target.value
                        }))
                      }
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveExternalAction}
                  className="mt-4 px-4 py-2 bg-[#13335a] text-white rounded hover:opacity-90 text-sm font-semibold flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Acionamento
                </button>
              </div>
            )}
          </div>

          {/* RESOLUÇÃO E ENCERRAMENTO */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-[#13335a]" />
              Resolução e Encerramento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="block text-slate-500">Resolvido em</span>
                <span className="font-semibold text-slate-800">
                  {formatDateTime(resolution.resolvedAt)}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">Confirmação da escola</span>
                <span
                  className={`font-semibold ${
                    resolution.confirmedBySchool
                      ? "text-green-700"
                      : "text-amber-700"
                  }`}
                >
                  {resolution.confirmedBySchool
                    ? "Confirmado"
                    : "Pendente"}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">Encerrado em</span>
                <span className="font-semibold text-slate-800">
                  {formatDateTime(resolution.closedAt)}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">Encerrado por</span>
                <span className="font-semibold text-slate-800">
                  {resolution.closedBy || "-"}
                </span>
              </div>

              <div className="md:col-span-4">
                <span className="block text-slate-500">Solução aplicada</span>
                <div className="font-semibold text-slate-800 bg-slate-50 border border-slate-100 rounded p-3 mt-1 whitespace-pre-wrap">
                  {resolution.solutionApplied || "Ainda não registrada."}
                </div>
              </div>
            </div>

            {canOperate && (
              <div className="pt-5 border-t border-slate-100 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Solução aplicada
                  </label>

                  <textarea
                    rows={4}
                    className="w-full p-2 border rounded resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                    placeholder="Descreva a solução aplicada, serviço executado, retorno técnico ou providência adotada."
                    value={resolutionDraft.solutionApplied}
                    onChange={e =>
                      setResolutionDraft(prev => ({
                        ...prev,
                        solutionApplied: e.target.value
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Data/hora de resolução
                    </label>

                    <input
                      type="datetime-local"
                      className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                      value={resolutionDraft.resolvedAt}
                      onChange={e =>
                        setResolutionDraft(prev => ({
                          ...prev,
                          resolvedAt: e.target.value
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Data/hora de encerramento
                    </label>

                    <input
                      type="datetime-local"
                      className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                      value={resolutionDraft.closedAt}
                      onChange={e =>
                        setResolutionDraft(prev => ({
                          ...prev,
                          closedAt: e.target.value
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Encerrado por
                    </label>

                    <input
                      type="text"
                      className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                      value={resolutionDraft.closedBy}
                      onChange={e =>
                        setResolutionDraft(prev => ({
                          ...prev,
                          closedBy: e.target.value
                        }))
                      }
                    />
                  </div>
                </div>

                <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded text-[#13335a] focus:ring-[#13335a]"
                    checked={resolutionDraft.confirmedBySchool}
                    onChange={e =>
                      setResolutionDraft(prev => ({
                        ...prev,
                        confirmedBySchool: e.target.checked
                      }))
                    }
                  />

                  <span>Unidade escolar confirmou ciência/resolução</span>
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSaveResolution}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm font-semibold flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Resolução
                  </button>

                  <button
                    type="button"
                    onClick={handleMarkAsResolved}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Resolvido
                  </button>

                  {canConfirmSchoolResolution && (
                    <button
                      type="button"
                      onClick={handleConfirmBySchool}
                      className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 text-sm font-semibold flex items-center"
                    >
                      <School className="w-4 h-4 mr-2" />
                      Confirmar pela Escola
                    </button>
                  )}

                  {canCloseTicket && (
                    <button
                      type="button"
                      onClick={handleCloseTicket}
                      className="px-4 py-2 bg-[#13335a] text-white rounded hover:opacity-90 text-sm font-semibold flex items-center"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Encerrar Chamado
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RECORRÊNCIA */}
          {canEditTriage && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center">
                <Link className="w-4 h-4 mr-2 text-[#13335a]" />
                Recorrência / Vínculo
              </h3>

              <div className="flex flex-col md:flex-row gap-4 md:items-end">
                <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded text-[#13335a] focus:ring-[#13335a]"
                    checked={recurrenceDraft.isRecurring}
                    onChange={e =>
                      setRecurrenceDraft(prev => ({
                        ...prev,
                        isRecurring: e.target.checked
                      }))
                    }
                  />

                  <span>Problema recorrente</span>
                </label>

                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Chamado vinculado
                  </label>

                  <input
                    type="text"
                    className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                    placeholder="Ex: INF-2026-000245"
                    value={recurrenceDraft.linkedTicketId}
                    onChange={e =>
                      setRecurrenceDraft(prev => ({
                        ...prev,
                        linkedTicketId: e.target.value
                      }))
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveRecurrence}
                  className="px-4 py-2 bg-[#13335a] text-white rounded hover:opacity-90 text-sm font-semibold flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </button>
              </div>
            </div>
          )}

          {/* ANEXOS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center">
                <Paperclip className="w-4 h-4 mr-2 text-[#13335a]" />
                Evidências e Anexos
              </h3>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs bg-[#13335a]/10 text-[#13335a] hover:bg-[#13335a]/20 px-3 py-1.5 rounded font-semibold transition"
              >
                + Adicionar Arquivo
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {attachments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Nenhum arquivo anexado a este chamado.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attachments.map(att => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2 border rounded border-slate-200 bg-slate-50"
                  >
                    <div className="flex items-center overflow-hidden mr-2">
                      {att.type?.startsWith("image/") ? (
                        <ImageIcon className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      ) : (
                        <FileIcon className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
                      )}

                      <span
                        className="text-xs text-slate-700 truncate font-medium"
                        title={att.name}
                      >
                        {att.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPreviewFile(att)}
                        className="p-1.5 text-slate-400 hover:text-[#13335a] bg-white border rounded shadow-sm transition"
                        title="Visualizar/Baixar"
                      >
                        <Eye className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => setFileToDelete(att)}
                        className="p-1.5 text-slate-400 hover:text-red-600 bg-white border rounded shadow-sm transition"
                        title="Excluir"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* HISTÓRICO */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center uppercase tracking-wider">
              <History className="w-4 h-4 mr-2 text-[#13335a]" />
              Linha do Tempo de Auditoria
            </h3>

            {localHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Nenhum evento registrado no histórico.
              </p>
            ) : (
              <div className="relative border-l-2 border-slate-200 pl-4 ml-2 space-y-4 max-h-72 overflow-y-auto pt-1">
                {localHistory.map((log, i) => (
                  <div key={log.id || i} className="relative">
                    <span className="absolute -left-[21px] top-1 bg-white w-2.5 h-2.5 rounded-full border-2 border-[#13335a]" />

                    <div className="text-[10px] text-slate-400 font-medium">
                      {formatDateTime(log.date)}
                    </div>

                    <div className="text-xs text-slate-700 font-medium mt-0.5">
                      {log.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUNA LATERAL - INTERAÇÕES */}
        <div className="w-full xl:w-96 flex flex-col h-[560px] xl:h-[calc(100vh-140px)] xl:sticky xl:top-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-[#13335a]" />
              <h3 className="font-semibold text-slate-800">Interações</h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
              {comments.length === 0 ? (
                <div className="text-center text-xs text-slate-400 italic mt-10">
                  Nenhuma interação registrada.
                </div>
              ) : (
                comments.map(comment => {
                  const currentName =
                    currentUser?.username ||
                    currentUser?.name ||
                    currentUser?.role;

                  const isUser = comment.author === currentName;

                  return (
                    <div
                      key={comment.id}
                      className={`flex ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] p-3 shadow-sm ${
                          isUser
                            ? "bg-[#13335a] text-white rounded-2xl rounded-tr-sm"
                            : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm"
                        }`}
                      >
                        <div
                          className={`flex justify-between items-center mb-1 gap-3 ${
                            isUser ? "text-[#66b6e3]" : "text-slate-500"
                          }`}
                        >
                          <span className="font-semibold text-xs flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {comment.author}
                          </span>

                          <span className="text-[10px] opacity-80">
                            {formatCommentDate(comment.date)}
                          </span>
                        </div>

                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleAddComment} className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escreva uma atualização..."
                  className="flex-1 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />

                <button
                  type="submit"
                  className="p-2 bg-[#13335a] text-white rounded-lg hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* MODAL VISUALIZADOR DE ARQUIVOS */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 truncate pr-4">
                {previewFile.name}
              </h3>

              <button
                onClick={() => setPreviewFile(null)}
                className="p-2 bg-slate-200 hover:bg-red-500 hover:text-white rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-200 flex items-center justify-center min-h-[300px] relative">
              {previewFile.type?.startsWith("image/") ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : previewFile.type === "application/pdf" ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-[70vh] border-none"
                  title="PDF Preview"
                />
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                  <FileIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />

                  <p className="text-slate-600 mb-4 font-medium">
                    A visualização direta deste tipo de arquivo pode não ser
                    suportada pelo navegador.
                  </p>

                  <a
                    href={previewFile.url}
                    download={previewFile.name}
                    className="inline-flex items-center px-4 py-2 bg-[#13335a] text-white rounded hover:opacity-90 font-semibold transition"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Fazer Download
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO DE EXCLUSÃO */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b bg-red-50 flex items-center text-red-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <h3 className="font-bold">Remover Arquivo?</h3>
            </div>

            <div className="p-4">
              <p className="text-sm text-slate-600 mb-6">
                Tem certeza que deseja remover o arquivo{" "}
                <strong>{fileToDelete.name}</strong> deste chamado?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFileToDelete(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded font-medium"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => confirmDeleteFile(fileToDelete.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}