# 🏫 Sistema de Gestão de Ocorrências de Infraestrutura Escolar (MVP V1)

Sistema web para registro, acompanhamento, monitoramento e encerramento de ocorrências de infraestrutura em unidades escolares, desenvolvido para substituir fluxos informais (WhatsApp, telefone e e-mail) por um processo estruturado, rastreável e auditável.

O sistema atende o fluxo operacional entre Escola, CRE, COR, CTO e Gestão, permitindo acompanhamento completo do ciclo de vida das ocorrências com histórico, SLA, priorização, acionamento de órgãos externos e indicadores gerenciais.

---

# 🎯 Objetivo

Centralizar e padronizar o tratamento de ocorrências de infraestrutura escolar através de um sistema único de chamados.

O principal objetivo é fornecer:

- Rastreabilidade completa de cada ocorrência;
- Padronização dos registros;
- Classificação adequada das demandas;
- Controle de SLA;
- Histórico de auditoria;
- Monitoramento operacional;
- Indicadores executivos;
- Gestão de recorrências.

---

# 🚀 Funcionalidades Implementadas

## ✅ Autenticação e Perfis

Sistema de login com perfis distintos:

- Escola
- CRE
- COR
- CTO
- Gestão Executiva

Cada perfil possui visões e permissões específicas dentro do sistema.

---

## ✅ Abertura de Chamados

Registro estruturado contendo:

### Identificação da Unidade

- CRE
- Código da Unidade
- Nome da Escola
- Endereço
- Bairro
- Telefone da Direção

### Classificação

- Categoria
- Subcategoria
- Prioridade
- Impacto operacional

### Ocorrência

- Título
- Local afetado
- Abrangência
- Descrição da ocorrência

### Evidências

- Imagens
- PDFs
- Documentos
- Arquivos diversos

---

## ✅ Categorias de Infraestrutura

### Água

- Falta d'água
- Baixa pressão
- Cisterna
- Carro pipa
- Bomba
- Vazamentos

### Saneamento

- Esgoto
- Entupimento
- Extravasamento
- Mau cheiro

### Luz e Energia

- Falta de energia
- Oscilação
- Queda de fase
- Equipamentos afetados

### Poda

- Árvores
- Galhos
- Rede elétrica
- Obstruções

### Conservação Predial

- Estrutura
- Infiltração
- Telhado
- Piso
- Instalações

### Outros

- Demandas não categorizadas

---

## ✅ Priorização e SLA

### Crítica

- SLA: 4 horas

### Alta

- SLA: 24 horas

### Média

- SLA: 72 horas

### Baixa

- SLA: 7 dias

O sistema calcula automaticamente:

- Tempo aberto
- Prazo restante
- SLA próximo do vencimento
- SLA vencido

---

## ✅ Fluxo Operacional

Status suportados:

- Aberto
- Em análise
- Encaminhado
- Em atendimento
- Reiterado
- Aguardando retorno
- Resolvido
- Encerrado
- Cancelado

---

## ✅ Acionamento Externo

Controle de atendimento por órgãos e concessionárias:

- Águas do Rio
- CEDAE
- Light
- Comlurb
- Fundação Parques e Jardins
- Conservação
- Defesa Civil
- Outros

Controle dos campos:

- Órgão responsável
- Protocolo
- Data/Hora de acionamento
- Responsável pelo acionamento

---

## ✅ Histórico de Auditoria

Toda movimentação gera registro permanente:

- Abertura
- Alteração de status
- Alteração de prioridade
- Reiteração
- Uploads
- Comentários
- Acionamentos externos
- Encerramentos

O histórico é imutável.

---

## ✅ Chat Operacional

Permite comunicação e acompanhamento entre os responsáveis pela ocorrência através de comentários registrados dentro do chamado.

---

## ✅ Gestão de Recorrências

Permite:

- Marcar ocorrências recorrentes
- Vincular chamados relacionados
- Identificar padrões de repetição

---

## ✅ Dashboard Executivo

Indicadores em tempo real:

- Total de chamados
- Pendentes
- Resolvidos
- SLA vencido
- Recorrências

Agrupamentos:

- Por CRE
- Por Categoria
- Por Prioridade
- Por Status
- Por Órgão
- Por Escola

---

## ✅ Painel Operacional (Kanban)

Visualizações por:

- Status
- CRE
- Prioridade
- Órgão/Concessionária

Suporta movimentação operacional via Drag-and-Drop.

---

## ✅ Documentação Integrada

O sistema possui documentação interna contendo:

