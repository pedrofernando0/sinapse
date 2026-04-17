# Architecture — Sinapse

Reference document for system design. Update whenever changing shell structure, routes, contexts, or the feature migration map. The source of truth for LLM agents on what lives where.

---

## Migration State (Sprint Arq — in progress)

The codebase is mid-migration from `01-app-core/` (legacy monolith) to `src/features/` (Feature-Sliced Design). Both directories coexist. **Do not add new files to `01-app-core/`** — new code goes to `src/features/`.

| Step | Artefact | Status |
|------|----------|--------|
| SA-1.1 | `src/routes/AppRoutes.jsx` | ✅ Done |
| SA-1.1 | `src/App.jsx` → provider host only | ✅ Done |
| SA-1.2 | `src/main.jsx` → React 18 named imports | ✅ Done |
| SA-1.3 | `src/features/auth/Login.jsx` (from `nova-tela-login.jsx`) | ✅ Done |
| SA-1.4 | `StudentShellPage` + `TeacherShellPage` → `<Outlet />` | ⬜ Next |
| SA-1.5 | `01-app-core/aluno.jsx` → `src/features/student/StudentShell.jsx` | ⬜ |
| SA-2.1 | Zustand: `src/store/sessionSlice.js` + `uiSlice.js` | ⬜ |
| SA-2.2 | `01-app-core/professor.jsx` → `src/features/teacher/TeacherShell.jsx` | ⬜ |
| SA-2.3 | AI modules → `src/features/ai-tools/` | ⬜ |
| SA-2.4 | Assessment modules → `src/features/assessments/` | ⬜ |
| SA-2.5 | Student modules → `src/features/student/` | ⬜ |
| SA-2.6 | Teacher modules → `src/features/teacher/` | ⬜ |
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

Files still in `01-app-core/` are awaiting migration. See naming map below.

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

### Migration naming map (01-app-core/ → src/features/)

| Legacy | Target | Status |
|--------|--------|--------|
| `nova-tela-login.jsx` | `features/auth/Login.jsx` | ✅ Deleted |
| `aluno.jsx` | `features/student/StudentShell.jsx` | ⬜ SA-1.5 |
| `professor.jsx` | `features/teacher/TeacherShell.jsx` | ⬜ SA-2.2 |
| `tutoria-ia.jsx` | `features/ai-tools/Tutoria.jsx` | ⬜ SA-2.3 |
| `discursiva-ia.jsx` | `features/ai-tools/DiscursiveAI.jsx` | ⬜ SA-2.3 |
| `redacao-ia-fuvest.jsx` | `features/ai-tools/EssayReview.jsx` | ⬜ SA-2.3 |
| `simulados.jsx` | `features/assessments/Simulados.jsx` | ⬜ SA-2.4 |
| `simulador-tri.jsx` | `features/assessments/TriSimulator.jsx` | ⬜ SA-2.4 |
| `aprovacao-fuvest.jsx` | `features/assessments/FuvestApproval.jsx` | ⬜ SA-2.4 |
| `calendario.jsx` | `features/student/Calendar.jsx` | ⬜ SA-2.5 |
| `cronograma.jsx` | `features/student/Schedule.jsx` | ⬜ SA-2.5 |
| `revisoes.jsx` | `features/student/Revisions.jsx` | ⬜ SA-2.5 |
| `leituras.jsx` | `features/student/Readings.jsx` | ⬜ SA-2.5 |
| `pomodoro.jsx` | `features/student/Pomodoro.jsx` | ⬜ SA-2.5 |
| `medidor-de-humor.jsx` | `features/student/MoodTracker.jsx` | ⬜ SA-2.5 |
| `rede-de-apoio.jsx` | `features/student/SupportNetwork.jsx` | ⬜ SA-2.5 |
| `tutoria.jsx` | `features/student/Mentorship.jsx` | ⬜ SA-2.5 |
| `prof-planejador-de-aulas.jsx` | `features/teacher/LessonPlanner.jsx` | ⬜ SA-2.6 |

**Rule:** after migrating a file, delete the original from `01-app-core/`.

---

## Current Runtime Flow

