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
| O módulo ainda está em `01-app-core/`? | `ls 01-app-core/` |
| Algum componente de `src/components/` já resolve o problema? | `src/components/` |
| O ícone que preciso existe no Lucide? | Consulte `lucide.dev` ou `grep -r "from 'lucide-react'" src/` |
| A mudança quebra algum import existente? | Verifique `import` e `export default` no arquivo alvo |
| O sprint atual prevê esta mudança? | `docs/SPRINTS.md` → Sprint Arq |

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
| Arquivo módulo (legado 01-app-core/) | kebab-case | `aprovacao-fuvest.jsx` |
| Arquivo componente React | PascalCase | `StudentFeatures.jsx`, `Login.jsx` |
| Arquivo componente migrado (src/features/) | PascalCase **em inglês** | `FuvestApproval.jsx`, `MoodTracker.jsx` |
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

# Arquivos ainda em 01-app-core/ (legado)
from 01-app-core/               →  ../src/components/...  ../src/lib/...
```

Regras absolutas:
- `01-app-core/` nunca importa de `src/pages/` ou `src/features/`.
- `src/lib/` nunca importa de `01-app-core/` ou `src/features/`.
- `src/features/*` nunca importa diretamente de outro feature slice.

---

## 5. Intervenção: adicionar view ao shell do aluno

Execute exatamente nesta ordem:

```bash
# Passo 0: verifique se o módulo já existe
ls 01-app-core/ | grep nome-do-modulo
```

```jsx
// Passo 1: crie 01-app-core/nome-modulo.jsx
export default function NomeModulo() {
  return <div>...</div>;
}

// Passo 2: lazy-importe em aluno.jsx (junto aos outros lazy imports, no topo)
const NomeModulo = lazy(() => import('./nome-modulo.jsx'));

// Passo 3: adicione em VIEW_TITLES (aluno.jsx)
'nome-modulo': 'Label Localizada',

// Passo 4: adicione em NAVIGATION_SECTIONS (aluno.jsx)
{ id: 'nome-modulo', icon: IconeLucide, label: 'Label Localizada' },

// Passo 5 (se imersivo): adicione em IMMERSIVE_VIEWS (aluno.jsx)
const IMMERSIVE_VIEWS = new Set(['...', 'nome-modulo']);

// Passo 6: adicione no bloco Suspense (aluno.jsx)
{currentView === 'nome-modulo' && <NomeModulo />}
```

Atualize `docs/ARCHITECTURE.md` (lista de views do student shell) e
`docs/SPRINTS.md` (mova o item de In Progress para Done).

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
import { ModalFrame } from '../src/components/ProfileActionPanels.jsx'; // se extraído
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
