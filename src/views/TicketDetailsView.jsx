import React, { useState, useRef } from 'react';
import { getStatusColor, formatCommentDate } from '../utils/helpers';
import { TEAM_MEMBERS, STATUS } from '../config/constants';
import Badge from '../components/Badge';
import { 
  X, Send, Paperclip, MessageSquare, Clock, User, Trash2, ImageIcon, FileIcon, AlertTriangle, Download, History, Eye
} from 'lucide-react';

export default function TicketDetailsView ({ ticket, currentUser, onBack, onUpdateTicket }) {
  const [newComment, setNewComment] = useState('');
  const [previewFile, setPreviewFile] = useState(null); 
  const [fileToDelete, setFileToDelete] = useState(null);
  const fileInputRef = useRef(null);

  const localHistory = ticket.history || [];

  const handleAddComment = (e) => {
    e.preventDefault();
    if(!newComment.trim()) return;

    const logEntry = {
      id: Date.now() + 1,
      type: 'comment',
      message: `Comentário adicionado por ${currentUser.username}.`,
      date: new Date().toISOString()
    };

    const updatedTicket = {
      ...ticket,
      updatedAt: new Date().toISOString(),
      comments: [
        ...ticket.comments, 
        { id: Date.now(), author: currentUser.username, text: newComment, date: new Date().toISOString() }
      ],
      history: [...localHistory, logEntry]
    };
    onUpdateTicket(updatedTicket);
    setNewComment('');
  };

  const handleStatusChange = (newStatus) => {
    const logEntry = {
      id: Date.now(),
      type: 'status',
      message: `Status alterado de [${ticket.status}] para [${newStatus}] por ${currentUser.username}.`,
      date: new Date().toISOString()
    };

    onUpdateTicket({
      ...ticket,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      history: [...localHistory, logEntry]
    });
  };

  const toggleAssignee = (person) => {
    let newAssigned = [...ticket.assignedTo];
    let actionMessage = '';

    if (newAssigned.includes(person)) {
      newAssigned = newAssigned.filter(p => p !== person);
      actionMessage = `Responsável [${person}] removido por ${currentUser.username}.`;
    } else {
      newAssigned.push(person);
      actionMessage = `Responsável [${person}] adicionado por ${currentUser.username}.`;
    }

    const autoStatus = newAssigned.length > 0 && ticket.status === 'Aguardando fila' ? 'Em andamento' : ticket.status;
    if(autoStatus !== ticket.status) {
      actionMessage += ` Status atualizado para [${autoStatus}] automaticamente.`;
    }

    const logEntry = {
      id: Date.now(),
      type: 'assign',
      message: actionMessage,
      date: new Date().toISOString()
    };

    onUpdateTicket({
      ...ticket,
      assignedTo: newAssigned,
      status: autoStatus,
      updatedAt: new Date().toISOString(),
      history: [...localHistory, logEntry]
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newAttachment = { id: Date.now(), name: file.name, type: file.type, url: URL.createObjectURL(file) };
    
    const logEntry = {
      id: Date.now() + 2,
      type: 'upload',
      message: `Arquivo [${file.name}] anexado por ${currentUser.username}.`,
      date: new Date().toISOString()
    };

    onUpdateTicket({
      ...ticket,
      updatedAt: new Date().toISOString(),
      attachments: [...(ticket.attachments || []), newAttachment],
      history: [...localHistory, logEntry]
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmDeleteFile = (id) => {
    const targetFile = ticket.attachments.find(a => a.id === id);
    
    const logEntry = {
      id: Date.now() + 3,
      type: 'delete_file',
      message: `Arquivo [${targetFile?.name || 'Inominado'}] removido por ${currentUser.username}.`,
      date: new Date().toISOString()
    };

    onUpdateTicket({
      ...ticket,
      updatedAt: new Date().toISOString(),
      attachments: ticket.attachments.filter(a => a.id !== id),
      history: [...localHistory, logEntry]
    });
    setFileToDelete(null);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Coluna Esquerda: Detalhes, Anexos e Operações */}
        <div className="flex-1 space-y-6">
          <button onClick={onBack} className="text-[#13335a] hover:text-[#66b6e3] transition flex items-center text-sm font-medium">
            ← Voltar para listagem
          </button>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{ticket.title}</h1>
                <p className="text-slate-500 font-mono text-sm mt-1">{ticket.id}</p>
              </div>
              <Badge colorClass={getStatusColor(ticket.status)}>{ticket.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 my-4 text-sm">
              <div><span className="block text-slate-500">Classificação:</span><span className="font-medium text-slate-800">{ticket.classification}</span></div>
              <div><span className="block text-slate-500">Setor:</span><span className="font-medium text-slate-800">{ticket.sector}</span></div>
              <div><span className="block text-slate-500">Categoria:</span><span className="font-medium text-slate-800">{ticket.category}</span></div>
              <div><span className="block text-slate-500">Data Abertura:</span><span className="font-medium text-slate-800">{new Date(ticket.createdAt).toLocaleString('pt-BR')}</span></div>
              <div className="col-span-2">
                <span className="block text-slate-500">E-mails de Notificação ({ticket.notifyUser ? 'Ativo' : 'Inativo'}):</span>
                <span className="font-medium text-[#13335a]">{ticket.requesterEmails.join(', ') || 'Nenhum'}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Descrição</h3>
              <div className="bg-slate-50 p-4 rounded text-slate-700 whitespace-pre-wrap text-sm border border-slate-100">{ticket.description}</div>
            </div>

            {/* Gerenciamento de Anexos Mantido e Integrado */}
            <div className="mt-6 pt-6 border-t border-slate-100">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="font-semibold text-slate-800 flex items-center">
                    <Paperclip className="w-4 h-4 mr-2 text-slate-500" /> Arquivos Anexos
                 </h3>
                 <button onClick={() => fileInputRef.current?.click()} className="text-xs bg-[#13335a]/10 text-[#13335a] hover:bg-[#13335a]/20 px-3 py-1.5 rounded font-semibold transition">
                   + Adicionar Arquivo
                 </button>
                 <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
               </div>
               
               {(!ticket.attachments || ticket.attachments.length === 0) ? (
                 <p className="text-xs text-slate-400 italic">Nenhum arquivo anexado a este chamado.</p>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ticket.attachments.map(att => (
                      <div key={att.id} className="flex items-center justify-between p-2 border rounded border-slate-200 bg-slate-50">
                        <div className="flex items-center overflow-hidden mr-2">
                          {att.type.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" /> : <FileIcon className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />}
                          <span className="text-xs text-slate-700 truncate font-medium" title={att.name}>{att.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setPreviewFile(att)} className="p-1.5 text-slate-400 hover:text-[#13335a] bg-white border rounded shadow-sm transition" title="Visualizar/Baixar">
                            <Eye className="w-3 h-3" />
                          </button>
                          <button onClick={() => setFileToDelete(att)} className="p-1.5 text-slate-400 hover:text-red-600 bg-white border rounded shadow-sm transition" title="Excluir">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* Painel Administrativo de Status e Responsáveis */}
          {currentUser.role === 'admin' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Mudar Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {STATUS.map(s => (
                    <button key={s} onClick={() => handleStatusChange(s)} className={`px-3 py-1.5 rounded text-sm font-medium transition ${ticket.status === s ? 'bg-[#13335a] text-white ring-2 ring-[#66b6e3]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Equipe Designada</h3>
                <div className="flex gap-2 flex-wrap">
                  {TEAM_MEMBERS.map(member => {
                    const isAssigned = ticket.assignedTo.includes(member);
                    return (
                      <button key={member} onClick={() => toggleAssignee(member)} className={`flex items-center px-3 py-1.5 rounded text-sm font-medium transition ${isAssigned ? 'bg-[#66b6e3] text-white ring-2 ring-blue-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {member} {isAssigned && <X className="w-3 h-3 ml-1 opacity-70" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* NOVO FRAME: LINHA DO TEMPO HISTÓRICA (Abaixo de Mudar Status) */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center">
              <History className="w-4 h-4 mr-2 text-[#13335a]" /> Linha do Tempo de Auditoria (Histórico)
            </h3>
            {localHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhum evento registrado no histórico.</p>
            ) : (
              <div className="relative border-l-2 border-slate-200 pl-4 ml-2 space-y-4 max-h-60 overflow-y-auto pt-1">
                {localHistory.map((log, i) => (
                  <div key={log.id || i} className="relative">
                    <span className="absolute -left-[21px] top-1 bg-white w-2.5 h-2.5 rounded-full border-2 border-[#13335a]" />
                    <div className="text-[10px] text-slate-400 font-medium">
                      {new Date(log.date).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-xs text-slate-700 font-medium mt-0.5">
                      {log.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Caixa Lateral de Chat/Interações */}
        <div className="w-full lg:w-96 flex flex-col h-[500px] lg:h-[calc(100vh-140px)] lg:sticky lg:top-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-[#13335a]" />
              <h3 className="font-semibold text-slate-800">Interações</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
              {ticket.comments.map(c => {
                const isUser = c.author === currentUser.username;
                return (
                  <div key={c.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 shadow-sm ${isUser ? 'bg-[#13335a] text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm'}`}>
                      <div className={`flex justify-between items-center mb-1 gap-3 ${isUser ? 'text-[#66b6e3]' : 'text-slate-500'}`}>
                        <span className="font-semibold text-xs flex items-center"><User className="w-3 h-3 mr-1" /> {c.author}</span>
                        <span className="text-[10px] opacity-80">{formatCommentDate(c.date)}</span>
                      </div>
                      <p className="text-sm">{c.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <form onSubmit={handleAddComment} className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input type="text" placeholder="Escreva uma mensagem..." className="flex-1 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b6e3]" value={newComment} onChange={e => setNewComment(e.target.value)} />
                <button type="submit" className="p-2 bg-[#13335a] text-white rounded-lg hover:opacity-90"><Send className="w-4 h-4" /></button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Visualizador de Arquivos Mantido */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-slate-800 truncate pr-4">{previewFile.name}</h3>
               <button onClick={() => setPreviewFile(null)} className="p-2 bg-slate-200 hover:bg-red-500 hover:text-white rounded-full transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-200 flex items-center justify-center min-h-[300px] relative">
               {previewFile.type.startsWith('image/') ? (
                 <img src={previewFile.url} alt={previewFile.name} className="max-w-full max-h-full object-contain" />
               ) : previewFile.type === 'application/pdf' ? (
                 <iframe src={previewFile.url} className="w-full h-full border-none" title="PDF Preview" />
               ) : (
                 <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                   <FileIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                   <p className="text-slate-600 mb-4 font-medium">A visualização direta para planilhas/documentos não é nativa no navegador.</p>
                   <a href={previewFile.url} download={previewFile.name} className="inline-flex items-center px-4 py-2 bg-[#13335a] text-white rounded hover:opacity-90 font-semibold transition">
                     <Download className="w-4 h-4 mr-2" /> Fazer Download do Arquivo
                   </a>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmação Deleção Mantido */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b bg-red-50 flex items-center text-red-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <h3 className="font-bold">Remover Arquivo?</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-600 mb-6">Tem certeza que deseja remover o arquivo <strong>{fileToDelete.name}</strong> deste chamado?</p>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setFileToDelete(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded font-medium">Cancelar</button>
                <button type="button" onClick={() => confirmDeleteFile(fileToDelete.id)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium">Excluir</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}