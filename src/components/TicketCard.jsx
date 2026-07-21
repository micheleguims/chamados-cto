import React from 'react';
import { Star, ArrowDownUp, Clock, User } from 'lucide-react';
import Badge from './Badge';
import { getStatusColor, getTicketAgeDays, getAgingAlertStyle } from '../utils/helpers';

export default function TicketCard({ 
  ticket, 
  index, 
  member, 
  sortMode, 
  viewLayout = 'member', 
  handleDragStart, 
  handleDragOver, 
  handleCardReorderDrop, 
  onViewTicket 
}) {
  const otherAssignees = ticket.assignedTo.filter(p => p !== member);
  const isPool = member === 'Fila';
  
  const daysOpen = getTicketAgeDays(ticket.createdAt);
  const isClosed = ticket.status === 'Resolvido' || ticket.status === 'Encerrado';
  const agingAlert = getAgingAlertStyle(daysOpen, isClosed);

  return (
    <div 
      draggable 
      onDragStart={(e) => handleDragStart(e, ticket.id, viewLayout === 'status' ? ticket.status : member)}
      onDragOver={handleDragOver}
      onDrop={(e) => isPool ? null : handleCardReorderDrop(e, ticket.id, member)}
      onClick={() => onViewTicket(ticket)}
      className={`bg-white p-3 rounded-lg border border-slate-200 cursor-pointer shadow-sm transition-all hover:shadow-md hover:border-[#66b6e3] group ${
        isPool ? 'w-full sm:w-[280px]' : 'relative'
      }`}
    >
      {/* CABEÇALHO DO CARD */}
      <div className="flex justify-between items-start mb-2 gap-1">
        
        {/* Lógica Alternada: Status vs Responsáveis */}
        {viewLayout === 'status' ? (
          <div className="flex flex-wrap gap-1">
            {ticket.assignedTo.length > 0 ? (
              ticket.assignedTo.map(person => (
                <span key={person} className="text-[10px] font-bold px-2 py-0.5 bg-[#13335a] text-white rounded-full flex items-center shadow-sm">
                  <User className="w-3 h-3 mr-1 opacity-70" /> {person}
                </span>
              ))
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-full">
                Sem atribuição
              </span>
            )}
          </div>
        ) : (
          <Badge colorClass={getStatusColor(ticket.status)}>{ticket.status}</Badge>
        )}
        
        <div className="flex flex-col items-end gap-1">
          {agingAlert && (
            <div className={`flex items-center px-1.5 py-0.5 rounded text-[10px] border ${agingAlert.classes}`} title="Tempo de permanência em aberto">
              <Clock className="w-2.5 h-2.5 mr-1 stroke-[2.5]" />
              {agingAlert.text}
            </div>
          )}

          {!isPool && sortMode === 'priority' && viewLayout === 'member' && (
            <div className={`flex items-center px-2 py-0.5 rounded-full border shadow-sm ${index === 0 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>
              {index === 0 && <Star className="w-3 h-3 mr-1 fill-current" />}
              <span className="text-[10px] font-bold">#{index + 1}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="font-semibold text-sm text-slate-800 line-clamp-2 my-1">
        {ticket.title}
      </div>
      
      {/* RODAPÉ DO CARD */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="text-[10px] text-slate-400 font-mono">{ticket.id}</span>
          
          {isPool && <span className="text-xs text-slate-500 truncate">{ticket.sector}</span>}
          
          {/* Mostra parceiros compartilhados apenas no layout de membro */}
          {viewLayout === 'member' && !isPool && otherAssignees.length > 0 && (
            <span className="text-[9px] font-bold text-[#66b6e3] bg-blue-50 px-1 rounded-sm truncate" title="Compartilhado">
              & {otherAssignees.join(', ')}
            </span>
          )}
        </div>
        {viewLayout === 'member' && !isPool && sortMode === 'priority' && (
          <ArrowDownUp className="w-3 h-3 text-slate-300 group-hover:text-[#66b6e3]" />
        )}
      </div>
    </div>
  );
}