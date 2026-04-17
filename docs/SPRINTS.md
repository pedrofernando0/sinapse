# Sprints & Kanban — Sinapse

Metodologia: sprints semanais informais. Cada sprint tem um tema de foco.
Prioridade: P0 (bloqueante) → P1 (alta) → P2 (média) → P3 (nice-to-have).

---

## Board atual

### 🔴 Bloqueante / P0
Itens que impedem demo ou publicação pública.

| Item | Responsável | Notas |
|------|-------------|-------|
| — | — | — |

### 🟡 Em andamento
Itens com trabalho ativo no momento.

| Item | Branch | Sprint |
|------|--------|--------|
| Documentação para agentes de IA | `claude/refactor-sinapse-platform-DSlhn` | Sprint 2 |

### 🔵 Review / QA
Prontos para revisão, aguardando merge.

| Item | PR | Sprint |
|------|-----|--------|
| Refactor UI/UX: modais, notificações, Raio-X, Mentoria | — | Sprint 2 |

### ✅ Concluído

#### Sprint 2 — Qualidade & Conteúdo (Abril 2026)
- [x] Corrigir overflow nos modais de Configurações e Ajuda
- [x] Aplicar branding navy/amarelo (Cursinho da Poli) nos modais do aluno
- [x] Animação sequencial de "Marcar todas como lidas" nas notificações
- [x] Exibir CheckCircle verde com "Tudo limpo!" ao final da animação
- [x] Refatorar Raio-X: abas para FUVEST, ENEM, UNESP e UNICAMP
- [x] Raio-X: substituir tabela por gráficos de barra com % de incidência
- [x] Extrair `RaioXSection` e `MentoriaView` para `src/components/StudentFeatures.jsx`
- [x] Mentoria: banner sticky "Ex-alunos do Cursinho Popular da Poli"
- [x] Corrigir bug de hook (`useApp().navigate` em event handler → `navigate`)

#### Sprint 1 — Fundação (Mar–Abr 2026)
- [x] Shell do aluno integrado (`aluno.jsx`) com 16 views
- [x] Shell do professor integrado (`professor.jsx`) com 5 views
- [x] Login com seleção de perfil (`nova-tela-login.jsx`)
- [x] Launch experience animada por perfil (`launchExperience.js`)
- [x] Sistema de sessão demo com `localStorage` (`demoSession.js`)
- [x] Módulo: Calendário com `date-fns`
- [x] Módulo: Cronograma semanal editável
- [x] Módulo: Leituras obrigatórias FUVEST
- [x] Módulo: Revisões espaçadas
- [x] Módulo: Simulados com tracker de performance
- [x] Módulo: Pomodoro com sistema de XP
- [x] Módulo: Aprovação FUVEST
- [x] Módulo: Discursiva IA
- [x] Módulo: Redação IA FUVEST
- [x] Módulo: Simulador TRI
- [x] Módulo: Tutoria com IA
- [x] Módulo: Tutoria / Mentoria (ex-alunos)
- [x] Módulo: Medidor de Humor
- [x] Módulo: Rede de Apoio
- [x] Professor: Planejador de Aulas
- [x] Modais de Configurações e Ajuda (`ProfileActionPanels.jsx`)
- [x] Sistema de notificações com badge de não lidas

---

## Backlog por sprint

### Sprint 3 — Real Data Layer (estimativa: Mai 2026)
> Foco: substituir mocks por dados reais sem quebrar a UI existente.

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S3-01 | Definir contrato de API (REST ou GraphQL) | P0 | 1d |
| S3-02 | Criar `src/lib/api.js` com fetch + error handling | P0 | 1d |
| S3-03 | Substituir `INITIAL_STUDENT_NOTIFICATIONS` por endpoint real | P1 | 0.5d |
| S3-04 | Substituir dados de simulados por API | P1 | 1d |
| S3-05 | Substituir dados de revisões por API | P1 | 1d |
| S3-06 | Loading states nos módulos que consomem API | P1 | 1d |
| S3-07 | Error boundary global (fallback UI para falhas de rede) | P2 | 0.5d |
| S3-08 | Cache de requisições com `useMemo` + TTL simples | P2 | 1d |

