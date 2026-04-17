# Architecture — Sinapse

Documento de referência do design do sistema. Mantido junto com o código —
atualize este arquivo sempre que mudar a estrutura de shells, rotas ou contextos.

---

## Visão geral

Sinapse tem **uma entrada de autenticação** e **dois shells de produto** separados
por perfil. Toda a lógica de produto vive em `01-app-core/`. A camada `src/`
conecta o produto ao roteador e ao sistema de sessão.

```
┌─────────────────────────────────────────────────────┐
│                        src/                         │
│  App.jsx (router)  ←  main.jsx (bootstrap)          │
│       │                                             │
│  ┌────┴────┐    ┌─────────────┐   ┌──────────────┐ │
│  │LoginPage│    │StudentShell │   │TeacherShell  │ │
│  │         │    │   Page.jsx  │   │   Page.jsx   │ │
│  └────┬────┘    └──────┬──────┘   └──────┬───────┘ │
└───────┼────────────────┼─────────────────┼─────────┘
        │                │                 │
┌───────┼────────────────┼─────────────────┼─────────┐
│       │         01-app-core/             │         │
│       ▼                ▼                 ▼         │
│  nova-tela-     aluno.jsx          professor.jsx   │
│  login.jsx      (AppProvider       (TeacherProvider│
│                 + Layout)          + TeacherLayout) │
│                      │                  │          │
│              lazy-loaded modules  lazy-loaded      │
│              (calendario, raio-x, (planejador-     │
│               revisoes, etc.)      de-aulas, etc.) │
└─────────────────────────────────────────────────────┘
```

---

## Camada `src/` — Integração

Responsabilidades exclusivas da camada de integração:

| Arquivo | Responsabilidade |
|---------|-----------------|
| `main.jsx` | Bootstrap React DOM + BrowserRouter |
| `App.jsx` | Mapa de rotas + redirects legacy |
| `pages/LoginPage.jsx` | Recebe credenciais, cria sessão, navega para shell |
| `pages/StudentShellPage.jsx` | Lê sessão, lê `?view=`, injeta props no shell do aluno |
| `pages/TeacherShellPage.jsx` | Lê sessão, lê `?view=`, injeta props no shell do professor |
| `lib/demoSession.js` | CRUD de sessão no `localStorage` |
| `lib/launchExperience.js` | Config da tela de boas-vindas por perfil |
| `lib/pageLoaders.js` | Preload dos shells antes da navegação |
| `components/ProfileActionPanels.jsx` | Modais de configurações e ajuda (ambos os perfis) |
| `components/StudentFeatures.jsx` | `RaioXSection` + `MentoriaView` |

**Regra:** `src/` nunca contém lógica de produto (UX de vestibular, dados de estudo,
visualizações específicas de módulo). Isso fica em `01-app-core/`.

---

## Camada `01-app-core/` — Produto

### Shell do aluno (`aluno.jsx`)

Container principal do aluno. Exporta `default function App({ initialView, session, onLogout })`.

**Estrutura interna:**

```
AppProvider (Context)
  └── Layout
        ├── <aside>  Sidebar com Navigation
        ├── <header> Header com notificações, XP, perfil
        └── <main>
              └── <Suspense>
                    └── view ativa baseada em currentView
```

**Views inline** (definidas dentro de `aluno.jsx`):

| View ID | Componente | Descrição |
|---------|-----------|-----------|
| `dashboard` | `DashboardView` | KPIs, progresso, timeline |
| `raio-x` | `RaioXSection` (importado) | Incidência por vestibular |
| `diagnostico` | `DiagnosticoView` | Autopercepção 1–5 por tópico |
| `cronograma` | `CronogramaView` | Grade semanal mockada |
| `leituras` | `LeiturasView` | Obras obrigatórias FUVEST |
| `revisoes` | `RevisoesView` | Lista de revisões espaçadas |
| `simulados` | `SimuladosView` | Performance histórica |

**Views lazy-loaded** (módulos externos):

| View ID | Arquivo | Tipo |
|---------|---------|------|
| `calendario` | `calendario.jsx` | Calendário com date-fns |
| `cronograma` | `cronograma.jsx` | Cronograma editável completo |
| `leituras` | `leituras.jsx` | Hub de leituras completo |
| `revisoes` | `revisoes.jsx` | Revisões espaçadas completo |
| `simulados` | `simulados.jsx` | Tracker de simulados completo |
| `pomodoro` | `pomodoro.jsx` | Timer Pomodoro + XP |
| `aprovacao-fuvest` | `aprovacao-fuvest.jsx` | Estratégia FUVEST |
| `discursiva-ia` | `discursiva-ia.jsx` | Redação discursiva com IA |
| `redacao-ia-fuvest` | `redacao-ia-fuvest.jsx` | Feedback de redação FUVEST |
| `simulador-tri` | `simulador-tri.jsx` | Simulador de nota TRI |
| `tutoria` | `tutoria-ia.jsx` | Chat com IA tutora |
| `mentoria` | `tutoria.jsx` | Mentoria com ex-alunos |
| `humor` | `medidor-de-humor.jsx` | Tracker emocional |
| `rede-de-apoio` | `rede-de-apoio.jsx` | Rede de suporte |

**Views imersivas** (sem padding no container, full-screen):
```
aprovacao-fuvest, discursiva-ia, redacao-ia-fuvest, simulador-tri,
tutoria, mentoria, humor, rede-de-apoio
```

### Shell do professor (`professor.jsx`)

Container principal do professor. Exporta `default function TeacherShell({ initialView, session, onLogout })`.

