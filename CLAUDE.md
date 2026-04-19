# Sinapse — Contexto para Agentes de IA

Plataforma educacional do **Cursinho Popular da Poli** (EPUSP). O projeto já
não é mais um frontend demo puro: autenticação e parte das operações do aluno
rodam com Supabase real via backend `/api`, enquanto boa parte das views ainda
permanece mockada.

## Comandos rápidos

Use estes comandos como ponto de partida.

```bash
npm install
npm run dev
npm run test
npm run build
npm run preview
npm run supabase:provision-demo
```

`npm run supabase:provision-demo` exige `SUPABASE_SERVICE_ROLE_KEY` e, quando
necessário, `SUPABASE_PROJECT_REF`.

## Setup local

O setup mínimo do frontend usa `.env.local`.

```bash
cp .env.example .env.local
```

Para fluxos que dependem de `/api/*`, o frontend local precisa de um backend
alcançável. Há dois caminhos suportados:

1. Definir `VITE_API_BASE_URL` apontando para um deploy existente.
2. Rodar o projeto via `vercel dev`, caso o Vercel CLI esteja instalado.

Variáveis importantes:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_ENABLE_DEMO_SHORTCUT`
- `VITE_DEMO_STUDENT_EMAIL`
- `VITE_DEMO_TEACHER_EMAIL`

## Estrutura do repositório

A árvore principal do runtime atual é esta:

```text
sinapse/
├── api/
│   └── [...path].js              # bridge Vercel Node → Web Request
├── src/
│   ├── App.jsx                   # AppErrorBoundary + AuthBootstrap + AppRoutes
│   ├── components/               # compartilhados
│   │   ├── AppErrorBoundary.jsx
│   │   ├── ProfileActionPanels.jsx
│   │   └── StudentFeatures.jsx
│   ├── features/                 # auth, student, teacher, ai-tools, assessments
│   ├── layouts/                  # StudentShellLayout, TeacherShellLayout
│   ├── lib/
│   │   ├── launchExperience.js
│   │   ├── pageLoaders.js
│   │   ├── supabase/
│   │   │   ├── client.js
│   │   │   └── server.js
│   │   └── useAuth.js
│   ├── pages/                    # LoginPage e entry points dos shells
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── server/api/               # router, handlers e cliente server-side
│   ├── services/                 # api.js, auth.js, student.js
│   └── store/                    # sessionSlice + uiSlice em Zustand
├── supabase/
│   └── migrations/               # schema e políticas do runtime real
├── docs/
├── AGENTS.md
├── CLAUDE.md
└── CONTRIBUTING.md
```

`legacy/` segue drenado. Não reintroduza imports de runtime para lá.

## Arquitetura atual

O runtime mistura três superfícies de estado.

- `React Router` faz o roteamento entre login, shell do aluno e shell do
  professor.
- `Zustand` guarda auth, sessão e estado de sidebar.
- `AppContext` e `TeacherContext` continuam responsáveis pela navegação interna
  de cada shell.

No lado dos dados:

- `src/services/auth.js` e `src/services/student.js` falam com `/api/*`.
- `api/[...path].js` encaminha para `src/server/api/router.js`.
- `src/server/api/*` usa `@supabase/ssr` para operar sobre cookies e sessão.
- `src/lib/supabase/client.js` permanece no browser para `onAuthStateChange()`
  e `updateUserPassword()` no fluxo de recuperação.

## Fluxo de runtime

O caminho principal de execução é este:

```text
src/main.jsx
  └── BrowserRouter
      └── src/App.jsx
          ├── AppErrorBoundary
          ├── AuthBootstrap
          └── AppRoutes
              ├── /login        → LoginPage → features/auth/Login.jsx
              ├── /aluno        → StudentShellLayout → StudentShellPage
              └── /professor    → TeacherShellLayout → TeacherShellPage
```

`AuthBootstrap` hidrata a sessão em Zustand. Os layouts validam o perfil
autenticado, saneiam `?view=` e entregam contexto ao shell correto.

## Fluxo de dados real

O backend já cobre estes endpoints:

- `/api/auth/session`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/register`
- `/api/auth/recover`
- `/api/student/notifications`
- `/api/student/notifications/read-all`
- `/api/student/notifications/:id`
- `/api/student/mock-exams`
- `/api/student/mock-exams/:id`
- `/api/student/revisions`
- `/api/student/revisions/:id`

O shell do professor ainda não depende desse backend.

## Identidade visual

Mantenha a paleta e o contraste do produto.

| Contexto | Tokens principais |
|----------|-------------------|
| Aluno | `blue-950`, `blue-900`, `yellow-400`, `yellow-50` |
| Professor | `indigo-700`, `indigo-600` |
| Sucesso | `teal-500` |
| Atenção | `orange-500` |
| Perigo | `red-500` |

## Padrões de implementação

Alguns limites importam para não quebrar o runtime.

- Não crie rotas internas novas para views do shell. Use `currentView`.
- Não mova lógica de auth para componentes visuais. Ela passa por
  `src/lib/useAuth.js` e `src/services/auth.js`.
- Não faça `fetch` direto em feature slices quando a integração já existe em
  `src/services/`.
- Não adicione backend paralelo fora de `api/[...path].js` e `src/server/api/`
  sem atualizar `docs/ARCHITECTURE.md`.

## Referências rápidas

Quando precisar de contexto extra, consulte:

- `AGENTS.md` para as regras prescritivas de intervenção.
- `docs/ARCHITECTURE.md` para fluxos e limites de camada.
- `docs/SPRINTS.md` para o backlog ainda pendente.
- `docs/STACK.md` para o uso esperado das bibliotecas.
