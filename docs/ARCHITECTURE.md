# Architecture — Sinapse

Reference document for system design. Update whenever changing shell structure, routes, contexts, or the feature migration map. The source of truth for LLM agents on what lives where.

---

## Migration State (Sprint Arq — runtime closed)

The runtime drain from `legacy/` to `src/features/` is complete and the shell
state migration to Zustand is also closed. There are no runtime imports from
`legacy/` anywhere under `src/`. `docs/SPRINTS.md` remains the operational
source of truth for pending work only; this section keeps the migration history.

| Step | Artefact | Status |
|------|----------|--------|
| SA-1.1 | `src/routes/AppRoutes.jsx` | ✅ Done |
| SA-1.1 | `src/App.jsx` → host for store bootstrap + routes | ✅ Done |
| SA-1.2 | `src/main.jsx` → React 18 named imports | ✅ Done |
| SA-1.3 | `src/features/auth/Login.jsx` (from `nova-tela-login.jsx`) | ✅ Done |
| SA-1.4 | `StudentShellPage` + `TeacherShellPage` → `<Outlet />` | ✅ Done |
| SA-1.5 | legacy student shell → `src/features/student/StudentShell.jsx` | ✅ Done |
| SA-2.1 | Zustand: `src/store/sessionSlice.js` + `uiSlice.js` | ✅ Done |
| SA-2.2 | `legacy/teacher-shell.jsx` → `src/features/teacher/TeacherShell.jsx` | ✅ Done |
| SA-2.3 | AI modules → `src/features/ai-tools/` | ✅ Done |
| SA-2.4 | Assessment modules → `src/features/assessments/` | ✅ Done |
| SA-2.5 | Student modules → `src/features/student/` | ✅ Done |
| SA-2.6 | Teacher modules → `src/features/teacher/` | ✅ Done |
| SA-3.1 | `src/services/` layer setup | ✅ Done |
| SA-3.2 | `src/store/` Zustand wiring | ✅ Done |

---

## Target Directory Tree

```
api/                     # Vercel catch-all API surface
src/
  assets/
  components/           # Shared presentational-only (named exports)
  features/
    auth/               # Login.jsx
    student/            # StudentShell.jsx + student-domain modules
    teacher/            # TeacherShell.jsx + teacher-domain modules
    ai-tools/           # Tutoria.jsx, EssayReview.jsx, DiscursiveAI.jsx
    assessments/        # Simulados.jsx, TriSimulator.jsx, FuvestApproval.jsx
  layouts/              # Shell guards + ?view= sync
  pages/                # Route entry points — thin orchestrators only
  routes/
    AppRoutes.jsx       # All <Routes> declarations
  server/
    api/                # Router + handlers + Supabase server client
  store/                # Zustand slices + composed app store
  services/             # API wrapper + auth/student clients
  lib/                  # useAuth, launchExperience, pageLoaders, Supabase bootstrap
  utils/                # Pure functions, no side-effects
  App.jsx               # AppErrorBoundary + StoreBootstrap + routes host
  main.jsx              # createRoot + BrowserRouter
```

The naming map below documents the drained runtime files and their final homes.

---

## Naming Conventions (enforced during migration)

| Type | Convention | Example |
|------|-----------|---------|
| Feature directory | lowercase English | `auth`, `student`, `ai-tools` |
| React component file | `PascalCase.jsx` | `Login.jsx`, `StudentShell.jsx` |
| Non-component module | `camelCase.js` | `sessionSlice.js` |
| Route config | `PascalCase.jsx` | `AppRoutes.jsx` |
| Shared component | `PascalCase.jsx` + named export | `StudentFeatures.jsx` |
| Hook | `use` + PascalCase | `useAuth.js` |

### Migration naming map (legacy/ → src/features/)

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

**Rule:** after migrating a file, delete the original from `legacy/`.

---

## Current Runtime Flow

