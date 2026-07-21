// ==========================================
// 9. DOCUMENTAÇÃO
// Arquivo Futuro Sugerido: src/views/DocumentationView.jsx
// ==========================================

import React from 'react';
import { FileCode, User, FileText, ShieldAlert } from 'lucide-react';

export default function DocumentationView ({ currentUser }) {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center mb-8 border-b pb-4">
            <FileCode className="w-8 h-8 text-[#13335a] mr-3" />
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Documentação e Checkpoints</h1>
                <p className="text-slate-500">Registro de decisões arquiteturais para IA e Desenvolvedores.</p>
            </div>
            </div>

            <div className="space-y-8">
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center"><User className="mr-2"/> Para Humanos (Usuários e Devs)</h2>
                <div className="prose text-slate-700 text-sm space-y-4">
                <p><strong>Objetivo:</strong> MVP do Portal Interno de Chamados.</p>
                <p><strong>Funcionalidades Atuais:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Abertura de chamados com classificação em árvore (Processo {'>'} Subárea {'>'} Detalhe).</li>
                    <li>Sistema de visualização com limite inteligente de 5 chamados abertos e botão de histórico estendido.</li>
                    <li>Visualização de métricas de atendimento nativa por gráficos de barra responsivos.</li>
                    <li>Alocação dinâmica de chamados em Kanban vertical (Raias da Equipe vs Piscina de Chamados). Suporta drag-and-drop de prioridades com marcadores visuais.</li>
                    <li>Anexação visual de imagens e arquivos (Simulação) tanto na tela de detalhesamp; quanto na abertura do chamado com alertas e dupla-confirmação para exclusão.</li>
                    <li>Preenchimento de e-mail de contato do solicitante para envio de automações.</li>
                    <li>Refatoração de Clean Code isolando subcomponentes modulares e tipagem dinâmica de cores de status.</li>
                </ul>
                <p><strong>Pilha Tecnológica Recomendada para Produção:</strong></p>
                <p>Para automatizar o envio de e-mails em cada movimentação, recomendamos a utilização do <strong>Power Automate</strong> integrado a uma conta de Outlook institucional ou o uso de <strong>Firebase Cloud Functions</strong> com gatilhos de criação no Firestore integrados a serviços de disparo como o SendGrid.</p>
                </div>
            </section>

            {currentUser.role === 'admin' && (
                <>
                <section className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center"><FileText className="mr-2 text-slate-500"/> Checkpoints & Memory (Para IA)</h2>
                    <div className="space-y-3 font-mono text-xs text-slate-600">
                    <div className="p-3 bg-white border border-slate-200 rounded">
                        <span className="font-bold text-[#13335a]">[CHECKPOINT 01] - Arquitetura Inicial (MVP V1)</span>
                        <p className="mt-1">Decisão: Uso de React em arquivo único com estado em memória (`useState` global no componente App) para validação rápida de UI/UX. Banco de dados real (Firebase/SQL) postergado para V2.</p>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded">
                        <span className="font-bold text-green-600">[CHECKPOINT 02] - Estrutura de Classificação</span>
                        <p className="mt-1">Decisão: Implementação da regra de "Árvore de Sistemas" (Sistemas {'>'} Áreas {'>'} Detalhes). Evitou-se input livre para garantir relatórios estruturados futuros. Ligado ao requisito: "manter a minúcia sem dificuldade".</p>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded">
                        <span className="font-bold text-[#66b6e3]">[CHECKPOINT 03] - Adaptação Mobile e Identidade Visual</span>
                        <p className="mt-1">Decisão: UI refatorada para responsividade (escondendo colunas menos vitais em mobile) e chat reestilizado no formato clássico de balões. Atualização da Árvore de Processos (PowerApps, Dashboards, Dados) e integração de amostra de dados reais do Sici para os Setores Solicitantes.</p>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded">
                        <span className="font-bold text-indigo-600">[CHECKPOINT 04] - Login, Distribuição e Metas (Admin)</span>
                        <p className="mt-1">Decisão: Implementada barreira de login fake. Administradores podem visualizar todos os chamados e alocar tarefas via Kanban interativo na tela. Usuários comuns são restritos às próprias visões de setor para segurança.</p>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded">
                        <span className="font-bold text-teal-600">[CHECKPOINT 05] - Priorização Avançada e Upload</span>
                        <p className="mt-1">Decisão: Atualização profunda da View Kanban suportando ordenação manual por index numérico via Drag-and-Drop + ordenação por Data. Implementado visualizador de ObjectURLs no Frontend para simular a abertura de Imagens, PDFs e Planilhas no navegador.</p>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded">
                        <span className="font-bold text-teal-600">[CHECKPOINT 06] - Refatoração do Objeto de Categorias e UI</span>
                        <p className="mt-1">Decisão: O objeto `PROCESS_TREE` agora lida dinamicamente com profundidades variáveis (1 a 3 níveis). Implementado modal customizado de dupla confirmação de exclusão de anexos sem usar chamadas nativas bloqueantes.</p>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded border-l-4 border-l-amber-500">
                        <span className="font-bold text-amber-600">[CHECKPOINT 07] - Refatoração de Clean Code e Componentização (SRP)</span>
                        <p className="mt-1">Decisão: Extração do subcomponente modular `TicketCard` de dentro da `AllocationView`. Uniformização dos status via componente `Badge` global e tratamento unificado de layouts sem dados via `EmptyState`. Adicionado helper para tratamento de iniciais de usuários.</p>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded border-l-4 border-l-[#13335a]">
                        <span className="font-bold text-[#13335a]">[CHECKPOINT 08] - Linha do Tempo Estendida, Kanban Alternativo e Controle de SLA</span>
                        <p className="mt-1">Decisão: Criação do nó de dados `history` no objeto do chamado para tracking indestrutível de eventos operacionais. Desenvolvido o alternador de layout (`viewLayout`) na tela de distribuição para suportar visualização matricial por Status ou por Colaborador. Inserida lógica de envelhecimento (Aging de chamados) por contadores de tempo calculados em helpers, gerando indicadores discretos que protegem a experiência de uso contra poluição visual.</p>
                    </div>
                    </div>
                </section>

                <section className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                    <h2 className="text-xl font-bold text-amber-800 mb-4 flex items-center"><ShieldAlert className="mr-2"/> Issues e Planejamentos Futuros</h2>
                    <div className="prose text-amber-900 text-sm space-y-4">
                    <ul className="list-disc pl-5 space-y-3">
                        <li>
                        <strong>Como filtrar se a pessoa pode abrir aquela solicitação? Como validar se ela tem permissão?</strong>
                        <p className="text-xs text-slate-600 mt-1">Solução futura: Integração com o Active Directory institucional (AD/LDAP) mapeando os cargos ou com as tabelas de autorizações do Sici para verificar as atribuições do usuário.</p>
                        </li>
                        <li>
                        <strong>Adicionar IA para categorizar as prioridades:</strong>
                        <p className="text-xs text-slate-600 mt-1">Solução futura: Utilizar a API do Gemini 2.5 Flash analisando o texto do campo de descrição do chamado para atribuir as prioridades (Baixa, Média, Alta ou Crítica) de forma automatizada no momento de salvar.</p>
                        </li>
                        <li>
                        <strong>Sensibilização do Usuário Final:</strong>
                        <p className="text-xs text-slate-600 mt-1">Garantir nas futuras versões alertas claros em vermelho sobre a importância de documentar o passo a passo que levou ao erro e de incluir prints.</p>
                        </li>
                        <li>
                        <strong>Envio de Movimentações por E-mail:</strong>
                        <p className="text-xs text-slate-600 mt-1">Integração backend com serviços SMTP para notificar o email inserido pelo solicitante sobre novas interações no chat ou alteração de status.</p>
                        </li>
                    </ul>
                    </div>
                </section>
                </>
            )}
            </div>
        </div>
    );
}