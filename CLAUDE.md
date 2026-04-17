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
├── 01-app-core/              # shells de produto e módulos de features
│   ├── aluno.jsx             # SHELL DO ALUNO — container principal (~1160 linhas)
│   ├── professor.jsx         # SHELL DO PROFESSOR — container principal (~1000 linhas)
│   ├── nova-tela-login.jsx   # tela de login (integrada via LoginPage)
│   ├── aprovacao-fuvest.jsx  # módulo: estratégia FUVEST
│   ├── calendario.jsx        # módulo: calendário (usa date-fns)
│   ├── cronograma.jsx        # módulo: grade semanal editável
│   ├── discursiva-ia.jsx     # módulo: redação discursiva com IA
│   ├── leituras.jsx          # módulo: obras obrigatórias FUVEST
│   ├── medidor-de-humor.jsx  # módulo: tracker emocional
│   ├── pomodoro.jsx          # módulo: timer Pomodoro
│   ├── prof-planejador-de-aulas.jsx  # módulo: planejador docente
│   ├── redacao-ia-fuvest.jsx # módulo: feedback de redação FUVEST
│   ├── rede-de-apoio.jsx     # módulo: rede de suporte
│   ├── revisoes.jsx          # módulo: revisões espaçadas
│   ├── simulador-tri.jsx     # módulo: simulador de nota TRI
│   ├── simulados.jsx         # módulo: tracker de simulados
│   ├── tutoria-ia.jsx        # módulo: tutoria com IA (chat)
│   └── tutoria.jsx           # módulo: mentoria com ex-alunos
│
├── src/
│   ├── App.jsx               # roteador React Router
│   ├── main.jsx              # bootstrap React DOM
│   ├── index.css             # fontes (Fraunces + Manrope) + base dark
│   ├── components/
│   │   ├── ProfileActionPanels.jsx  # modais de configurações e ajuda
│   │   └── StudentFeatures.jsx      # RaioXSection + MentoriaView
│   ├── lib/
│   │   ├── demoSession.js    # gerência de sessão demo (localStorage)
│   │   ├── launchExperience.js  # config da tela de boas-vindas por perfil
│   │   └── pageLoaders.js    # preload dos shells
│   └── pages/
│       ├── LoginPage.jsx     # wrapper: lida com autenticação demo
│       ├── StudentShellPage.jsx  # wrapper: lê sessão + query params
│       └── TeacherShellPage.jsx  # wrapper: lê sessão + query params
│
├── docs/
│   ├── ARCHITECTURE.md       # design do sistema, diagrama de fluxo
│   ├── SPRINTS.md            # kanban e backlog de sprints
│   └── STACK.md              # referência por biblioteca
│
├── AGENTS.md                 # LEIA ANTES DE QUALQUER INTERVENÇÃO
├── CLAUDE.md                 # este arquivo
├── CONTRIBUTING.md           # regras de contribuição humana
└── README.md                 # visão geral pública do projeto
```

---

## Arquitetura em duas camadas

```
src/          →  integração: roteamento, sessão, wrappers de página
01-app-core/  →  produto: shells, views inline, módulos lazy-loaded
```

`src/` não contém lógica de produto. `01-app-core/` não conhece o roteador.
A comunicação é feita via props (`initialView`, `session`, `onLogout`) que os
wrappers em `src/pages/` injetam nos shells.

---

## Fluxo de runtime

```
src/main.jsx
  └── BrowserRouter + App.jsx (routes)
        ├── /login   → LoginPage → nova-tela-login.jsx
        │                └── handleLogin() → buildDemoSession() → navigate(/aluno)
        ├── /aluno   → StudentShellPage
        │                └── aluno.jsx (AppProvider + Layout)
        └── /professor → TeacherShellPage
                         └── professor.jsx (TeacherProvider + TeacherLayout)
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

// Componentes compartilhados
import { AccountSettingsModal, AccountHelpModal } from '../src/components/ProfileActionPanels.jsx';
import { RaioXSection, MentoriaView } from '../src/components/StudentFeatures.jsx';

// Sessão (use só em src/pages/)
import { getStoredDemoSession, clearDemoSession } from '../src/lib/demoSession.js';
```

Caminhos relativos a partir de `01-app-core/`: `../src/...`
Caminhos relativos a partir de `src/components/`: `../lib/...`, `../../01-app-core/...`

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
