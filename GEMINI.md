# Project Context: 2025 Profile

## Project Overview
This project (`2025-profile-shop`) is a personal portfolio website built using a modern frontend stack. It is designed to showcase projects, skills, and contact information with a clean, dark-themed UI and smooth animations.

### Tech Stack
- **Framework:** React (v18) + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (with custom configuration)
- **Animation:** Framer Motion
- **Icons:** Lucide React

## Building and Running

The project uses `npm` for dependency management and script execution.

### Key Commands
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server using Vite. |
| `npm run build` | Runs the TypeScript compiler (`tsc`) and builds the application for production. |
| `npm run preview` | Previews the built production build locally. |
| `npm run lint` | Runs ESLint to check for code quality and style issues. |

## Directory Structure

```
/src
  ├── components/    # UI Components (Hero, Navbar, Projects, etc.)
  ├── data/          # Static data files (projects.ts, skills.ts)
  ├── hooks/         # Custom React hooks
  ├── utils/         # Utility functions
  ├── App.tsx        # Main application layout and component composition
  ├── main.tsx       # Application entry point
  └── types.ts       # Shared TypeScript interfaces (Project, Skill, SocialLink)
```

## Development Conventions

### Styling (Tailwind CSS)
The project utilizes Tailwind CSS for styling with a custom theme configuration defined in `tailwind.config.js`.
- **Colors:**
  - `primary`: `#FFFFFF` (White)
  - `secondary`: `#A3A3A3` (Light Gray)
  - `dark`: `#000000` (Black - Background)
  - `card`: `rgba(255, 255, 255, 0.1)` (Glassmorphism effect)
- **Fonts:** Uses the 'Inter' font family.

### TypeScript
- Strict type checking is enabled.
- Shared interfaces are defined in `src/types.ts`.
- Key interfaces include `Project`, `Skill`, and `SocialLink`.

### Component Architecture
- Components are functional and reside in `src/components/`.
- `App.tsx` handles the main layout, including a sticky/reveal footer effect managed by React state and refs.
- Data is typically decoupled from components and imported from `src/data/` or passed via props.

### Animations
- **Framer Motion** is available and likely used for component transitions and interactive elements.
