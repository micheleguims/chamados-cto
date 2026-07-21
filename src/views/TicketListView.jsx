import React, { useState, useMemo } from 'react';
import { OPEN_STATUSES, STATUS } from '../config/constants';
import { getStatusColor, getTicketAgeDays, getAgingAlertStyle } from '../utils/helpers';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { Search, ChevronRight, Settings, Clock } from 'lucide-react';

export default function TicketList ({ tickets, currentUser, onViewTicket, historyMode, setHistoryMode, filterStatus, setFilterStatus }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const hasPermission = currentUser.role === 'admin' || t.sector === currentUser.sector;
      if (!hasPermission) return false;

      const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchStatus = true;
      if (!historyMode) {
        if (filterStatus && OPEN_STATUSES.includes(filterStatus)) {
           matchStatus = t.status === filterStatus;
        } else {
           matchStatus = OPEN_STATUSES.includes(t.status);
        }
      } else {
        if (filterStatus) {
           matchStatus = t.status === filterStatus;
        }
      }

      return matchSearch && matchStatus;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [tickets, searchTerm, filterStatus, historyMode, currentUser]);

  const displayedTickets = historyMode ? filteredTickets : filteredTickets.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Frame Informativo */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-[#13335a]">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">
            {historyMode ? "Modo Histórico Completo" : "Caixa de Entrada"}
          </h3>
          <p className="text-xs text-slate-500">
            Acompanhe o tempo de resposta dos chamados abertos. Alertas visuais indicam pendências antigas.
          </p>
        </div>
        <button
          onClick={() => { setHistoryMode(!historyMode); setFilterStatus(''); }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center ${
            historyMode ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-[#13335a] text-white hover:opacity-90'
          }`}
        >
          {historyMode ? "Voltar aos Abertos" : "Ver Meu Histórico Completo"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por ID ou Título..." 
              className="pl-10 p-2 w-full border rounded-lg focus:ring-2 focus:ring-[#66b6e3] outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-slate-500 self-center font-medium">Filtrar:</span>
            <select className="p-2 border rounded-lg bg-white text-xs font-medium" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              {!historyMode ? (
                <>
                  <option value="">Todos os Abertos</option>
                  <option value="Aguardando fila">Aguardando fila</option>
                  <option value="Em andamento">Em andamento</option>
                </>
              ) : (
                <>
                  <option value="">Todos os Status</option>
                  {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </>
              )}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Título & Classificação</th>
                <th className="p-4 font-medium hidden md:table-cell">Idade do Chamado</th>
                <th className="p-4 font-medium hidden lg:table-cell">Responsáveis</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayedTickets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8">
                    <EmptyState message="Nenhum chamado encontrado nesta visualização." icon={Search} />
                  </td>
                </tr>
              ) : (
                displayedTickets.map(ticket => {
                  const daysOpen = getTicketAgeDays(ticket.createdAt);
                  const isClosed = ticket.status === 'Resolvido' || ticket.status === 'Encerrado';
                  const alertSLA = getAgingAlertStyle(daysOpen, isClosed);
                  
                  return (
                    <tr key={ticket.id} onClick={() => onViewTicket(ticket)} className="hover:bg-slate-50 cursor-pointer transition group">
                      <td className="p-4 font-mono text-sm text-slate-600 group-hover:text-[#66b6e3]">{ticket.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{ticket.title}</div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center">
                          <Settings className="w-3 h-3 mr-1 text-[#66b6e3]" /> {ticket.classification}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        {isClosed ? (
                          <span className="text-xs text-slate-400">Finalizado</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Clock className={`w-3.5 h-3.5 ${daysOpen >= 3 ? 'text-amber-500' : 'text-slate-400'}`} />
                            <span className={`text-xs ${alertSLA ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
                              {daysOpen === 0 ? 'Aberto hoje' : `${daysOpen} ${daysOpen === 1 ? 'dia' : 'dias'}`}
                            </span>
                            {alertSLA && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                          </div>
                        )}
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        {ticket.assignedTo.length === 0 ? (
                          <span className="text-[10px] uppercase font-bold text-slate-400">Não Atribuído</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {ticket.assignedTo.map(person => (
                              <span key={person} className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">{person}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-4 flex items-center justify-between">
                        <Badge colorClass={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#13335a] transition" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};