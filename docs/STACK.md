# Stack Reference — Sinapse

Referência técnica de cada biblioteca usada. Para cada uma: versão, como é
usada no projeto, padrões adotados e o que evitar.

---

## React 19

**Versão:** 19.2.5 | **Docs:** react.dev

### Como é usado
- Functional components exclusivamente. Zero class components.
- `createContext` + `useContext` para estado compartilhado dentro de cada shell.
- `lazy()` + `<Suspense>` para code splitting dos módulos de feature.
- Hooks: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback` (conforme necessário).

### Padrões adotados

```jsx
// Context pattern (AppContext em StudentShell.jsx, TeacherContext em TeacherShell.jsx)
const AppContext = createContext();
const AppProvider = ({ children, initialView }) => { ... };
const useApp = () => useContext(AppContext); // hook de acesso

// Lazy loading de módulo de feature
const CalendarView = lazy(() => import('./CalendarView.jsx'));

// Suspense com fallback mínimo
<Suspense fallback={<div className="...">Carregando módulo...</div>}>
  {currentView === 'calendario' && <CalendarView />}
</Suspense>
```

### O que evitar
- `useEffect` para sincronizar estado derivado (use `useMemo` ou cálculo direto no render).
- Mutação direta de estado (`state.items.push(x)` → use spread ou `.map()`).
- Dependências ausentes ou excessivas no array de `useEffect`.
- `forwardRef` sem necessidade real.

---

## Vite 8

**Versão:** 8.0.8 | **Docs:** vitejs.dev

### Como é usado
- Dev server com HMR em `http://localhost:5173`.
- Build de produção com tree-shaking e code splitting automático.
- `@vitejs/plugin-react` para suporte a JSX/Fast Refresh.

### Configuração atual (`vite.config.js`)
Configuração mínima com o plugin React. Sem aliases, sem proxies, sem env vars customizadas.

### Comandos
```bash
npm run dev      # inicia dev server
npm run build    # build de produção em /dist
npm run preview  # preview do /dist em localhost
```

### O que evitar
- Não use `import.meta.env` sem definir a variável em `.env` (causará `undefined` em build).
- Não configure `base` no `vite.config.js` sem entender o impacto nas rotas do React Router.
- Não ignore warnings de "missing export" — eles viram erros em produção.

---

## React Router 7

**Versão:** 7.14.1 | **Docs:** reactrouter.com

### Como é usado
No projeto, o React Router cuida apenas do **roteamento entre shells**. A
navegação *dentro* de cada shell é gerenciada por estado local (`currentView`
em `AppContext` ou `TeacherContext`).

```
Rotas reais (React Router):
  /login        → LoginPage
  /aluno        → StudentShellPage
  /professor    → TeacherShellPage

Navegação interna (estado):
  AppContext.navigate('raio-x')  →  muda currentView → URL vira /aluno?view=raio-x
  TeacherContext.navigate('planner') → muda currentView → URL vira /professor?view=planner
```

### Query param sync
`StudentShellPage` lê `?view=` via `useSearchParams()`, resolve a sessão e injeta
`initialView` no shell. Quando a view pertence a outro slice (`ai-tools/` ou
`assessments/`), o wrapper também monta o mapa de lazy imports e o passa para
`StudentShell.jsx`. O shell não escreve diretamente na URL — o wrapper cuida
disso.

### O que evitar
- Não crie rotas novas em `src/routes/AppRoutes.jsx` para views internas dos shells. Use o sistema de
  `currentView`.
- Não use `useNavigate()` dentro dos shells — os shells não conhecem o roteador.
- Não use `<Link>` para navegação interna dos shells.

---

## Tailwind CSS 3

**Versão:** 3.4.17 | **Docs:** tailwindcss.com

### Como é usado
**100% das classes de estilo são Tailwind.** Sem CSS modules, sem styled-components,
sem CSS-in-JS. A única exceção é `pb-safe` definida em `src/index.css` para
safe area em mobile.

### Content paths configurados (`tailwind.config.js`)
```js
content: [
  './index.html',
  './src/**/*.{js,jsx}',
  './legacy/**/*.{js,jsx}',        // ← mantido por compatibilidade enquanto o diretório existir
]
```

Se criar código fora de `src/` ou fora dos caminhos já cobertos, adicione o
glob correspondente aqui.

### Plugins
`tailwindcss-animate` — fornece utilitários `animate-in`, `fade-in`, `zoom-in-95`,
`slide-in-from-bottom-4`, etc. usados nas animações de entrada das views.

### Padrões adotados

```jsx
// Classes condicionais com template literal
className={`flex items-center ${isActive ? 'text-blue-600' : 'text-slate-400'}`}

// Animação de entrada de view
<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

// Glassmorphism (Card padrão)
className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl"

// Safe area mobile
className="pb-safe"   // definida em index.css como padding-bottom: env(safe-area-inset-bottom)
```

### Escala de cores do projeto
Ver `CLAUDE.md → Identidade visual`. Em resumo: `blue-900` (aluno primário),
`yellow-400` (aluno acento), `indigo-600` (professor).

