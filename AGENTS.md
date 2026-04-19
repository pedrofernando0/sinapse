# Agents.md — Paradigmas Técnicos para Intervenções de IA

Este documento define **como** um agente de IA deve raciocinar e agir sobre o
repositório Sinapse. Leia antes de qualquer modificação. As regras aqui são
prescritivas, não sugestivas.

---

## 0. Protocolo de pré-voo

Antes de escrever uma linha de código, responda mentalmente às perguntas abaixo.
Se alguma resposta for "não sei", leia o arquivo indicado antes de continuar.

| Pergunta | Onde buscar resposta |
|----------|---------------------|
| Qual shell recebe a feature? | `docs/ARCHITECTURE.md` → seção Student/Teacher shell |
| O arquivo já foi migrado para `src/features/`? | `docs/ARCHITECTURE.md` → Migration naming map |
| O módulo ainda está em `legacy/`? | `ls legacy/` |
| Algum componente de `src/components/` já resolve o problema? | `src/components/` |
| O ícone que preciso existe no Lucide? | Consulte `lucide.dev` ou `grep -r "from 'lucide-react'" src/` |
| A mudança quebra algum import existente? | Verifique `import` e `export default` no arquivo alvo |
| O backlog atual prevê esta mudança? | `docs/SPRINTS.md` → Board atual / Backlog por sprint |

---

## 1. Taxonomia de intervenções

Classifique cada mudança antes de executá-la. O nível determina o escopo
permitido dos arquivos tocados.

### Nível 1 — Cosmético
**Exemplos:** cor, espaçamento, texto, ícone, ajuste de Tailwind.

- Toque apenas o arquivo alvo.
- Não extraia componentes.
- Commit único, mensagem: `style: <descrição concisa>`.

### Nível 2 — Funcional
**Exemplos:** novo estado, handler, lógica de animação, toggle, validação.

- Toque o arquivo alvo e, se necessário, um componente em `src/components/`.
- Se a lógica tiver > 30 linhas, extraia uma função pura (não um componente).
- Commit único ou dois commits logicamente separados.
- Mensagem: `feat: <descrição>` ou `fix: <descrição>`.

### Nível 3 — Estrutural
**Exemplos:** novo módulo (view) no shell, extração de componente, nova seção de navegação.

- Siga o passo-a-passo de "Como adicionar uma view" em `CLAUDE.md`.
- Atualize `VIEW_TITLES`, `NAVIGATION_SECTIONS`, `docs/ARCHITECTURE.md`.
- Se criar arquivo novo em `src/components/`, adicione `export` nomeado (não default).
- Commit separado para o novo arquivo + commit para a integração no shell.

### Nível 4 — Arquitetural
**Exemplos:** novo contexto React, mudança de roteamento, nova camada de dados, refactor de shell.

- **Abra uma discussão antes de executar** (comentário no PR ou issue).
- Mapeie todos os arquivos afetados antes de tocar qualquer um.
- Não misture mudanças arquiteturais com features no mesmo PR.
- Atualize `docs/ARCHITECTURE.md` no mesmo commit da mudança.

### Nível 5 — Ruptura
**Exemplos:** remover login-first flow, trocar React Router por outra lib, migrar para Next.js.

- Requer aprovação explícita do mantenedor (`plfonseca@usp.br`).
- Nenhum agente deve executar intervenções nível 5 de forma autônoma.

---

## 2. Regras de estilo de código

### Comentários
Escreva zero comentários por padrão. Adicione um comentário **somente** quando
o PORQUÊ não for óbvio para um leitor que conhece React + Tailwind:

```jsx
// ❌ desnecessário — o código já diz isso
// Renderiza o card de progresso
const ProgressCard = ...

// ✅ necessário — comportamento não óbvio
// date-fns não suporta timezone; forçamos UTC aqui para evitar
// off-by-one na comparação de datas do vestibular
const today = new Date(Date.UTC(...))
```

Nunca escreva comentários como `// TODO`, `// FIXME`, `// added for X`, `// used by Y`.
Esses pertencem ao histórico de commits e ao backlog, não ao código.

