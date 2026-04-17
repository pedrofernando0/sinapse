# Sinapse — Contexto para Agentes de IA

Plataforma educacional do **Cursinho Popular da Poli** (EPUSP). Prototype React em
produção ativa. Dois perfis: aluno (vestibulando) e professor. Nenhum backend real —
toda persistência via `localStorage`; dados são mockados para fins de produto.

---

## Comandos rápidos

```bash
npm install        # instala dependências (node_modules ausente no clone)
npm run dev        # dev server em http://localhost:5173
npm run build      # build de produção (Vite — valida JSX/imports)
npm run preview    # preview do build de produção
```

> **Contas demo** (login screen): `valentina / valentina` (aluno) ou `pedro / pedro`
> (aluno). Professor: qualquer usuário que escolha o perfil "Professor" no login.

---

## Estrutura do repositório

```
sinapse/
├── legacy/                   # diretório drenado; mantido vazio até a limpeza final
│
├── src/
│   ├── App.jsx               # provider host — renderiza <AppRoutes /> apenas
│   ├── main.jsx              # createRoot + BrowserRouter
│   ├── index.css             # fontes (Fraunces + Manrope) + base dark
│   ├── components/           # componentes presentacionais compartilhados (named exports)
│   │   ├── ProfileActionPanels.jsx
│   │   └── StudentFeatures.jsx
│   ├── features/             # domínios de produto (Feature-Sliced Design)
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   ├── student/
│   │   │   ├── StudentShell.jsx
│   │   │   ├── CalendarView.jsx
│   │   │   ├── ScheduleView.jsx
│   │   │   ├── Readings.jsx
│   │   │   ├── Revisions.jsx
│   │   │   ├── Pomodoro.jsx
│   │   │   ├── Mentorship.jsx
│   │   │   ├── MoodTracker.jsx
│   │   │   └── SupportNetwork.jsx
│   │   ├── teacher/
│   │   │   ├── TeacherShell.jsx
│   │   │   └── LessonPlanner.jsx
│   │   ├── assessments/
│   │   │   ├── Simulados.jsx
│   │   │   ├── TriSimulator.jsx
│   │   │   └── FuvestApproval.jsx
│   │   └── ai-tools/
│   │       ├── Tutoria.jsx
│   │       ├── DiscursiveAI.jsx
│   │       └── EssayReview.jsx
│   ├── lib/
│   │   ├── demoSession.js
│   │   ├── launchExperience.js
│   │   └── pageLoaders.js
│   ├── pages/                # entry points de rotas — orquestram features + libs
│   │   ├── LoginPage.jsx
│   │   ├── StudentShellPage.jsx
│   │   └── TeacherShellPage.jsx
│   └── routes/
│       └── AppRoutes.jsx     # ✅ toda a configuração declarativa de rotas
│
├── docs/
│   ├── ARCHITECTURE.md       # design do sistema + mapa de migração
│   ├── SPRINTS.md            # kanban e backlog de sprints
│   └── STACK.md              # referência por biblioteca
│
├── AGENTS.md                 # LEIA ANTES DE QUALQUER INTERVENÇÃO
├── CLAUDE.md                 # este arquivo
├── CONTRIBUTING.md           # regras de contribuição humana
└── README.md                 # visão geral pública do projeto
```

> **Mantenha `legacy/` vazio.** Novos módulos vão em `src/features/{domínio}/`.

---

## Arquitetura (estado atual — Sprint Arq em progresso)

```
src/routes/   →  configuração declarativa de rotas (AppRoutes.jsx)
src/features/ →  domínios de produto (Feature-Sliced Design) — crescendo
src/pages/    →  entry points de rotas: orquestram features + libs
src/components/ → componentes presentacionais compartilhados
src/lib/      →  sessão, experiência de lançamento, preload
legacy/       →  diretório drenado, sem dependências de runtime a partir de src/
```

`src/features/*` não importa de `src/pages/` nem de outros feature slices.
Orquestração cross-slice para shells acontece em `src/pages/*ShellPage.jsx`.

---

## Fluxo de runtime

```
src/main.jsx  (createRoot + BrowserRouter)
  └── App.jsx  (provider host)
        └── routes/AppRoutes.jsx
              ├── /  /login   → LoginPage → features/auth/Login.jsx
              │                  └── handleLogin() → buildDemoSession() → navigate(/aluno)
              ├── /aluno/*    → StudentShellPage
              │                  ├── lê sessão + ?view=
              │                  ├── injeta lazy views cross-slice quando necessário
              │                  └── features/student/StudentShell.jsx
              └── /professor/* → TeacherShellPage
                                  └── features/teacher/TeacherShell.jsx
```

Navegação interna aos shells **não usa React Router**: usa
`AppContext.navigate(view)` no aluno e `TeacherContext.navigate(view)` no
professor, refletindo `currentView` em `?view=` pelo wrapper.

---

## Sistema de sessão

`src/lib/demoSession.js` gerencia sessões demo:

| Função | O que faz |
|--------|-----------|
| `buildDemoSession(profile, formData)` | cria objeto de sessão |
| `persistDemoSession(session)` | salva em `localStorage` com chave `sinapse.demo-session` |
| `getStoredDemoSession(profile)` | lê e valida sessão existente |
| `clearDemoSession()` | remove ao fazer logout |

Contas demo embutidas: `valentina` (aluno, sem discursiva-ia) e `pedro` (aluno, tudo visível).

---

