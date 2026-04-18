# Architecture — Sinapse

Reference document for system design. Update whenever changing shell structure, routes, contexts, or the feature migration map. The source of truth for LLM agents on what lives where.

---

## Migration State (Sprint Arq — in progress)

The codebase remains in Sprint Arq because routing and state migration are still
open, but the runtime drain from `legacy/` to `src/features/` is complete.
There are no runtime imports from `legacy/` anywhere under `src/`.

| Step | Artefact | Status |
|------|----------|--------|
| SA-1.1 | `src/routes/AppRoutes.jsx` | ✅ Done |
| SA-1.1 | `src/App.jsx` → provider host only | ✅ Done |
| SA-1.2 | `src/main.jsx` → React 18 named imports | ✅ Done |
| SA-1.3 | `src/features/auth/Login.jsx` (from `nova-tela-login.jsx`) | ✅ Done |
| SA-1.4 | `StudentShellPage` + `TeacherShellPage` → `<Outlet />` | ⬜ Next |
| SA-1.5 | legacy student shell → `src/features/student/StudentShell.jsx` | ✅ Done |
| SA-2.1 | Zustand: `src/store/sessionSlice.js` + `uiSlice.js` | ⬜ |
| SA-2.2 | `legacy/teacher-shell.jsx` → `src/features/teacher/TeacherShell.jsx` | ✅ Done |
| SA-2.3 | AI modules → `src/features/ai-tools/` | ✅ Done |
| SA-2.4 | Assessment modules → `src/features/assessments/` | ✅ Done |
| SA-2.5 | Student modules → `src/features/student/` | ✅ Done |
| SA-2.6 | Teacher modules → `src/features/teacher/` | ✅ Done |
| SA-3.1 | `src/services/` layer setup | ⬜ |
| SA-3.2 | `src/store/` Zustand wiring | ⬜ |

---

## Target Directory Tree

```
src/
  assets/
  components/           # Shared presentational-only (named exports)
  features/
    auth/               # Login.jsx ✅
    student/            # StudentShell.jsx + student-domain modules
    teacher/            # TeacherShell.jsx + teacher-domain modules
    ai-tools/           # Tutoria.jsx, EssayReview.jsx, DiscursiveAI.jsx
    assessments/        # Simulados.jsx, TriSimulator.jsx, FuvestApproval.jsx
  layouts/              # Shell layout skeletons (post SA-1.4)
  pages/                # Route entry points — thin orchestrators only
  routes/
    AppRoutes.jsx       # All <Routes> declarations ✅
  store/                # Zustand slices
  services/             # External API clients (OpenAI, Firebase, etc.)
  lib/                  # demoSession.js, launchExperience.js, pageLoaders.js
  utils/                # Pure functions, no side-effects
  App.jsx               # Provider host ✅
  main.jsx              # createRoot + BrowserRouter ✅
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
| Hook | `use` + PascalCase | `useSession.js` |

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
  └── App.jsx  (provider host — future: Zustand <Provider> wraps here)
        └── routes/AppRoutes.jsx
              ├── /  /login     → pages/LoginPage → features/auth/Login.jsx
              ├── /aluno/*      → pages/StudentShellPage
              │                   ├── reads session + sanitizes view query
              │                   ├── syncs currentView back to ?view=
              │                   ├── lazy-loads student / assessments / ai-tools modules
              │                   └── features/student/StudentShell.jsx
              └── /professor/*  → pages/TeacherShellPage
                                  ├── reads session + sanitizes view query
                                  ├── syncs currentView back to ?view=
                                  └── features/teacher/TeacherShell.jsx
```

Internal shell navigation does NOT use React Router — uses
`AppContext.navigate(viewId)` in the student shell and
`TeacherContext.navigate(viewId)` in the teacher shell. Both update
`currentView`, which is synced to `?view=` by the wrapper page. The wrappers
also coerce invalid view ids to safe fallbacks (`dashboard` or `overview`).

---

## Layer: src/routes/

| File | Responsibility |
|------|----------------|
| `AppRoutes.jsx` | All `<Routes>` declarations. Lazy-imports shell pages. Handles `/modulos/*` legacy redirects. |

```jsx
// Pattern: lazy page + wildcard route
const StudentShellPage = lazy(() => import('../pages/StudentShellPage.jsx'));
<Route path="/aluno/*" element={<StudentShellPage />} />
```

---

## Layer: src/features/

### auth/

| File | Exports | Description |
|------|---------|-------------|
| `Login.jsx` | `default Login` | Full login UI: profile selection, credentials form, loading ritual |

`Login` receives `onLogin({ profile, formData })` from `LoginPage`. Has no routing knowledge.

### student/

