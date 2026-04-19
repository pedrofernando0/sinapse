# Contributing — Sinapse

Guia de contribuição humana para o repositório. Se você estiver operando como
agente, leia [`AGENTS.md`](AGENTS.md) antes deste documento.

## Antes de começar

Estes arquivos formam o contexto mínimo do projeto.

| Ordem | Arquivo | Por que ler |
|-------|---------|-------------|
| 1 | [`CLAUDE.md`](CLAUDE.md) | setup rápido, arquitetura e comandos |
| 2 | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | camadas, runtime e mapa de migração |
| 3 | [`docs/SPRINTS.md`](docs/SPRINTS.md) | backlog ainda pendente |
| 4 | [`AGENTS.md`](AGENTS.md) | regras prescritivas de intervenção |

## Setup de desenvolvimento

O setup mínimo do frontend é este:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Antes de abrir PR, rode também:

```bash
npm run test
npm run build
```

Importante: `npm run dev` sobe apenas o frontend Vite. Para testar fluxos que
dependem de `/api/*`, use um destes modos:

1. defina `VITE_API_BASE_URL` apontando para um deploy existente;
2. rode o projeto com `vercel dev`, caso tenha o Vercel CLI instalado.

O atalho demo `pedro/pedro` funciona em `DEV` ou quando
`VITE_ENABLE_DEMO_SHORTCUT=true`.

Se você quiser provisionar as contas demo no projeto Supabase, execute:

```bash
npm run supabase:provision-demo
```

Esse script usa `SUPABASE_SERVICE_ROLE_KEY`.

## Workflow de contribuição

Siga este fluxo para manter o histórico limpo.

1. Crie uma branch a partir de `main`.

   ```bash
   git checkout -b feat/nome-da-feature
   ```

2. Classifique a mudança pela taxonomia descrita em `AGENTS.md`.
3. Implemente a mudança no shell, serviço ou camada corretos.
4. Rode `npm run test` e `npm run build`.
5. Atualize a documentação pertinente.
6. Abra o pull request com a checklist preenchida.

## Quando atualizar documentação

A documentação precisa acompanhar a camada tocada.

| Mudança no código | Documentos a atualizar |
|-------------------|------------------------|
| nova view em um shell | `docs/ARCHITECTURE.md` e `docs/SPRINTS.md` |
| nova rota React Router | `README.md` e `docs/ARCHITECTURE.md` |
| novo endpoint `/api/*` | `README.md`, `docs/ARCHITECTURE.md` e `docs/STACK.md` |
| nova dependência | `docs/STACK.md` |
| nova variável de ambiente ou setup | `README.md`, `CLAUDE.md` e `CONTRIBUTING.md` |
| nova convenção de código | `AGENTS.md` |

## Regras de contribuição

Mantenha estes limites durante a implementação.

**Estrutura**

- preserve o fluxo login-first;
- não crie rotas internas para módulos que já pertencem ao shell;
- mantenha `legacy/` drenado, sem novos imports de runtime;
- use `src/services/` como a porta do frontend para dados reais.

**Código**

- use somente Tailwind para styling;
- importe ícones apenas de `lucide-react`;
- use export nomeado em `src/components/`;
- remova `console.log`, `TODO` e `FIXME` antes de commitar.

**Commits**

Use Conventional Commits em português.

```text
feat(shell): adiciona view de cronograma adaptativo
fix(auth): corrige leitura da sessao apos confirmacao de email
docs: atualiza arquitetura do backend /api
```

## Checklist de pull request

Antes de abrir o PR, confirme:

- [ ] `npm run test` passa
- [ ] `npm run build` passa
- [ ] a mudança entrou na camada correta
- [ ] nenhuma rota nova quebre o fluxo login-first
- [ ] a documentação afetada foi atualizada
- [ ] não há `console.log`, `TODO` ou `FIXME`
- [ ] os commits seguem Conventional Commits

## Escopo de pull requests

Prefira PRs com um único tema técnico.

**Bom escopo**

- integrar um endpoint novo;
- conectar uma view existente ao serviço real;
- corrigir um bug de shell ou layout;
- atualizar documentação estrutural.

**Evite misturar**

- feature nova com refactor não relacionado;
- mudança visual grande com alteração de infraestrutura;
- múltiplos domínios sem relação direta no mesmo PR.

## Contato

Bugs, sugestões e feedback: `plfonseca@usp.br`
