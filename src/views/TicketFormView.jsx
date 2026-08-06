// ==========================================
// FORMULÁRIO DE NOVO CHAMADO DE INFRAESTRUTURA ESCOLAR
// src/views/TicketFormView.jsx
// ==========================================

import React, { useEffect, useMemo, useRef, useState } from "react";
import { getSchools } from "../services/schoolService";
import { supabase } from "../services/supabaseClient";
import { getOccurrenceTemplates } from "../services/occurrenceTemplateService";
import OccurrenceSection from "../components/ticket/form/OccurrenceSection";
import { PRIORITIES } from "../config/constants";

import {
  PlusCircle,
  Paperclip,
  CheckCircle,
  ImageIcon,
  FileIcon,
  AlertTriangle,
  Trash2,
  MapPin,
  Phone
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
    phone: "",
    phoneSecondary: "",
    referencePoint: "",
    contactNotes: "",
    installationNotes: "",
  });

  // ----------------------------------------
  // ESTADOS DAS CONCESSIONÁRIAS DA ESCOLA
  // TABELA: school_utility_accounts
  // ----------------------------------------
  const [schoolUtilities, setSchoolUtilities] = useState({
    agua: null,
    esgoto: null,
    energia: null,
  });

  const [utilitiesLoading, setUtilitiesLoading] = useState(false);
  const [utilitiesError, setUtilitiesError] = useState("");

  // ----------------------------------------
  // ESTADOS DA CLASSIFICAÇÃO
  // ----------------------------------------
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  // ----------------------------------------
  // ESTADOS DOS TEMPLATES DE OCORRÊNCIA
  // TABELA: occurrence_templates
  // ----------------------------------------
  const [occurrenceTemplates, setOccurrenceTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  // ----------------------------------------
  // ESTADOS DA OCORRÊNCIA
  // ----------------------------------------
  const [occurrenceData, setOccurrenceData] = useState({
    title: "",
    priority: "",
    deadlineDays: "",
    impact: "",
    affectedLocation: "",
    scope: "",
    description: "",
  });

  // ----------------------------------------
  // ESTADOS DO ACIONAMENTO EXTERNO
  // Agora recebe dados vindos da tabela school_utility_accounts
  // ----------------------------------------
  const [externalAction, setExternalAction] = useState({
    agency: "",
    protocol: "",
    triggeredAt: "",
    responsible: "",
    serviceType: "",
    utilityAccountId: null,
    registrationNumber: "",
    tension: "",
  });

  // ----------------------------------------
  // ESTADOS DOS ANEXOS
  // ----------------------------------------
  const [attachments, setAttachments] = useState([]);
  const [fileToDelete, setFileToDelete] = useState(null);

  // ----------------------------------------
  // OPÇÕES DE OCORRÊNCIA VINDAS DO BANCO
  // TABELA: public.occurrence_templates
  // ----------------------------------------
  const SERVICE_TYPE_LABELS = {
    agua: "Água",
    esgoto: "Esgoto",
    energia: "Energia",
    outro: "Outro",
  };

  const getServiceTypeFromCategory = (value) => {
    const map = {
      Água: "agua",
      Agua: "agua",
      água: "agua",
      agua: "agua",
      Esgoto: "esgoto",
      esgoto: "esgoto",
      Energia: "energia",
      energia: "energia",
      Outro: "outro",
      outro: "outro",
    };

    return map[value] || value;
  };

  const categoryOptions = useMemo(() => {
    const serviceTypes = [
      ...new Set(
        occurrenceTemplates
          .filter((item) => item.active !== false)
          .map((item) => item.service_type)
          .filter(Boolean)
      ),
    ];

    return serviceTypes.map((serviceType) => ({
      serviceType,
      label: SERVICE_TYPE_LABELS[serviceType] || serviceType,
    }));
  }, [occurrenceTemplates]);

  const subcategoryOptions = useMemo(() => {
    if (!category) return [];

    const selectedServiceType = getServiceTypeFromCategory(category);

    return occurrenceTemplates
      .filter(
        (item) =>
          item.active !== false &&
          item.service_type === selectedServiceType
      )
      .map((item) => item.occurrence_name);
  }, [category, occurrenceTemplates]);

  // ----------------------------------------
  // GERAÇÃO DO NÚMERO DO CHAMADO
  // ----------------------------------------
  const generateTicketId = () => {
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 999999) + 1;
    return `INF-${year}-${String(randomNumber).padStart(6, "0")}`;
  };

  // ----------------------------------------
  // NORMALIZAÇÃO DE TEXTO
  // ----------------------------------------
  const normalizeText = (value) => {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // ----------------------------------------
  // IDENTIFICAR TIPO DE SERVIÇO A PARTIR DA CLASSIFICAÇÃO
  // ----------------------------------------
  const detectServiceType = (selectedCategory, selectedSubcategory) => {
    const text = normalizeText(`${selectedCategory || ""} ${selectedSubcategory || ""}`);

    if (
      text.includes("esgoto") ||
      text.includes("saneamento")
    ) {
      return "esgoto";
    }

    if (
      text.includes("agua") ||
      text.includes("abastecimento") ||
      text.includes("hidraul")
    ) {
      return "agua";
    }

    if (
      text.includes("energia") ||
      text.includes("eletrica") ||
      text.includes("luz") ||
      text.includes("queda de energia")
    ) {
      return "energia";
    }

    return "outro";
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
  // CARREGAR CONCESSIONÁRIAS DA ESCOLA
  // TABELA: public.school_utility_accounts
  // ----------------------------------------
  useEffect(() => {
    async function loadUtilities() {
      if (!schoolData.code) {
        setSchoolUtilities({
          agua: null,
          esgoto: null,
          energia: null,
        });

        setExternalAction((prev) => ({
          ...prev,
          agency: "",
          serviceType: "",
          utilityAccountId: null,
          registrationNumber: "",
          tension: "",
        }));

        return;
      }

      try {
        setUtilitiesLoading(true);
        setUtilitiesError("");

        const { data, error } = await supabase
          .from("school_utility_accounts")
          .select(
            "id, school_code, service_type, concessionaire, registration_number, tension, source_sheet, active"
          )
          .eq("school_code", schoolData.code)
          .eq("active", true);

        //teste 2
        console.log("Resultado bruto school_utility_accounts:", data);
        console.log("Erro school_utility_accounts:", error);

        if (error) {
          throw error;
        }

        const utilities = {
          agua: null,
          esgoto: null,
          energia: null,
        };

        (data || []).forEach((item) => {
          if (item.service_type === "agua") {
            utilities.agua = item;
          }

          if (item.service_type === "esgoto") {
            utilities.esgoto = item;
          }

          if (item.service_type === "energia") {
            utilities.energia = item;
          }
        });

        //teste 3
        console.log("Concessionárias agrupadas:", utilities);

        setSchoolUtilities(utilities);
      } catch (error) {
        console.error("Erro ao carregar concessionárias da escola:", error);
        setUtilitiesError("Não foi possível carregar os dados de concessionária da unidade.");
        setSchoolUtilities({
          agua: null,
          esgoto: null,
          energia: null,
        });
      } finally {
        setUtilitiesLoading(false);
      }
    }

    loadUtilities();
  }, [schoolData.code]);

  // ----------------------------------------
  // CARREGAR TEMPLATES DE OCORRÊNCIA
  // TABELA: public.occurrence_templates
  // ----------------------------------------
  useEffect(() => {
    async function loadOccurrenceTemplates() {
      try {
        setTemplatesLoading(true);

        const data = await getOccurrenceTemplates();

        setOccurrenceTemplates(data || []);

        console.log(
          "Templates de ocorrência:",
          data
        );
      } catch (error) {
        console.error(
          "Erro ao carregar templates de ocorrência:",
          error
        );
      } finally {
        setTemplatesLoading(false);
      }
    }

    loadOccurrenceTemplates();
  }, []);

  // ----------------------------------------
  // PREENCHIMENTO AUTOMÁTICO PARA PERFIL ESCOLA
  // ----------------------------------------
  useEffect(() => {
    if (!isSchoolUser) return;

    const currentSchoolCode = currentUser?.schoolCode;

    if (!currentSchoolCode) {
      setSchoolData((prev) => ({
        ...prev,
        cre: currentUser?.cre || currentUser?.sector || prev.cre || "",
        code: prev.code || "",
      }));

      return;
    }

    const school = schools.find(
      (item) => String(item.code) === String(currentSchoolCode)
    );

    // Enquanto a lista ainda não carregou, mantém pelo menos CRE e código do login.
    if (!school) {
      setSelectedSchoolId("");

      setSchoolData((prev) => ({
        ...prev,
        cre: currentUser?.cre || currentUser?.sector || prev.cre || "",
        code: currentSchoolCode || prev.code || "",
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
      phone: school.phone || "",
      phoneSecondary: school.phone_secondary || "",
      referencePoint: school.reference_point || "",
      contactNotes: school.contact_notes || "",
      installationNotes: school.installation_notes || "",
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
        phone: "",
        phoneSecondary: "",
        referencePoint: "",
        contactNotes: "",
        installationNotes: "",
      });

      return;
    }

    const school = schools.find(
      (item) => String(item.id) === String(schoolId)
    );

    if (!school) return;

    setSchoolData({
      cre: school.cre || "",
      code: school.code || "",
      name: school.name || "",
      address: school.address || "",
      neighborhood: school.neighborhood || "",
      phone: school.phone || "",
      phoneSecondary: school.phone_secondary || "",
      referencePoint: school.reference_point || "",
      contactNotes: school.contact_notes || "",
      installationNotes: school.installation_notes || "",
    });
  };

  // ----------------------------------------
  // ALTERAÇÃO DOS DADOS DA ESCOLA
  // Usado para telefone, referência e contatos editáveis no chamado.
  // ----------------------------------------
  const handleSchoolChange = (field, value) => {
    setSchoolData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ----------------------------------------
  // ALTERAÇÃO DA OCORRÊNCIA
  // ----------------------------------------
  const handleOccurrenceChange = (field, value) => {
    setOccurrenceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ----------------------------------------
  // ALTERAÇÃO DO ACIONAMENTO EXTERNO
  // ----------------------------------------
  const handleExternalActionChange = (field, value) => {
    setExternalAction((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ----------------------------------------
  // ATUALIZAR CONCESSIONÁRIA COM BASE NA CLASSIFICAÇÃO
  // ----------------------------------------
  useEffect(() => {
    const serviceType = detectServiceType(category, subcategory);

    if (!category && !subcategory) {
      setExternalAction((prev) => ({
        ...prev,
        serviceType: "",
        utilityAccountId: null,
        agency: "",
        registrationNumber: "",
        tension: "",
      }));

      return;
    }

    if (serviceType === "outro") {
      setExternalAction((prev) => ({
        ...prev,
        serviceType: "outro",
        utilityAccountId: null,
        agency: "",
        registrationNumber: "",
        tension: "",
      }));

      return;
    }

    const selectedUtility = schoolUtilities[serviceType];

    if (!selectedUtility) {
      setExternalAction((prev) => ({
        ...prev,
        serviceType,
        utilityAccountId: null,
        agency: "",
        registrationNumber: "",
        tension: "",
      }));

      return;
    }

    setExternalAction((prev) => ({
      ...prev,
      serviceType,
      utilityAccountId: selectedUtility.id || null,
      agency: selectedUtility.concessionaire || "",
      registrationNumber: selectedUtility.registration_number || "",
      tension: selectedUtility.tension || "",
    }));
  }, [category, subcategory, schoolUtilities]);

  // ----------------------------------------
  // PREENCHER CRITICIDADE E PRAZO
  // COM BASE NA SUBCATEGORIA
  // ----------------------------------------
  useEffect(() => {

    if (!subcategory || occurrenceTemplates.length === 0) {
      return;
    }

    const template = occurrenceTemplates.find(
      (item) =>
        item.occurrence_name === subcategory
    );

    if (!template) {
      //teste
      console.log("Nenhum template encontrado para:", subcategory);
      return;
    }

    setOccurrenceData((prev) => ({
      ...prev,
      priority: template.criticality || "",
      deadlineDays: template.deadline_days ?? "",
    }));

  }, [subcategory, occurrenceTemplates]);

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
      url: URL.createObjectURL(file),
    };

    setAttachments((prev) => [...prev, newAttachment]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ----------------------------------------
  // EXCLUIR ANEXO
  // ----------------------------------------
  const confirmDeleteFile = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
    setFileToDelete(null);
  };

  // ----------------------------------------
  // VERIFICA SE HÁ ACIONAMENTO EXTERNO PREENCHIDO
  // ----------------------------------------
  const isExternalActionFilled =
    externalAction.agency ||
    externalAction.protocol ||
    externalAction.triggeredAt ||
    externalAction.responsible ||
    externalAction.registrationNumber ||
    externalAction.tension ||
    externalAction.serviceType;

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
        date: now,
      },
    ];

    if (occurrenceData.priority) {
      history.push({
        id: Date.now() + 1,
        type: "priority",
        message: `Prioridade inicial definida como [${occurrenceData.priority}].`,
        date: now,
      });
    }

    if (isExternalActionFilled) {
      history.push({
        id: Date.now() + 2,
        type: "external_action",
        message: `Acionamento externo registrado para [${
          externalAction.agency || "Órgão/concessionária não informado"
        }]${
          externalAction.registrationNumber
            ? ` com matrícula/instalação [${externalAction.registrationNumber}]`
            : ""
        }${
          externalAction.protocol
            ? ` e protocolo [${externalAction.protocol}]`
            : ""
        }.`,
        date: now,
      });
    }

    if (attachments.length > 0) {
      history.push({
        id: Date.now() + 3,
        type: "upload",
        message: `${attachments.length} anexo(s) incluído(s) na abertura do chamado.`,
        date: now,
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

      // Novos campos ligados à tabela tickets
      serviceType: externalAction.serviceType || detectServiceType(category, subcategory),
      utilityAccountId: externalAction.utilityAccountId || null,
      schoolPhoneSecondary: schoolData.phoneSecondary,
      contactNotes: schoolData.contactNotes,
      referencePoint: schoolData.referencePoint,

      school: {
        cre: schoolData.cre,
        code: schoolData.code,
        name: schoolData.name,
        address: schoolData.address,
        neighborhood: schoolData.neighborhood,
        phone: schoolData.phone,
        phoneSecondary: schoolData.phoneSecondary,
        referencePoint: schoolData.referencePoint,
        contactNotes: schoolData.contactNotes,
        installationNotes: schoolData.installationNotes,
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
        responsible: externalAction.responsible,
        serviceType: externalAction.serviceType,
        utilityAccountId: externalAction.utilityAccountId,
        registrationNumber: externalAction.registrationNumber,
        tension: externalAction.tension,
      },

      resolution: {
        solutionApplied: "",
        resolvedAt: null,
        confirmedBySchool: false,
        closedAt: null,
        closedBy: "",
      },

      recurrence: {
        isRecurring: false,
        linkedTicketId: null,
      },

      assignedTo: [],
      priorityIndex: 999,
      comments: [],
      attachments,
      history,
    };

    onSubmit(newTicket);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-5xl mx-auto relative">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <PlusCircle className="mr-2 text-[#13335a]" />
            Abrir Chamado de Concessionárias
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Registre ocorrências de água, saneamento, energia, poda,
            conservação predial e outras demandas da unidade escolar. [### O QUE DEVE VIR ESCRITO AQUI? ###]
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-[#13335a] max-w-sm">
          <strong>Orientação:</strong> descreva objetivamente o problema,
          informe o local afetado e anexe evidências sempre que possível.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* IDENTIFICAÇÃO DA UNIDADE */}
        <section className="p-5 bg-blue-50/40 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h3 className="text-sm font-bold text-[#13335a] uppercase tracking-wider flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Identificação da Unidade Escolar
            </h3>
          </div>

          {schoolsError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {schoolsError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* LINHA 1: CRE, DESIGNAÇÃO, NOME DA ESCOLA */}
            <div className="md:col-span-2 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  CRE <span className="text-red-500">*</span>
                </label>
              </div>

              <select
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3] text-sm"
                value={schoolData.cre}
                onChange={(e) => handleSchoolChange("cre", e.target.value)}
                disabled={isSchoolUser}
              >
                <option value="">Selecione (CRE)...</option>
                <option value="1ª CRE">1ª CRE</option>
                <option value="2ª CRE">2ª CRE</option>
                <option value="3ª CRE">3ª CRE</option>
                <option value="4ª CRE">4ª CRE</option>
                <option value="5ª CRE">5ª CRE</option>
                <option value="6ª CRE">6ª CRE</option>
                <option value="7ª CRE">7ª CRE</option>
                <option value="8ª CRE">8ª CRE</option>
                <option value="9ª CRE">9ª CRE</option>
                <option value="10ª CRE">10ª CRE</option>
                <option value="11ª CRE">11ª CRE</option>
              </select>
            </div>

            <div className="md:col-span-2 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Designação <span className="text-red-500">*</span>
                </label>
              </div>

              <input
                type="text"
                disabled={isSchoolUser}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3] disabled:bg-slate-100 disabled:text-slate-500 text-sm"
                placeholder="Designação..."
                value={schoolData.code}
                onChange={(e) => handleSchoolChange("code", e.target.value)}
              />
            </div>

            <div className="md:col-span-8 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Nome da Escola <span className="text-red-500">*</span>
                </label>
              </div>

              <select
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3] disabled:bg-slate-100 text-sm"
                value={selectedSchoolId}
                onChange={handleSchoolSelect}
                disabled={isSchoolUser || schoolsLoading}
              >
                <option value="">
                  {schoolsLoading
                    ? "Carregando escolas..."
                    : "Selecione (Nome da Escola)..."}
                </option>

                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>

            {/* LINHA 2: ENDEREÇO, BAIRRO, PONTO DE REFERÊNCIA */}
            <div className="md:col-span-5 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Endereço <span className="text-red-500">*</span>
                </label>
              </div>

              <input
                type="text"
                disabled={isSchoolUser}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3] disabled:bg-slate-100 disabled:text-slate-500 text-sm"
                placeholder="Preencher endereço..."
                value={schoolData.address}
                onChange={(e) => handleSchoolChange("address", e.target.value)}
              />
            </div>

            <div className="md:col-span-3 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Bairro <span className="text-red-500">*</span>
                </label>
              </div>

              <input
                type="text"
                disabled={isSchoolUser}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3] disabled:bg-slate-100 disabled:text-slate-500 text-sm"
                placeholder="Preencher bairro..."
                value={schoolData.neighborhood}
                onChange={(e) => handleSchoolChange("neighborhood", e.target.value)}
              />
            </div>

            <div className="md:col-span-4 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Ponto de Referência
                </label>
              </div>

              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3] text-sm"
                placeholder="Ex: próximo à praça, entrada lateral..."
                value={schoolData.referencePoint}
                onChange={(e) => handleSchoolChange("referencePoint", e.target.value)}
              />
            </div>

            {/* LINHA 3: TELEFONE 1, TELEFONE 2, CONTATO VINCULADO */}
            <div className="md:col-span-3 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Telefone Direção <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="relative">
                <Phone className="absolute left-2 top-2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  className="w-full p-2 pl-8 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3] text-sm"
                  placeholder="Telefone principal..."
                  value={schoolData.phone}
                  onChange={(e) => handleSchoolChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="md:col-span-3 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Telefone Secundário
                </label>
              </div>

              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3] text-sm"
                placeholder="Outro telefone da unidade..."
                value={schoolData.phoneSecondary}
                onChange={(e) => handleSchoolChange("phoneSecondary", e.target.value)}
              />
            </div>

            <div className="md:col-span-6 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Contato vinculado ao telefone secundário
                </label>
              </div>

              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3] text-sm"
                placeholder="Ex: secretaria, direção adjunta, portaria, melhor horário para contato..."
                value={schoolData.contactNotes}
                onChange={(e) => handleSchoolChange("contactNotes", e.target.value)}
              />
            </div>

            {/* LINHA 4: OBSERVAÇÕES DAS INSTALAÇÕES */}
            <div className="md:col-span-12 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Observações
                </label>
              </div>

              <textarea
                rows={3}
                className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-[#66b6e3] text-sm"
                placeholder="Ex: quadro de luz, casa de bombas, hidrômetro, entrada de serviço, bloco afetado..."
                value={schoolData.installationNotes}
                onChange={(e) => handleSchoolChange("installationNotes", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* OCORRÊNCIA: CLASSIFICAÇÃO + ACIONAMENTO EXTERNO + DETALHAMENTO */}
        <OccurrenceSection
          category={category}
          setCategory={setCategory}
          subcategory={subcategory}
          setSubcategory={setSubcategory}
          categoryOptions={categoryOptions}
          occurrenceTemplates={occurrenceTemplates}
          templatesLoading={templatesLoading}
          subcategoryOptions={subcategoryOptions}
          occurrenceData={occurrenceData}
          handleOccurrenceChange={handleOccurrenceChange}
          externalAction={externalAction}
          handleExternalActionChange={handleExternalActionChange}
          utilitiesLoading={utilitiesLoading}
          utilitiesError={utilitiesError}
        />

        {/* ANEXOS */}
        <section>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
            Evidências e Anexos
          </label>

          {attachments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {attachments.map((att) => (
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