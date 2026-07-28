// ==========================================
// FORMULÁRIO DE NOVO CHAMADO DE INFRAESTRUTURA ESCOLAR
// src/views/TicketFormView.jsx
// ==========================================

import React, { useEffect, useMemo, useRef, useState } from "react";

import { getSchools } from "../services/schoolService";

import {
  CRES,
  INFRASTRUCTURE_TREE,
  PRIORITIES,
  IMPACTS,
  AGENCIES
} from "../config/constants";

import {
  PlusCircle,
  Paperclip,
  CheckCircle,
  ImageIcon,
  FileIcon,
  AlertTriangle,
  Trash2,
  Building2,
  MapPin,
  School,
  Phone,
  ClipboardList,
  Siren,
  Wrench
} from "lucide-react";

export default function TicketFormView({ currentUser, onSubmit, onCancel }) {
  const fileInputRef = useRef(null);

  // ----------------------------------------
  // PERFIL DO USUÁRIO
  // ----------------------------------------
  const role = String(currentUser?.role || "").toLowerCase();
  const isSchoolUser = role === "escola";

  // ----------------------------------------
  // ESTADOS DA UNIDADE ESCOLAR
  // ----------------------------------------
  const [schools, setSchools] = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schoolsError, setSchoolsError] = useState("");

  const [selectedSchoolId, setSelectedSchoolId] = useState("");

  const [schoolData, setSchoolData] = useState({
    cre: currentUser?.cre || currentUser?.sector || "",
    code: currentUser?.schoolCode || "",
    name: "",
    address: "",
    neighborhood: "",
    phone: ""
  });

  // ----------------------------------------
  // ESTADOS DA CLASSIFICAÇÃO
  // ----------------------------------------
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  // ----------------------------------------
  // ESTADOS DA OCORRÊNCIA
  // ----------------------------------------
  const [occurrenceData, setOccurrenceData] = useState({
    title: "",
    priority: "",
    impact: "",
    affectedLocation: "",
    scope: "",
    description: ""
  });

  // ----------------------------------------
  // ESTADOS DO ACIONAMENTO EXTERNO
  // ----------------------------------------
  const [externalAction, setExternalAction] = useState({
    agency: "",
    protocol: "",
    triggeredAt: "",
    responsible: ""
  });

  // ----------------------------------------
  // ESTADOS DOS ANEXOS
  // ----------------------------------------
  const [attachments, setAttachments] = useState([]);
  const [fileToDelete, setFileToDelete] = useState(null);

  // ----------------------------------------
  // SUBCATEGORIAS DA ÁRVORE DE INFRA
  // ----------------------------------------
  const subcategoryOptions = useMemo(() => {
    if (!category) return [];
    return INFRASTRUCTURE_TREE[category] || [];
  }, [category]);

  // ----------------------------------------
  // GERAÇÃO DO NÚMERO DO CHAMADO
  // ----------------------------------------
  const generateTicketId = () => {
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 999999) + 1;

    return `INF-${year}-${String(randomNumber).padStart(6, "0")}`;
  };

  // ----------------------------------------
  // CARREGAR ESCOLAS DO SUPABASE
  // ----------------------------------------
  useEffect(() => {
    async function loadSchools() {
      try {
        setSchoolsLoading(true);
        setSchoolsError("");

        const data = await getSchools();

        setSchools(data || []);
      } catch (error) {
        console.error("Erro ao carregar escolas:", error);
        setSchoolsError("Não foi possível carregar a lista de unidades escolares.");
      } finally {
        setSchoolsLoading(false);
      }
    }

    loadSchools();
  }, []);

  // ----------------------------------------
  // PREENCHIMENTO AUTOMÁTICO PARA PERFIL ESCOLA
  // ----------------------------------------
  useEffect(() => {
    if (!isSchoolUser) return;

    const currentSchoolCode = currentUser?.schoolCode;

    if (!currentSchoolCode) {
      setSchoolData(prev => ({
        ...prev,
        cre: currentUser?.cre || currentUser?.sector || prev.cre || "",
        code: prev.code || ""
      }));

      return;
    }

    const school = schools.find(
      item => String(item.code) === String(currentSchoolCode)
    );

    // Enquanto a lista ainda não carregou, mantém pelo menos CRE e código do login.
    if (!school) {
      setSelectedSchoolId("");

      setSchoolData(prev => ({
        ...prev,
        cre: currentUser?.cre || currentUser?.sector || prev.cre || "",
        code: currentSchoolCode || prev.code || ""
      }));

      return;
    }

    setSelectedSchoolId(String(school.id));

    setSchoolData({
      cre: school.cre || currentUser?.cre || "",
      code: school.code || currentSchoolCode || "",
      name: school.name || "",
      address: school.address || "",
      neighborhood: school.neighborhood || "",
      phone: school.phone || ""
    });
  }, [schools, currentUser, isSchoolUser]);

  // ----------------------------------------
  // SELEÇÃO MANUAL DE ESCOLA
  // Admin, CRE, COR e CTO podem escolher a unidade.
  // Escola recebe preenchimento automático e não troca a unidade.
  // ----------------------------------------
  const handleSchoolSelect = (e) => {
    const schoolId = e.target.value;

    setSelectedSchoolId(schoolId);

    if (!schoolId) {
      setSchoolData({
        cre: currentUser?.cre || currentUser?.sector || "",
        code: "",
        name: "",
        address: "",
        neighborhood: "",
        phone: ""
      });

      return;
    }

    const school = schools.find(
      item => String(item.id) === String(schoolId)
    );

    if (!school) return;

    setSchoolData({
      cre: school.cre || "",
      code: school.code || "",
      name: school.name || "",
      address: school.address || "",
      neighborhood: school.neighborhood || "",
      phone: school.phone || ""
    });
  };

  // ----------------------------------------
  // ALTERAÇÃO DOS DADOS DA ESCOLA
  // Usado apenas para perfis que podem editar.
  // ----------------------------------------
  const handleSchoolChange = (field, value) => {
    setSchoolData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ----------------------------------------
  // ALTERAÇÃO DA OCORRÊNCIA
  // ----------------------------------------
  const handleOccurrenceChange = (field, value) => {
    setOccurrenceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ----------------------------------------
  // ALTERAÇÃO DO ACIONAMENTO EXTERNO
  // ----------------------------------------
  const handleExternalActionChange = (field, value) => {
    setExternalAction(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ----------------------------------------
  // UPLOAD LOCAL DE ANEXO
  // Observação: neste MVP, o anexo fica como objectURL local.
  // Na integração real, este ponto deve ser trocado por Supabase Storage.
  // ----------------------------------------
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

    setAttachments(prev => [...prev, newAttachment]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ----------------------------------------
  // EXCLUIR ANEXO
  // ----------------------------------------
  const confirmDeleteFile = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
    setFileToDelete(null);
  };

  // ----------------------------------------
  // VERIFICA SE HÁ ACIONAMENTO EXTERNO PREENCHIDO
  // ----------------------------------------
  const isExternalActionFilled =
    externalAction.agency ||
    externalAction.protocol ||
    externalAction.triggeredAt ||
    externalAction.responsible;

  // ----------------------------------------
  // SUBMISSÃO DO FORMULÁRIO
  // ----------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!schoolData.name?.trim()) {
      alert("Informe ou selecione a unidade escolar.");
      return;
    }

    const now = new Date().toISOString();

    const classification = [category, subcategory]
      .filter(Boolean)
      .join(" > ");

    const history = [
      {
        id: Date.now(),
        type: "create",
        message: "Chamado de infraestrutura aberto no sistema.",
        date: now
      }
    ];

    if (occurrenceData.priority) {
      history.push({
        id: Date.now() + 1,
        type: "priority",
        message: `Prioridade inicial definida como [${occurrenceData.priority}].`,
        date: now
      });
    }

    if (isExternalActionFilled) {
      history.push({
        id: Date.now() + 2,
        type: "external_action",
        message: `Acionamento externo registrado para [${
          externalAction.agency || "Órgão/concessionária não informado"
        }]${
          externalAction.protocol
            ? ` com protocolo [${externalAction.protocol}]`
            : ""
        }.`,
        date: now
      });
    }

    if (attachments.length > 0) {
      history.push({
        id: Date.now() + 3,
        type: "upload",
        message: `${attachments.length} anexo(s) incluído(s) na abertura do chamado.`,
        date: now
      });
    }

    const newTicket = {
      id: generateTicketId(),

      createdAt: now,
      updatedAt: now,

      origin: currentUser?.role || "Escola",
      openedBy: currentUser?.username || currentUser?.name || "Usuário",

      status: "Aberto",

      // Compatibilidade com componentes antigos
      title: occurrenceData.title,
      sector: schoolData.cre,
      classification,
      category,
      subcategory,

      school: {
        cre: schoolData.cre,
        code: schoolData.code,
        name: schoolData.name,
        address: schoolData.address,
        neighborhood: schoolData.neighborhood,
        phone: schoolData.phone
      },

      priority: occurrenceData.priority,
      impact: occurrenceData.impact,

      description: occurrenceData.description,
      affectedLocation: occurrenceData.affectedLocation,
      scope: occurrenceData.scope,

      externalAction: {
        agency: externalAction.agency,
        protocol: externalAction.protocol,
        triggeredAt: externalAction.triggeredAt
          ? new Date(externalAction.triggeredAt).toISOString()
          : null,
        responsible: externalAction.responsible
      },

      resolution: {
        solutionApplied: "",
        resolvedAt: null,
        confirmedBySchool: false,
        closedAt: null,
        closedBy: ""
      },

      recurrence: {
        isRecurring: false,
        linkedTicketId: null
      },

      assignedTo: [],
      priorityIndex: 999,

      comments: [],
      attachments,
      history
    };

    onSubmit(newTicket);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-5xl mx-auto relative">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <PlusCircle className="mr-2 text-[#13335a]" />
            Abrir Chamado de Infraestrutura Escolar
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Registre ocorrências de água, saneamento, energia, poda,
            conservação predial e outras demandas da unidade escolar.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-[#13335a] max-w-sm">
          <strong>Orientação:</strong> descreva objetivamente o problema,
          informe o local afetado e anexe evidências sempre que possível.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* IDENTIFICAÇÃO DA UNIDADE */}
        <section className="p-5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <School className="w-4 h-4 mr-2 text-[#13335a]" />
              Dados da Unidade Escolar
            </h3>

            {isSchoolUser && (
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full">
                Unidade vinculada ao perfil Escola
              </span>
            )}
          </div>

          {schoolsError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start">
              <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{schoolsError}</span>
            </div>
          )}

          {isSchoolUser && schoolsLoading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
              Carregando dados da unidade vinculada ao seu perfil...
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                CRE
              </label>

              <select
                required
                disabled={isSchoolUser}
                className="w-full p-2 pr-8 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3] disabled:bg-slate-100 disabled:text-slate-500"
                value={schoolData.cre}
                onChange={e => handleSchoolChange("cre", e.target.value)}
              >
                <option value="">Selecione a CRE...</option>

                {CRES.map(cre => (
                  <option key={cre} value={cre}>
                    {cre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Código da unidade
              </label>

              <input
                required
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3] disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="Ex: 0301012"
                value={schoolData.code}
                disabled={isSchoolUser}
                onChange={e => handleSchoolChange("code", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Telefone da direção
              </label>

              <div className="relative">
                <Phone className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />

                <input
                  required
                  type="text"
                  className="w-full p-2 pl-8 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                  placeholder="Ex: (21) 99999-9999"
                  value={schoolData.phone}
                  onChange={e => handleSchoolChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome da unidade escolar
              </label>

              <div className="relative">
                <Building2 className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />

                <select
                  required={!isSchoolUser}
                  value={selectedSchoolId}
                  onChange={handleSchoolSelect}
                  disabled={isSchoolUser}
                  className="w-full p-2 pl-8 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3] disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="">
                    {schoolsLoading
                      ? "Carregando unidades..."
                      : "Selecione a unidade"}
                  </option>

                  {schools.map(school => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>

              {isSchoolUser && schoolData.name && !selectedSchoolId && (
                <p className="text-xs text-slate-500 mt-1">
                  Unidade identificada pelo perfil:{" "}
                  <strong>{schoolData.name}</strong>
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Endereço
              </label>

              <div className="relative">
                <MapPin className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />

                <input
                  required
                  type="text"
                  disabled={isSchoolUser}
                  className="w-full p-2 pl-8 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3] disabled:bg-slate-100 disabled:text-slate-500"
                  placeholder="Rua, número e complemento"
                  value={schoolData.address}
                  onChange={e => handleSchoolChange("address", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bairro
              </label>

              <input
                required
                type="text"
                disabled={isSchoolUser}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3] disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="Ex: Méier"
                value={schoolData.neighborhood}
                onChange={e =>
                  handleSchoolChange("neighborhood", e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* CLASSIFICAÇÃO DA OCORRÊNCIA */}
        <section className="p-5 bg-blue-50/40 rounded-xl border border-blue-100">
          <h3 className="text-sm font-bold text-[#13335a] mb-4 uppercase tracking-wider flex items-center">
            <ClipboardList className="w-4 h-4 mr-2" />
            Classificação da Ocorrência
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoria
              </label>

              <select
                required
                className="w-full p-2 pr-8 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                value={category}
                onChange={e => {
                  setCategory(e.target.value);
                  setSubcategory("");
                }}
              >
                <option value="">Selecione...</option>

                {Object.keys(INFRASTRUCTURE_TREE).map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subcategoria
              </label>

              <select
                required
                disabled={!category}
                className="w-full p-2 pr-8 border rounded bg-white disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
              >
                <option value="">
                  {category ? "Selecione..." : "Escolha a categoria"}
                </option>

                {subcategoryOptions.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prioridade
              </label>

              <select
                required
                className="w-full p-2 pr-8 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                value={occurrenceData.priority}
                onChange={e =>
                  handleOccurrenceChange("priority", e.target.value)
                }
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
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Impacto
              </label>

              <select
                required
                className="w-full p-2 pr-8 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                value={occurrenceData.impact}
                onChange={e =>
                  handleOccurrenceChange("impact", e.target.value)
                }
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

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start">
            <Siren className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />

            <span>
              Chamados críticos devem ser usados para risco imediato à operação
              ou segurança, como falta total de água, falta de energia, esgoto
              dentro da unidade ou unidade interditada.
            </span>
          </div>
        </section>

        {/* DESCRIÇÃO DA OCORRÊNCIA */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-[#13335a]" />
            Detalhamento da Ocorrência
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título resumido
            </label>

            <input
              required
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
              placeholder="Ex: Unidade sem abastecimento de água"
              value={occurrenceData.title}
              onChange={e => handleOccurrenceChange("title", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Local afetado
              </label>

              <input
                required
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                placeholder="Ex: cozinha, banheiros, pátio, toda unidade"
                value={occurrenceData.affectedLocation}
                onChange={e =>
                  handleOccurrenceChange("affectedLocation", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Abrangência
              </label>

              <input
                required
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                placeholder="Ex: toda unidade, área externa, bloco administrativo"
                value={occurrenceData.scope}
                onChange={e => handleOccurrenceChange("scope", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descrição objetiva
            </label>

            <textarea
              required
              rows={5}
              className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
              placeholder="Descreva o problema, desde quando ocorre, impacto no atendimento, providências já tomadas e informações relevantes."
              value={occurrenceData.description}
              onChange={e =>
                handleOccurrenceChange("description", e.target.value)
              }
            />
          </div>
        </section>

        {/* ACIONAMENTO EXTERNO */}
        <section className="p-5 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center">
            <Wrench className="w-4 h-4 mr-2 text-[#13335a]" />
            Acionamento Externo
            <span className="ml-2 text-[10px] normal-case font-medium text-slate-400">
              opcional na abertura
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Órgão/concessionária
              </label>

              <select
                className="w-full p-2 pr-8 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                value={externalAction.agency}
                onChange={e =>
                  handleExternalActionChange("agency", e.target.value)
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
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Protocolo
              </label>

              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                placeholder="Ex: AR-2026-998877"
                value={externalAction.protocol}
                onChange={e =>
                  handleExternalActionChange("protocol", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Data/hora do acionamento
              </label>

              <input
                type="datetime-local"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                value={externalAction.triggeredAt}
                onChange={e =>
                  handleExternalActionChange("triggeredAt", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Responsável
              </label>

              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                placeholder="Ex: CTO, CRE, COR"
                value={externalAction.responsible}
                onChange={e =>
                  handleExternalActionChange("responsible", e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* ANEXOS */}
        <section>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
            Evidências e Anexos
          </label>

          {attachments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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

                  <button
                    type="button"
                    onClick={() => setFileToDelete(att)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border rounded shadow-sm transition"
                    title="Remover anexo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition text-center"
          >
            <Paperclip className="mb-2" />

            <span className="text-sm font-medium text-slate-600">
              Clique para adicionar fotos, documentos, vídeos ou mensagens
              relacionadas
            </span>

            <span className="text-xs text-amber-700 mt-2 flex items-center bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Anexos não substituem a descrição textual mínima da ocorrência
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
        </section>

        {/* AÇÕES */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-slate-600 hover:bg-slate-100 rounded font-semibold"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-[#13335a] text-white rounded hover:opacity-90 flex items-center justify-center font-semibold"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Salvar Chamado
          </button>
        </div>
      </form>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE ANEXO */}
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
    </div>
  );
}