| File | Exports | Description |
|------|---------|-------------|
| `StudentShell.jsx` | `default StudentShell` | Main student shell with `AppContext`, notifications, profile actions, same-slice lazy views, and page-injected cross-slice modules |
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
| `TeacherShell.jsx` | `default TeacherShell` | Shell do professor com `TeacherContext`, navegação e relatórios |
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
| `App.jsx` | Provider host — renders `<AppRoutes />` only |
| `routes/AppRoutes.jsx` | Declarative route config |
| `pages/LoginPage.jsx` | Builds a demo session, short-circuits invalid student login, and navigates to the shell |
| `pages/StudentShellPage.jsx` | Reads session + `?view=`, sanitizes invalid or hidden views, lazy-loads cross-slice student views, and injects them into `StudentShell.jsx` |
| `pages/TeacherShellPage.jsx` | Reads session + `?view=`, sanitizes invalid views, and injects props into teacher shell |
| `lib/demoSession.js` | Session CRUD on configured Web Storage with TTL validation and student demo credential checks |
| `lib/launchExperience.js` | Welcome destination per profile |
| `lib/pageLoaders.js` | Shell chunk preload |
| `components/ProfileActionPanels.jsx` | Settings + help modals (both profiles) |
| `components/StudentFeatures.jsx` | `RaioXSection` + `MentoriaView` |

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

## Auth flow (demo)

```
1. User: selects profile + credentials in features/auth/Login.jsx
2. LoginPage.handleLogin({ profile, formData })
3. buildDemoSession()       → session object or null
4. persistDemoSession()     → runs only when session exists
5. preloadShellPage()       → preloads shell chunk
6. navigate()               → /aluno or /professor
7. ShellPage                → getStoredDemoSession() + sanitized view
8. StudentShellPage         → also injects the cross-slice lazy view map
```

Demo accounts (`demoSession.js` + `.env.local`):

| User | Password | Profile | Restrictions |
|------|----------|---------|--------------|
| `VITE_DEMO_STUDENT_USERNAME` | `VITE_DEMO_STUDENT_PASSWORD` | student | `discursiva-ia` hidden |
| `VITE_DEMO_POWER_USER_USERNAME` | `VITE_DEMO_POWER_USER_PASSWORD` | student | none |
| any non-empty | any non-empty | teacher | none |

If no student demo accounts are configured, the student shell falls back to
accepting any non-empty credential pair in demo mode. Teacher demo remains open
to any non-empty credentials.

---

## React Contexts

### AppContext (`features/student/StudentShell.jsx`)

```ts
interface AppContextValue {
  currentView: string;
  navigate: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: { name: string; turma: string; xp: number; level: number };
  addXp: (amount: number) => void;
  hiddenViews: string[];
}
```

### TeacherContext (`features/teacher/TeacherShell.jsx`)

```ts
interface TeacherContextValue {
  currentView: string;
  navigate: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  teacher: { name: string; subject: string; turmas: string[] };
}
```

Both contexts will be replaced by Zustand slices in SA-2.1.

---

## Shared components (src/components/)

### ProfileActionPanels.jsx

Named exports: `AccountSettingsModal`, `AccountHelpModal`, `ModalFrame`, `SUPPORT_EMAIL`.
`ModalFrame`: overlay, Escape key, body scroll lock, `max-h-[90vh]`.

### StudentFeatures.jsx

Named exports:
- `RaioXSection` — ENEM/FUVEST/UNESP/UNICAMP tabs + bar charts per subject.
- `MentoriaView` — sticky ex-alumni banner + `{children}` slot.

---

## Data strategy

All mocked. Constants defined at top of consuming file (SCREAMING_SNAKE_CASE).

| Constant | Location | Target (Sprint SA-3) |
|----------|----------|-----------------------|
| `INITIAL_STUDENT_NOTIFICATIONS` | `features/student/StudentShell.jsx` | `services/notifications.js` |
| `mockDashboard`, `booksData` | `features/student/StudentShell.jsx` | `services/student.js` |
| `MOCK_MENTORS` | `features/student/Mentorship.jsx` | `services/mentors.js` |
| `mockStudents` | `features/teacher/TeacherShell.jsx` | `services/teacher.js` |
| `RAIOX_DATA` | `StudentFeatures.jsx` | `services/raiox.js` |

---

## Cross-layer import rules

| Importing from | Allowed imports | Forbidden |
|----------------|----------------|-----------|
| `src/features/*` | `src/components/`, `src/lib/`, `src/store/` | `src/pages/`, other feature slices |
| `src/pages/` | `src/features/`, `src/components/`, `src/lib/` | `legacy/` |
| `src/routes/` | `src/pages/` | — |
| `src/components/` | `src/lib/` | `src/pages/`, `src/features/`, `legacy/` |

**Relative paths by source location:**

```
from src/features/auth/      →  ../../components/...   ../../lib/...
from src/features/student/   →  ../../components/...   ../../lib/...
from src/components/         →  ../lib/...
from src/pages/              →  ../features/...         ../lib/...
from src/routes/             →  ../pages/...
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
