# Sprints & Kanban — Sinapse

Sprints semanais informais. Prioridade: P0 (bloqueante) → P3 (nice-to-have).

---

## Board atual

### 🔴 Bloqueante / P0

| Item | Responsável | Notas |
|------|-------------|-------|
| — | — | — |

### 🟡 Em andamento

| Item | Branch | Sprint |
|------|--------|--------|
| SA-1.4: ShellPages → `<Outlet />` (nested routing) | `claude/scale-edtech-platform-5scIb` | Sprint Arq |

### 🔵 Review / QA

| Item | PR | Sprint |
|------|-----|--------|
| — | — | — |

### ✅ Concluído

#### Sprint Arq — Refatoração Modular (Abril 2026)

- [x] SA-1.1: `src/routes/AppRoutes.jsx` criado — declarative router
- [x] SA-1.1: `src/App.jsx` → provider host (3 linhas)
- [x] SA-1.2: `src/main.jsx` → React 18 named imports (`createRoot`, `StrictMode`)
- [x] SA-1.3: `src/features/auth/Login.jsx` migrado do legado de login
- [x] SA-1.3: arquivo legado de login deletado após a migração
- [x] SA-1.3: `src/pages/LoginPage.jsx` atualizado para importar de `features/auth/`
- [x] SA-1.5: `src/features/student/StudentShell.jsx` migrado do shell legado do aluno
- [x] SA-1.5: `src/pages/StudentShellPage.jsx` atualizado para importar do student slice
- [x] SA-1.5: shell legado do aluno deletado apos a troca do shell
- [x] SA-2.2: `src/features/teacher/TeacherShell.jsx` migrado de `legacy/teacher-shell.jsx`
- [x] SA-2.2: `src/pages/TeacherShellPage.jsx` atualizado para importar do teacher slice
- [x] SA-2.3: `src/features/ai-tools/DiscursiveAI.jsx`, `EssayReview.jsx` e `Tutoria.jsx` migrados
- [x] SA-2.4: `src/features/assessments/Simulados.jsx`, `TriSimulator.jsx` e `FuvestApproval.jsx` migrados
- [x] SA-2.5: `src/features/student/CalendarView.jsx`, `ScheduleView.jsx`, `Readings.jsx`, `Revisions.jsx`, `Pomodoro.jsx`, `Mentorship.jsx`, `MoodTracker.jsx` e `SupportNetwork.jsx` migrados
- [x] SA-2.5: `src/pages/StudentShellPage.jsx` passou a injetar lazy views cross-slice no shell do aluno
- [x] SA-2.6: `src/features/teacher/LessonPlanner.jsx` migrado de `legacy/lesson-planner.jsx`
- [x] Runtime: `src/` não importa mais de `legacy/`

#### Sprint Arq — Integração de Views (Resumo Técnico)

**Status**: ✅ **CONCLUÍDO** (18 de Abril de 2026)

##### Mapa de Views do Student Shell

| View ID | Módulo | Localização | Lazy Import | Status | Imersivo |
|---------|--------|-------------|------------|--------|----------|
| `dashboard` | Dashboard | `src/features/student/StudentShell.jsx` | Inline | ✅ | ❌ |
| `raio-x` | Raio-X | `src/features/student/StudentShell.jsx` | Inline | ✅ | ❌ |
| `diagnostico` | Diagnóstico | `src/features/student/StudentShell.jsx` | Inline | ✅ | ❌ |
| `calendario` | Calendar | `src/features/student/StudentShell.jsx` | Inline | ✅ | ❌ |
| `cronograma` | Schedule | `src/features/student/StudentShell.jsx` | Inline | ✅ | ❌ |
| `leituras` | Readings | `src/features/student/Readings.jsx` | Via `StudentShellPage.jsx` | ✅ | ❌ |
| `pomodoro` | Pomodoro | `src/features/student/StudentShell.jsx` | Inline | ✅ | ❌ |
| `revisoes` | Revisions | `src/features/student/Revisions.jsx` | Via `StudentShellPage.jsx` | ✅ | ❌ |
| `simulados` | Simulados | `src/features/assessments/Simulados.jsx` | Via `StudentShellPage.jsx` | ✅ | ❌ |
| `aprovacao-fuvest` | Fuvest Approval | `src/features/assessments/FuvestApproval.jsx` | Via `StudentShellPage.jsx` | ✅ | ✅ |
| `discursiva-ia` | Discursive AI | `src/features/ai-tools/DiscursiveAI.jsx` | Via `StudentShellPage.jsx` | ✅ | ✅ |
| `redacao-ia-fuvest` | Essay Review | `src/features/ai-tools/EssayReview.jsx` | Via `StudentShellPage.jsx` | ✅ | ❌ |
| `simulador-tri` | TRI Simulator | `src/features/assessments/TriSimulator.jsx` | Via `StudentShellPage.jsx` | ✅ | ✅ |
| `tutoria` | Tutoria IA | `src/features/ai-tools/Tutoria.jsx` | Via `StudentShellPage.jsx` | ✅ | ✅ |
| `mentoria` | Mentorship | `src/features/student/Mentorship.jsx` | Via `StudentShellPage.jsx` | ✅ | ✅ |
| `humor` | Mood Tracker | `src/features/student/MoodTracker.jsx` | Via `StudentShellPage.jsx` | ✅ | ✅ |
| `rede-de-apoio` | Support Network | `src/features/student/SupportNetwork.jsx` | Via `StudentShellPage.jsx` | ✅ | ✅ |

