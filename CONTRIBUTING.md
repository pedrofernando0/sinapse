# Contributing

This repository is a prototype that is being prepared for public or team-facing
GitHub use. Keep changes focused, reviewable, and aligned with the existing
product flow.

## Before you start

Read the following files before making structural changes:

- [`README.md`](README.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

These documents explain how the repository is split between product prototypes
and integration code.

## Development workflow

Use the following workflow for changes.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Validate the project before you finish:

   ```bash
   npm run build
   ```

## Contribution rules

Follow these rules when you update the repository.

- Keep the login screen as the main entry point.
- Route student features through the student shell.
- Route teacher features through the teacher shell.
- Avoid leaving features accessible only by direct route unless that is a
  deliberate product requirement.
- Keep `src/` focused on app bootstrap, routing, and wrappers.
- Keep `01-app-core/` as the source for product shells and focused feature
  modules until a larger refactor is planned.

## Documentation expectations

Update documentation when you make any of the following changes:

- Add a new product module
- Move or rename a shell
- Change route behavior
- Change the repository structure

At minimum, update:

- `README.md`
- `docs/ARCHITECTURE.md`

## Pull request checklist

Before opening a pull request, verify the following:

- The app runs locally.
- `npm run build` passes.
- The change is integrated into the correct shell.
- Any new routes still respect the login-led flow.
- Documentation reflects the current implementation.

## Scope guidance

Prefer narrow, intentional pull requests.

Good examples:

- Integrate one new student module into the student shell
- Fix one shell navigation issue
- Improve repository documentation

Avoid mixing unrelated cleanup, feature work, and documentation in one large
change unless the repository genuinely requires it.
