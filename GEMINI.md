# Project Overview

**2025 Profile** is a high-performance developer portfolio website built with **React**, **Vite**, and **Tailwind CSS**. It features advanced interactive elements using **Three.js** (via `@react-three/fiber`) and **Framer Motion** for animations. The project emphasizes a modern, "Deep Space" aesthetic with glassmorphism effects and a robust, custom layout system to ensure responsiveness across all devices.

## Architecture & Technologies

-   **Framework**: React 19 + Vite 7
-   **Styling**: Tailwind CSS 4 (using CSS variables for theming)
-   **Layout System**: Custom CSS architecture (`src/styles/layout.css`) implementing a strict `Section > Container` pattern.
-   **Animation**: Framer Motion, GSAP
-   **3D Graphics**: Three.js, React Three Fiber, React Three Drei
-   **Testing**: Vitest + React Testing Library

## Directory Structure

```text
src/
├── components/
│   ├── effects/       # Background fields, particle systems (Three.js)
│   ├── layout/        # Core layout components (Layout, Section, Container, Header, Footer)
│   ├── sections/      # Page content sections (Hero, About, Projects, Skills, Contact)
│   └── ui/            # Reusable UI primitives (Button, Card, Badge, etc.)
├── styles/
│   ├── global.css     # Global resets and Tailwind imports
│   ├── layout.css     # CRITICAL: Explicit layout constraints (.app-container, .app-section)
│   └── tokens.css     # Design tokens (colors, shadows, variables)
├── data/              # Static content data (projects, skills)
├── hooks/             # Custom React hooks
└── utils/             # Helper functions and motion variants
```

# Building and Running

The project uses standard `npm` scripts for development and production tasks.

*   **Install Dependencies**:
    ```bash
    npm install
    ```

*   **Development Server**:
    ```bash
    npm run dev
    ```

*   **Production Build**:
    ```bash
    npm run build
    ```
    *Output will be generated in the `dist/` directory.*

*   **Run Tests**:
    ```bash
    npm run test
    ```

*   **Linting**:
    ```bash
    npm run lint
    ```

# Development Conventions

## Layout System (Critical)

To prevent layout regressions (e.g., content touching screen edges), the project enforces a strict **Container** pattern defined in `src/styles/layout.css`.

*   **Do not** rely solely on Tailwind's `container` utility.
*   **Always** use the `<Container />` component (`src/components/layout/Container.jsx`) for horizontal constraints.
    *   It applies the `.app-container` class, which enforces safe-area padding (`1.5rem` mobile, `3rem` desktop) and max-widths.
*   **Always** use the `<Section />` component (`src/components/layout/Section.jsx`) for vertical spacing and background styling.
    *   It applies the `.app-section` class.

**Example:**
```jsx
import { Section } from '../layout/Section';
// The Container is automatically handled within Section unless fullWidth is true
export const MySection = () => (
  <Section id="my-section">
    <h2>Content is safe here</h2>
  </Section>
);
```

## Styling & Theming

*   **Design Tokens**: Use the CSS variables defined in `src/styles/tokens.css` (e.g., `var(--color-bg-primary)`, `var(--color-accent-primary)`) or their Tailwind aliases (e.g., `bg-bg-primary`, `text-accent-primary`).
*   **Tailwind v4**: The project uses the new CSS-first configuration. Global styles and theme extensions are managed in CSS files, not just `tailwind.config.js`.

## Performance

*   **3D Content**: Three.js scenes are resource-intensive. Ensure they are lazy-loaded or conditionally rendered where possible.
*   **Bundle Size**: The current bundle is large due to 3D libraries. Future work should focus on code-splitting these dependencies.
