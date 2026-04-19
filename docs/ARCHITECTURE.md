# Architecture — Sinapse

Documento de referência para a arquitetura do runtime. Atualize este arquivo
sempre que mexer em rotas, shells, camadas de dados, estado compartilhado ou no
mapa de migração de `legacy/` para `src/features/`.

## Migration state

O repositório já concluiu a drenagem de `legacy/` para `src/features/`, mas a
migração arquitetural ainda não terminou. Auth, sessão e estado de UI já vivem
em Zustand e serviços dedicados. A navegação interna dos shells ainda permanece
nos contextos locais.

| Step | Artefact | Status |
|------|----------|--------|
| SA-1.1 | `src/routes/AppRoutes.jsx` | ✅ Done |
| SA-1.2 | `src/main.jsx` com `BrowserRouter` | ✅ Done |
| SA-1.3 | `src/features/auth/Login.jsx` | ✅ Done |
| SA-1.4 | `src/layouts/*ShellLayout.jsx` + `src/pages/*ShellPage.jsx` | ✅ Done |
| SA-2.1 | `src/store/sessionSlice.js` + `uiSlice.js` | ✅ Done |
| SA-2.2 | `src/features/teacher/TeacherShell.jsx` | ✅ Done |
| SA-2.3 | `src/features/ai-tools/` | ✅ Done |
| SA-2.4 | `src/features/assessments/` | ✅ Done |
| SA-2.5 | `src/features/student/` | ✅ Done |
| SA-3.1 | `src/services/` + bridge `/api/*` | ✅ Done |
| SA-3.2 | substituir a navegação interna dos shells por superfície compartilhada | ⬜ |

Entregas estruturais já absorvidas no runtime atual:

- `src/components/AppErrorBoundary.jsx` protege a árvore principal.
- `api/[...path].js` e `src/server/api/*` hospedam o backend Vercel.
- `src/services/api.js` centraliza requests e cache TTL simples.

## Target directory tree

Esta é a árvore de referência para o runtime atual.

```text
api/
  [...path].js                 # Vercel function que atende /api/*

src/
  components/                  # compartilhados (named exports)
  features/
    auth/
    student/
    teacher/
    ai-tools/
    assessments/
  layouts/                     # guards por shell + sync de ?view=
  pages/                       # entry points finos das rotas
  routes/
    AppRoutes.jsx
  server/api/                  # router, handlers, helpers HTTP, Supabase server
  services/                    # clientes do frontend para /api
  store/                       # Zustand: auth/session/ui
  lib/                         # preload, auth bootstrap, clientes Supabase
  App.jsx                      # AppErrorBoundary + AuthBootstrap + AppRoutes
  main.jsx                     # createRoot + BrowserRouter

supabase/
  migrations/                  # schema e políticas do runtime real
```

## Naming conventions

As convenções abaixo continuam valendo para arquivos novos.

| Type | Convention | Example |
|------|------------|---------|
| Feature directory | lowercase English | `auth`, `student`, `ai-tools` |
| React component file | `PascalCase.jsx` | `Login.jsx`, `StudentShell.jsx` |
| Non-component module | `camelCase.js` | `sessionSlice.js` |
| Route config | `PascalCase.jsx` | `AppRoutes.jsx` |
| Shared component | `PascalCase.jsx` + named export | `StudentFeatures.jsx` |
| Hook | `use` + PascalCase | `useAuth.js` |

## Migration naming map

Este mapa existe para preservar o histórico da drenagem de `legacy/`.

