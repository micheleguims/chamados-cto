// ==========================================
// 1. DADOS MOCKADOS E CONFIGURAÇÕES INICIAIS
// Arquivo: src/config/constants.js
// ==========================================

export const SECTORS = [
  { id: "1600", name: "Secretaria Municipal de Educação", sigla: "SME" },
  { id: "1602", name: "1a. Coordenadoria Regional de Educação", sigla: "E/1a.CRE" },
  { id: "1603", name: "2a. Coordenadoria Regional de Educação", sigla: "E/2a.CRE" },
  { id: "10708", name: "Gerência de Operações", sigla: "E/10a.CRE/GOP" },
  { id: "53330", name: "Coordenadoria Técnica de Infraestrutura", sigla: "E/CTIN" }
];

export const CATEGORIES = ["Erro / Bug", "Melhoria", "Manutenção", "Solicitação de Dados", "Permissão"];

export const TEAM_MEMBERS = ["Michele", "Gabi", "Jorge", "Raphael"];
export const STATUS = ["Aguardando fila", "Em andamento", "Resolvido", "Encerrado"];
export const OPEN_STATUSES = ["Aguardando fila", "Em andamento"];

const getRetroDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

export const PROCESS_TREE = {
  "Sistemas Internos": {
    "NetCenter (Chamados)": ["Automação de Captura", "Interface Sici", "Relatórios"],
    "Escola Segura": ["Permissões", "Cadastro de Ocorrências", "Painel Diretor"]
  },
  "Dashboards & BI": {
    "Frequência Escolar": ["Filtro por CRE", "Exportação Excel"],
    "Alocação de Professores": ["Visão Consolidada", "Divergências"]
  },
  "Bases de Dados": {
    "Estrutura Sici": ["Sincronização Ativa", "Mapeamento Ids"],
    "Censo Escolar": ["Carga de Dados", "Limpeza de Duplicados"]
  }
};

