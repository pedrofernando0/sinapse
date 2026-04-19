# Stack reference — Sinapse

Este documento registra como cada biblioteca importante é usada no runtime
atual. A ideia não é listar tudo o que existe no `package.json`, mas mostrar o
que sustenta a aplicação e quais padrões o repositório espera.

## React 19

**Versão:** `19.2.5`

React continua sendo a base de renderização do projeto.

- Functional components exclusivamente.
- `lazy()` + `Suspense` para dividir os módulos dos shells.
- `AppErrorBoundary` envolve a árvore inteira em `src/App.jsx`.
- `AppContext` e `TeacherContext` ainda sustentam a navegação interna dos
  shells.

Evite:

- usar `useEffect` para sincronizar estado derivado;
- colocar lógica de dados direto no JSX;
- introduzir class components fora do error boundary existente.

## Vite 8

**Versão:** `8.0.8`

Vite é o bundler e o dev server do frontend.

- `npm run dev` sobe apenas a aplicação Vite.
- `npm run build` valida imports, JSX e gera o bundle de produção.
- `npm run preview` serve o build local.

Importante: o runtime `/api/*` não é servido automaticamente por Vite. Para
testar auth e dados reais durante o desenvolvimento, você precisa usar
`VITE_API_BASE_URL` apontando para um backend já publicado ou rodar o projeto
via `vercel dev`.

## React Router 7

**Versão:** `7.14.1`

O roteador só cuida das superfícies públicas e dos shells.

- `/` e `/login` renderizam `LoginPage`.
- `/aluno` e `/professor` passam pelos layouts autenticados.
- rotas legadas `/modulos/*` redirecionam para `?view=` no shell do aluno.

Os layouts saneiam `?view=` e evitam que uma sessão do aluno abra uma view
escondida ou que um professor entre no shell errado.

Evite criar uma rota nova para cada módulo interno do shell. A convenção do
projeto continua sendo `currentView`.

## Zustand 5

**Versão:** `5.0.8`

Zustand é o estado compartilhado já consolidado no runtime atual.

- `sessionSlice.js` guarda `authStatus`, `session`, `profileRecord` e
  `authUser`.
- `uiSlice.js` guarda o estado de sidebar dos dois shells.
- `src/lib/useAuth.js` hidrata o store e expõe as actions de auth.

Hoje o store cobre auth, sessão e UI básica. A navegação interna dos shells
ainda não migrou para cá.

## Supabase

**Bibliotecas:** `@supabase/ssr@0.10.2` e `@supabase/supabase-js@2.103.3`

Supabase já atende o runtime real de autenticação e parte do domínio do aluno.

### Browser

`src/lib/supabase/client.js` usa `createBrowserClient()` para:

- escutar `onAuthStateChange()`;
- atualizar a senha no fluxo de recuperação.

### Server

`src/server/api/supabase.js` usa `createServerClient()` para:

- ler cookies da sessão nos handlers de `/api`;
- escrever `set-cookie` de volta na response;
- falar com `profiles`, `student_notifications`, `student_revisions` e
  `student_mock_exams`.

### Migrations

O schema de runtime atual está em:

- `supabase/migrations/20260419015808_auth_runtime_v1.sql`

Esse arquivo cria `profiles`, tabelas do aluno, trigger de novo usuário,
índices e políticas RLS.

## Runtime `/api` em Vercel

O backend do projeto roda como função Vercel.

- `api/[...path].js` adapta o request Node da Vercel para `Request`.
- `src/server/api/router.js` resolve método e segmento de rota.
- `src/server/api/http.js` padroniza respostas e parsing.
- `src/services/api.js` usa `/api` como base padrão e mantém cache TTL de
  30 segundos para leituras.

`vercel.json` também reescreve qualquer deep link para `index.html`, o que
mantém o fluxo de confirmação de e-mail do Supabase em `/login?code=...`.

## Tailwind CSS 3

**Versão:** `3.4.17`

Tailwind continua sendo a única superfície de styling autorizada.

- zero CSS modules;
- zero styled-components;
- `src/index.css` existe só para base global e `pb-safe`;
- `tailwindcss-animate` cobre a maior parte das animações simples.

Evite valores arbitrários sem necessidade e não crie abstrações com `@apply`.

## Vitest + Testing Library

**Versões:** `vitest@4.1.4`, `@testing-library/react@16.3.2`,
`@testing-library/user-event@14.6.1`

O projeto já tem cobertura de regressão para os pontos mais críticos da
integração recente.

- `src/services/auth.test.js` cobre o contrato do serviço de auth.
- `src/services/student.test.js` cobre cache e invalidação do serviço do aluno.
- `src/features/student/Revisions.test.jsx` cobre CRUD da view de revisões.
- `src/features/assessments/Simulados.test.jsx` cobre CRUD da view de simulados.
- `src/components/AppErrorBoundary.test.jsx` cobre o fallback global.
- `src/vercel-config.test.js` protege a rewrite de SPA na Vercel.

Use `npm run test` como verificação mínima antes de publicar mudanças.

## Lucide React

**Versão:** `1.8.0`

Lucide é a biblioteca oficial de ícones do projeto.

- importe apenas os ícones usados;
- confirme o nome em `lucide.dev` antes de editar;
- use `fill=\"currentColor\"` só quando quiser de fato um ícone preenchido.

Evite `import * as Icons from 'lucide-react'`.

## Recharts

**Versão:** `3.8.1`

Recharts está disponível para gráficos mais densos, mas o produto ainda prefere
renderizações simples em Tailwind quando isso resolve o problema.

Use Recharts quando houver série temporal, comparação com tooltip ou gráfico
multidimensional. Para barras simples, `StudentFeatures.jsx` continua sendo a
referência.

## date-fns

**Versão:** `4.1.0`

Date-fns é a base das telas de calendário e cronograma.

- use `new Date(YYYY, MM - 1, DD)` para datas fixas de vestibular;
- trate comparações de dia com cuidado para evitar `off-by-one` de timezone.

## Framer Motion

**Versão:** `12.38.0`

Framer Motion permanece disponível, mas não é a primeira escolha para
animações simples. Use quando precisar de layout transitions, presença ou
gestures. Para fade e slide de entrada, prefira Tailwind.

## Observabilidade Vercel

**Bibliotecas:** `@vercel/analytics@2.0.1`,
`@vercel/speed-insights@2.0.0`

Ambas são montadas diretamente em `src/App.jsx`. Não espalhe esses componentes
por views ou shells.
