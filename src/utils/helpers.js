// ==========================================
// 2. FUNÇÕES AUXILIARES DE FORMATAÇÃO E UI
// Arquivo: src/utils/helpers.js
// ==========================================

export const getStatusColor = (status) => {
  switch(status) {
    case 'Aguardando fila': return 'bg-red-100 text-red-800 border-red-200';
    case 'Em andamento': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Resolvido': return 'bg-green-100 text-green-800 border-green-200';
    case 'Encerrado': return 'bg-slate-100 text-slate-800 border-slate-200';
    default: return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

export const formatCommentDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  
  if (isToday) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' });
  }
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' });
};

// Retorna a quantidade de dias que o chamado está aberto
export const getTicketAgeDays = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// Retorna a estilização visual discreta para o alerta de SLA/Aging
export const getAgingAlertStyle = (days, isClosed) => {
  if (isClosed || days < 3) return null;
  if (days >= 7) return { text: `${days} dias aberto`, classes: 'text-red-600 bg-red-50 border-red-200 font-bold' };
  return { text: `${days} dias aberto`, classes: 'text-amber-600 bg-amber-50 border-amber-200 font-medium' };
};

// Retorna a cor de fundo e borda para as colunas do Kanban
export const getStatusColumnStyle = (status) => {
  switch(status) {
    case 'Aguardando fila': return 'bg-red-50 border-red-200';
    case 'Em andamento': return 'bg-yellow-50 border-yellow-200';
    case 'Resolvido': return 'bg-green-50 border-green-200';
    case 'Encerrado': return 'bg-slate-50 border-slate-200';
    default: return 'bg-blue-50 border-blue-200';
  }
};