```
main.jsx  (BrowserRouter)
  └── App.jsx  (AppErrorBoundary + StoreBootstrap + AppRoutes)
        ├── StoreBootstrap → lib/useAuth.js → GET /api/auth/session
        └── routes/AppRoutes.jsx
              ├── /  /login      → pages/LoginPage → features/auth/Login.jsx
              ├── /aluno         → layouts/StudentShellLayout.jsx
              │                    └── pages/StudentShellPage.jsx
              │                         ├── consumes outlet context
              │                         ├── lazy-loads student / assessments / ai-tools modules
              │                         └── features/student/StudentShell.jsx
              └── /professor     → layouts/TeacherShellLayout.jsx
                                   └── pages/TeacherShellPage.jsx
                                        ├── consumes outlet context
                                        └── features/teacher/TeacherShell.jsx
```

Internal shell navigation does NOT use React Router. `studentCurrentView` and
`teacherCurrentView` live in Zustand slices, are synced to `?view=` by the
shell layouts, and invalid view ids are coerced to safe fallbacks
(`dashboard` or `overview`).

---

## Layer: src/routes/

| File | Responsibility |
|------|----------------|
| `AppRoutes.jsx` | All `<Routes>` declarations. Lazy-imports shell layouts/pages and handles `/modulos/*` legacy redirects. |

```jsx
// Pattern: layout route + index page
const StudentShellLayout = lazy(() => import('../layouts/StudentShellLayout.jsx'));
const StudentShellPage = lazy(() => import('../pages/StudentShellPage.jsx'));

<Route path="/aluno" element={<StudentShellLayout />}>
  <Route index element={<StudentShellPage />} />
</Route>
```

---

## Layer: src/features/

### auth/

| File | Exports | Description |
|------|---------|-------------|
| `Login.jsx` | `default Login` | Full auth UI: profile selection, login, registration, password recovery, and login loading ritual |

`Login` receives callbacks from `LoginPage` (`onLogin`, `onRegister`, `onRecover`) and remains route-agnostic.

### student/

| File | Exports | Description |
|------|---------|-------------|
| `StudentShell.jsx` | `default StudentShell` | Main student shell backed by `studentShellSlice`, notifications from `services/student.js`, profile actions, and page-injected cross-slice modules |
| `CalendarView.jsx` | `default CalendarView` | Timeline of vestibular milestones with exam filters and schedule integration CTA |
| `ScheduleView.jsx` | `default ScheduleView` | Editable weekly schedule backed by the shared `ModalFrame` |
| `Readings.jsx` | `default Readings` | Leituras obrigatórias com progresso e anotações |
| `Revisions.jsx` | `default Revisions` | Revisões espaçadas com cadastro e checklist |
| `Pomodoro.jsx` | `default Pomodoro` | Focus timer com XP e presets de sessão |
| `Mentorship.jsx` | `default Mentorship` | Jornada de mentoria com descoberta, perfil e chat |
| `MoodTracker.jsx` | `default MoodTracker` | Registro de humor com calendário e recomendações |
| `SupportNetwork.jsx` | `default SupportNetwork` | Diretório de apoio emocional e social |

### teacher/

| File | Exports | Description |
|------|---------|-------------|
| `TeacherShell.jsx` | `default TeacherShell` | Shell do professor backed by `teacherShellSlice`, navegação interna e relatórios |
| `LessonPlanner.jsx` | `default LessonPlanner` | Planejador de aulas com preview e sugestões guiadas |

### ai-tools/

| File | Exports | Description |
|------|---------|-------------|
| `Tutoria.jsx` | `default Tutoria` | Tutor com personas e chat guiado |
| `DiscursiveAI.jsx` | `default DiscursiveAI` | Correção guiada de resposta discursiva |
| `EssayReview.jsx` | `default EssayReview` | Laboratório de redação com timer e feedback |

### assessments/

| File | Exports | Description |
|------|---------|-------------|
| `Simulados.jsx` | `default Simulados` | Tracker de simulados com edição e métricas |
| `TriSimulator.jsx` | `default TriSimulator` | Simulador TRI com pesos e histórico |
| `FuvestApproval.jsx` | `default FuvestApproval` | Hub imersivo de estudo estratégico FUVEST |

---

