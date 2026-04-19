# Sinapse

Plataforma educacional do **Cursinho Popular da Poli** (EPUSP). O projeto
combina dois shells, aluno e professor, com uma base React/Vite e um runtime
server-side em Vercel para autenticação e parte das operações do aluno.

Hoje o produto está em estado híbrido. Login, cadastro, confirmação de e-mail,
recuperação de senha, notificações, revisões e simulados do aluno já passam por
Supabase real via `/api/*`. O restante das views continua majoritariamente em
modo mockado enquanto a migração estrutural segue.

## Produto

Sinapse organiza a jornada de preparação do vestibulando e o acompanhamento da
turma pelo professor.

**Shell do aluno**

- Raio-X de incidência por vestibular.
- Diagnóstico de nivelamento.
- Calendário e cronograma semanal.
- Leituras obrigatórias.
- Revisões espaçadas.
- Simulados com análise de performance.
- Pomodoro com XP.
- Aprovação FUVEST.
- Tutoria, discursiva e redação com IA.
- Mentoria, humor e rede de apoio.

**Shell do professor**

- Visão geral da turma.
- Leitura individual de alunos.
- Frequência e risco de evasão.
- Análise de simulados.
- Planejador de aulas.

## Runtime atual

O runtime já não é mais somente demo.

- `src/services/auth.js` fala com `/api/auth/*` para sessão, login, cadastro,
  logout e recuperação de senha.
- `src/services/student.js` fala com `/api/student/*` para notificações,
  revisões e simulados do aluno.
- `api/[...path].js` converte a request Node da Vercel para Web Request e
  delega para `src/server/api/router.js`.
- `src/server/api/*` usa `@supabase/ssr` no servidor para ler e atualizar a
  sessão por cookie.
- `vercel.json` reescreve rotas profundas para `index.html`, o que mantém
  links como `/login?code=...` funcionando após confirmação de e-mail.

## Rodando localmente

Comece pelo setup básico do frontend.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Use estes comandos de validação durante o trabalho:

```bash
npm run test
npm run build
npm run preview
```

Por padrão, `npm run dev` sobe apenas o frontend Vite. Para testar fluxos que
dependem de `/api/*`, você precisa escolher um destes modos:

1. Definir `VITE_API_BASE_URL` apontando para um deploy existente, por exemplo
   `https://sinapse-dusky.vercel.app/api`.
2. Rodar o projeto com `vercel dev`, desde que o Vercel CLI esteja instalado no
   seu ambiente.

As variáveis mínimas para auth e dados reais são:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

As variáveis opcionais do fluxo demo são:

- `VITE_ENABLE_DEMO_SHORTCUT`
- `VITE_DEMO_STUDENT_EMAIL`
- `VITE_DEMO_TEACHER_EMAIL`

Se você quiser provisionar as contas demo no projeto Supabase, execute:

```bash
npm run supabase:provision-demo
```

Esse script usa `SUPABASE_SERVICE_ROLE_KEY` e, se necessário,
`SUPABASE_PROJECT_REF`.

## Estrutura do repositório

O repositório está organizado por rotas, shells, serviços e runtime server-side.

```text
sinapse/
├── api/                  # entrypoint Vercel para /api/*
├── docs/                 # documentação técnica e operacional
├── legacy/               # diretório drenado, sem imports de runtime
├── src/
│   ├── components/       # componentes compartilhados
│   ├── features/         # slices de produto
│   ├── layouts/          # guards por shell + sync de ?view=
│   ├── lib/              # bootstrap, preload, clientes Supabase
│   ├── pages/            # entry points de rota
│   ├── routes/           # configuração declarativa do React Router
│   ├── server/api/       # handlers e utilitários do backend Vercel
│   ├── services/         # clientes do frontend para /api
│   └── store/            # Zustand para auth/session/ui
├── supabase/             # migrations e artefatos do banco
├── AGENTS.md             # protocolo de intervenção para IA
├── CLAUDE.md             # contexto rápido do projeto
├── CONTRIBUTING.md       # fluxo de contribuição
└── README.md             # este arquivo
```

Detalhes adicionais vivem em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Modelo de roteamento

O React Router cuida da navegação entre shells. A navegação interna continua nos
contextos dos shells e é refletida em `?view=`.

```text
/         → login
/login    → login
/aluno    → shell do aluno autenticado
/professor → shell do professor autenticado
```

Rotas legadas como `/modulos/tutoria` redirecionam para a view equivalente do
shell do aluno.

## Documentação

Use estes arquivos como fonte de verdade local:

| Documento | Conteúdo |
|-----------|----------|
| [`CLAUDE.md`](CLAUDE.md) | contexto rápido para agentes e contribuidores |
| [`AGENTS.md`](AGENTS.md) | regras prescritivas de intervenção |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | fluxo de runtime, camadas e API |
| [`docs/SPRINTS.md`](docs/SPRINTS.md) | backlog operacional pendente |
| [`docs/STACK.md`](docs/STACK.md) | referência das bibliotecas e padrões |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | setup, workflow e checklist de PR |

## Status

Sinapse está em desenvolvimento ativo.

- Auth real e parte do shell do aluno já estão conectados ao Supabase.
- O shell do professor e várias views do aluno ainda usam dados mockados.
- A migração arquitetural segue aberta até substituir a navegação interna dos
  shells por uma solução compartilhada além dos contextos atuais.

Contato: `plfonseca@usp.br`
