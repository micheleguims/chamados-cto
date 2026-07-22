// ==========================================
// LOGIN - INFRAESTRUTURA ESCOLAR
// src/views/LoginView.jsx
// ==========================================

import React, { useState } from "react";

import {
  ShieldCheck,
  School,
  Building2,
  Briefcase,
  Users,
  ArrowRight,
  AlertTriangle
} from "lucide-react";

export default function LoginView({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const USERS = {
    escola: {
      username: "escola",
      password: "123",
      role: "Escola",
      name: "Direção Escolar",
      email: "direcao.escola@rio.rj.gov.br",
      cre: "3ª CRE",
      schoolCode: "0301012"
    },

    cre: {
      username: "cre",
      password: "123",
      role: "CRE",
      name: "Analista CRE",
      email: "cre3@rio.rj.gov.br",
      cre: "3ª CRE"
    },

    cor: {
      username: "cor",
      password: "123",
      role: "COR",
      name: "Operador COR",
      email: "cor@rio.rj.gov.br"
    },

    cto: {
      username: "cto",
      password: "123",
      role: "CTO",
      name: "Analista CTO",
      email: "cto@rio.rj.gov.br"
    },

    gestao: {
      username: "gestao",
      password: "123",
      role: "Gestão",
      name: "Gestão Executiva",
      email: "gestao@rio.rj.gov.br"
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const foundUser = Object.values(USERS).find(
      (u) =>
        u.username === username &&
        u.password === password
    );

    if (!foundUser) {
      setError(
        "Usuário ou senha inválidos. Utilize uma das credenciais de demonstração."
      );
      return;
    }

    setError("");

    onLogin({
      username: foundUser.name,
      role: foundUser.role,
      email: foundUser.email,
      cre: foundUser.cre,
      schoolCode: foundUser.schoolCode
    });
  };

  const quickLogin = (userKey) => {
    const user = USERS[userKey];

    onLogin({
      username: user.name,
      role: user.role,
      email: user.email,
      cre: user.cre,
      schoolCode: user.schoolCode
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">

        {/* APRESENTAÇÃO */}
        <div className="hidden lg:flex flex-col justify-center">
          <div className="max-w-lg">

            <div className="inline-flex items-center px-3 py-2 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm mb-5">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Sistema Institucional
            </div>

            <h1 className="text-4xl font-bold text-slate-800 leading-tight">
              Gestão de Ocorrências de
              <span className="text-[#13335a]">
                {" "}
                Infraestrutura Escolar
              </span>
            </h1>

            <p className="text-slate-600 mt-5 text-lg leading-relaxed">
              Plataforma para registro, monitoramento,
              acompanhamento e encerramento de demandas
              de infraestrutura da rede escolar.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <School className="w-5 h-5 text-[#13335a] mb-2" />
                <div className="font-semibold text-slate-800">
                  Unidades Escolares
                </div>
                <div className="text-xs text-slate-500">
                  Registro das ocorrências
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <Building2 className="w-5 h-5 text-[#13335a] mb-2" />
                <div className="font-semibold text-slate-800">
                  CRE
                </div>
                <div className="text-xs text-slate-500">
                  Validação e triagem
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <Users className="w-5 h-5 text-[#13335a] mb-2" />
                <div className="font-semibold text-slate-800">
                  COR / CTO
                </div>
                <div className="text-xs text-slate-500">
                  Monitoramento operacional
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <Briefcase className="w-5 h-5 text-[#13335a] mb-2" />
                <div className="font-semibold text-slate-800">
                  Gestão
                </div>
                <div className="text-xs text-slate-500">
                  Indicadores executivos
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* LOGIN */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">

            <div className="bg-[#13335a] text-white p-6">
              <h2 className="text-2xl font-bold">
                Acessar Sistema
              </h2>

              <p className="text-blue-100 mt-1 text-sm">
                Infraestrutura Escolar • SME-RJ
              </p>
            </div>

            <div className="p-6">

              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />

                  <span className="text-sm text-red-700">
                    {error}
                  </span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Usuário
                  </label>

                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                    placeholder="Digite seu usuário"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Senha
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                    placeholder="Digite sua senha"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#13335a] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition flex justify-center items-center"
                >
                  Entrar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>

              </form>

              {/* LOGIN RÁPIDO DEMO */}
              <div className="mt-8 pt-6 border-t border-slate-100">

                <h3 className="text-sm font-bold text-slate-700 mb-3">
                  Perfis de Demonstração
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <button
                    onClick={() => quickLogin("escola")}
                    className="p-3 border rounded-lg hover:bg-slate-50 text-left"
                  >
                    <div className="font-semibold text-slate-800">
                      Escola
                    </div>

                    <div className="text-xs text-slate-500">
                      Direção Escolar
                    </div>
                  </button>

                  <button
                    onClick={() => quickLogin("cre")}
                    className="p-3 border rounded-lg hover:bg-slate-50 text-left"
                  >
                    <div className="font-semibold text-slate-800">
                      CRE
                    </div>

                    <div className="text-xs text-slate-500">
                      Triagem Regional
                    </div>
                  </button>

                  <button
                    onClick={() => quickLogin("cor")}
                    className="p-3 border rounded-lg hover:bg-slate-50 text-left"
                  >
                    <div className="font-semibold text-slate-800">
                      COR
                    </div>

                    <div className="text-xs text-slate-500">
                      Centro Operacional
                    </div>
                  </button>

                  <button
                    onClick={() => quickLogin("cto")}
                    className="p-3 border rounded-lg hover:bg-slate-50 text-left"
                  >
                    <div className="font-semibold text-slate-800">
                      CTO
                    </div>

                    <div className="text-xs text-slate-500">
                      Operação Técnica
                    </div>
                  </button>

                  <button
                    onClick={() => quickLogin("gestao")}
                    className="p-3 border rounded-lg hover:bg-slate-50 text-left sm:col-span-2"
                  >
                    <div className="font-semibold text-slate-800">
                      Gestão Executiva
                    </div>

                    <div className="text-xs text-slate-500">
                      Visão Estratégica e Indicadores
                    </div>
                  </button>

                </div>

                <div className="mt-5 bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-bold text-slate-700 mb-2">
                    Credenciais de Teste
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div>escola / 123</div>
                    <div>cre / 123</div>
                    <div>cor / 123</div>
                    <div>cto / 123</div>
                    <div>gestao / 123</div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}