## Layer: src/ — Integration

| File | Responsibility |
|------|----------------|
| `main.jsx` | `createRoot` + `BrowserRouter` |
| `App.jsx` | Renders `AppErrorBoundary`, `StoreBootstrap`, and `<AppRoutes />` |
| `routes/AppRoutes.jsx` | Declarative route config |
| `pages/LoginPage.jsx` | Wires `useAuth()` into `Login.jsx`, redirects authenticated users, and preloads shell chunks |
| `layouts/StudentShellLayout.jsx` | Validates student session, syncs `?view=`, and exposes outlet context |
| `layouts/TeacherShellLayout.jsx` | Validates teacher session, syncs `?view=`, and exposes outlet context |
| `pages/StudentShellPage.jsx` | Consumes outlet context, lazy-loads cross-slice student views, and injects them into `StudentShell.jsx` |
| `pages/TeacherShellPage.jsx` | Consumes outlet context and injects props into teacher shell |
| `lib/useAuth.js` | Auth hook + bootstrap for login, logout, session refresh, registration, recovery, and profile update |
| `lib/launchExperience.js` | Welcome destination per profile |
| `lib/pageLoaders.js` | Shell chunk preload |
| `store/index.js` | `StoreBootstrap` + re-export of the composed app store |
| `store/appStore.js` | Composes `sessionSlice`, `uiSlice`, `studentShellSlice`, and `teacherShellSlice` |
| `services/api.js` | Shared fetch wrapper with timeout, normalized errors, and TTL cache helpers |
| `services/auth.js` | Client auth contract for `/api/auth/*` |
| `services/student.js` | Student-facing service calls for notifications, mock exams, and revisions |
| `components/AppErrorBoundary.jsx` | Global render/data fallback with retry |
| `components/ProfileActionPanels.jsx` | Settings, profile edit, and help modals (both profiles) |
| `components/StudentFeatures.jsx` | `RaioXSection` + `MentoriaView` |

---

## Layer: api/ + src/server/api/

| File | Responsibility |
|------|----------------|
| `api/[...path].js` | Catch-all Vercel function that forwards requests into the internal router |
| `src/server/api/router.js` | Dispatches `/api/auth/*` and `/api/student/*` endpoints |
| `src/server/api/http.js` | Request/response helpers and normalized API errors |
| `src/server/api/supabase.js` | Server-side Supabase client with cookie bridging |
| `src/server/api/authHandlers.js` | Session, login, logout, register, recover, and profile update handlers |
| `src/server/api/studentHandlers.js` | Notifications, mock exams, and revisions handlers |

---

## Layer: legacy/

The `legacy/` directory is drained. Keep it empty until the repository cleanup
task removes the directory entirely. No runtime code under `src/` imports from
this layer anymore.

**Immersive views** (no container padding — full area):
```
aprovacao-fuvest, discursiva-ia, redacao-ia-fuvest, simulador-tri,
tutoria, mentoria, humor, rede-de-apoio
```

---

## Auth flow (server-side)

```
1. App mount           → StoreBootstrap runs useAuthBootstrap()
2. Session bootstrap   → GET /api/auth/session
3. LoginPage           → passes login/register/recover callbacks into Login.jsx
4. Login/Register      → POST /api/auth/login or POST /api/auth/register
5. Supabase SSR        → server client issues/refreshes cookies via response headers
6. Protected layouts   → block /aluno and /professor when session is missing
7. Shell bootstrap     → initializeStudentShell / initializeTeacherShell from Zustand
8. Profile edits       → PATCH /api/auth/profile from AccountSettingsModal
```

No credential, refresh token, or session cookie lifecycle is handled directly by
the browser bundle anymore. The client only talks to `/api/*`.

---

## Zustand state model

### sessionSlice

```ts
interface SessionSlice {
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  session: { profile: 'aluno' | 'professor'; hiddenStudentViews: string[] } | null;
  user: { id: string; email: string; fullName: string; profile: string } | null;
}
```

### studentShellSlice

