# Sinapse

Sinapse is a React and Vite prototype for an educational platform with two
primary journeys: a student experience and a teacher experience. The current
repository integrates all available screens into a single application flow that
starts at the login screen and branches by profile.

The codebase keeps the original product shells and feature prototypes in
`01-app-core/`. The application bootstrap, routing, and integration wrappers
live in `src/`.

## Product overview

Sinapse includes two main shells:

- **Student shell** with study planning, diagnostics, reading, revision,
  simulated exams, AI-assisted study modules, emotional support, and tutoring.
- **Teacher shell** with class overview, student tracking, attendance,
  simulated exam analysis, and lesson planning.

The login screen routes users to the correct shell:

- `Login -> student -> full student journey`
- `Login -> teacher -> full teacher journey`

## Tech stack

Sinapse uses the following stack:

- `React 19`
- `Vite 8`
- `React Router`
- `Tailwind CSS`
- `Lucide React`
- `Framer Motion`
- `date-fns`
- `Recharts`

## Getting started

Use the following steps to run the project locally.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the application in your browser using the URL shown by Vite.

To create a production build, run:

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

## Repository structure

The repository is intentionally split between source prototypes and integration
layers.

```text
sinapse/
├── 01-app-core/          # original screens and product-focused shells
├── docs/                 # repository and architecture documentation
├── src/                  # app bootstrap, routes, and wrappers
├── index.html            # Vite entry HTML
├── package.json          # scripts and dependencies
└── tailwind.config.js    # Tailwind configuration
```

## Routing model

Sinapse uses a simple route model:

- `/` and `/login` render the login experience.
- `/aluno` renders the integrated student shell.
- `/professor` renders the integrated teacher shell.
- Legacy `/modulos/*` routes redirect into the correct student shell view.

## Architecture notes

The application does not treat each file in `01-app-core/` as an isolated page.
Instead, those files represent focused product explorations that are integrated
back into the main shells.

For the current architecture and integration rules, see
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Contributing

If you plan to extend or clean up the repository before publishing it, read
[CONTRIBUTING.md](CONTRIBUTING.md).

## Status

This repository is a product prototype under active organization. The current
goal is to preserve all built screens while making the codebase easier to run,
review, and publish.