##### Padrão de Integração

**Views Internas** (renderizadas dentro de `StudentShell.jsx`):
- Importadas com `lazy()` no início do arquivo
- Renderizadas no bloco condicional `{currentView === 'id' && <Component />}`
- Lógica e UI no mesmo slice (`src/features/student/`)

**Views Externas** (injetadas via `externalViews`):
- Importadas com `lazy()` em `StudentShellPage.jsx`
- Adicionadas ao objeto `STUDENT_SHELL_EXTERNAL_VIEWS`
- Passadas para `<StudentShell externalViews={...} />`
- Renderizadas via proxy no shell: `{currentView === 'id' && externalViews.ComponentName && <externalViews.ComponentName />}`

##### Orquestração de Estado

- `StudentShellPage.jsx` gerencia `?view=` via URL params
- `useSearchParams` sincroniza estado da URL com Redux DevTools
- Views inválidas ou ocultas (`hiddenStudentViews`) rebaixam para `dashboard`
- Session carregada via `getStoredDemoSession('aluno')`

##### Checklist de Conformidade

- ✅ Todas as views em `STUDENT_VIEW_IDS` coincidem com os lazy imports
- ✅ Todas as views imersivas estão em `IMMERSIVE_VIEWS` (8 total)
- ✅ Sem `export default` em `src/components/` (apenas named exports)
- ✅ Zero `console.log`, `TODO`, `FIXME` no código
- ✅ Build sem erros: 206.86 kB (65.31 kB gzip)

**Referência**: [`src/pages/StudentShellPage.jsx`](../src/pages/StudentShellPage.jsx), [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md)

#### Sprint 2 — Qualidade & Conteúdo (Abril 2026)

- [x] Corrigir overflow nos modais de Configurações e Ajuda
- [x] Aplicar branding navy/amarelo nos modais do aluno
- [x] Animação sequencial de "Marcar todas como lidas" nas notificações
- [x] Exibir CheckCircle verde ao final da animação de notificações
- [x] Raio-X: abas FUVEST, ENEM, UNESP, UNICAMP
- [x] Raio-X: gráficos de barra com % de incidência
- [x] Extrair `RaioXSection` e `MentoriaView` → `src/components/StudentFeatures.jsx`
- [x] Mentoria: banner sticky "Ex-alunos do Cursinho Popular da Poli"
- [x] Fix: `useApp()` em event handler → hook no corpo do componente
- [x] Fix: valida credenciais demo do aluno quando contas seedadas existem
- [x] Fix: sincroniza `currentView` com `?view=` e saneia views inválidas nos shells

#### Sprint 1 — Fundação (Mar–Abr 2026)

- [x] Shell do aluno (`aluno.jsx`) com 16 views
- [x] Shell do professor (`teacher-shell.jsx`) com 5 views
- [x] Login com seleção de perfil
- [x] Launch experience animada por perfil
- [x] Sistema de sessão demo com Web Storage configurável
- [x] Módulo: Calendário (date-fns)
- [x] Módulo: Cronograma semanal editável
- [x] Módulo: Leituras obrigatórias FUVEST
- [x] Módulo: Revisões espaçadas
- [x] Módulo: Simulados com tracker de performance
- [x] Módulo: Pomodoro com sistema de XP
- [x] Módulo: Aprovação FUVEST
- [x] Módulo: Discursiva IA
- [x] Módulo: Redação IA FUVEST
- [x] Módulo: Simulador TRI
- [x] Módulo: Tutoria com IA
- [x] Módulo: Mentoria (ex-alunos)
- [x] Módulo: Medidor de Humor
- [x] Módulo: Rede de Apoio
- [x] Professor: Planejador de Aulas
- [x] Modais de Configurações e Ajuda
- [x] Sistema de notificações com badge

---

## Backlog por sprint

### Sprint Arq — Refatoração Modular DDD (Abril–Maio 2026)

> Migração de `legacy/` → `src/features/` (Feature-Sliced Design).
> Ver `docs/ARCHITECTURE.md → Migration State` para o mapa completo de arquivos.
> Branch: `claude/scale-edtech-platform-5scIb`
> Itens concluídos ficam apenas na seção "Concluído" para manter o board limpo.

| ID | Item | Prioridade | Status |
|----|------|-----------|--------|
| SA-1.4 | `StudentShellPage` + `TeacherShellPage` → `<Outlet />` nested routes | P0 | 🟡 In progress |
| SA-2.1 | Zustand setup: `store/sessionSlice.js` + `store/uiSlice.js` | P1 | ⬜ |
| SA-3.1 | `src/services/` layer — stub API clients | P1 | ⬜ |
| SA-3.2 | Zustand wiring — replace Context in migrated shells | P1 | ⬜ |

