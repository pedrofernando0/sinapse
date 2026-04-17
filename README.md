# Sinapse

Plataforma educacional do **Cursinho Popular da Poli** (EPUSP). Prototype React
com dois perfis de usuário: aluno (vestibulando) e professor. Desenvolvido para
centralizar ferramentas de estudo, acompanhamento de turma e suporte ao aprendizado.

---

## Produto

Sinapse tem dois shells principais, acessados após login com seleção de perfil:

**Shell do aluno** — jornada completa de preparação para vestibulares:
- Raio-X de incidência por vestibular (ENEM, FUVEST, UNESP, UNICAMP)
- Diagnóstico de nivelamento por tópico
- Calendário de marcos estratégicos
- Cronograma semanal editável
- Leituras obrigatórias FUVEST
- Revisões espaçadas
- Simulados com análise de performance
- Pomodoro com sistema de XP
- Aprovação FUVEST
- Módulos de IA: Tutoria, Discursiva, Redação FUVEST
- Mentoria com ex-alunos da Poli
- Medidor de humor e Rede de apoio

**Shell do professor** — acompanhamento de turma:
- Visão geral da turma com KPIs
- Análise individual de alunos
- Frequência e risco de evasão
- Análise de simulados da turma
- Planejador de aulas

---

## Tech stack

| Biblioteca | Versão | Uso |
|-----------|--------|-----|
| React | 19 | UI framework |
| Vite | 8 | Build tool e dev server |
| React Router | 7 | Roteamento entre shells |
| Tailwind CSS | 3 | Estilização (100% utilitários) |
| Lucide React | 1.8 | Ícones |
| Framer Motion | 12 | Animações complexas |
| Recharts | 3 | Gráficos |
| date-fns | 4 | Manipulação de datas |

Referência completa de cada biblioteca: [`docs/STACK.md`](docs/STACK.md).

---

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. Faça login com:
- `valentina` / `valentina` (aluno)
- `pedro` / `pedro` (aluno, acesso total)
- Qualquer usuário selecionando o perfil "Professor"

```bash
npm run build    # build de produção
npm run preview  # preview do build
```

---

## Estrutura do repositório

```
sinapse/
├── legacy/         # diretório drenado; mantido vazio até a limpeza final
├── src/            # bootstrap, roteamento, feature slices e componentes compartilhados
├── docs/           # documentação técnica
│   ├── ARCHITECTURE.md   # design do sistema
│   ├── SPRINTS.md        # kanban e backlog
│   └── STACK.md          # referência por biblioteca
├── CLAUDE.md       # contexto rápido para agentes de IA
├── AGENTS.md       # paradigmas técnicos para intervenções de IA
├── CONTRIBUTING.md # guia de contribuição
└── README.md       # este arquivo
```

Detalhes da arquitetura: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Modelo de roteamento

```
/         → redireciona para /login
/login    → tela de login com seleção de perfil
/aluno    → shell do aluno (requer sessão)
/professor → shell do professor (requer sessão)
```

A navegação interna aos shells usa estado via `AppContext` e `TeacherContext`
(não rotas adicionais).
A URL reflete a view ativa via query param: `/aluno?view=raio-x`.

---

## Documentação

| Documento | Conteúdo |
|-----------|---------|
| [`CLAUDE.md`](CLAUDE.md) | Contexto de projeto para agentes de IA — leia primeiro |
| [`AGENTS.md`](AGENTS.md) | Paradigmas técnicos de intervenção para IA |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Arquitetura, fluxos, contextos React |
| [`docs/SPRINTS.md`](docs/SPRINTS.md) | Backlog, sprints e kanban |
| [`docs/STACK.md`](docs/STACK.md) | Referência técnica por biblioteca |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Workflow de contribuição e checklist de PR |

---

## Status

Prototype em desenvolvimento ativo. Dados são mockados. Autenticação é demo.
Backlog completo e sprints planejados em [`docs/SPRINTS.md`](docs/SPRINTS.md).

Contato: `plfonseca@usp.br`