| Legacy | Target | Status |
|--------|--------|--------|
| `nova-tela-login.jsx` | `features/auth/Login.jsx` | ✅ Deleted |
| `aluno.jsx` | `features/student/StudentShell.jsx` | ✅ Deleted |
| `teacher-shell.jsx` | `features/teacher/TeacherShell.jsx` | ✅ Deleted |
| `ai-tutoring.jsx` | `features/ai-tools/Tutoria.jsx` | ✅ Deleted |
| `discursive-ai.jsx` | `features/ai-tools/DiscursiveAI.jsx` | ✅ Deleted |
| `essay-review.jsx` | `features/ai-tools/EssayReview.jsx` | ✅ Deleted |
| `mock-exam-tracker.jsx` | `features/assessments/Simulados.jsx` | ✅ Deleted |
| `tri-simulator.jsx` | `features/assessments/TriSimulator.jsx` | ✅ Deleted |
| `fuvest-approval.jsx` | `features/assessments/FuvestApproval.jsx` | ✅ Deleted |
| `calendar legacy module` | `features/student/CalendarView.jsx` | ✅ Deleted |
| `schedule legacy module` | `features/student/ScheduleView.jsx` | ✅ Deleted |
| `revisions.jsx` | `features/student/Revisions.jsx` | ✅ Deleted |
| `reading-hub.jsx` | `features/student/Readings.jsx` | ✅ Deleted |
| `pomodoro-focus.jsx` | `features/student/Pomodoro.jsx` | ✅ Deleted |
| `mood-tracker.jsx` | `features/student/MoodTracker.jsx` | ✅ Deleted |
| `support-network.jsx` | `features/student/SupportNetwork.jsx` | ✅ Deleted |
| `mentorship.jsx` | `features/student/Mentorship.jsx` | ✅ Deleted |
| `lesson-planner.jsx` | `features/teacher/LessonPlanner.jsx` | ✅ Deleted |

## Current runtime flow

O caminho principal de renderização e bootstrap é este:

```text
src/main.jsx
  └── BrowserRouter
      └── src/App.jsx
          ├── AppErrorBoundary
          ├── AuthBootstrap
          └── AppRoutes
              ├── /  /login       → LoginPage → features/auth/Login.jsx
              ├── /aluno          → StudentShellLayout → StudentShellPage
              └── /professor      → TeacherShellLayout → TeacherShellPage
```

`AuthBootstrap` carrega a sessão em Zustand logo no início. Os layouts validam
perfil, saneiam `?view=` e só então entregam contexto ao shell correspondente.

## Client-server data flow

O runtime real de auth e dados do aluno segue este desenho:

```text
frontend component
  └── src/lib/useAuth.js / feature views
      └── src/services/auth.js / src/services/student.js
          └── src/services/api.js
              └── /api/*
                  └── api/[...path].js
                      └── src/server/api/router.js
                          ├── authHandlers.js
                          └── studentHandlers.js
                              └── src/server/api/supabase.js
                                  └── Supabase Auth + Postgres (cookies + RLS)
```

O browser ainda mantém `src/lib/supabase/client.js` para dois casos
específicos: `onAuthStateChange()` e `updateUserPassword()` no fluxo de
recuperação.

## Layer reference

As camadas abaixo são a referência para novas mudanças.

### `src/routes/`

`AppRoutes.jsx` é a única configuração declarativa de rotas. Também concentra os
redirects das URLs legadas `/modulos/*`.

### `src/layouts/`

Os layouts são guards de shell.

| File | Responsibility |
|------|----------------|
| `StudentShellLayout.jsx` | valida sessão do aluno, saneia `?view=`, bloqueia views ocultas e expõe contexto ao outlet |
| `TeacherShellLayout.jsx` | valida sessão do professor, saneia `?view=` e expõe contexto ao outlet |

### `src/pages/`

As pages fazem apenas orquestração de rota.

| File | Responsibility |
|------|----------------|
| `LoginPage.jsx` | usa `useAuth()`, navega por perfil e trata password recovery |
| `StudentShellPage.jsx` | lazy-load das views externas e injeção em `StudentShell.jsx` |
| `TeacherShellPage.jsx` | injeta props de sessão e navegação em `TeacherShell.jsx` |

### `src/features/`

Os slices de domínio seguem separados por responsabilidade.

| Slice | Main files | Notes |
|-------|------------|-------|
| `auth/` | `Login.jsx` | UI de login, cadastro, recuperação e reset |
| `student/` | `StudentShell.jsx`, `CalendarView.jsx`, `Revisions.jsx`, `Readings.jsx`, `Pomodoro.jsx`, `Mentorship.jsx`, `MoodTracker.jsx`, `SupportNetwork.jsx` | shell do aluno + views do domínio |
| `teacher/` | `TeacherShell.jsx`, `LessonPlanner.jsx` | shell do professor |
| `ai-tools/` | `Tutoria.jsx`, `DiscursiveAI.jsx`, `EssayReview.jsx` | módulos imersivos e assistidos |
| `assessments/` | `Simulados.jsx`, `TriSimulator.jsx`, `FuvestApproval.jsx` | avaliações e acompanhamento |

