# Architecture

This document explains how Sinapse is organized today, why the repository keeps
`01-app-core/`, and where to add or update code without breaking the product
flow.

## High-level design

Sinapse has one application entry point and two main post-login shells:

- **Student shell**
- **Teacher shell**

The login screen in `01-app-core/login.jsx` is the only intended entry point for
the product experience. After authentication, the app routes the user to the
correct shell based on the selected profile.

## Source of truth

Sinapse has two layers of source code:

- `01-app-core/` contains the original product shells and feature-specific
  screens. These files represent the UI explorations that define the platform.
- `src/` contains the integration layer. It bootstraps React, defines routes,
  and wraps the shells so the product runs as one application.

This split is intentional. The repository preserves the original product
modules while providing a clean runtime entry point for the integrated app.

## Runtime flow

The runtime flow is:

1. The app starts in `src/main.jsx`.
2. `src/App.jsx` defines the route map.
3. `/login` renders the login experience.
4. The login wrapper sends the user to either `/aluno` or `/professor`.
5. The selected shell manages the internal product views for that profile.

## Student shell

The student shell is implemented in `01-app-core/aluno.jsx`. It acts as the
primary container for the student-facing platform.

The student shell currently integrates:

- Dashboard
- Raio-X
- Diagnóstico
- Calendário
- Cronograma
- Leituras
- Revisões
- Simulados
- Pomodoro
- Aprovação FUVEST
- Discursiva IA
- Redação IA FUVEST
- Simulador TRI
- Tutoria
- Medidor de humor
- Rede de apoio

Some of these views come from the original shell file, and others are loaded
from focused product files in `01-app-core/`.

## Teacher shell

The teacher shell is implemented in `01-app-core/professor.jsx`. It contains the
teacher-facing platform flow and currently integrates:

- Overview
- Student tracking
- Attendance
- Simulated exam analysis
- Lesson planner

The lesson planner is sourced from
`01-app-core/prof-planejador-de-aulas.jsx`.

## Integration rules

Use these rules when you change the product:

1. Keep login as the primary user entry point.
2. Add student-facing modules to the student shell unless they are explicitly
   intended for teachers.
3. Add teacher-facing modules to the teacher shell unless they are explicitly
   intended for students.
4. If you create a focused prototype file in `01-app-core/`, integrate it back
   into the relevant shell before considering the work complete.
5. Use `src/` only for bootstrapping, routing, wrappers, and other integration
   concerns.

## Recommended cleanup path

If you continue improving the repository, the next structural cleanup should be
incremental rather than a full rewrite.

Recommended order:

1. Extract shared UI primitives used by both shells.
2. Normalize repeated navigation patterns.
3. Move repeated mock data into dedicated data modules.
4. Add automated UI or smoke tests around shell routing.

## What not to do

Avoid these changes unless you are doing a deliberate refactor:

- Do not replace the login-led flow with a separate landing page.
- Do not leave new product modules accessible only by direct route.
- Do not move prototype files out of `01-app-core/` without updating the
  integration wrappers and documentation.

## Next steps

If you add new product work, update this document and the README in the same
change so the GitHub repository stays aligned with the codebase.