### Tailwind
- **Zero CSS externo**. Nenhuma classe customizada em `index.css` exceto as já
  definidas (`pb-safe`).
- Use `cn()` / concatenação de template string para classes condicionais.
- Prefira classes Tailwind semânticas (`text-slate-800`) sobre valores arbitrários
  (`text-[#1e293b]`) exceto quando o design exige um valor exato não coberto pela
  escala padrão.
- Não use `@apply` para criar abstrações CSS — use componentes React.

### Estrutura de componente
Ordem padrão dentro de um componente funcional:

```jsx
const MeuComponente = ({ propA, propB }) => {
  // 1. context / refs
  const { navigate } = useApp();
  const ref = useRef(null);

  // 2. state
  const [open, setOpen] = useState(false);

  // 3. derived / memo
  const label = useMemo(() => ..., [propA]);

  // 4. effects
  useEffect(() => { ... }, [dep]);

  // 5. handlers
  const handleClick = () => { ... };

  // 6. render
  return ( ... );
};
```

### Nomes
| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componente | PascalCase | `RaioXSection` |
| Hook customizado | `use` + PascalCase | `useNotifAnimation` |
| Handler | `handle` + evento | `handleMarkAllRead` |
| Variável booleana | `is/has/show/can` + substantivo | `isImmersiveView` |
| Constante de dado | SCREAMING_SNAKE_CASE | `INITIAL_STUDENT_NOTIFICATIONS` |
| Arquivo componente React | PascalCase | `StudentFeatures.jsx`, `Login.jsx` |
| Arquivo componente migrado (src/features/) | PascalCase **em inglês** | `CalendarView.jsx`, `MoodTracker.jsx` |
| Diretório de feature | lowercase inglês | `auth`, `student`, `ai-tools` |

---

## 3. Gerenciamento de estado

### Quando usar cada primitivo

| Situação | Primitivo |
|----------|-----------|
| Estado local de UI (open/close, valor de input) | `useState` |
| Estado compartilhado dentro de um shell | Context (`AppContext` / `TeacherContext`) |
| Ref para DOM ou timer | `useRef` |
| Valor derivado com custo computacional | `useMemo` |
| Side-effect com dependências | `useEffect` |
| Estado global cross-shell | **Não existe ainda** — não crie sem discussão |

### Não faça

- Não eleve estado para o contexto sem necessidade. Se só um componente usa, `useState` local.
- Não use `useReducer` para estados simples boliganos. `useState` é suficiente.
- Não use `useEffect` para sincronizar estado derivado — use `useMemo` ou calcule no render.
- Não coloque lógica de negócio dentro de JSX. Extraia para um handler ou um memo.

---

## 4. Padrões de importação

### Ícones Lucide

```jsx
// ✅ importe somente o que usar, pelo nome exato
import { Bell, CheckCircle2, Star, AlertCircle } from 'lucide-react';

// ❌ nunca importe o módulo inteiro
import * as Icons from 'lucide-react';
```

Verifique o nome exato em `lucide.dev` antes de usar. Ícones inexistentes causam
`Element type is invalid` em runtime sem stacktrace útil.

Convenção de nomes de ícones que geram confusão:

| Intenção | Nome correto |
|----------|-------------|
| Check dentro de círculo | `CheckCircle2` (outline) ou `CheckCircle` (filled) |
| Engrenagem | `Settings2` (mais bonita) ou `Settings` |
| Cadeado aberto | `LockOpen` |
| Estrela preenchida | `Star` com `fill="currentColor"` |

### Lazy loading de módulos

```jsx
// Módulo que exporta default:
const MeuModulo = lazy(() => import('./meu-modulo.jsx'));

// Módulo que exporta named:
const MeuModulo = lazy(() =>
  import('./meu-modulo.jsx').then(m => ({ default: m.NomeExportado }))
);
```

Todos os módulos lazy precisam estar dentro de um `<Suspense>`. O fallback padrão
do shell já está configurado — não crie Suspense redundante.

### Imports cross-layer

