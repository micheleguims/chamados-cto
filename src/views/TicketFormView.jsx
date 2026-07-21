// ==========================================
// 4. FORMULÁRIO DE NOVO CHAMADO
// Arquivo Futuro Sugerido: src/views/TicketFormView.jsx
// ==========================================

import React, { useState, useRef } from 'react';
import { SECTORS, CATEGORIES, PROCESS_TREE } from '../config/constants';
import { 
  Plus,
  PlusCircle, 
  Paperclip, 
  X, 
  CheckCircle,
  ImageIcon,
  FileIcon,
  AlertTriangle,
  Trash2 
} from 'lucide-react';


export default function TicketForm ({ currentUser, onSubmit, onCancel }) {
  const [level1, setLevel1] = useState('');
  const [level2, setLevel2] = useState('');
  const [level3, setLevel3] = useState('');
  
  const [emails, setEmails] = useState([currentUser.email || '']);
  const [notifyUser, setNotifyUser] = useState(true);
  
  const [attachments, setAttachments] = useState([]);
  const [fileToDelete, setFileToDelete] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    sector: currentUser.sector,
    category: '',
    description: ''
  });

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => setEmails([...emails, '']);
  const removeEmailField = (index) => setEmails(emails.filter((_, i) => i !== index));

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newAttachment = { id: Date.now(), name: file.name, type: file.type, url: URL.createObjectURL(file) };
    setAttachments([...attachments, newAttachment]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmDeleteFile = (id) => {
    setAttachments(attachments.filter(a => a.id !== id));
    setFileToDelete(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const classificationPath = [level1, level2, level3].filter(Boolean).join(' > ');

    const newTicket = {
      ...formData,
      id: `CHM-${Math.floor(Math.random() * 10000)}`,
      classification: classificationPath,
      status: 'Aguardando fila',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      assignedTo: [],
      requesterEmails: emails.filter(e => e.trim() !== ''),
      notifyUser,
      priorityIndex: 999,
      attachments
    };
    onSubmit(newTicket);
  };

  const selectedL1 = PROCESS_TREE[level1];
  const isL1Obj = selectedL1 && typeof selectedL1 === 'object' && !Array.isArray(selectedL1);
  const isL1Arr = selectedL1 && Array.isArray(selectedL1);
  
  const showLevel2 = isL1Obj || (isL1Arr && selectedL1.length > 0);
  let level2Options = [];
  if (isL1Obj) level2Options = Object.keys(selectedL1);
  else if (isL1Arr) level2Options = selectedL1;

  const showLevel3 = isL1Obj && level2 && selectedL1[level2] && selectedL1[level2].length > 0;
  const level3Options = showLevel3 ? selectedL1[level2] : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-3xl mx-auto relative">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center">
        <PlusCircle className="mr-2 text-[#13335a]" /> Abrir Novo Chamado
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Classificação do Problema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Sistema/Processo</label>
              <select required className="w-full p-2 pr-8 truncate border rounded bg-white" value={level1} onChange={(e) => { setLevel1(e.target.value); setLevel2(''); setLevel3(''); }}>
                <option value="">Selecione...</option>
                {Object.keys(PROCESS_TREE).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            {showLevel2 && (
              <div>
                <label className="block text-sm text-slate-600 mb-1">Subárea</label>
                <select required className="w-full p-2 pr-8 truncate border rounded bg-white" value={level2} onChange={(e) => { setLevel2(e.target.value); setLevel3(''); }}>
                  <option value="">Selecione...</option>
                  {level2Options.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            )}
            {showLevel3 && (
              <div>
                <label className="block text-sm text-slate-600 mb-1">Detalhe</label>
                <select required className="w-full p-2 pr-8 truncate border rounded bg-white" value={level3} onChange={(e) => setLevel3(e.target.value)}>
                  <option value="">Selecione...</option>
                  {level3Options.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Setor Solicitante</label>
            <select required className="w-full p-2 pr-8 truncate border rounded bg-white" value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})}>
              <option value="">Selecione o setor...</option>
              {SECTORS.map(s => <option key={s.id} value={s.sigla}>{s.sigla} - {s.name}</option>)}
            </select>
            <span className="text-[10px] text-slate-400">Permitido alterar temporariamente.</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
            <select required className="w-full p-2 pr-8 truncate border rounded bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="">Selecione...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Título Resumido</label>
          <input required type="text" className="w-full p-2 border rounded" placeholder="Ex: Erro ao gerar folha" 
                 value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>

        <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-[#13335a]">E-mails para Notificações de Contato</label>
            <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" className="rounded text-[#13335a] focus:ring-[#13335a]" checked={notifyUser} onChange={(e) => setNotifyUser(e.target.checked)} />
              <span>Receber atualizações por e-mail</span>
            </label>
          </div>
          <div className="space-y-2">
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <input required type="email" className="flex-1 p-2 border rounded text-sm" placeholder="Ex: solicitante@rio.rj.gov.br" 
                       value={email} onChange={e => handleEmailChange(index, e.target.value)} disabled={!notifyUser} />
                {emails.length > 1 && (
                  <button type="button" onClick={() => removeEmailField(index)} className="p-2 text-red-500 hover:bg-red-50 rounded border border-transparent" disabled={!notifyUser}>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {notifyUser && (
            <button type="button" onClick={addEmailField} className="mt-3 text-xs font-semibold text-[#66b6e3] hover:text-[#13335a] flex items-center transition">
              <Plus className="w-3 h-3 mr-1" /> Adicionar outro e-mail para notificação
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição Detalhada</label>
          <textarea required rows={4} className="w-full p-2 border rounded resize-none" placeholder="Descreva o problema ou solicitação com o máximo de detalhes..."
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Arquivos Anexos (Opcional)</label>
          {attachments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {attachments.map(att => (
                <div key={att.id} className="flex items-center justify-between p-2 border rounded border-slate-200 bg-slate-50">
                  <div className="flex items-center overflow-hidden mr-2">
                    {att.type.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" /> : <FileIcon className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />}
                    <span className="text-xs text-slate-700 truncate font-medium" title={att.name}>{att.name}</span>
                  </div>
                  <button type="button" onClick={() => setFileToDelete(att)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border rounded shadow-sm transition" title="Remover Anexo">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition text-center">
            <Paperclip className="mb-2" />
            <span className="text-sm font-medium text-slate-600">Clique para adicionar arquivos</span>
            <span className="text-xs text-amber-600 mt-2 flex items-center bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <AlertTriangle className="w-3 h-3 mr-1" /> 
              Lembre-se: anexe prints de erro sempre que possível
            </span>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={onCancel} className="w-full sm:w-auto px-4 py-2 text-slate-600 hover:bg-slate-100 rounded font-semibold">Cancelar</button>
          <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-[#13335a] text-white rounded hover:opacity-90 flex items-center justify-center font-semibold">
            <CheckCircle className="w-4 h-4 mr-2" /> Salvar Chamado
          </button>
        </div>
      </form>

      {/* Modal Confirmação Deleção */}
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
    </div>
  );
};