**Views disponíveis:**

| View ID | Componente | Descrição |
|---------|-----------|-----------|
| `overview` | `OverviewView` | KPIs de turma, saudação, tabela de alunos |
| `students` | `StudentsDetailView` | Análise individual de aluno |
| `simulados-turma` | `SimuladosClassView` | Performance comparada da turma |
| `attendance` | `AttendanceView` | Frequência e risco de evasão |
| `planejador` | Lazy: `prof-planejador-de-aulas.jsx` | Planejador de aulas |

---

## Fluxo de autenticação (demo)

```
1. Usuário seleciona perfil + digita credenciais em nova-tela-login.jsx
2. LoginPage.handleLogin({ profile, formData })
3. buildDemoSession(profile, formData)         → { name, profile, hiddenViews }
4. persistDemoSession(session)                 → localStorage['sinapse.demo-session']
5. preloadShellPage(profile)                   → precarrega o chunk do shell
6. navigate(getLaunchDestination(profile))     → /aluno ou /professor
7. StudentShellPage lê session via getStoredDemoSession('aluno')
8. Passa { initialView, session, onLogout } para aluno.jsx
```

Contas embutidas em `demoSession.js`:

| Usuário | Senha | Perfil | Restrições |
|---------|-------|--------|-----------|
| valentina | valentina | aluno | `discursiva-ia` oculta |
| pedro | pedro | aluno | sem restrições |
| qualquer | qualquer | professor | sem restrições |

---

## Sistema de navegação interna

A navegação dentro dos shells **não usa React Router**. Usa `AppContext`:

```
currentView ──────────► condicional no <Suspense>
     ▲                         ▼
navigate(id) ◄── SidebarItem, BottomNav, botões de módulo
     │
     └── setSidebarOpen(false)  // fecha sidebar em mobile
```

O wrapper `StudentShellPage` sincroniza `currentView` com `?view=` na URL via
`useSearchParams`, permitindo bookmarking e navegação pelo histórico do browser.

---

## Contextos React

### `AppContext` (aluno.jsx)

```ts
interface AppContextValue {
  currentView: string;       // view ativa
  navigate: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: { name: string; turma: string; xp: number; level: number };
  addXp: (amount: number) => void;
  hiddenViews: string[];     // views desabilitadas para a conta
}
```

### `TeacherContext` (professor.jsx)

```ts
interface TeacherContextValue {
  currentView: string;
  navigate: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  teacher: { name: string; subject: string; turmas: string[] };
}
```

---

## Componentes compartilhados (`src/components/`)

### `ProfileActionPanels.jsx`

Exports nomeados:
- `AccountSettingsModal` — configurações por perfil, salvas em `localStorage`.
- `AccountHelpModal` — canal de suporte com mailto e clipboard.
- `SUPPORT_EMAIL` — constante: `plfonseca@usp.br`.

Internamente usa `ModalFrame` (não exportado), que gerencia: overlay, Escape key,
body scroll lock, `max-h-[90vh]`, `overflow-y-auto`.

### `StudentFeatures.jsx`

Exports nomeados:
- `RaioXSection` — abas ENEM/FUVEST/UNESP/UNICAMP + bar charts por disciplina.
- `MentoriaView` — banner sticky de ex-alunos + slot `{children}` para o hub.

---

## Estratégia de dados

**Estado atual:** 100% mockado. Constantes definidas no topo do arquivo que as usa.

```
INITIAL_STUDENT_NOTIFICATIONS  →  aluno.jsx
mockDashboard, booksData, etc. →  aluno.jsx
MOCK_MENTORS                   →  tutoria.jsx
MOCK_STUDENTS                  →  professor.jsx
RAIOX_DATA                     →  StudentFeatures.jsx
```

**Próximo passo:** substituir por `src/lib/api.js` com fetches reais (Sprint 3).
O padrão de substituição é: trocar a constante por um `useState` com `useEffect`
de fetch, sem alterar a interface dos componentes visuais.

---

## Regras de integração

1. Todo módulo novo em `01-app-core/` deve ser integrado ao shell relevante antes
   de ser considerado completo.
2. `src/` não contém lógica de produto.
3. `01-app-core/` não importa de `src/pages/` — apenas de `src/components/` e `src/lib/`.
4. Componentes usados por mais de um shell ficam em `src/components/`.
5. Views inline ficam no shell até atingirem > 80 linhas de JSX, momento em que
   devem ser extraídas para arquivo próprio em `01-app-core/`.

---

## O que não fazer

- Não adicione rotas no `App.jsx` para views internas (use o sistema de `currentView`).
- Não passe o `navigate` do React Router para dentro dos shells.
- Não deixe módulo novo acessível apenas por URL direta (integre ao shell).
- Não mova arquivos de `01-app-core/` sem atualizar os lazy imports nos shells.
- Não crie um terceiro shell sem discutir a arquitetura de contextos primeiro.

---

## Próximas mudanças arquiteturais previstas

| Sprint | Mudança | Impacto |
|--------|---------|---------|
| Sprint 3 | `src/lib/api.js` + hook `useFetch` | Baixo — substitui constantes |
| Sprint 4 | `src/lib/auth.js` + hook `useAuth` | Médio — substitui `demoSession.js` |
| Sprint 4 | Rota protegida em `App.jsx` | Baixo — adiciona guard |
| Sprint 5 | `src/lib/claude.js` para chamadas AI | Baixo — novo arquivo |
| Sprint 6 | `manifest.json` + Service Worker | Baixo — arquivos novos |
