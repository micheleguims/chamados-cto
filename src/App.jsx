import React, { useState } from 'react';
import { 
  PlusCircle, AlertTriangle, LogOut, Users, BarChart2, FileCode,
} from 'lucide-react';
import TicketList from './views/TicketListView';
import TicketDetailsView from './views/TicketDetailsView';
import TicketFormView from './views/TicketFormView';
import MetricsView from './views/MetricsView';
import AllocationView from './views/AllocationView';
import Documentation from './views/DocumentationView';
import LoginView from './views/LoginView';

import { INITIAL_TICKETS } from './config/constants';

// ==========================================
// 10. APLICAÇÃO PRINCIPAL (APP)
// Arquivo: src/App.jsx
// ==========================================

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const [historyMode, setHistoryMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  
  const [tickets, setTickets] = useState(INITIAL_TICKETS);

  const navigateTo = (view, ticket = null) => {
    setSelectedTicket(ticket);
    setCurrentView(view);
  };

  const handleNavigateWithFilter = (status) => {
    setHistoryMode(true);
    setFilterStatus(status);
    setCurrentView('list');
  };

  const handleLogin = (user) => { setCurrentUser(user); setCurrentView('list'); };
  const handleLogout = () => { setCurrentUser(null); setCurrentView('list'); setHistoryMode(false); setFilterStatus(''); };

  const handleAddTicket = (newTicket) => {
    setTickets([...tickets, newTicket]); 
    navigateTo('list');
  };

  const handleUpdateTicket = (updatedTicket) => {
    setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    if (selectedTicket && selectedTicket.id === updatedTicket.id) setSelectedTicket(updatedTicket);
  };

  const handleBulkUpdateTickets = (updatedTicketsArray) => {
    setTickets(prevTickets => {
      const newTickets = [...prevTickets];
      updatedTicketsArray.forEach(updatedObj => {
        const idx = newTickets.findIndex(t => t.id === updatedObj.id);
        if (idx !== -1) newTickets[idx] = updatedObj;
      });
      return newTickets;
    });
  };

  if (!currentUser) return <LoginView onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#13335a] text-white shadow-md z-10 sticky top-0 border-b-4 border-[#66b6e3]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg"><AlertTriangle className="w-6 h-6 text-[#66b6e3]" /></div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Chamados</h1>
              <span className="font-light text-xs text-[#66b6e3] block -mt-1">Gerência de Sistemas e Dados (CIT)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => navigateTo('list')} className={`hover:text-[#66b6e3] transition ${currentView === 'list' ? 'text-[#66b6e3]' : ''}`}>Chamados</button>
            {currentUser.role === 'admin' && (
              <>
                <button onClick={() => navigateTo('assign')} className={`hover:text-[#66b6e3] transition flex items-center ${currentView === 'assign' ? 'text-[#66b6e3]' : ''}`}><Users className="w-4 h-4 mr-1"/> Distribuição</button>
                <button onClick={() => navigateTo('metrics')} className={`hover:text-[#66b6e3] transition flex items-center ${currentView === 'metrics' ? 'text-[#66b6e3]' : ''}`}><BarChart2 className="w-4 h-4 mr-1"/> Métricas</button>
              </>
            )}
            <button onClick={() => navigateTo('docs')} className={`hover:text-[#66b6e3] transition flex items-center ${currentView === 'docs' ? 'text-[#66b6e3]' : ''}`}><FileCode className="w-4 h-4 mr-1"/> Docs</button>
            <div className="flex items-center gap-2 pl-2 border-l border-white/20">
              <div className="hidden md:block text-right">
                <span className="block text-xs font-bold">{currentUser.username}</span>
                <span className="block text-[10px] text-slate-300 font-medium uppercase">{currentUser.role}</span>
              </div>
              <button onClick={handleLogout} className="p-1.5 bg-white/10 hover:bg-red-600 rounded-lg transition" title="Sair"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {currentView === 'list' && (
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Meus Chamados</h2>
            </div>
            <button onClick={() => navigateTo('new')} className="bg-[#13335a] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center font-medium transition shadow-sm text-sm">
              <PlusCircle className="w-5 h-5 mr-2" /> Novo Chamado
            </button>
          </div>
        )}

        {/* View Router */}
        {currentView === 'list' && <TicketList tickets={tickets} currentUser={currentUser} onViewTicket={(t) => navigateTo('details', t)} historyMode={historyMode} setHistoryMode={setHistoryMode} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />}
        {currentView === 'new' && <TicketFormView currentUser={currentUser} onSubmit={handleAddTicket} onCancel={() => navigateTo('list')} />}
        {currentView === 'details' && selectedTicket && <TicketDetailsView ticket={selectedTicket} currentUser={currentUser} onBack={() => navigateTo('list')} onUpdateTicket={handleUpdateTicket} />}
        {currentView === 'metrics' && <MetricsView tickets={tickets} onNavigateWithFilter={handleNavigateWithFilter} />}
        {currentView === 'assign' && <AllocationView tickets={tickets} onUpdateTicket={handleUpdateTicket} onBulkUpdateTickets={handleBulkUpdateTickets} onViewTicket={(t) => navigateTo('details', t)} />}
        {currentView === 'docs' && <Documentation currentUser={currentUser} />}
      </main>
    </div>
  );
}