### `src/services/`

`src/services/` é a única camada que o frontend usa para falar com runtime
real. Não faça `fetch` direto dentro de feature slices se um serviço já existe.

| File | Responsibility |
|------|----------------|
| `api.js` | request wrapper, timeout e cache TTL |
| `auth.js` | sessão, login, cadastro, logout, recover e reset |
| `student.js` | notificações, revisões e simulados do aluno |

### `src/server/api/`

Essa camada existe para o runtime Vercel.

| File | Responsibility |
|------|----------------|
| `router.js` | roteamento por método e path |
| `http.js` | helpers de resposta e parsing |
| `authHandlers.js` | auth/session/recover/register/logout |
| `studentHandlers.js` | notificações, revisões e simulados |
| `supabase.js` | `createServerClient()` com cookies e env vars |

### `src/store/`

O store atual já cobre auth e UI compartilhada.

| File | Responsibility |
|------|----------------|
| `sessionSlice.js` | `authStatus`, `session`, `profileRecord`, `authUser` |
| `uiSlice.js` | sidebars dos shells |
| `index.js` | composição do store Zustand |

### `src/components/`

Os compartilhados principais hoje são:

| File | Responsibility |
|------|----------------|
| `AppErrorBoundary.jsx` | fallback global da aplicação |
| `ProfileActionPanels.jsx` | modais de configurações e ajuda |
| `StudentFeatures.jsx` | `RaioXSection` e `MentoriaView` |

## Auth flow

O fluxo de autenticação atual é server-side first.

1. `AuthBootstrap` chama `getAuthSession()` ao montar.
2. `useAuth()` grava o resultado em Zustand.
3. `LoginPage` chama `login()`, `register()`, `recoverPassword()` e
   `resetPassword()` via `useAuth()`.
4. `src/services/auth.js` conversa com `/api/auth/*`.
5. `src/server/api/authHandlers.js` usa Supabase Auth e sincroniza a linha em
   `public.profiles`.
6. O layout correto valida `session.profile` antes de renderizar o shell.

O atalho demo `pedro/pedro` continua existindo. Ele mapeia para as contas demo
reais quando `VITE_ENABLE_DEMO_SHORTCUT=true` ou quando o frontend roda em
modo `DEV`.

## Student shell

O shell do aluno continua sendo a superfície mais rica do produto.

- `StudentShellLayout.jsx` decide a `safeInitialView`.
- `StudentShellPage.jsx` injeta as views lazy que vivem fora do slice
  `student/`.
- `StudentShell.jsx` mantém `AppContext` para navegação interna e usa os dados
  reais quando a feature já está conectada a `src/services/student.js`.

Views com dados reais hoje:

- notificações do shell;
- revisões;
- simulados.

## Teacher shell

O shell do professor segue autenticado por Supabase, mas o conteúdo ainda é
majoritariamente mockado.

- `TeacherShellLayout.jsx` protege a rota e saneia `?view=`.
- `TeacherShell.jsx` mantém `TeacherContext` e a navegação interna.

## Supabase assets

O runtime real depende destes artefatos:

| Path | Responsibility |
|------|----------------|
| `supabase/migrations/20260419015808_auth_runtime_v1.sql` | profiles, student tables, trigger de novo usuário e RLS |
| `scripts/provision-demo-users.mjs` | provisionamento das contas demo no Auth |

## React contexts

Os contextos continuam sendo o ponto de orquestração da navegação interna.

### `AppContext`

Vive em `src/features/student/StudentShell.jsx` e concentra `currentView`,
`navigate()`, `sidebarOpen`, `setSidebarOpen()`, `user`, `addXp()` e
`hiddenViews`.

### `TeacherContext`

Vive em `src/features/teacher/TeacherShell.jsx` e concentra `currentView`,
`navigate()`, `sidebarOpen`, `setSidebarOpen()` e o perfil docente.

Esses contextos ainda existem porque SA-3.2 permanece pendente.
