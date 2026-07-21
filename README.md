# 🎫 Portal Interno de Chamados - CIT (MVP V1)

Um sistema completo de gerenciamento e abertura de chamados internos focado em usabilidade (UX) e padronização de dados arquiteturais, desenvolvido como um MVP (Minimum Viable Product) de alta fidelidade.

---

## 🚀 Funcionalidades Atuais

- **Abertura de Chamados Estruturada:** Classificação dinâmica em árvore de até 3 níveis (`Processo > Subárea > Detalhe`), evitando inputs livres e garantindo relatórios gerenciais padronizados.
- **Limite Inteligente de Visualização:** A listagem inicial exibe um limite otimizado de 5 chamados abertos com botão de expansão para histórico estendido, melhorando a performance e o foco do usuário.
- **Painel Kanban Interativo:** Alocação dinâmica de chamados verticalizada dividida entre *Piscina de Chamados* e *Raias da Equipe*. Suporta ordenação manual/priorização por index numérico e ordenação por data.
- **Simulação de Upload Avançada:** Visualizador baseado em `ObjectURLs` no Frontend que permite simular a anexação e abertura de Imagens, PDFs e Planilhas diretamente no navegador, contando com modal customizado de dupla-confirmação para exclusões.
- **Métricas Nativas:** Dashboard integrado com gráficos de barras responsivos para visualização em tempo real do status dos atendimentos.
- **Restrição de Acesso (Fake Auth):** Visões separadas por papéis (`admin` visualiza e distribui tarefas no Kanban; `user` possui restrição de segurança visualizando apenas os chamados de seu próprio setor).

---

## 🛠️ Pilha Tecnológica Recomendada

- **Frontend:** React.js (Componentização funcional e Hooks)
- **Estilização:** Tailwind CSS (Layouts responsivos e utilitários)
- **Ícones:** Lucide React
- **Compilador/Bundler:** Vite (Altamente performático)

---

## 📁 Estrutura de Pastas e Arquitetura

O projeto foi refatorado seguindo as melhores práticas de separação de responsabilidades (Clean Code), isolando lógica, componentes reutilizáveis, constantes estáticas e visões globais:

```text
src/
├── components/          # Componentes visuais atômicos reutilizáveis
│   └── Badge.jsx        # Etiqueta de status com estilização centralizada
├── config/              # Configurações globais estáveis
│   └── constants.js     # Dados brutos fixos (SECTORS, STATUS, PROCESS_TREE)
├── utils/               # Funções de utilidade e lógica pura
│   └── helpers.js       # Formatação de datas e processamento dinâmico de cores
├── views/               # Telas completas da aplicação (Views)
│   ├── LoginView.jsx
│   ├── TicketListView.jsx
│   ├── TicketFormView.jsx
│   ├── AllocationView.jsx
│   ├── MetricsView.jsx
│   └── DocumentationView.jsx
├── App.jsx              # Gerenciador de Estado Global e Roteamento
└── main.jsx             # Ponto de entrada do React
```

---

## 🧠 Registro de Decisões Arquiteturais (Checkpoints)

O desenvolvimento seguiu uma esteira incremental registrada através de checkpoints rígidos de memória de projeto:

- **[CHECKPOINT 01]** Uso inicial de estado em memória centralizado (`useState` global no `App.jsx`) para validação ultra-rápida de interface (UI/UX), postergando infraestrutura de banco de dados real para a V2.
- **[CHECKPOINT 02]** Implementation da "Árvore de Processos" para mitigar a inconsistência de dados comuns em inputs de texto livre.
- **[CHECKPOINT 03]** Refatoração focada em responsividade mobile, ocultando colunas secundárias em telas menores e convertendo o chat para o formato clássico de balões.
- **[CHECKPOINT 04]** Implementação de barreira de login simulação para segregação de regras de negócio entre Administradores e Usuários comuns.
- **[CHECKPOINT 05]** Upgrade da View Kanban para suportar ordenação por índice numérico via Drag-and-Drop em conjunto com ordenação cronológica.
- **[CHECKPOINT 06]** Adaptação do objeto `PROCESS_TREE` para aceitar profundidades de árvore flexíveis (1 a 3 níveis) e substituição de alertas nativos do navegador (`window.confirm`) por modais customizados não bloqueantes.

---

## 🔮 Roadmap & Planejamento Futuro

1. **Integração Corporativa de Acesso:** Substituir o Fake Auth pela integração nativa com o **Active Directory (AD/LDAP)** institucional ou tabelas de autorização do Sici para controle fino de permissões de abertura.
2. **Priorização por Inteligência Artificial:** Integração com a API do **Gemini 2.5 Flash** para analisar a descrição textual do chamado e categorizar a prioridade de forma automatizada (Baixa, Média, Alta, Crítica) no momento da criação.
3. **Automação de Notificações:** Acoplamento de serviços SMTP no Backend ou uso do **Power Automate / Firebase Cloud Functions** para disparar e-mails automáticos ao solicitante em cada movimentação de status ou nova mensagem no chat.
4. **Sensibilização de UX:** Adicionar alertas visuais imperativos sobre a importância de anexar prints e descrever o passo a passo que gerou a inconsistência reclamada.

---

## 💻 Como Rodar o Projeto Localmente

1. Clone o repositório:
   ```bash
   git clone [https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git)
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento local (Vite):
   ```bash
   npm run dev
   ```
4. Abra o navegador no endereço indicado (Geralmente `http://localhost:5173`).

---
Desenvolvido para otimização de processos de suporte interno.
```