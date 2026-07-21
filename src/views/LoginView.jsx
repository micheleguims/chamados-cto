// ==========================================
// 3. TELA DE LOGIN
// Arquivo Futuro Sugerido: src/views/LoginView.jsx
// ==========================================
import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginView ({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '123') {
      onLogin({ username: 'Administrador (CIT)', role: 'admin', sector: 'E/CTIN', email: 'admin.cit@rio.rj.gov.br' });
    } else if (username === 'user' && password === '123') {
      onLogin({ username: 'Usuário SME', role: 'user', sector: 'E/10a.CRE/GRH', email: 'usuario.sme@rio.rj.gov.br' });
    } else {
      setError('Credenciais incorretas. Use as dicas mostradas abaixo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#13335a] flex flex-col justify-center items-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-8 border-[#66b6e3]">
        <div className="text-center mb-8">
          <div className="bg-[#13335a]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-8 h-8 text-[#13335a]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Chamados - CIT</h1>
          <p className="text-sm text-slate-500 mt-1">Gerência de Sistemas e Dados</p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs mb-4 border border-red-200 flex items-center">
            <ShieldAlert className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Usuário</label>
            <input type="text" required className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#66b6e3] outline-none" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Senha</label>
            <input type="password" required className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#66b6e3] outline-none" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-3 bg-[#13335a] text-white font-semibold rounded-lg hover:opacity-90 transition flex items-center justify-center">
            Acessar Painel <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>
        <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <p className="font-semibold text-slate-600 mb-1">Credenciais de Teste:</p>
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border">
            <div><p>Admin: <span className="font-mono bg-slate-200 px-1">admin</span> / <span className="font-mono bg-slate-200 px-1">123</span></p></div>
            <div><p>User: <span className="font-mono bg-slate-200 px-1">user</span> / <span className="font-mono bg-slate-200 px-1">123</span></p></div>
          </div>
        </div>
      </div>
    </div>
  );
};