```
# Arquivos já migrados para src/features/
from src/features/auth/         →  ../../components/...   ../../lib/...
from src/features/student/      →  ../../components/...   ../../lib/...
from src/features/teacher/      →  ../../components/...   ../../lib/...
from src/features/ai-tools/     →  ../../components/...   ../../lib/...
from src/features/assessments/  →  ../../components/...   ../../lib/...

# Camadas de integração
from src/pages/                 →  ../features/...         ../lib/...
from src/routes/                →  ../pages/...
from src/components/            →  ../lib/...
```

Regras absolutas:
- `src/lib/` nunca importa de `legacy/` ou `src/features/`.
- `src/features/*` nunca importa diretamente de outro feature slice.
- Orquestração cross-slice para shells acontece em `src/pages/*ShellPage.jsx`,
  não dentro de `src/features/*`.

---

## 5. Intervenção: adicionar view ao shell do aluno

Execute exatamente nesta ordem:

```bash
# Passo 0: verifique se o módulo já existe
rg --files src/features | grep NomeModulo
```

```jsx
// Passo 1: defina o slice correto da view
// student/ se for domínio do aluno
// assessments/ ou ai-tools/ se a view pertencer a esses domínios

// Passo 2a: se a view ficar em src/features/student/, crie o módulo
export default function NomeModulo() {
  return <div>...</div>;
}

// Passo 2b: se a view ficar em src/features/student/,
// lazy-importe em StudentShell.jsx
const NomeModulo = lazy(() => import('./NomeModulo.jsx'));

// Passo 2c: se a view ficar em assessments/ ou ai-tools/,
// lazy-importe em src/pages/StudentShellPage.jsx
const NomeModuloView = lazy(() => import('../features/assessments/NomeModulo.jsx'));

const STUDENT_SHELL_EXTERNAL_VIEWS = {
  NomeModuloView,
};

// Passo 3: adicione em VIEW_TITLES (StudentShell.jsx)
'nome-modulo': 'Label Localizada',

// Passo 4: adicione em NAVIGATION_SECTIONS (StudentShell.jsx)
{ id: 'nome-modulo', icon: IconeLucide, label: 'Label Localizada' },

// Passo 5 (se imersivo): adicione em IMMERSIVE_VIEWS (StudentShell.jsx)
const IMMERSIVE_VIEWS = new Set(['...', 'nome-modulo']);

// Passo 6a: se a view ficou em src/features/student/,
// adicione no bloco Suspense / renderização (StudentShell.jsx)
{currentView === 'nome-modulo' && <NomeModulo />}

// Passo 6b: se a view foi injetada via StudentShellPage.jsx,
// use a referência recebida em externalViews
{currentView === 'nome-modulo' && NomeModuloView && <NomeModuloView />}
```

Atualize `docs/ARCHITECTURE.md` (lista de views do student shell) e
`docs/SPRINTS.md` (atualize o status pendente ou remova o item concluído do backlog).

---

## 6. Intervenção: extrair componente para `src/components/`

Extraia para `src/components/` quando **todas** as condições abaixo forem verdadeiras:

1. O componente é usado em mais de um arquivo de shell **ou** tem > 80 linhas de JSX.
2. Não depende de estado interno do shell (ou aceita tudo via props).
3. Tem uma responsabilidade bem definida (ex.: `RaioXSection`, `MentoriaView`).

Use **export nomeado** (não default) em componentes de `src/components/`:

```jsx
// ✅ export nomeado — permite vários exports por arquivo relacionado
export const MeuComponente = () => { ... };

// ❌ evite default em src/components/ — dificulta tree-shaking e auto-import
export default MeuComponente;
```

---

## 7. Intervenção: modificar um modal

Todos os modais do produto usam `ModalFrame` de `ProfileActionPanels.jsx`.
Ele já fornece: overlay, bordas arredondadas, gradiente de header, Escape key,
body scroll lock e `max-h-[90vh] overflow-y-auto`.

Para criar um modal novo:

```jsx
import { ModalFrame } from '../../components/ProfileActionPanels.jsx'; // de src/features/*
// ou defina um ModalFrame local usando o mesmo padrão structural
```