### Sprint 4 — Autenticação Real (estimativa: Jun 2026)
> Foco: substituir o sistema de sessão demo por autenticação real.

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S4-01 | Integrar provedor de auth (Supabase Auth ou Firebase) | P0 | 2d |
| S4-02 | Substituir `demoSession.js` por hook `useAuth()` | P0 | 1d |
| S4-03 | Rota protegida: redirecionar para `/login` se sem sessão | P0 | 0.5d |
| S4-04 | Persistência de sessão com refresh token | P1 | 1d |
| S4-05 | Cadastro de alunos (form + validação) | P1 | 1d |
| S4-06 | Recuperação de senha | P2 | 0.5d |
| S4-07 | Perfil do aluno editável (nome, turma, avatar) | P2 | 1d |

### Sprint 5 — IA Real (estimativa: Jul 2026)
> Foco: integrar modelos de linguagem nos módulos de tutoria e redação.

| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S5-01 | Integrar Claude API no módulo Tutoria com IA | P0 | 2d |
| S5-02 | Integrar Claude API no módulo Redação IA FUVEST | P0 | 2d |
| S5-03 | Prompt templates para cada disciplina (Matemática, Português...) | P1 | 1d |
| S5-04 | Histórico de conversa persistido por sessão | P1 | 1d |
| S5-05 | Feedback estruturado de redação (critérios ENEM/FUVEST) | P1 | 2d |
| S5-06 | Rate limiting e feedback de quota para o aluno | P2 | 0.5d |

### Sprint 6 — Mobile & PWA (estimativa: Ago 2026)
| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S6-01 | Manifest.json + ícones para PWA | P1 | 0.5d |
| S6-02 | Service worker para cache offline dos módulos estáticos | P1 | 1d |
| S6-03 | Notificações push (Web Push API) para revisões e prazos | P2 | 2d |
| S6-04 | Layout responsivo auditado em iPhone SE e Android médio | P1 | 1d |

### Sprint 7 — Professor Avançado (estimativa: Set 2026)
| ID | Item | Prioridade | Estimativa |
|----|------|-----------|-----------|
| S7-01 | Mensagens diretas professor → aluno | P1 | 2d |
| S7-02 | Criação de simulados pelo professor | P1 | 3d |
| S7-03 | Dashboard de risco de evasão com dados reais | P1 | 2d |
| S7-04 | Exportar relatório de turma em PDF | P2 | 1d |
| S7-05 | Notificações para o professor quando aluno atinge meta | P2 | 1d |

---

## Backlog livre (sem sprint definida)

| Item | Prioridade | Observação |
|------|-----------|-----------|
| Testes de integração dos shells (Playwright ou Cypress) | P1 | Sem test runner configurado ainda |
| Storybook para componentes de `src/components/` | P2 | Útil quando houver > 5 componentes |
| Internacionalização (i18n) | P3 | Só se houver alunos fora do Brasil |
| Modo escuro nativo | P3 | Base já tem `slate-950` como default |
| Analytics de uso (Posthog ou similar) | P2 | Requer consentimento LGPD |
| Gamificação: tabela de ranking por turma | P2 | XP system já existe no shell |
| Cronograma adaptativo via IA | P1 | Bloqueia Sprint 5 |
| Diagnóstico com questões reais (não autopercepção) | P1 | Requer banco de questões |

---

## Definição de pronto (DoD)

Um item é considerado **Done** quando:

1. O código foi commitado na branch de feature com mensagem conventional.
2. `npm run build` passa sem erros.
3. A mudança está integrada no shell correto (não só em arquivo isolado).
4. `docs/ARCHITECTURE.md` reflete a mudança (se nível estrutural ou acima).
5. O item foi movido para a coluna Done neste arquivo.
6. Não há `console.log`, `TODO` ou `FIXME` no código commitado.

---

## Cadência de sprints

| Evento | Frequência | Formato |
|--------|-----------|---------|
| Sprint planning | Início de cada sprint | Selecionar itens do backlog, definir tema |
| Sprint review | Fim de cada sprint | Demo das features, atualizar este board |
| Retrospectiva | Fim de cada sprint | O que foi bem, o que melhorar |

Duração padrão de sprint: **1 semana** (ajustável conforme disponibilidade do time).