export const INITIAL_TICKETS = [
  {
    id: 'CHM-1042',
    title: 'Erro ao abrir relatório no Censo Escolar',
    sector: 'E/10a.CRE/GRH',
    category: 'Erro',
    classification: 'App (PowerApps) > Correções > Censo Escolar',
    description: 'A tela de fechamento apresenta uma mensagem de estouro de memória ao carregar os dados.',
    status: 'Em andamento',
    createdAt: getRetroDate(2),
    updatedAt: getRetroDate(1),
    comments: [{ id: 1, author: 'Administrador (CIT)', text: 'Analisando consulta.', date: getRetroDate(1) }, { id: 2, author: 'CRE10', text: 'Ok, no aguardo.', date: getRetroDate(1) }, { id: 3, author: 'Administrador (CIT)', text: 'Poderia adicionar um print de tela, por favor?', date: getRetroDate(1) }],
    requesterEmails: ['servidor.cre10@rio.rj.gov.br'],
    notifyUser: true,
    assignedTo: ['Michele', 'Jorge'],
    priorityIndex: 1,
    attachments: []
  },
  {
    id: 'CHM-5012',
    title: 'Erro na sincronização de dados institucionais SICI',
    sector: 'E/CTIN',
    category: 'Erro / Bug',
    classification: 'Bases de Dados > Estrutura Sici > Sincronização Ativa',
    description: 'Mudanças estruturais recentes no Sici da prefeitura causaram quebra na rotina noturna de coleta automatizada.',
    status: 'Em andamento',
    createdAt: getRetroDate(8), // 8 dias atrás (Dispara Alerta Vermelho de SLA)
    updatedAt: getRetroDate(2),
    comments: [],
    requesterEmails: ['suporte.ctin@rio.rj.gov.br'],
    notifyUser: true,
    assignedTo: ['Jorge'],
    priorityIndex: 1,
    attachments: [],
    history: [
      { id: 1, type: 'create', message: 'Chamado aberto pelo solicitante corporativo.', date: getRetroDate(8) },
      { id: 2, type: 'status', message: 'Status alterado de [Aguardando fila] para [Em andamento].', date: getRetroDate(7) },
      { id: 3, type: 'assign', message: 'Chamado atribuído para Jorge.', date: getRetroDate(7) },
      { id: 4, type: 'assign', message: 'Raphael adicionado como responsável compartilhado.', date: getRetroDate(2) }
    ]
  },
  {
    id: 'CHM-5013',
    title: 'Acesso negado no painel Escola Segura',
    sector: 'SME',
    category: 'Permissão',
    classification: 'Sistemas Internos > Escola Segura > Permissões',
    description: 'Novos servidores da Gerência de Educação não conseguem carregar o formulário.',
    status: 'Aguardando fila',
    createdAt: getRetroDate(4), // 4 dias atrás (Dispara Alerta Amarelo de SLA)
    updatedAt: getRetroDate(4),
    comments: [],
    requesterEmails: ['smegse@rio.rj.gov.br'],
    notifyUser: false,
    assignedTo: [],
    priorityIndex: 1,
    attachments: [],
    history: [
      { id: 1, type: 'create', message: 'Chamado aberto e inserido na Piscina de Entrada.', date: getRetroDate(4) }
    ]
  },
  {
    id: 'CHM-4014',
    title: 'Atualização da base de alunos para o BI',
    sector: 'E/1a.CRE',
    category: 'Solicitação de Dados',
    classification: 'Dashboards & BI > Frequência Escolar > Filtro por CRE',
    description: 'Necessário extrair dump consolidado para validação da equipe de monitoramento.',
    status: 'Resolvido',
    createdAt: getRetroDate(1), // Recente
    updatedAt: getRetroDate(0),
    comments: [],
    requesterEmails: ['cre1.educacao@rio.rj.gov.br'],
    notifyUser: false,
    assignedTo: ['Gabi'],
    priorityIndex: 2,
    attachments: [],
    history: [
      { id: 1, type: 'create', message: 'Chamado criado.', date: getRetroDate(1) },
      { id: 2, type: 'assign', message: 'Atribuído para Gabi.', date: getRetroDate(1) },
      { id: 3, type: 'status', message: 'Status modificado para [Resolvido].', date: getRetroDate(0) }
    ]
  },
  {
    id: 'CHM-2055',
    title: 'Acesso às Trilhas no Power BI',
    sector: 'E/1a.CRE',
    category: 'Dúvida',
    classification: 'Dashboard (BI) > Permissões > Trilhas',
    description: 'Solicito a liberação de acesso ao painel.',
    status: 'Aguardando fila',
    createdAt: getRetroDate(5),
    updatedAt: getRetroDate(5),
    comments: [],
    requesterEmails: ['coordenacao.cre1@rio.rj.gov.br'],
    notifyUser: true,
    assignedTo: [],
    priorityIndex: 2,
    attachments: []
  },
  {
    id: 'CHM-3081',
    title: 'Base de Alunos da Zona Oeste',
    sector: 'SME',
    category: 'Manutenção',
    classification: 'Solicitação de Dados > Dados de Alunos',
    description: 'Extração pontual para a assessoria.',
    status: 'Resolvido',
    createdAt: getRetroDate(45),
    updatedAt: getRetroDate(40),
    comments: [],
    requesterEmails: ['dados.sme@rio.rj.gov.br'],
    notifyUser: true,
    assignedTo: ['Jorge'],
    priorityIndex: 1,
    attachments: []
  },
  {
    id: 'CHM-4012',
    title: 'Erro de Permissão no NIAP',
    sector: 'E/2a.CRE',
    category: 'Erro',
    classification: 'App (PowerApps) > Permissões > NIAP',
    description: 'Servidor novo não consegue acessar.',
    status: 'Resolvido',
    createdAt: getRetroDate(75),
    updatedAt: getRetroDate(70),
    comments: [],
    requesterEmails: ['rh.cre2@rio.rj.gov.br'],
    notifyUser: false,
    assignedTo: ['Gabi'],
    priorityIndex: 1,
    attachments: []
  },
  {
    id: 'CHM-4013',
    title: 'Solicitação de Permissão no Escola Segura',
    sector: 'GSE',
    category: 'Permissão',
    classification: 'App (PowerApps) > Permissões > Escola Segura',
    description: 'Servidor novo não consegue acessar.',
    status: 'Aguardando fila',
    createdAt: getRetroDate(5),
    updatedAt: getRetroDate(5),
    comments: [],
    requesterEmails: ['smegse@rio.rj.gov.br'],
    notifyUser: false,
    assignedTo: [],
    priorityIndex: 1,
    attachments: []
  },
  {
    id: 'CHM-4014',
    title: 'Base de Alunos Alura',
    sector: 'E/2a.CRE',
    category: 'Solicitação',
    classification: 'Solicitação de Dados > Dados de Alunos',
    description: 'Atualização mensal para controle de acesso.',
    status: 'Em andamento',
    createdAt: getRetroDate(75),
    updatedAt: getRetroDate(70),
    comments: [],
    requesterEmails: ['rh.cre2@rio.rj.gov.br'],
    notifyUser: false,
    assignedTo: ['Gabi'],
    priorityIndex: 1,
    attachments: []
  },
  {
    id: 'CHM-4015',
    title: 'Ajuste no App Comlurb',
    sector: 'E/CTIN',
    category: 'Melhoria',
    classification: 'App (PowerApps) > Melhorias > Comlurb - Registro de Ocorrências',
    description: 'Ajuste na tela de registro para incluir campo de localização.',
    status: 'Em andamento',
    createdAt: getRetroDate(5),
    updatedAt: getRetroDate(5),
    comments: [],
    requesterEmails: ['smectin@rio.rj.gov.br'],
    notifyUser: false,
    assignedTo: ['Jorge'],
    priorityIndex: 1,
    attachments: []
  },
];