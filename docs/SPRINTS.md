# Sprints & Kanban — Sinapse

Este arquivo lista apenas trabalho pendente ou em andamento. Itens concluídos
saem daqui para manter o backlog operacional limpo.

## Board atual

No momento não há card operacional aberto fora do backlog por sprint.

### 🔴 Bloqueante / P0

| Item | Branch | Sprint |
|------|--------|--------|
| — | — | — |

### 🟡 Em andamento

| Item | Branch | Sprint |
|------|--------|--------|
| — | — | — |

### 🔵 Review / QA

| Item | PR | Sprint |
|------|-----|--------|
| — | — | — |

## Backlog por sprint

As entregas de auth server-side, error boundary global e cache TTL simples já
saíram do backlog operacional. Restam os itens abaixo.

### Sprint Arq — Refatoração modular DDD

A drenagem de `legacy/` para `src/features/` está concluída. O único débito
estrutural remanescente é trocar a navegação interna dos shells por uma
superfície compartilhada além dos contextos locais.

| ID | Item | Prioridade | Status |
|----|------|------------|--------|
| SA-3.2 | substituir a navegação interna dos shells por store ou orquestração compartilhada | P1 | ⬜ |

### Sprint 4 — Autenticação real

Auth via Supabase já atende login, cadastro, confirmação de e-mail, recuperação
de senha e roteamento por perfil. Permanecem apenas refinamentos de produto e
operação.

| ID | Item | Prioridade | Estimativa |
|----|------|------------|-----------|
| S4-07 | perfil do aluno editável | P2 | 1d |
| S4-08 | revisar auth settings de preview e produção no Supabase Dashboard | P1 | 0.5d |

### Sprint 5 — IA real

Os módulos de IA ainda dependem de backend próprio e integração com provedor
LLM. Nenhuma chave deve entrar no bundle do cliente.

| ID | Item | Prioridade | Estimativa |
|----|------|------------|-----------|
| S5-00 | criar proxy server-side para chamadas LLM | P0 | 1d |
| S5-01 | integrar Claude API na Tutoria | P0 | 2d |
| S5-02 | integrar Claude API na Redação IA FUVEST | P0 | 2d |
| S5-03 | definir prompt templates por disciplina | P1 | 1d |
| S5-04 | persistir histórico de conversa por sessão | P1 | 1d |
| S5-05 | estruturar feedback de redação por critério | P1 | 2d |
| S5-06 | adicionar rate limiting e feedback de quota | P2 | 0.5d |

### Sprint 6 — Mobile & PWA

O app ainda precisa de trabalho dedicado para responsividade profunda e modo
instalável.

| ID | Item | Prioridade | Estimativa |
|----|------|------------|-----------|
| S6-01 | adicionar manifest e ícones de PWA | P1 | 0.5d |
| S6-02 | criar service worker para cache offline | P1 | 1d |
| S6-03 | implementar web push para revisões e prazos | P2 | 2d |
| S6-04 | auditar responsividade em mobile real | P1 | 1d |

### Sprint 7 — Professor avançado

O shell do professor ainda concentra a maior parte do backlog funcional.

| ID | Item | Prioridade | Estimativa |
|----|------|------------|-----------|
| S7-01 | mensagens diretas professor → aluno | P1 | 2d |
| S7-02 | criação de simulados pelo professor | P1 | 3d |
| S7-03 | dashboard de risco de evasão com dados reais | P1 | 2d |
| S7-04 | exportar relatório de turma em PDF | P2 | 1d |
| S7-05 | notificações quando aluno atinge meta | P2 | 1d |

## Backlog livre

Esses itens ainda não têm sprint dedicada.

| Item | Prioridade | Observação |
|------|------------|-----------|
| testes E2E de autenticação e shell | P1 | hoje a cobertura é unitária e de componente |
| paridade de desenvolvimento local para `/api/*` sem depender de deploy | P1 | hoje exige `VITE_API_BASE_URL` ou `vercel dev` |
| Storybook para `src/components/` | P2 | útil quando o catálogo crescer |
| i18n | P3 | só faz sentido com expansão além do português |
| analytics de produto com consentimento | P2 | precisa de desenho LGPD |
| gamificação por turma | P2 | XP já existe no shell do aluno |
| cronograma adaptativo via IA | P1 | depende da Sprint 5 |
| diagnóstico com questões reais | P1 | depende de banco de questões |

## Definition of done

Uma mudança só sai do backlog quando cumpre estes critérios.

1. Código commitado com Conventional Commits.
2. `npm run test` passa.
3. `npm run build` passa.
4. A mudança entra no shell, rota ou camada corretos.
5. `docs/ARCHITECTURE.md` é atualizado quando a mudança é estrutural.
6. `docs/SPRINTS.md` deixa de listar o item como pendente.
7. Não há `console.log`, `TODO` ou `FIXME` no código commitado.