```ts
interface StudentShellSlice {
  studentAllowedViews: string[];
  studentCurrentView: string;
  studentHiddenViews: string[];
  studentUser: { name: string; turma: string; xp: number; level: number };
}
```

### teacherShellSlice

```ts
interface TeacherShellSlice {
  teacherAllowedViews: string[];
  teacherCurrentView: string;
  selectedTeacherStudentId: string | null;
}
```

`uiSlice` remains responsible for generic UI flags such as shell sidebar state.

---

## Shared components (src/components/)

### AppErrorBoundary.jsx

Named export: default only.
Wraps the app host and renders a retryable fallback for unexpected render/data failures.

### ProfileActionPanels.jsx

Named exports: `AccountSettingsModal`, `AccountHelpModal`, `ModalFrame`, `SUPPORT_EMAIL`.
`ModalFrame`: overlay, Escape key, body scroll lock, `max-h-[90vh]`.
`AccountSettingsModal`: profile name edit + local preferences.

### StudentFeatures.jsx

Named exports:
- `RaioXSection` — ENEM/FUVEST/UNESP/UNICAMP tabs + bar charts per subject.
- `MentoriaView` — sticky ex-alumni banner + `{children}` slot.

---

## Data strategy

The current live contract is centered on `/api/*`. `services/api.js` owns
timeout handling, error normalization, TTL caching, and cache invalidation after
mutations.

### Student endpoints in use

| Endpoint | Consumer |
|----------|----------|
| `GET /api/student/notifications` | `features/student/StudentShell.jsx` |
| `GET /api/student/mock-exams` | `features/assessments/Simulados.jsx` |
| `POST/PATCH/DELETE /api/student/mock-exams` | `features/assessments/Simulados.jsx` |
| `GET /api/student/revisions` | `features/student/Revisions.jsx` |
| `POST/PATCH/DELETE /api/student/revisions` | `features/student/Revisions.jsx` |

### Auth endpoints in use

| Endpoint | Consumer |
|----------|----------|
| `GET /api/auth/session` | `lib/useAuth.js` bootstrap |
| `POST /api/auth/login` | `pages/LoginPage.jsx` |
| `POST /api/auth/logout` | shell layouts |
| `POST /api/auth/register` | `pages/LoginPage.jsx` |
| `POST /api/auth/recover` | `pages/LoginPage.jsx` |
| `PATCH /api/auth/profile` | `components/ProfileActionPanels.jsx` |

---

## Cross-layer import rules

| Importing from | Allowed imports | Forbidden |
|----------------|----------------|-----------|
| `src/features/*` | `src/components/`, `src/lib/`, `src/services/`, `src/store/` | `src/pages/`, other feature slices |
| `src/layouts/` | `src/features/`, `src/lib/`, `src/store/` | `legacy/` |
| `src/pages/` | `src/features/`, `src/components/`, `src/lib/` | `legacy/` |
| `src/routes/` | `src/layouts/`, `src/pages/` | — |
| `src/components/` | `src/lib/` | `src/pages/`, `src/features/`, `legacy/` |

**Relative paths by source location:**

```
from src/features/auth/      →  ../../components/...   ../../lib/...
from src/features/student/   →  ../../components/...   ../../lib/...
from src/components/         →  ../lib/...
from src/layouts/            →  ../features/...         ../lib/...  ../store/...
from src/pages/              →  ../features/...         ../lib/...
from src/routes/             →  ../layouts/...          ../pages/...
```

---

## Integration rules

1. New modules → `src/features/{domain}/`, not `legacy/`.
2. `src/` has no product logic (vestibular UX, study data, module-specific views).
3. `src/components/` uses named exports only.
4. Extract inline shell views when > 80 lines of JSX.
5. Do not reintroduce runtime dependencies on `legacy/` from `src/`.
6. `npm run build` must pass zero errors after every structural change.

---

## What NOT to do

- Do not add routes to `AppRoutes.jsx` for shell-internal views — use `currentView`.
- Do not point runtime code in `src/` back to `legacy/`.
- Do not create files in `legacy/` — use `src/features/`.
- Do not move files without updating lazy imports in the consuming shell.
