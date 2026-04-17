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
├── 01-app-core/              # LEGADO — sendo drenado para src/features/ (Sprint Arq)
│   ├── aluno.jsx             # → features/student/StudentShell.jsx (pendente SA-1.5)
│   ├── professor.jsx         # → features/teacher/TeacherShell.jsx (pendente SA-2.2)
│   ├── aprovacao-fuvest.jsx  # → features/assessments/FuvestApproval.jsx
│   ├── calendario.jsx        # → features/student/Calendar.jsx
│   ├── cronograma.jsx        # → features/student/Schedule.jsx
│   ├── discursiva-ia.jsx     # → features/ai-tools/DiscursiveAI.jsx
│   ├── leituras.jsx          # → features/student/Readings.jsx
│   ├── medidor-de-humor.jsx  # → features/student/MoodTracker.jsx
│   ├── pomodoro.jsx          # → features/student/Pomodoro.jsx
│   ├── prof-planejador-de-aulas.jsx  # → features/teacher/LessonPlanner.jsx
│   ├── redacao-ia-fuvest.jsx # → features/ai-tools/EssayReview.jsx
│   ├── rede-de-apoio.jsx     # → features/student/SupportNetwork.jsx
│   ├── revisoes.jsx          # → features/student/Revisions.jsx
│   ├── simulador-tri.jsx     # → features/assessments/TriSimulator.jsx
│   ├── simulados.jsx         # → features/assessments/Simulados.jsx
│   ├── tutoria-ia.jsx        # → features/ai-tools/Tutoria.jsx
│   └── tutoria.jsx           # → features/student/Mentorship.jsx
│
├── src/
│   ├── App.jsx               # provider host — renderiza <AppRoutes /> apenas
│   ├── main.jsx              # createRoot + BrowserRouter
│   ├── index.css             # fontes (Fraunces + Manrope) + base dark
│   ├── components/           # componentes presentacionais compartilhados (named exports)
│   │   ├── ProfileActionPanels.jsx
│   │   └── StudentFeatures.jsx
│   ├── features/             # domínios de produto (Feature-Sliced Design)
│   │   └── auth/
│   │       └── Login.jsx     # ✅ migrado de nova-tela-login.jsx
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

> **Não crie arquivos novos em `01-app-core/`.** Novos módulos vão em `src/features/{domínio}/`.

---

## Arquitetura (estado atual — Sprint Arq em progresso)

```
src/routes/   →  configuração declarativa de rotas (AppRoutes.jsx)
src/features/ →  domínios de produto (Feature-Sliced Design) — crescendo
src/pages/    →  entry points de rotas: orquestram features + libs
src/components/ → componentes presentacionais compartilhados
src/lib/      →  sessão, experiência de lançamento, preload
01-app-core/  →  LEGADO: shells + módulos aguardando migração para src/features/
```

`src/features/*` não importa de `src/pages/` nem de outros feature slices.
`01-app-core/` não importa de `src/pages/` nem de `src/features/`.

---

## Fluxo de runtime

```
src/main.jsx  (createRoot + BrowserRouter)
  └── App.jsx  (provider host)
        └── routes/AppRoutes.jsx
              ├── /  /login   → LoginPage → features/auth/Login.jsx
              │                  └── handleLogin() → buildDemoSession() → navigate(/aluno)
              ├── /aluno/*    → StudentShellPage
              │                  └── 01-app-core/aluno.jsx  (pendente SA-1.5)
              └── /professor/* → TeacherShellPage
                                  └── 01-app-core/professor.jsx  (pendente SA-2.2)
```

Navegação interna aos shells **não usa React Router**: usa `AppContext.navigate(view)`
que atualiza `currentView` no estado local, refletido em `?view=` pelo wrapper.

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

### Primitivos reutilizáveis (definidos em `aluno.jsx`)

```jsx
<Card className="...">           // bg-white/80 backdrop-blur-md, rounded-2xl
<ProgressBar progress={85} colorClass="bg-blue-500" />
```

### Modais (em `ProfileActionPanels.jsx`)

```jsx
<AccountSettingsModal open={bool} onClose={fn} profile="student" userName="..." />
<AccountHelpModal     open={bool} onClose={fn} profile="student" userName="..." />
```

O `ModalFrame` interno já lida com: `max-h-[90vh]`, `overflow-y-auto`, Escape key, body scroll lock.

### Views imersivas (full-screen)

Módulos em `IMMERSIVE_VIEWS` (Set em `aluno.jsx`) recebem a área de conteúdo sem
padding. Para adicionar banner/header a um módulo imersivo, use `position: sticky top-0`
(ver `MentoriaView` em `src/components/StudentFeatures.jsx` como referência).

---

## Como adicionar uma view ao shell do aluno

1. Crie o módulo em `01-app-core/nome-modulo.jsx` com um `export default`.
2. Lazy-importe no topo de `aluno.jsx`:
   ```jsx
   const MeuModulo = lazy(() => import('./nome-modulo.jsx'));
   ```
3. Adicione a entrada em `VIEW_TITLES` (string localizada).
4. Adicione um item em `NAVIGATION_SECTIONS` (com icon Lucide e label).
5. Se for imersivo, adicione o id em `IMMERSIVE_VIEWS`.
6. Adicione o condicional no bloco `<Suspense>`:
   ```jsx
   {currentView === 'meu-modulo' && <MeuModulo />}
   ```
7. Atualize `docs/ARCHITECTURE.md` e `docs/SPRINTS.md`.

---

## Como adicionar uma view ao shell do professor

Mesmo fluxo, porém em `professor.jsx` usando `TeacherContext` e
`TEACHER_NAVIGATION_SECTIONS`. Não há `IMMERSIVE_VIEWS` no shell do professor —
todos os módulos recebem padding padrão.

---

## Imports mais usados

```jsx
// Ícones — SEMPRE de lucide-react, verifique o nome em lucide.dev
import { Home, Bell, Star, CheckCircle2 } from 'lucide-react';

// Componentes compartilhados — de qualquer camada:
import { AccountSettingsModal, AccountHelpModal } from '../src/components/ProfileActionPanels.jsx'; // de 01-app-core/
import { AccountSettingsModal, AccountHelpModal } from '../../components/ProfileActionPanels.jsx';  // de src/features/*/

import { RaioXSection, MentoriaView } from '../src/components/StudentFeatures.jsx'; // de 01-app-core/
import { RaioXSection, MentoriaView } from '../../components/StudentFeatures.jsx';  // de src/features/*/

// Sessão (use só em src/pages/ ou src/features/)
import { getStoredDemoSession, clearDemoSession } from '../src/lib/demoSession.js'; // de 01-app-core/
import { getStoredDemoSession, clearDemoSession } from '../../lib/demoSession.js';  // de src/features/*/
```

| Importando de | Caminho para src/components/ | Caminho para src/lib/ |
|---------------|-----------------------------|-----------------------|
| `01-app-core/` | `../src/components/...` | `../src/lib/...` |
| `src/features/auth/` | `../../components/...` | `../../lib/...` |
| `src/features/student/` | `../../components/...` | `../../lib/...` |
| `src/pages/` | `../components/...` | `../lib/...` |

---

## O que NÃO fazer

- Não criar rotas novas em `App.jsx` para features que já cabem dentro de um shell.
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
