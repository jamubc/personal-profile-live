# Project Context

## Purpose
This project (`2025-profile-shop`) is a personal portfolio website built using a modern frontend stack. It is designed to showcase projects, skills, and contact information with a clean, dark-themed UI and smooth animations.

## Tech Stack
- React (v18)
- TypeScript
- Vite
- Tailwind CSS (with custom configuration)
- Framer Motion
- Lucide React

## Project Conventions

### Code Style
- **Components:** Functional components in `src/components/`.
- **Styling:** Tailwind CSS with custom theme in `tailwind.config.js`.
- **Types:** Shared interfaces in `src/types.ts`.
- **Data:** Static data in `src/data/`.

### Architecture Patterns
- **Entry Point:** `src/main.tsx` -> `src/App.tsx`.
- **Layout:** `App.tsx` handles main layout and sticky footer.
- **State:** React `useState` and `useEffect` for local state; no global store currently.

### Testing Strategy
- **Manual:** Verification via browser preview (`npm run dev`, `npm run preview`).
- **Linting:** `npm run lint` for code quality.

### Git Workflow
- Standard feature branch workflow.

## Domain Context
- Personal branding and portfolio showcase.
- "Shop" aspect implies potential e-commerce or product showcase features.

## Important Constraints
- **Aesthetics:** High priority on "amazing" feel, smooth animations, and premium design.
- **Performance:** Fast load times and smooth transitions.

## External Dependencies
- **Fonts:** Inter (Google Fonts).
- **Icons:** Lucide React.