```
main.jsx  (BrowserRouter)
  └── App.jsx  (provider host — future: Zustand <Provider> wraps here)
        └── routes/AppRoutes.jsx
              ├── /  /login     → pages/LoginPage → features/auth/Login.jsx
              ├── /aluno/*      → pages/StudentShellPage → 01-app-core/aluno.jsx  ← pending SA-1.5
              └── /professor/*  → pages/TeacherShellPage → 01-app-core/professor.jsx  ← pending SA-2.2
```

Internal shell navigation does NOT use React Router — uses `AppContext.navigate(viewId)` → updates `currentView` → `?view=` synced by wrapper page.

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

## Layer: src/features/ (partial — migration in progress)

### auth/

| File | Exports | Description |
|------|---------|-------------|
| `Login.jsx` | `default Login` | Full login UI: profile selection, credentials form, loading ritual |

`Login` receives `onLogin({ profile, formData })` from `LoginPage`. Has no routing knowledge.

---

## Layer: src/ — Integration

| File | Responsibility |
|------|----------------|
| `main.jsx` | `createRoot` + `BrowserRouter` |
| `App.jsx` | Provider host — renders `<AppRoutes />` only |
| `routes/AppRoutes.jsx` | Declarative route config |
| `pages/LoginPage.jsx` | Builds session, navigates to shell |
| `pages/StudentShellPage.jsx` | Reads session + `?view=`, injects props into student shell |
| `pages/TeacherShellPage.jsx` | Reads session + `?view=`, injects props into teacher shell |
| `lib/demoSession.js` | Session CRUD on `localStorage` |
| `lib/launchExperience.js` | Welcome destination per profile |
| `lib/pageLoaders.js` | Shell chunk preload |
| `components/ProfileActionPanels.jsx` | Settings + help modals (both profiles) |
| `components/StudentFeatures.jsx` | `RaioXSection` + `MentoriaView` |

---

## Layer: 01-app-core/ (legacy — being drained)

**Do not create new files here.** All additions go to `src/features/`.

### Student shell — `aluno.jsx`

Export: `default function App({ initialView, session, onLogout })`

```
AppProvider (Context)
  └── Layout
        ├── <aside>  Sidebar + NAVIGATION_SECTIONS
        ├── <header> Notifications, XP, Profile
        └── <main>
              └── <Suspense>
                    └── view selected by currentView
```

**Views inline** (in `aluno.jsx`, extracted when > 80 lines):

| View ID | Component | Notes |
|---------|-----------|-------|
| `dashboard` | `DashboardView` | KPIs, timeline |
| `raio-x` | `RaioXSection` (imported) | Bar charts by vestibular |
| `diagnostico` | `DiagnosticoView` | Self-assessment 1–5 per topic |
| `cronograma` | `CronogramaView` | Mocked weekly grid |
| `leituras` | `LeiturasView` | Required readings list |
| `revisoes` | `RevisoesView` | Spaced repetition list |
| `simulados` | `SimuladosView` | Performance history |

**Views lazy-loaded** (external modules):

| View ID | Current file | Target |
|---------|-------------|--------|
| `calendario` | `calendario.jsx` | `features/student/Calendar.jsx` |
| `cronograma` | `cronograma.jsx` | `features/student/Schedule.jsx` |
| `leituras` | `leituras.jsx` | `features/student/Readings.jsx` |
| `revisoes` | `revisoes.jsx` | `features/student/Revisions.jsx` |
| `simulados` | `simulados.jsx` | `features/assessments/Simulados.jsx` |
| `pomodoro` | `pomodoro.jsx` | `features/student/Pomodoro.jsx` |
| `aprovacao-fuvest` | `aprovacao-fuvest.jsx` | `features/assessments/FuvestApproval.jsx` |
| `discursiva-ia` | `discursiva-ia.jsx` | `features/ai-tools/DiscursiveAI.jsx` |
| `redacao-ia-fuvest` | `redacao-ia-fuvest.jsx` | `features/ai-tools/EssayReview.jsx` |
| `simulador-tri` | `simulador-tri.jsx` | `features/assessments/TriSimulator.jsx` |
| `tutoria` | `tutoria-ia.jsx` | `features/ai-tools/Tutoria.jsx` |
| `mentoria` | `tutoria.jsx` | `features/student/Mentorship.jsx` |
| `humor` | `medidor-de-humor.jsx` | `features/student/MoodTracker.jsx` |
| `rede-de-apoio` | `rede-de-apoio.jsx` | `features/student/SupportNetwork.jsx` |

