import React from "react";
import {
  ClipboardList,
  Siren,
  Wrench,
  AlertTriangle,
} from "lucide-react";

import { IMPACTS, } from "../../../config/constants";

export default function OccurrenceSection({
  category,
  setCategory,
  subcategory,
  setSubcategory,
  categoryOptions = [],
  subcategoryOptions = [],
  occurrenceData,
  handleOccurrenceChange,
  externalAction,
  handleExternalActionChange,
  utilitiesLoading,
  utilitiesError,
  templatesLoading = false,
}) {
  return (
    <section className="p-5 bg-blue-50/40 rounded-xl border border-blue-100">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h3 className="text-sm font-bold text-[#13335a] uppercase tracking-wider flex items-center">
          <ClipboardList className="w-4 h-4 mr-2" />
          Ocorrência
        </h3>
      </div>

      {/* CLASSIFICAÇÃO */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
          Classificação
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Categoria
            </label>

            <select
              required
              className="w-full p-2 pr-8 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory("");

                handleOccurrenceChange("priority", "");
                handleOccurrenceChange("deadlineDays", "");
              }}
            >
              <option value="">Selecione...</option>

              {categoryOptions.map((item) => (
                <option key={item.serviceType} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subcategoria
            </label>

            <select
              required
              disabled={!category}
              className="w-full p-2 pr-8 border rounded bg-white disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            >
              <option value="">
                {category ? "Selecione..." : "Escolha a categoria"}
              </option>

              {subcategoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Impacto
            </label>

            <select
              required
              className="w-full p-2 pr-8 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
              value={occurrenceData.impact}
              onChange={(e) =>
                handleOccurrenceChange("impact", e.target.value)
              }
            >
              <option value="">Selecione...</option>

              {IMPACTS.map((impact) => (
                <option key={impact} value={impact}>
                  {impact}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Criticidade
            </label>

            <input
              type="text"
              required
              readOnly
              value={occurrenceData.priority || ""}
              placeholder="Preenchida automaticamente"
              className="w-full p-2 border rounded bg-slate-100 text-slate-700 cursor-not-allowed focus:outline-none text-sm"
            />
          </div>

          <div className="md:col-span-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">
            Prazo de Atendimento
            </label>

            <input
                type="text"
                readOnly
                value={
                occurrenceData.deadlineDays === 0
                    ? "Mesmo dia"
                    : occurrenceData.deadlineDays
                    ? `${occurrenceData.deadlineDays} dia(s)`
                    : ""
                }
                className="w-full p-2 border rounded bg-slate-100 text-slate-600 text-sm cursor-not-allowed"
            />
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
      </div>

      {/* ACIONAMENTO EXTERNO */}
      <div className="mb-6 pt-5 border-t border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center">
            <Wrench className="w-4 h-4 mr-2 text-[#13335a]" />
            Acionamento Externo
          </h4>

          <span className="text-[11px] text-slate-500">
            Concessionária, matrícula e tensão são preenchidas automaticamente conforme a escola e o tipo da ocorrência.
          </span>
        </div>

        {utilitiesLoading && (
          <div className="mb-4 p-3 bg-white border border-blue-100 rounded-lg text-xs text-slate-600">
            Carregando dados de concessionária da unidade...
          </div>
        )}

        {utilitiesError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {utilitiesError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Órgão/Concessionária
            </label>

            <input
              type="text"
              readOnly
              className="w-full p-2 border rounded bg-slate-100 text-slate-600 text-sm cursor-not-allowed"
              placeholder="Preenchido automaticamente, se houver"
              value={externalAction.agency || ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Matrícula/Instalação
            </label>

            <input
              type="text"
              readOnly
              className="w-full p-2 border rounded bg-slate-100 text-slate-600 text-sm cursor-not-allowed"
              placeholder="Matrícula da concessionária"
              value={externalAction.registrationNumber || ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tensão
            </label>

            <input
              type="text"
              readOnly
              className="w-full p-2 border rounded bg-slate-100 text-slate-600 text-sm cursor-not-allowed"
              placeholder="Usado para energia"
              value={externalAction.tension || ""}
            />
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
              onChange={(e) =>
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
              onChange={(e) =>
                handleExternalActionChange("triggeredAt", e.target.value)
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Responsável pelo acionamento
            </label>

            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
              placeholder="Ex: escola, CRE, CTO, COR"
              value={externalAction.responsible}
              onChange={(e) =>
                handleExternalActionChange("responsible", e.target.value)
              }
            />
          </div>
        </div>

        {!externalAction.agency &&
          category &&
          externalAction.serviceType !== "outro" &&
          !utilitiesLoading && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              Não foi encontrado cadastro de concessionária para esta escola
              e este tipo de serviço.
            </div>
          )}
      </div>

      {/* DETALHAMENTO */}
      <div className="pt-5 border-t border-blue-100">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-[#13335a]" />
          Detalhamento da Ocorrência
        </h4>

        <div className="space-y-4">
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
              onChange={(e) =>
                handleOccurrenceChange("title", e.target.value)
              }
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
                onChange={(e) =>
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
                onChange={(e) =>
                  handleOccurrenceChange("scope", e.target.value)
                }
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
              placeholder="Descreva a ocorrência atual: o que aconteceu, desde quando ocorre, local afetado, impacto no funcionamento da unidade e providências já tomadas."
              value={occurrenceData.description}
              onChange={(e) =>
                handleOccurrenceChange("description", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}