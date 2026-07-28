// ==========================================
// SISTEMA DE INFRAESTRUTURA ESCOLAR
// src/config/constants.js
// ==========================================

export const CRES = [
  "1ª CRE",
  "2ª CRE",
  "3ª CRE",
  "4ª CRE",
  "5ª CRE",
  "6ª CRE",
  "7ª CRE",
  "8ª CRE",
  "9ª CRE",
  "10ª CRE",
  "11ª CRE"
];

export const USER_ROLES = [
  "Escola",
  "CRE",
  "COR",
  "CTO",
  "Admin"
];

export const STATUS = [
  "Aberto",
  "Em análise",
  "Encaminhado",
  "Em atendimento",
  "Reiterado",
  "Aguardando retorno",
  "Resolvido",
  "Encerrado",
  "Cancelado"
];

export const OPEN_STATUSES = [
  "Aberto",
  "Em análise",
  "Encaminhado",
  "Em atendimento",
  "Reiterado",
  "Aguardando retorno"
];

export const PRIORITIES = [
  {
    name: "Crítica",
    slaHours: 4,
    color: "bg-red-100 text-red-800 border-red-200"
  },
  {
    name: "Alta",
    slaHours: 24,
    color: "bg-orange-100 text-orange-800 border-orange-200"
  },
  {
    name: "Média",
    slaHours: 72,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200"
  },
  {
    name: "Baixa",
    slaHours: 168,
    color: "bg-green-100 text-green-800 border-green-200"
  }
];

export const IMPACTS = [
  "Unidade interditada",
  "Atendimento suspenso",
  "Atendimento parcial",
  "Impacto localizado",
  "Sem impacto operacional imediato"
];

export const AGENCIES = [
  "Águas do Rio",
  "CEDAE",
  "Light",
  "Comlurb",
  "Fundação Parques e Jardins",
  "Conservação",
  "Defesa Civil",
  "Outro"
];

export const INFRASTRUCTURE_TREE = {
  Água: [
    "Falta d’água",
    "Baixa pressão",
    "Cisterna sem abastecimento",
    "Carro-pipa",
    "Bomba sem funcionamento",
    "Vazamento de água limpa"
  ],

  Saneamento: [
    "Vazamento de esgoto",
    "Entupimento",
    "Extravasamento",
    "Esgoto entrando na unidade",
    "Mau cheiro recorrente"
  ],

  "Luz / Energia": [
    "Falta de energia",
    "Queda de fase",
    "Oscilação elétrica",
    "Unidade e entorno sem luz",
    "Impacto em equipamentos"
  ],

  Poda: [
    "Árvore com risco",
    "Galhos sobre rede elétrica",
    "Queda de galhos",
    "Poda preventiva",
    "Obstrução de acesso"
  ],

  "Conservação Predial": [
    "Problema estrutural",
    "Infiltração",
    "Portão",
    "Telhado",
    "Piso",
    "Instalações internas"
  ],

  Outros: [
    "Outros problemas",
    "Necessita análise"
  ]
};

export const CATEGORIES = Object.keys(INFRASTRUCTURE_TREE);

const getRetroDate = (daysAgo, hour = 8) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}