# Sprints & Kanban — Sinapse

Sprints semanais informais. Prioridade: P0 (bloqueante) → P3 (nice-to-have).
Este arquivo lista apenas trabalho pendente ou em andamento. Itens concluídos
saem daqui para manter o backlog operacional limpo.

---

## Board atual

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

---

## Backlog por sprint

### Sprint Arq — Refatoração Modular DDD (Abril–Maio 2026)

> Migração de `legacy/` → `src/features/` (Feature-Sliced Design).
> Ver `docs/ARCHITECTURE.md → Migration State` para o mapa completo de arquivos.
> Branch: `claude/scale-edtech-platform-5scIb`
> Concluído nesta branch: `SA-1.4`, `SA-2.1`, `SA-3.1`.
> Itens concluídos devem ser removidos desta seção assim que entrarem em
> produção ou forem fechados na branch de trabalho.

| ID | Item | Prioridade | Status |
|----|------|-----------|--------|
| SA-3.2 | Zustand wiring — replace Context in migrated shells | P1 | ⬜ |

### Sprint 3 — Real Data Layer (estimativa: Mai 2026)

> Substituir mocks por dados reais sem quebrar a UI.
> Depende de SA-1.5 (shell migrado) estar concluído.
> Primeiro slice entregue: contrato inicial + `GET /student/notifications` com
> loading, empty e erro no shell do aluno.

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S3-04 | Substituir dados de simulados por API | P1 | 1d |
| S3-05 | Substituir dados de revisões por API | P1 | 1d |
| S3-06 | Expandir loading/error/empty para simulados e revisões quando esses módulos migrarem | P1 | 1d |
| S3-07 | Error boundary global | P2 | 0.5d |
| S3-08 | Cache de requisições com TTL simples | P2 | 1d |

### Sprint 4 — Autenticação Real (estimativa: Jun 2026)

> Substituir sistema de sessão demo por auth real.
> Vercel resolve deploy e variáveis server-side, mas não transforma `VITE_*`
> em segredo. Sessão, refresh token e credenciais sensíveis precisam sair do
> frontend e ir para Functions/Edge ou backend dedicado.

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S4-00 | Definir boundary client/server no Vercel para auth e segredos | P0 | 0.5d |
| S4-01 | Integrar Supabase Auth ou Firebase via camada server-side | P0 | 2d |
| S4-02 | Substituir `demoSession.js` por `useAuth()` + cookie `httpOnly` | P0 | 1d |
| S4-03 | Rota protegida: redirect para `/login` sem sessão válida | P0 | 0.5d |
| S4-04 | Emitir e renovar sessão em endpoint server-side | P1 | 1d |
| S4-05 | Cadastro de alunos (form + validação) | P1 | 1d |
| S4-06 | Recuperação de senha | P2 | 0.5d |
| S4-07 | Perfil do aluno editável | P2 | 1d |

### Sprint 5 — IA Real (estimativa: Jul 2026)

> Integrar LLMs nos módulos de tutoria e redação.
> Depende de Sprint Arq SA-2.3 estar concluído.
> Chaves de provedor nunca ficam no bundle do cliente; integração real passa por
> proxy server-side no Vercel ou backend dedicado.

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S5-00 | Criar proxy server-side para chamadas LLM | P0 | 1d |
| S5-01 | Claude API no módulo Tutoria com IA | P0 | 2d |
| S5-02 | Claude API no módulo Redação IA FUVEST | P0 | 2d |
| S5-03 | Prompt templates por disciplina | P1 | 1d |
| S5-04 | Histórico de conversa persistido por sessão | P1 | 1d |
| S5-05 | Feedback estruturado de redação (critérios ENEM/FUVEST) | P1 | 2d |
| S5-06 | Rate limiting + feedback de quota | P2 | 0.5d |

### Sprint 6 — Mobile & PWA (estimativa: Ago 2026)

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S6-01 | manifest.json + ícones para PWA | P1 | 0.5d |
| S6-02 | Service worker para cache offline | P1 | 1d |
| S6-03 | Web Push para revisões e prazos | P2 | 2d |
| S6-04 | Auditoria de responsividade (iPhone SE + Android médio) | P1 | 1d |

### Sprint 7 — Professor Avançado (estimativa: Set 2026)

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S7-01 | Mensagens diretas professor → aluno | P1 | 2d |
| S7-02 | Criação de simulados pelo professor | P1 | 3d |
| S7-03 | Dashboard de risco de evasão com dados reais | P1 | 2d |
| S7-04 | Exportar relatório de turma em PDF | P2 | 1d |
| S7-05 | Notificações quando aluno atinge meta | P2 | 1d |

---

## Backlog livre (sem sprint definida)

| Item | Prioridade | Observação |
|------|-----------|-----------|
| Testes de integração (Playwright ou Cypress) | P1 | Sem test runner configurado ainda |
| Storybook para `src/components/` | P2 | Útil quando houver > 5 componentes |
| i18n | P3 | Só se houver alunos fora do Brasil |
| Analytics (Posthog ou similar) | P2 | Requer consentimento LGPD |
| Gamificação: ranking por turma | P2 | XP system já existe |
| Cronograma adaptativo via IA | P1 | Bloqueia Sprint 5 |
| Diagnóstico com questões reais | P1 | Requer banco de questões |

---

## Definition of Done

1. Código commitado na branch com mensagem Conventional Commits.
2. `npm run build` passa sem erros.
3. Mudança integrada no shell ou rota corretos.
4. `docs/ARCHITECTURE.md` atualizado se nível estrutural.
5. Item removido do backlog pendente neste arquivo.
6. Zero `console.log`, `TODO`, `FIXME` no código commitado.