Regra: **todo modal deve ter um botão de fechar visível** (X no canto superior direito)
e **fechar com Escape**. O `ModalFrame` já garante isso — não reimplemente.

---

## 8. Mock data

Dados mockados ficam no arquivo de shell ou no componente mais próximo. Não crie
arquivos `*.json` ou `mockData.js` avulsos — o padrão atual é constantes no topo
do arquivo que as usa.

```jsx
// ✅ constante no topo do arquivo, nome em SCREAMING_SNAKE_CASE
const INITIAL_STUDENT_NOTIFICATIONS = [ ... ];

// ❌ arquivo separado sem necessidade
import { notifications } from '../data/notificationsMock.js';
```

Quando um dado for usado em mais de dois arquivos, aí sim vale criar
`src/lib/mockData.js`. Até lá, mantenha-o local.

---

## 9. Branding — enforcement

O agente é responsável por manter a consistência visual. Antes de usar qualquer
cor, consulte a tabela em `CLAUDE.md → Identidade visual`.

Checklist rápido:
- [ ] Novos botões primários do aluno usam `bg-blue-900 hover:bg-blue-800`?
- [ ] Acentos do aluno usam `yellow-400` / `yellow-50` (não `amber`, não `orange`)?
- [ ] Gradientes de header/banner do aluno são `from-blue-950 via-blue-900 to-blue-800`?
- [ ] Professor usa `indigo-600` / `indigo-700` (não `blue`, não `violet`)?
- [ ] Ícones de status seguem: teal=sucesso, orange=atenção, red=perigo?

---

## 10. Protocolo de verificação pós-mudança

Execute mentalmente (ou literalmente) antes de cada commit:

```
1. npm run build                  → zero erros de import/JSX
2. Grep por RaioXView, raioXData  → zero ocorrências de artefatos removidos
3. Grep por useApp() em handlers  → hooks só no corpo de componentes
4. Grep por "export default" em   → src/components/ usa export nomeado
   src/components/
5. Grep por "TODO\|FIXME\|console.log" → zero no código commitado
```

---

## 11. Git discipline

### Branch naming
```
claude/<descricao-kebab>-<token-curto>   # para agentes AI
feat/<descricao-kebab>                    # para humanos
fix/<descricao-kebab>
docs/<descricao-kebab>
refactor/<descricao-kebab>
```

### Commit messages (Conventional Commits)
```
<tipo>(<escopo opcional>): <descrição imperativa em português>

feat(aluno): adiciona view de cronograma adaptativo
fix(modais): corrige overflow no modal de configurações em mobile
style(branding): aplica paleta azul-marinho no shell do aluno
refactor(raio-x): extrai RaioXSection para src/components/StudentFeatures
docs: atualiza ARCHITECTURE.md com nova view de cronograma
```

Tipos permitidos: `feat`, `fix`, `style`, `refactor`, `docs`, `test`, `chore`.

### Push
```bash
git push -u origin <branch>   # sempre -u no primeiro push
```

Nunca force-push em `main`. Nunca commite `node_modules/`, `.env` ou arquivos de build.

---

## 12. Anti-patterns catalogados

| Anti-pattern | Por que evitar | Alternativa |
|--------------|---------------|-------------|
| `useApp()` dentro de event handler | Viola Rules of Hooks | Desestruture no corpo do componente |
| `import * as Icons from 'lucide-react'` | Tree-shaking não funciona | Importe apenas os ícones usados |
| CSS em `index.css` além do base | Conflita com Tailwind | Use classes Tailwind diretamente |
| `export default` em `src/components/` | Dificulta múltiplos exports | Use `export const` |
| `console.log` em código commitado | Polui o console do usuário | Remova antes do commit |
| `h-screen` dentro de módulo imersivo | Conflita com o container do shell | Use `h-full` ou deixe o layout fluir |
| Estado global para UI local | Over-engineering | `useState` local no componente |
| Fetch real em componente sem loading/error state | Experiência quebrada | Sempre trate loading e erro |
| Comentário explicando O QUÊ o código faz | Ruído | Renomeie variáveis/funções para ser auto-descritivo |