### Sprint 3 — Real Data Layer (estimativa: Mai 2026)

> Substituir mocks por dados reais sem quebrar a UI.
> Depende de SA-1.5 (shell migrado) estar concluído.

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S3-01 | Definir contrato de API (REST ou GraphQL) | P0 | 1d |
| S3-02 | `src/services/api.js` com fetch + error handling | P0 | 1d |
| S3-03 | Substituir `INITIAL_STUDENT_NOTIFICATIONS` por endpoint | P1 | 0.5d |
| S3-04 | Substituir dados de simulados por API | P1 | 1d |
| S3-05 | Substituir dados de revisões por API | P1 | 1d |
| S3-06 | Loading states nos módulos que consomem API | P1 | 1d |
| S3-07 | Error boundary global | P2 | 0.5d |
| S3-08 | Cache de requisições com TTL simples | P2 | 1d |

### Sprint 4 — Autenticação Real (estimativa: Jun 2026)

> Substituir sistema de sessão demo por auth real.
> Vercel resolve deploy e variáveis server-side, mas não transforma `VITE_*`
> em segredo. Sessão, refresh token e credenciais sensíveis precisam sair do
> frontend e ir para Functions/Edge ou backend dedicado.

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S4-00 | Definir boundary client/server no Vercel para auth e segredos | P0 | 0.5d |
| S4-01 | Integrar Supabase Auth ou Firebase via camada server-side | P0 | 2d |
| S4-02 | Substituir `demoSession.js` por `useAuth()` + cookie `httpOnly` | P0 | 1d |
| S4-03 | Rota protegida: redirect para `/login` sem sessão válida | P0 | 0.5d |
| S4-04 | Emitir e renovar sessão em endpoint server-side | P1 | 1d |
| S4-05 | Cadastro de alunos (form + validação) | P1 | 1d |
| S4-06 | Recuperação de senha | P2 | 0.5d |
| S4-07 | Perfil do aluno editável | P2 | 1d |

### Sprint 5 — IA Real (estimativa: Jul 2026)

> Integrar LLMs nos módulos de tutoria e redação.
> Depende de Sprint Arq SA-2.3 estar concluído.
> Chaves de provedor nunca ficam no bundle do cliente; integração real passa por
> proxy server-side no Vercel ou backend dedicado.

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S5-00 | Criar proxy server-side para chamadas LLM | P0 | 1d |
| S5-01 | Claude API no módulo Tutoria com IA | P0 | 2d |
| S5-02 | Claude API no módulo Redação IA FUVEST | P0 | 2d |
| S5-03 | Prompt templates por disciplina | P1 | 1d |
| S5-04 | Histórico de conversa persistido por sessão | P1 | 1d |
| S5-05 | Feedback estruturado de redação (critérios ENEM/FUVEST) | P1 | 2d |
| S5-06 | Rate limiting + feedback de quota | P2 | 0.5d |

### Sprint 6 — Mobile & PWA (estimativa: Ago 2026)

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S6-01 | manifest.json + ícones para PWA | P1 | 0.5d |
| S6-02 | Service worker para cache offline | P1 | 1d |
| S6-03 | Web Push para revisões e prazos | P2 | 2d |
| S6-04 | Auditoria de responsividade (iPhone SE + Android médio) | P1 | 1d |

### Sprint 7 — Professor Avançado (estimativa: Set 2026)

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S7-01 | Mensagens diretas professor → aluno | P1 | 2d |
| S7-02 | Criação de simulados pelo professor | P1 | 3d |
| S7-03 | Dashboard de risco de evasão com dados reais | P1 | 2d |
| S7-04 | Exportar relatório de turma em PDF | P2 | 1d |
| S7-05 | Notificações quando aluno atinge meta | P2 | 1d |

---

## Backlog livre (sem sprint definida)

| Item | Prioridade | Observação |
|------|-----------|-----------|
| Testes de integração (Playwright ou Cypress) | P1 | Sem test runner configurado ainda |
| Storybook para `src/components/` | P2 | Útil quando houver > 5 componentes |
| i18n | P3 | Só se houver alunos fora do Brasil |
| Analytics (Posthog ou similar) | P2 | Requer consentimento LGPD |
| Gamificação: ranking por turma | P2 | XP system já existe |
| Cronograma adaptativo via IA | P1 | Bloqueia Sprint 5 |
| Diagnóstico com questões reais | P1 | Requer banco de questões |

---

## Definition of Done

1. Código commitado na branch com mensagem Conventional Commits.
2. `npm run build` passa sem erros.
3. Mudança integrada no shell ou rota corretos.
4. `docs/ARCHITECTURE.md` atualizado se nível estrutural.
5. Item movido para Done neste arquivo.
6. Zero `console.log`, `TODO`, `FIXME` no código commitado.