### O que evitar
- Valores arbitrários sem necessidade: `text-[#1e293b]` → use `text-slate-800`.
- `@apply` para criar abstrações — use componentes React.
- Misturar `hover:` com `:hover` em CSS customizado.
- Classes longas não divididas em múltiplas linhas (dificulta leitura e review).

---

## Lucide React

**Versão:** 1.8.0 | **Docs:** lucide.dev

### Como é usado
Todos os ícones do projeto. Zero SVGs inline, zero imagens de ícone.

```jsx
import { Bell, Star, CheckCircle2, Settings2 } from 'lucide-react';

<Bell size={20} className="text-slate-500" />
<Star size={16} className="text-yellow-400 fill-yellow-400" />
```

### Tamanhos padrão por contexto

| Contexto | `size` |
|----------|--------|
| Navegação lateral | 20 |
| Header / notificações | 20 |
| Cards KPI | 24 |
| Modais (header) | 18 |
| Badges / inline | 14–16 |
| Ilustração / empty state | 48–56 |

### Ícones usados no projeto (referência rápida)

```
Home, Activity, Calendar, Clock, BookOpen, RotateCcw, CheckSquare,
TrendingUp, Menu, X, Bell, Zap, Play, Search, CheckCircle2, AlertCircle,
Clock3, ChevronRight, BookMarked, Target, BarChart2, FileText, PenTool,
Heart, HeartHandshake, Users, Sparkles, Settings, Settings2, HelpCircle,
LogOut, Star, Mail, Copy, Check, Send, Award, GraduationCap, Briefcase,
MessageSquare, TrendingUp, Activity
```

### O que evitar
- Nomes inexistentes: `CheckCircle` existe, mas `CheckCircleFill` não.
- Importar o pacote inteiro (`import * as Icons`).
- Usar `className="fill-current"` em ícones outline (muda o visual).

---

## Framer Motion

**Versão:** 12.38.0 | **Docs:** framer.com/motion

### Como é usado
**Atualmente subutilizado.** O projeto usa `tailwindcss-animate` para a maioria
das animações de entrada. Framer Motion está disponível para animações mais
complexas (transições de layout, drag, gestures).

### Quando usar
- Animações de layout (`<AnimatePresence>` + `<motion.div layout>`).
- Transições de entrada/saída com spring physics.
- Gestures (drag, hover com spring).

### Quando NÃO usar
- Animações simples de fade/slide de entrada — use `animate-in` do Tailwind.
- Toggle de visibilidade — use conditional rendering + `animate-in`.

### Exemplo de uso quando necessário
```jsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

---

## Recharts

**Versão:** 3.8.1 | **Docs:** recharts.org

### Como é usado
Disponível para gráficos mais complexos (ex.: linha de progresso ao longo do tempo,
radar de diagnóstico por área). Ainda não utilizado amplamente — o projeto prefere
barras simples em Tailwind (ver `RaioXSection` em `StudentFeatures.jsx`).

### Quando usar
- Série temporal (progresso ao longo de semanas/meses).
- Radar chart (diagnóstico multidimensional).
- Quando os dados têm > 5 pontos e precisam de legenda e tooltip.

### Quando NÃO usar
- Listas rankeadas simples → use barra Tailwind (`<div style={{ width: '85%' }}`).
- KPI único → use número grande com label.
- Comparação binária → use progress bar.

### Componentes mais úteis para o contexto educacional
```jsx
import { LineChart, Line, BarChart, Bar, RadarChart, Radar,
         XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sempre envolva em ResponsiveContainer para responsividade
<ResponsiveContainer width="100%" height={200}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="semana" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="acertos" stroke="#3b82f6" />
  </LineChart>
</ResponsiveContainer>
```

---

## date-fns

**Versão:** 4.1.0 | **Docs:** date-fns.org

### Como é usado
Manipulação de datas nos módulos de Calendário e Cronograma. Também usado para
calcular dias até o ENEM/FUVEST.

### Imports mais comuns no projeto
```js
import { format, addDays, differenceInDays, isToday, isBefore, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

format(new Date(), "d 'de' MMMM", { locale: ptBR }) // "17 de abril"
differenceInDays(new Date('2026-11-08'), new Date())  // dias até o ENEM
```

### Importante
`date-fns` não faz timezone awareness por padrão. Se comparar datas de vestibular
(que são datas fixas, sem hora), sempre construa com `new Date(YYYY, MM-1, DD)` para
evitar off-by-one de UTC vs horário local.

---

## Fontes (Google Fonts)

Definidas em `src/index.css` via `@import`:

| Fonte | Uso | Pesos carregados |
|-------|-----|-----------------|
| `Fraunces` (serif) | Headings de destaque, banners | 500, 600, 700 |
| `Manrope` (sans-serif) | Corpo de texto, labels, UI | 400, 600, 700, 800 |

A fonte de UI padrão do Tailwind (`font-sans`) aponta para `Manrope` via
`font-family` no `:root` de `index.css`. Use `font-serif` (ou classe customizada)
para `Fraunces` em headings de impacto.