---

## 13. Quando parar e perguntar

Um agente deve pausar e solicitar confirmação humana quando:

- A mudança afeta o fluxo de autenticação / routing em `src/routes/AppRoutes.jsx`.
- A mudança remove ou renomeia uma rota existente.
- A mudança afeta mais de **4 arquivos** não relacionados entre si.
- O agente identificou um bug que requer remoção de funcionalidade existente.
- O código original parece propositalmente escrito de um jeito "estranho" — pode
  ser um workaround intencional.
- A tarefa requer uma dependência npm não listada em `package.json`.

---

## 14. Princípios de Execução Karpathy

- **Think Before Coding**: Não assuma premissas. Não esconda confusão. Explicite trade-offs antes de implementar.
- **Simplicity First**: Código mínimo para resolver o problema. Nenhuma flexibilidade especulativa não solicitada.
- **Surgical Changes**: Toque apenas no que for estritamente necessário. Não reformate ou refatore código adjacente.
- **Goal-Driven Execution**: Defina critérios de sucesso e divida a tarefa em passos verificáveis.


<claude-mem-context>
# Memory Context

# [sinapse] recent context, 2026-04-18 10:10pm GMT-3

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 26 obs (9,850t read) | 707,952t work | 99% savings

### Apr 18, 2026
34 9:03p 🟣 Vitest + Testing Library Configured for Sinapse
35 " 🟣 Supabase Client Integrated via shadcn CLI — sinapse
36 " 🔵 Sinapse Auth Layer — Demo-Only with VITE_DEMO_* Env Vars
39 " 🔵 Sinapse — Supabase Client Uses @supabase/ssr, Not supabase-js Directly
40 " ✅ shadcn Nova Preset CSS Variables Injected into src/index.css
41 " 🟣 Supabase Agent Skills Installed in sinapse Project Environment
42 9:06p 🔴 CSS Build Failure Fixed — @apply bg-background Removed, CSS vars Used Directly
43 " 🔵 Sinapse Build Succeeds with lightningcss Warnings — Non-Fatal
44 " 🔵 Supabase Agent Skills Install Cancelled Before Completion
48 9:07p 🔵 Sinapse — .git Directory is Read-Only in Codex Sandbox
51 9:08p 🔵 Codex Sandbox — git add Blocked Even After Branch Creation Succeeds
53 9:11p ✅ Sinapse — Sprint Changes Staged for Commit on Branch claude/configure-tests-supabase-r9k4
54 9:13p ✅ Sinapse — Sprint Commit Pushed to GitHub PR Branch
56 9:19p 🔵 Sinapse Sprint Backlog — Full Pending Work Inventory
58 9:20p 🔵 Sinapse Architecture — Complete File Inventory and SA-3.2 Gap Confirmed
59 9:22p 🔵 Sinapse Build and Test Status — Green Baseline Confirmed
60 " 🔵 TeacherShell.jsx — Same React Context Pattern as StudentShell, Both Need SA-3.2
61 " ⚖️ Sinapse Blueprint Plan Scope — Sprint Arq to Sprint 4, Supabase Backend
68 9:25p ⚖️ Sinapse Sprint 4 — Execution Plan Organized (5 Phases)
69 " 🔵 Sinapse App.jsx + AppRoutes.jsx — Full Routing Architecture Confirmed
71 9:26p 🔵 Sinapse Test Coverage Gap — Only 1 Test File Exists Across Entire src/
73 " 🔵 Login.jsx Has SSO Buttons (Google/Apple) as UI Stubs — Not Wired to Auth
75 " 🔵 Both Shells Use Local Context Providers — Sprint 3 Zustand Migration Target Mapped
77 9:28p 🔵 Login.jsx — "Esqueceu a senha?" Links to # (Dead Placeholder) + LLM Design Note in Loading Widget
78 9:31p 🟣 Sinapse — 6 New Test Files Written for Sprint 4 TDD RED Phase
79 " 🔵 Sinapse TDD RED Gate — 10 Failures Across 6 Suites Reveal Exact Implementation Gaps

Access 708k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>