**Immersive views** (no container padding — full area):
```
aprovacao-fuvest, discursiva-ia, redacao-ia-fuvest, simulador-tri,
tutoria, mentoria, humor, rede-de-apoio
```

### Teacher shell — `professor.jsx`

Export: `default function TeacherShell({ initialView, session, onLogout })`

| View ID | Component | Notes |
|---------|-----------|-------|
| `overview` | `OverviewView` | Class KPIs, student table |
| `students` | `StudentsDetailView` | Individual student analysis |
| `simulados-turma` | `SimuladosClassView` | Class performance |
| `attendance` | `AttendanceView` | Attendance + dropout risk |
| `planejador` | Lazy: `prof-planejador-de-aulas.jsx` | Lesson planner |

---

## Auth flow (demo)

```
1. User: selects profile + credentials in features/auth/Login.jsx
2. LoginPage.handleLogin({ profile, formData })
3. buildDemoSession()       → { name, profile, hiddenViews }
4. persistDemoSession()     → localStorage['sinapse.demo-session']
5. preloadShellPage()       → preloads shell chunk
6. navigate()               → /aluno or /professor
7. StudentShellPage         → getStoredDemoSession() → passes { initialView, session, onLogout }
```

Demo accounts (`demoSession.js`):

| User | Password | Profile | Restrictions |
|------|----------|---------|--------------|
| valentina | valentina | student | `discursiva-ia` hidden |
| pedro | pedro | student | none |
| any | any | teacher | none |

---

## React Contexts

### AppContext (aluno.jsx)

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

### TeacherContext (professor.jsx)

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

Named exports: `AccountSettingsModal`, `AccountHelpModal`, `SUPPORT_EMAIL`.
Internal `ModalFrame`: overlay, Escape key, body scroll lock, `max-h-[90vh]`.

### StudentFeatures.jsx

Named exports:
- `RaioXSection` — ENEM/FUVEST/UNESP/UNICAMP tabs + bar charts per subject.
- `MentoriaView` — sticky ex-alumni banner + `{children}` slot.

---

## Data strategy

All mocked. Constants defined at top of consuming file (SCREAMING_SNAKE_CASE).

| Constant | Location | Target (Sprint SA-3) |
|----------|----------|-----------------------|
| `INITIAL_STUDENT_NOTIFICATIONS` | `aluno.jsx` | `services/notifications.js` |
| `mockDashboard`, `booksData` | `aluno.jsx` | `services/student.js` |
| `MOCK_MENTORS` | `tutoria.jsx` | `services/mentors.js` |
| `MOCK_STUDENTS` | `professor.jsx` | `services/teacher.js` |
| `RAIOX_DATA` | `StudentFeatures.jsx` | `services/raiox.js` |

---

## Cross-layer import rules

| Importing from | Allowed imports | Forbidden |
|----------------|----------------|-----------|
| `src/features/*` | `src/components/`, `src/lib/`, `src/store/` | `src/pages/`, other feature slices |
| `src/pages/` | `src/features/`, `src/components/`, `src/lib/` | `01-app-core/` |
| `src/routes/` | `src/pages/` | — |
| `src/components/` | `src/lib/` | `src/pages/`, `src/features/`, `01-app-core/` |
| `01-app-core/` (legacy) | `src/components/`, `src/lib/` | `src/pages/` |

**Relative paths by source location:**

```
from src/features/auth/      →  ../../components/...   ../../lib/...
from src/features/student/   →  ../../components/...   ../../lib/...
from src/components/         →  ../lib/...
from src/pages/              →  ../features/...         ../lib/...
from src/routes/             →  ../pages/...
from 01-app-core/            →  ../src/components/...  ../src/lib/...
```

---

## Integration rules

1. New modules → `src/features/{domain}/`, not `01-app-core/`.
2. `src/` has no product logic (vestibular UX, study data, module-specific views).
3. `src/components/` uses named exports only.
4. Extract inline shell views when > 80 lines of JSX.
5. Delete `01-app-core/` original after migrating to `src/features/`.
6. `npm run build` must pass zero errors after every structural change.

---

## What NOT to do

- Do not add routes to `AppRoutes.jsx` for shell-internal views — use `currentView`.
- Do not use `useNavigate()` inside `01-app-core/` — shells have no router knowledge.
- Do not create files in `01-app-core/` — use `src/features/`.
- Do not move files without updating lazy imports in the consuming shell.
