// ==========================================
// 8. KANBAN DE ALOCAÇÃO (ADMIN)
// Arquivo: src/views/AllocationView.jsx
// ==========================================

import React, { useState, useMemo } from 'react';
import { TEAM_MEMBERS, STATUS } from '../config/constants';
import TicketCard from '../components/TicketCard';
import EmptyState from '../components/EmptyState';
import { Users, UserPlus, Layers, LayoutDashboard } from 'lucide-react';
import { getStatusColor, getStatusColumnStyle } from '../utils/helpers';

export default function AllocationView ({ tickets, onUpdateTicket, onBulkUpdateTickets, onViewTicket }) {
  const [sortMode, setSortMode] = useState('priority'); 
  const [filterPerson, setFilterPerson] = useState('');
  const [viewLayout, setViewLayout] = useState('member'); // 'member' ou 'status'

  const handleDragStart = (e, ticketId, sourceColumn) => {
    e.dataTransfer.setData('ticketId', ticketId);
    e.dataTransfer.setData('sourceColumn', sourceColumn || '');
  };
  
  const handleDragOver = (e) => e.preventDefault();

  const handleDropToColumn = (e, targetColumn) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('ticketId');
    const sourceCol = e.dataTransfer.getData('sourceColumn');
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) return;

    let newAssigned = [...ticket.assignedTo];
    let newStatus = ticket.status;
    let actionLog = '';

    // FLUXO 1: MODO DE RAIA POR STATUS
    if (viewLayout === 'status') {
      if (STATUS.includes(targetColumn)) {
        newStatus = targetColumn;
        actionLog = `Status alterado via Kanban para [${targetColumn}].`;
      }
    } 
    // FLUXO 2: MODO DE RAIA POR MEMBRO DA EQUIPE
    else {
      if (targetColumn === 'Fila') {
        if (sourceCol && sourceCol !== 'Fila') {
          newAssigned = newAssigned.filter(p => p !== sourceCol);
        }
        if (newAssigned.length === 0) {
          newStatus = 'Aguardando fila';
        }
        actionLog = `Chamado devolvido à piscina por remanejamento.`;
      } else {
        if (!newAssigned.includes(targetColumn)) newAssigned.push(targetColumn);
        if (ticket.status === 'Aguardando fila') newStatus = 'Em andamento';
        actionLog = `Atribuído para o operador [${targetColumn}] via Kanban.`;
      }
    }

    const logEntry = {
      id: Date.now(),
      type: 'kanban_movement',
      message: actionLog,
      date: new Date().toISOString()
    };

    onUpdateTicket({ 
      ...ticket, 
      assignedTo: newAssigned, 
      status: newStatus, 
      updatedAt: new Date().toISOString(),
      history: [...(ticket.history || []), logEntry]
    });
  };

  const handleCardReorderDrop = (e, targetTicketId, column) => {
    e.preventDefault();
    e.stopPropagation();

    const draggedId = e.dataTransfer.getData('ticketId');
    const sourceCol = e.dataTransfer.getData('sourceColumn');

    if (draggedId === targetTicketId) return;
    if (viewLayout === 'status') return; // Reordenação de prioridade manual apenas na raia de equipe

    if (sourceCol !== column) {
      handleDropToColumn(e, column);
      return;
    }

    if (sortMode !== 'priority') return; 

    let colTickets = tickets.filter(t => t.status !== 'Resolvido' && t.status !== 'Encerrado' && t.assignedTo.includes(column));
    colTickets.sort((a, b) => (a.priorityIndex || 0) - (b.priorityIndex || 0));

    const draggedIndex = colTickets.findIndex(t => t.id === draggedId);
    const targetIndex = colTickets.findIndex(t => t.id === targetTicketId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedItem] = colTickets.splice(draggedIndex, 1);
    colTickets.splice(targetIndex, 0, draggedItem);

    const bulkUpdates = colTickets.map((t, idx) => ({ ...t, priorityIndex: idx + 1, updatedAt: new Date().toISOString() }));
    onBulkUpdateTickets(bulkUpdates);
  };

  const activeTickets = tickets.filter(t => t.status !== 'Resolvido' && t.status !== 'Encerrado');
  const unassigned = activeTickets.filter(t => t.assignedTo.length === 0);

  const sortTickets = (ticketList) => {
    return [...ticketList].sort((a, b) => {
      if (sortMode === 'priority') return (a.priorityIndex || 999) - (b.priorityIndex || 999);
      if (sortMode === 'date_asc') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortMode === 'date_desc') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
  };

  const poolTickets = useMemo(() => {
    return [...unassigned].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [unassigned]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-auto min-h-[calc(100vh-120px)] space-y-6">
      
      {/* Menu Superior Operacional */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            {viewLayout === 'member' ? <Users className="mr-2 text-[#13335a]" /> : <LayoutDashboard className="mr-2 text-[#13335a]" />} 
            Painel de Distribuição Geral
          </h2>
          <p className="text-sm text-slate-500">Mude o modo de visualização abaixo para organizar os fluxos por Operador ou por Status de Ciclo.</p>
        </div>
        
        {/* Controles do Frame */}
        <div className="flex flex-wrap items-center gap-3">
          {/* CONTROLADOR DE FORMATO DE KANBAN (Item 2) */}
          <div className="flex bg-slate-200/60 p-1 rounded-xl border">
            <button onClick={() => setViewLayout('member')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition ${viewLayout === 'member' ? 'bg-white text-[#13335a] shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              <Users className="w-3.5 h-3.5 mr-1" /> Por Responsável
            </button>
            <button onClick={() => setViewLayout('status')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition ${viewLayout === 'status' ? 'bg-white text-[#13335a] shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              <Layers className="w-3.5 h-3.5 mr-1" /> Por Status (Lifecycle)
            </button>
          </div>

          {viewLayout === 'member' && (
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Equipe:</span>
              <select className="border-none bg-slate-50 text-[#13335a] font-bold text-sm focus:ring-0 cursor-pointer" value={filterPerson} onChange={e => setFilterPerson(e.target.value)}>
                <option value="">Todos</option>
                {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Classificar:</span>
            <select className="border-none bg-slate-50 text-[#13335a] font-bold text-sm focus:ring-0 cursor-pointer" value={sortMode} onChange={e => setSortMode(e.target.value)}>
              <option value="priority">Prioridades</option>
              <option value="date_asc">Mais antigas</option>
              <option value="date_desc">Mais recentes</option>
            </select>
          </div>
        </div>
      </div>

      {/* RAIA DINÂMICA DO QUADRO KANBAN */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start">
        
        {/* VISUALIZAÇÃO A: POR OPERADOR */}
        {viewLayout === 'member' && (
          TEAM_MEMBERS.filter(m => filterPerson ? m === filterPerson : true).map(member => {
            const memberTicketsRaw = activeTickets.filter(t => t.assignedTo.includes(member));
            const memberTickets = sortTickets(memberTicketsRaw);
            
            return (
              <div key={member} onDragOver={handleDragOver} onDrop={(e) => handleDropToColumn(e, member)} className="bg-white rounded-xl border border-slate-200 p-4 min-w-[300px] w-[300px] flex flex-col shadow-sm">
                <h3 className="font-bold text-[#13335a] text-sm mb-3 border-b pb-2 flex items-center justify-between">
                  {member} 
                  <span className="bg-slate-100 text-[#13335a] border px-2 rounded-full text-xs">{memberTickets.length}</span>
                </h3>
                <div className="flex flex-col gap-3">
                  {memberTickets.length === 0 ? (
                    <div className="h-full mt-2">
                      <EmptyState message="Arraste para cá para atribuir" icon={UserPlus} />
                    </div>
                  ) : (
                    memberTickets.map((t, index) => (
                      <TicketCard 
                        key={t.id}
                        ticket={t}
                        index={index}
                        member={member}
                        sortMode={sortMode}
                        viewLayout="member"
                        handleDragStart={handleDragStart}
                        handleDragOver={handleDragOver}
                        handleCardReorderDrop={handleCardReorderDrop}
                        onViewTicket={onViewTicket}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* VISUALIZAÇÃO B: POR STATUS DO CICLO DE VIDA (Item 2 Solicitado) */}
        {viewLayout === 'status' && (
          STATUS.map(st => {
            const statusTicketsRaw = tickets.filter(t => t.status === st);
            const statusTickets = sortTickets(statusTicketsRaw);

            return (
              <div key={st} onDragOver={handleDragOver} onDrop={(e) => handleDropToColumn(e, st)} className="bg-white rounded-xl border border-slate-200 p-4 min-w-[300px] w-[300px] flex flex-col shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm mb-3 border-b pb-2 flex items-center justify-between">
                  {st}
                  <span className="bg-slate-100 text-slate-700 border px-2 rounded-full text-xs">{statusTickets.length}</span>
                </h3>
                <div className="flex flex-col gap-3">
                  {statusTickets.length === 0 ? (
                    <div className="h-full mt-2">
                      <EmptyState message="Sem chamados neste status" icon={Layers} />
                    </div>
                  ) : (
                    statusTickets.map((t, index) => (
                      <TicketCard 
                        key={t.id}
                        ticket={t}
                        index={index}
                        member={st}
                        sortMode={sortMode}
                        viewLayout="status"
                        handleDragStart={handleDragStart}
                        handleDragOver={handleDragOver}
                        handleCardReorderDrop={handleCardReorderDrop}
                        onViewTicket={onViewTicket}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Piscina Inferior Desalocada (Apenas visível no modo por Operador) */}
      {viewLayout === 'member' && (
        <div 
          onDragOver={handleDragOver} 
          onDrop={(e) => handleDropToColumn(e, 'Fila')} 
          className="bg-slate-100/80 rounded-xl border-2 border-dashed border-slate-300 p-6 flex flex-col mt-4 min-h-[250px]"
        >
          <h3 className="font-bold text-slate-700 text-sm mb-4 border-b border-slate-300 pb-2 flex items-center">
            Piscina de Entrada (Não Atribuídos) 
            <span className="bg-slate-300 text-slate-700 px-2 py-0.5 rounded-full text-xs ml-3">{poolTickets.length} pendentes</span>
          </h3>
          
          {poolTickets.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">
              Não há chamados aguardando distribuição na piscina.
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 overflow-y-auto max-h-[300px]">
              {poolTickets.map(t => (
                <TicketCard 
                  key={t.id}
                  ticket={t}
                  member="Fila"
                  sortMode={sortMode}
                  viewLayout="member"
                  handleDragStart={handleDragStart}
                  handleDragOver={handleDragOver}
                  onViewTicket={onViewTicket}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};