## Identidade visual

| Contexto | Token Tailwind | Uso |
|----------|---------------|-----|
| Aluno — primário | `blue-900`, `blue-950` | gradientes, botões, sidebar active |
| Aluno — acento | `yellow-400`, `yellow-50` | badges, destaques, toggles |
| Professor — primário | `indigo-600`, `indigo-700` | equivalente ao blue do aluno |
| Status: sucesso | `teal-500` | progresso completo, notif positiva |
| Status: atenção | `orange-500` | XP bar, deadlines |
| Status: perigo | `red-500` | notif crítica, risco de evasão |
| Superfícies | `slate-50` a `slate-900` | fundos, bordas, textos |

Fontes: `Fraunces` (serifada, usada em headings de destaque) e `Manrope` (sans-serif, uso geral).

---

## Padrões de componente

### Primitivos reutilizáveis (definidos em `src/features/student/StudentShell.jsx`)

```jsx
<Card className="...">           // bg-white/80 backdrop-blur-md, rounded-2xl
<ProgressBar progress={85} colorClass="bg-blue-500" />
```

### Modais (em `ProfileActionPanels.jsx`)

```jsx
<AccountSettingsModal open={bool} onClose={fn} profile="student" userName="..." />
<AccountHelpModal     open={bool} onClose={fn} profile="student" userName="..." />
```

O `ModalFrame` exportado já lida com: `max-h-[90vh]`, `overflow-y-auto`, Escape key, body scroll lock.

### Views imersivas (full-screen)

Módulos em `IMMERSIVE_VIEWS` (Set em `src/features/student/StudentShell.jsx`) recebem a área de conteúdo sem
padding. Para adicionar banner/header a um módulo imersivo, use `position: sticky top-0`
(ver `MentoriaView` em `src/components/StudentFeatures.jsx` como referência).

---

## Como adicionar uma view ao shell do aluno

1. Defina o slice correto:
   - `src/features/student/` se a view é estritamente do domínio do aluno.
   - `src/features/assessments/` ou `src/features/ai-tools/` se a view pertence a
     esses domínios, mesmo sendo renderizada dentro do shell do aluno.
2. Se a view ficar em `src/features/student/`, crie o módulo com `export default`
   e faça o lazy import diretamente em `src/features/student/StudentShell.jsx`.
3. Se a view ficar em outro slice, crie o módulo no slice correto e faça o lazy
   import em `src/pages/StudentShellPage.jsx`, adicionando a entrada no objeto
   `STUDENT_SHELL_EXTERNAL_VIEWS`.
4. Em `src/features/student/StudentShell.jsx`, adicione a entrada em
   `VIEW_TITLES`, `NAVIGATION_SECTIONS`, `IMMERSIVE_VIEWS` (se aplicável) e no
   bloco de renderização correspondente.
5. Atualize `docs/ARCHITECTURE.md` e `docs/SPRINTS.md`.

---

## Como adicionar uma view ao shell do professor

Mesmo fluxo, porém em `src/features/teacher/TeacherShell.jsx` usando
`TeacherContext`, os itens de `SidebarItem` e o bloco de renderização por
`currentView`. Não há `IMMERSIVE_VIEWS` no shell do professor — todos os
módulos recebem padding padrão.

---

## Imports mais usados

```jsx
// Ícones — SEMPRE de lucide-react, verifique o nome em lucide.dev
import { Home, Bell, Star, CheckCircle2 } from 'lucide-react';

// Componentes compartilhados — de src/features/*/
import { AccountSettingsModal, AccountHelpModal } from '../../components/ProfileActionPanels.jsx';

import { RaioXSection, MentoriaView } from '../../components/StudentFeatures.jsx';

// Sessão
import { getStoredDemoSession, clearDemoSession } from '../../lib/demoSession.js';  // de src/features/*/
import TeacherShell from '../features/teacher/TeacherShell.jsx';                    // de src/pages/
```

| Importando de | Caminho para src/components/ | Caminho para src/lib/ |
|---------------|-----------------------------|-----------------------|
| `src/features/auth/` | `../../components/...` | `../../lib/...` |
| `src/features/student/` | `../../components/...` | `../../lib/...` |
| `src/features/teacher/` | `../../components/...` | `../../lib/...` |
| `src/features/assessments/` | `../../components/...` | `../../lib/...` |
| `src/features/ai-tools/` | `../../components/...` | `../../lib/...` |
| `src/pages/` | `../components/...` | `../lib/...` |

---

## O que NÃO fazer

- Não criar rotas novas em `src/routes/AppRoutes.jsx` para features que já cabem dentro de um shell.
- Não usar CSS modules, styled-components ou classes customizadas — **somente Tailwind**.
- Não chamar hooks fora do render de componentes (ex.: hook em event handler).
- Não remover o fluxo login-first sem alinhamento explícito.
- Não commitar com `eslint-disable` ou `@ts-ignore` sem justificativa no PR.
- Não adicionar dependências sem verificar se `lucide-react` ou `tailwindcss-animate`
  já cobrem o caso.

---

## Referências rápidas

| Preciso de... | Onde está |
|---------------|-----------|
| Regras de intervenção AI | `AGENTS.md` |
| Diagrama de arquitetura | `docs/ARCHITECTURE.md` |
| Backlog e sprint atual | `docs/SPRINTS.md` |
| Referência de libs | `docs/STACK.md` |
| Regras de PR | `CONTRIBUTING.md` |
