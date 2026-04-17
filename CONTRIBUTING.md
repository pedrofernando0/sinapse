# Contributing — Sinapse

Guia para contribuições humanas ao repositório. Se você é um agente de IA, leia
[`AGENTS.md`](AGENTS.md) antes deste documento.

---

## Antes de começar

Leia os documentos abaixo na ordem indicada:

| Ordem | Arquivo | Por que ler |
|-------|---------|------------|
| 1 | [`CLAUDE.md`](CLAUDE.md) | Contexto rápido do projeto, comandos, padrões |
| 2 | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Como o sistema está organizado |
| 3 | [`docs/SPRINTS.md`](docs/SPRINTS.md) | O que está sendo trabalhado agora |
| 4 | [`AGENTS.md`](AGENTS.md) | Paradigmas técnicos de intervenção (vale para humanos também) |

---

## Setup de desenvolvimento

```bash
npm install      # instala dependências
npm run dev      # inicia dev server em http://localhost:5173
npm run build    # valida o build de produção
npm run preview  # preview local do build
```

Contas de demonstração para testar o produto:

| Usuário | Senha | Perfil |
|---------|-------|--------|
| valentina | valentina | Aluno |
| pedro | pedro | Aluno |
| qualquer nome | qualquer senha | Professor |

---

## Workflow de contribuição

1. **Crie uma branch** a partir de `main`:
   ```bash
   git checkout -b feat/nome-da-feature
   ```

2. **Classifique a mudança** usando a taxonomia em `AGENTS.md § 1. Taxonomia de intervenções`
   antes de começar a escrever código.

3. **Implemente** seguindo os padrões de `AGENTS.md`.

4. **Valide** o build:
   ```bash
   npm run build   # deve terminar sem erros
   ```

5. **Atualize a documentação** se necessário (ver seção abaixo).

6. **Abra um pull request** com a checklist preenchida.

---

## Quando atualizar documentação

| Mudança no código | Documentos a atualizar |
|-------------------|----------------------|
| Nova view no shell do aluno | `docs/ARCHITECTURE.md` (tabela de views) + `docs/SPRINTS.md` (Done) |
| Nova view no shell do professor | `docs/ARCHITECTURE.md` + `docs/SPRINTS.md` |
| Novo componente em `src/components/` | `docs/ARCHITECTURE.md` (seção componentes compartilhados) |
| Novo arquivo em `src/lib/` | `docs/ARCHITECTURE.md` (tabela da camada src) |
| Nova rota em `src/routes/AppRoutes.jsx` | `docs/ARCHITECTURE.md` (fluxo de autenticação) + `README.md` |
| Nova dependência npm | `docs/STACK.md` |
| Nova convenção de código | `AGENTS.md` |
| Mudança estrutural maior | `README.md` |

---

## Regras de contribuição

**Estrutura:**
- Mantenha o fluxo login-first intacto.
- Features do aluno vão no shell do aluno; features do professor no shell do professor.
- Não deixe features acessíveis apenas por URL direta — integre ao shell.
- `src/` é para bootstrapping, routing e feature slices. Não reintroduza dependências
  de runtime em `legacy/`.

**Código:**
- Somente Tailwind CSS — zero CSS modules, styled-components ou @apply.
- Ícones somente de `lucide-react` — verifique o nome em `lucide.dev`.
- Export nomeado em `src/components/`. Módulos de feature usam `export default`.
- Zero `console.log` commitado.

**Commits** (Conventional Commits em português):
```
feat(shell): adiciona view de cronograma adaptativo
fix(modal): corrige overflow em telas menores que 640px
style: aplica paleta navy/amarelo no banner do aluno
refactor(raio-x): extrai dados para StudentFeatures.jsx
docs: atualiza ARCHITECTURE.md com nova view
```

---

## Checklist de pull request

Antes de abrir o PR, confirme cada item:

- [ ] `npm run build` termina sem erros
- [ ] A feature está integrada no shell correto (não só em arquivo isolado)
- [ ] Nenhuma rota nova viola o fluxo login-first
- [ ] Documentação atualizada conforme a tabela acima
- [ ] Zero `console.log`, `TODO` ou `FIXME` no código
- [ ] Ícones Lucide verificados por nome em `lucide.dev`
- [ ] Commits seguem Conventional Commits

---

## Escopo de pull requests

Prefira PRs focados em um único tipo de mudança.

**Exemplos de bom escopo:**
- Integrar um novo módulo do aluno
- Corrigir um bug de layout em um componente específico
- Atualizar documentação de arquitetura
- Refatorar um componente para `src/components/`

**Evite misturar:**
- Feature nova + refactor não relacionado
- Mudança de produto + mudança de infraestrutura
- Múltiplos módulos não relacionados em um PR

---

## Contato

Bugs, sugestões e feedback: `plfonseca@usp.br`

Para contexto adicional do projeto e histórico de decisões, consulte
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) e o histórico de commits.
