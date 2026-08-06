// ==========================================
// LOGIN - INFRAESTRUTURA ESCOLAR
// src/views/LoginView.jsx
// ==========================================

import React, { useState } from "react";

import { signIn, getCurrentProfile } from "../services/authService";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await signIn(email, password);

      const profile = await getCurrentProfile();

      if (!profile) {
        setError("Login realizado, mas o perfil do usuário não foi encontrado.");
        return;
      }

      if (!profile.ativo) {
        setError("Usuário inativo. Procure o administrador do sistema.");
        return;
      }

      onLogin(profile);
    } catch (err) {
      console.error("Erro no login:", err);
      setError("E-mail ou senha inválidos, ou perfil não configurado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <section className="bg-[#13335a] text-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-6">
              <ShieldCheck className="w-8 h-8 mr-3" />
              <span className="font-bold text-lg">Sistema Institucional</span>
            </div>

            <h1 className="text-3xl font-bold leading-tight mb-4">
              Gestão de Ocorrências - Concessionárias
            </h1>

            <p className="text-blue-100 text-sm leading-relaxed">
              Plataforma para registro, monitoramento, acompanhamento e encerramento
              de demandas de Concessionárias da rede escolar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-8 text-sm">
            <div className="bg-white/10 rounded-xl p-4">
              <School className="w-5 h-5 mb-2" />
              <strong>Unidades Escolares</strong>
              <p className="text-blue-100 text-xs mt-1">Registro das ocorrências</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <Building2 className="w-5 h-5 mb-2" />
              <strong>CRE</strong>
              <p className="text-blue-100 text-xs mt-1">Validação e triagem</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <Briefcase className="w-5 h-5 mb-2" />
              <strong>COR / CTO</strong>
              <p className="text-blue-100 text-xs mt-1">Monitoramento operacional</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <Users className="w-5 h-5 mb-2" />
              <strong>Administrador</strong>
              <p className="text-blue-100 text-xs mt-1">Controle do sistema</p>
            </div>
          </div>
        </section>

        <section className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Acessar Sistema
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Concessionárias • SME-RJ
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start">
              <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                placeholder="Digite seu e-mail"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b6e3]"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#13335a] hover:opacity-90 disabled:opacity-60 text-white p-3 rounded-lg font-semibold flex items-center justify-center transition"
            >
              {loading ? "Entrando..." : "Entrar"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
            Use o e-mail e a senha cadastrados em Authentication &gt; Users no Supabase.
            O usuário também precisa existir na tabela profiles.
          </div>
        </section>
      </div>
    </div>
  );
}