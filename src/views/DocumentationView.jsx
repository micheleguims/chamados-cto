// ==========================================
// DOCUMENTAÇÃO DO SISTEMA
// src/views/DocumentationView.jsx
// ==========================================

import React from "react";

import {
  FileText,
  School,
  Building2,
  Users,
  Wrench,
  Clock,
  ShieldCheck,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export default function DocumentationView() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* CABEÇALHO */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

        <div className="flex items-center mb-3">
          <FileText className="w-6 h-6 mr-2 text-[#13335a]" />

          <h1 className="text-2xl font-bold text-slate-800">
            Documentação do Sistema
          </h1>
        </div>

        <p className="text-slate-600">
          Sistema de Gestão de Ocorrências de Infraestrutura Escolar.
        </p>

      </div>

      {/* OBJETIVO */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

        <h2 className="font-bold text-slate-800 mb-3">
          Objetivo
        </h2>

        <p className="text-slate-600 leading-relaxed">
          Transformar comunicações operacionais de infraestrutura
          em chamados rastreáveis, classificados por prioridade,
          monitorados por Escola, CRE, COR e CTO,
          com histórico completo e indicadores executivos.
        </p>

      </div>

      {/* PERFIS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

        <h2 className="font-bold text-slate-800 mb-4">
          Perfis de Acesso
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">

          <div className="border rounded-lg p-4">
            <School className="w-5 h-5 text-[#13335a] mb-2" />
            <div className="font-semibold">
              Escola
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Abre chamados e acompanha andamento.
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <Building2 className="w-5 h-5 text-[#13335a] mb-2" />
            <div className="font-semibold">
              CRE
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Valida, classifica e prioriza.
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <Users className="w-5 h-5 text-[#13335a] mb-2" />
            <div className="font-semibold">
              COR
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Monitora ocorrências críticas.
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <Wrench className="w-5 h-5 text-[#13335a] mb-2" />
            <div className="font-semibold">
              CTO
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Aciona órgãos e concessionárias.
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <TrendingUp className="w-5 h-5 text-[#13335a] mb-2" />
            <div className="font-semibold">
              Gestão
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Acompanha indicadores.
            </div>
          </div>

        </div>

      </div>

      {/* FLUXO */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

        <h2 className="font-bold text-slate-800 mb-4">
          Fluxo Operacional
        </h2>

        <div className="space-y-3 text-slate-600">

          <div>1. Escola registra ocorrência.</div>
          <div>2. Sistema gera número único.</div>
          <div>3. CRE valida e classifica.</div>
          <div>4. COR monitora chamados críticos.</div>
          <div>5. CTO registra acionamento externo.</div>
          <div>6. Atualizações ficam registradas no histórico.</div>
          <div>7. Chamado é resolvido.</div>
          <div>8. Escola confirma atendimento.</div>
          <div>9. Chamado é encerrado formalmente.</div>

        </div>

      </div>

      {/* PRIORIDADES */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

        <h2 className="font-bold text-slate-800 mb-4">
          Prioridades e SLA
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertTriangle className="w-5 h-5 text-red-700 mb-2" />
            <div className="font-bold text-red-700">
              Crítica
            </div>
            <div className="text-sm text-red-600">
              SLA até 4h
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <Clock className="w-5 h-5 text-orange-700 mb-2" />
            <div className="font-bold text-orange-700">
              Alta
            </div>
            <div className="text-sm text-orange-600">
              SLA até 24h
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <Clock className="w-5 h-5 text-yellow-700 mb-2" />
            <div className="font-bold text-yellow-700">
              Média
            </div>
            <div className="text-sm text-yellow-600">
              SLA até 72h
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Clock className="w-5 h-5 text-green-700 mb-2" />
            <div className="font-bold text-green-700">
              Baixa
            </div>
            <div className="text-sm text-green-600">
              SLA até 7 dias
            </div>
          </div>

        </div>

      </div>

      {/* GOVERNANÇA */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

        <h2 className="font-bold text-slate-800 mb-4">
          Regras de Governança
        </h2>

        <ul className="space-y-2 text-slate-600 list-disc pl-5">
          <li>Toda movimentação gera histórico.</li>
          <li>Toda alteração de prioridade é registrada.</li>
          <li>Chamados críticos aparecem com destaque.</li>
          <li>Anexos não substituem descrição textual.</li>
          <li>Chamados não podem ser encerrados sem solução registrada.</li>
          <li>Encerramento exige confirmação da unidade escolar.</li>
        </ul>

      </div>

      {/* ROADMAP */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

        <h2 className="font-bold text-slate-800 mb-4">
          Evoluções Futuras
        </h2>

        <ul className="space-y-2 text-slate-600 list-disc pl-5">
          <li>Integração WhatsApp → Pré-Chamado.</li>
          <li>Integração com Power BI.</li>
          <li>Mapa georreferenciado.</li>
          <li>Integração automática com concessionárias.</li>
          <li>Classificação automática via IA.</li>
          <li>Painel preditivo de recorrências.</li>
        </ul>

      </div>

      <div className="bg-[#13335a] text-white rounded-xl p-6">
        <div className="flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2" />
          Sistema de Infraestrutura Escolar • SME-RJ
        </div>
      </div>

    </div>
  );
}