- Objetivo
- Fluxo operacional
- Perfis
- Governança
- SLA
- Roadmap

---

# 🛠️ Stack Tecnológica

## Frontend

- React
- Vite
- Tailwind CSS
- Lucide React

## Estado

- React Hooks
- useState

## Persistência Atual

- Memória local (MVP)

---

# 🏗️ Arquitetura Atual

```text
src/

├── components/
│   ├── common/
│   │   ├── Badge.jsx
│   │   ├── EmptyState.jsx
│   │   └── TicketCard.jsx
│   │
│   └── ticket/
│       ├── TicketHeader.jsx
│       ├── SchoolInfoCard.jsx
│       ├── ClassificationCard.jsx
│       ├── OperationalControls.jsx
│       ├── ExternalActionCard.jsx
│       ├── ResolutionCard.jsx
│       ├── RecurrenceCard.jsx
│       ├── AttachmentsCard.jsx
│       ├── HistoryTimeline.jsx
│       ├── ChatPanel.jsx
│       ├── FilePreviewModal.jsx
│       └── DeleteFileModal.jsx
│
├── config/
│   └── constants.js
│
├── hooks/
│   ├── useTicketDetails.js
│   ├── useTicketMetrics.js
│   ├── useTicketFilters.js
│   ├── useKanban.js
│   ├── useAuth.js
│   ├── usePermissions.js
│   ├── useAttachments.js
│   ├── useComments.js
│   └── useHistory.js
│
├── services/
│   ├── ticketService.js
│   ├── authService.js
│   ├── metricsService.js
│   └── storageService.js
│
├── utils/
│   └── helpers.js
│
├── views/
│   ├── LoginView.jsx
│   ├── TicketListView.jsx
│   ├── TicketFormView.jsx
│   ├── TicketDetailsView.jsx
│   ├── AllocationView.jsx
│   ├── MetricsView.jsx
│   └── DocumentationView.jsx
│
├── App.jsx
└── main.jsx
```

---

# 📋 Decisões Arquiteturais

## CHECKPOINT 01

Construção do MVP utilizando estado centralizado em memória com React Hooks para validação rápida do fluxo operacional antes da adoção de infraestrutura persistente.

---

## CHECKPOINT 02

Substituição de classificações livres por categorias estruturadas de infraestrutura para garantir consistência dos dados.

---

## CHECKPOINT 03

Implementação de SLA operacional com níveis de prioridade e monitoramento de vencimento.

---

## CHECKPOINT 04

Implementação de perfis distintos:

- Escola
- CRE
- COR
- CTO
- Gestão

---

## CHECKPOINT 05

Implementação de auditoria completa através de histórico permanente.

---

## CHECKPOINT 06

Criação de Dashboard Executivo com indicadores em tempo real.

---

## CHECKPOINT 07

Implementação de Kanban Operacional estruturado para gestão das ocorrências.

---

## CHECKPOINT 08

Planejamento da modularização completa do sistema através da criação da camada:

- Components
- Hooks
- Services

para futura refatoração do código sem impacto funcional.

---

# 🔮 Roadmap Futuro (V2)

## Persistência Real

Migração para Supabase:

- Banco PostgreSQL
- Autenticação
- Storage de arquivos

---

## Upload Real de Arquivos

Integração com Supabase Storage rotacionando:

- Imagens
- PDFs
- Documentos

---

## Controle de Acesso Corporativo

Integração futura com:

- Azure AD
- Microsoft 365
- LDAP
- Active Directory

---

## Notificações

Automação por:

- E-mail
- Microsoft Teams
- Power Automate

---

## Mapa Operacional

Georreferenciamento das ocorrências.

---

## Business Intelligence

Integração com:

- Power BI
- Dashboards Executivos
- Indicadores históricos

---

## Inteligência Artificial

Possíveis automações futuras:

- Sugestão de prioridade
- Análise de recorrência
- Classificação automática
- Resumos gerenciais

---

# 💻 Como Executar Localmente

Instalar dependências:

```bash
npm install
```

Executar aplicação:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
```

Preview local:

```bash
npm run preview
```

---

# 📌 Status Atual

✅ MVP funcional

✅ Fluxo operacional completo

✅ Dashboard executivo

✅ Kanban operacional

✅ Histórico de auditoria

✅ Gestão de SLA

✅ Controle de prioridades

✅ Gestão de recorrências

✅ Documentação integrada

🔄 Próxima etapa: Supabase + Persistência em banco

---

Desenvolvido para modernização da gestão de infraestrutura escolar e melhoria do acompanhamento operacional da rede.