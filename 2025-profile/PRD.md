# Product Requirements Document: Neobrutalist Developer Portfolio

**Version**: 2.0
**Date**: 2025-10-03
**Owner**: Andrew
**Status**: Ready for Implementation

---

## Executive Summary

This PRD defines a personal developer portfolio website built with React and Tailwind CSS, implementing a neobrutalist design aesthetic. The portfolio will showcase Andrew's work, experience, and successful projects (including projects with significant metrics like 260K downloads) in a clean, bold, and memorable way.

**Key Philosophy**: Build reusable components once with zero style duplication. A single design token file controls all colors, spacing, shadows, and typography across the entire site.

**Deliverable**: A live website hosted on Vercel with custom domain, optimized for fast loading, easy content updates, and complete style customization from a single source of truth.

**Stakeholder**: Solo developer (Andrew) - sole owner, designer, implementer, and approver. All architectural decisions prioritize long-term maintainability and efficient updates.

---

## 1) Objectives & Success Metrics

### Primary Objectives
1. Create a memorable, distinctive portfolio that stands out from generic developer sites
2. Showcase projects and metrics in a clean, non-cocky manner that lets the work speak for itself
3. Achieve complete style control through centralized design tokens
4. Build a reusable component system that eliminates repetitive code

### Success Metrics

**Technical Quality**:
- [ ] Lighthouse Performance score > 95
- [ ] Lighthouse Accessibility score > 95
- [ ] First Contentful Paint < 1.5s
- [ ] Total bundle size < 200KB (initial load)
- [ ] Zero duplicate style definitions across components
- [ ] 100% of visual properties controlled by design tokens

**Maintainability**:
- [ ] Complete site recolor achievable by editing ONE file
- [ ] New project cards added in < 5 minutes
- [ ] Typography scale changes propagate to all components automatically
- [ ] Shadow/border adjustments require single token change

**User Engagement** (measured after launch):
- [ ] Average session duration > 2 minutes
- [ ] Bounce rate < 40%
- [ ] Mobile traffic engagement equivalent to desktop

**Business Impact**:
- [ ] Portfolio drives measurable inbound opportunities (tracked via contact conversions)
- [ ] Project showcase increases GitHub stars/engagement on featured repos

---

## 2) Product Strategy & Differentiation

### Vision
Create a portfolio that reflects technical excellence through both content and implementation. The neobrutalist aesthetic communicates confidence, clarity, and attention to craft.

### Competitive Context
Most developer portfolios fall into two categories:
1. Generic templates with minimal customization
2. Over-engineered, animation-heavy sites that sacrifice usability

This portfolio differentiates by:
- **Distinctive Visual Identity**: Neobrutalist design is memorable without being gimmicky
- **Technical Credibility**: Clean code architecture demonstrates professional-level engineering
- **Substance Over Flash**: Metrics and project details presented clearly, not buried in animations
- **Maintainability**: Architecture that supports long-term updates without technical debt

---

## 3) User Personas & Key Scenarios

### Primary Persona: Hiring Manager / Technical Recruiter
**Goals**:
- Quickly assess technical capabilities
- Verify project experience and impact
- Determine cultural/team fit through presentation style

**User Story US-001 [P0]**: As a hiring manager, I want to see featured projects with clear metrics within 10 seconds of landing, so I can quickly assess candidate quality.

**Acceptance Criteria**:
- Hero section loads in < 1.5s
- Featured projects visible above fold on desktop
- Download counts, GitHub stars, or usage metrics clearly displayed
- Project titles and tech stacks immediately scannable

### Secondary Persona: Developer / Collaborator
**Goals**:
- Evaluate technical expertise for potential collaboration
- Find links to GitHub, live demos, or documentation
- Assess technology preferences and experience areas

**User Story US-002 [P1]**: As a fellow developer, I want to navigate to GitHub repos and live demos with one click, so I can evaluate code quality and project scope.

**Acceptance Criteria**:
- Each project card contains direct links to repo and/or live demo
- Tech stack tags visible for quick filtering
- GitHub links open in new tab
- Clear visual distinction between repo link and demo link

### Tertiary Persona: Andrew (Content Maintainer)
**Goals**:
- Add new projects quickly without code duplication
- Update site-wide styling from one location
- Deploy changes with confidence (no broken layouts)

**User Story US-003 [P0]**: As the site maintainer, I want to change the entire site's color scheme by editing one file, so I can refresh the design without hunting through components.

**Acceptance Criteria**:
- All colors defined in central design token file
- Component files contain zero hardcoded color values
- Color token changes propagate to all components automatically
- Site rebuilds successfully with new tokens

---

## 4) Component Inventory

### Core Components (Phase 1 & 2)

**NAV-001: Header Navigation** [P0]
- Logo/name with link to home
- Navigation links (Projects, About, Skills, Contact)
- Mobile-responsive hamburger menu
- Active state indication
- Sticky positioning on scroll

**HERO-001: Hero Section** [P0]
- Name and title/tagline
- Brief value proposition (1-2 sentences)
- Primary CTA (e.g., "View Projects" or "Get in Touch")
- Background pattern or accent element (optional)

**CARD-001: Project Card** [P0]
- Project title
- Tech stack tags
- Description (2-3 sentences)
- Metrics display (downloads, stars, users, etc.)
- Links to GitHub repo and/or live demo
- Thumbnail or icon (optional)
- Support for "Featured" variant with enhanced styling

**SECTION-001: About Section** [P1]
- Headshot or avatar (optional)
- Bio paragraph(s)
- Career highlights or timeline
- Consistent card styling with other sections

**SECTION-002: Skills Section** [P1]
- Technology categories (Languages, Frameworks, Tools, etc.)
- Skill tags or badges
- Proficiency indication (optional - use sparingly to avoid appearing cocky)

**FOOTER-001: Footer** [P1]
- Social links (GitHub, LinkedIn, etc.)
- Contact information or email
- Copyright/last updated date
- Site navigation links (duplicate from header)

### Utility Components

**TEXT-001: Typography Components**
- Heading variants (H1, H2, H3)
- Body text variants (paragraph, small, caption)
- All sizes/weights pulled from design tokens

**LINK-001: Link Component**
- External link variant (opens new tab, security attributes)
- Internal navigation variant
- Styled for neobrutalist aesthetic (underline on hover)

**BUTTON-001: Button Component** [P1]
- Primary variant (white bg, black text, hard shadow)
- Secondary variant (dark bg, white text, white shadow)
- Ghost variant (transparent, border only)
- States: default, hover, active, disabled

**TAG-001: Tag/Badge Component** [P1]
- Technology tags for project cards
- Small, inline display
- Color variants for different categories (optional)

---

## 5) Design Token Architecture (CRITICAL)

### Objective
Achieve single-source-of-truth styling where Andrew can open ONE file and change the entire site's visual appearance. Zero duplicate definitions across components.

### Recommended Approach: Tailwind Theme Extension + CSS Variables

**Architecture Decision**: Extend Tailwind's `theme` in `tailwind.config.js` with custom design tokens, supplemented by CSS variables for computed values (like shadows).

**Rationale**:
- Tailwind already provides a utility-first system; extending the theme integrates tokens seamlessly
- CSS variables handle complex values (multi-part shadows) that Tailwind utilities can reference
- Components use Tailwind classes exclusively (e.g., `bg-primary`, `shadow-brutal-card`) with no inline styles
- Single file changes propagate through Tailwind's build process automatically

### Design Token Structure

**File: `/src/styles/tokens.css`** (CSS Variables for complex values)
```css
:root {
  /* Shadows */
  --shadow-brutal-sm: 4px 4px 0px 0px #000000;
  --shadow-brutal-md: 6px 6px 0px 0px #000000;
  --shadow-brutal-lg: 8px 8px 0px 0px #000000;
  --shadow-brutal-xl: 12px 12px 0px 0px #000000;

  /* Shadow variants (pressed state) */
  --shadow-brutal-pressed-sm: 2px 2px 0px 0px #000000;
  --shadow-brutal-pressed-md: 3px 3px 0px 0px #000000;

  /* Shadow variants (light) */
  --shadow-brutal-light-md: 6px 6px 0px 0px rgba(255, 255, 255, 0.2);
}
```

**File: `/tailwind.config.js`** (Primary Design Token File)
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Base colors
        primary: '#FFFFFF',
        secondary: '#1A1A1A',
        accent: '#0A0A0A',
        text: {
          primary: '#FFFFFF',
          secondary: '#CCCCCC',
          inverse: '#000000',
        },
        border: {
          primary: '#FFFFFF',
          secondary: '#4A5568',
          dark: '#000000',
        },
        bg: {
          primary: '#000000',
          card: '#1A1A1A',
          'card-featured': '#0A0A0A',
          'card-inline': '#2A2A2A',
          overlay: '#000000',
        },
      },

      spacing: {
        // Card spacing
        'card-sm': '16px',
        'card-md': '24px',
        'card-lg': '32px',

        // Shadow offsets (reference for consistency)
        'shadow-sm': '4px',
        'shadow-md': '6px',
        'shadow-lg': '8px',
        'shadow-xl': '12px',
      },

      borderWidth: {
        'default': '3px',
        'thick': '4px',
        'thin': '2px',
      },

      borderRadius: {
        // Neobrutalism = no border radius, but defined for consistency
        'none': '0px',
      },

      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },

      fontSize: {
        // Exaggerated scale
        'display-xl': ['72px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-lg': ['60px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },

      boxShadow: {
        // Reference CSS variables
        'brutal-sm': 'var(--shadow-brutal-sm)',
        'brutal-md': 'var(--shadow-brutal-md)',
        'brutal-lg': 'var(--shadow-brutal-lg)',
        'brutal-xl': 'var(--shadow-brutal-xl)',
        'brutal-pressed-sm': 'var(--shadow-brutal-pressed-sm)',
        'brutal-pressed-md': 'var(--shadow-brutal-pressed-md)',
        'brutal-light-md': 'var(--shadow-brutal-light-md)',
        'none': 'none',
      },

      height: {
        'nav': '80px',
      },
    },
  },
}
```

### Token Usage in Components

**Example: Button Component**
```jsx
// src/components/Button.jsx
export const Button = ({ variant = 'primary', children, ...props }) => {
  const variants = {
    primary: 'bg-primary text-text-inverse border-border-dark shadow-brutal-md hover:bg-gray-100 hover:shadow-brutal-pressed-md active:shadow-none',
    secondary: 'bg-secondary text-text-primary border-border-primary shadow-brutal-light-md hover:bg-gray-800 hover:border-gray-300',
    ghost: 'bg-transparent text-text-primary border-border-secondary border-thin hover:border-border-primary',
  };

  return (
    <button
      className={`
        px-8 py-4
        font-bold
        border-default
        rounded-none
        transition-all
        ${variants[variant]}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
```

**Key Principle**: Components use ONLY Tailwind utility classes that reference tokens. No hardcoded colors, sizes, or shadows.

### How Andrew Updates the Site Style

**Scenario: Change primary color from white to cyan**

1. Open `/tailwind.config.js`
2. Change `colors.primary: '#FFFFFF'` to `colors.primary: '#00FFFF'`
3. Save file
4. Tailwind rebuilds automatically (in dev mode)
5. All buttons, borders, and text using `primary` color update instantly

**Scenario: Increase all shadow offsets**

1. Open `/src/styles/tokens.css`
2. Change `--shadow-brutal-lg: 8px 8px 0px 0px #000000` to `--shadow-brutal-lg: 12px 12px 0px 0px #000000`
3. Save file
4. All cards using `shadow-brutal-lg` update instantly

### Design Token Validation Checklist
- [ ] All colors defined in `tailwind.config.js` under `theme.extend.colors`
- [ ] All shadows defined in `/src/styles/tokens.css` and referenced in Tailwind config
- [ ] All spacing values defined in `theme.extend.spacing`
- [ ] All typography scales defined in `theme.extend.fontSize`
- [ ] Components contain ZERO hardcoded hex codes, pixel values, or inline styles
- [ ] Tailwind config is the single source of truth for all visual properties

---

## 6) Data Display Strategy

### Objective
Showcase project metrics (downloads, GitHub stars, users, etc.) in a clean, non-cocky manner that demonstrates impact without appearing boastful.

### Approach: Contextual Metrics Within Cards

**Principle**: Let numbers speak for themselves with minimal editorializing. Use subtle visual hierarchy to present data as facts, not bragging.

### Metric Display Patterns

**METRIC-001: Inline Stat Display**
```jsx
// Example structure for project card metrics
<div className="flex gap-4 text-body-sm text-text-secondary">
  <span className="flex items-center gap-1">
    <DownloadIcon className="w-4 h-4" />
    260K downloads
  </span>
  <span className="flex items-center gap-1">
    <StarIcon className="w-4 h-4" />
    1.2K stars
  </span>
</div>
```

**Design Decisions**:
- Metrics displayed in secondary text color (less prominent than project title)
- Icons provide context without labels (GitHub icon = stars, download icon = installs)
- Numbers formatted for readability (260K vs 260,000)
- Positioned below project description, not above (description is primary)

**METRIC-002: Featured Project Metrics**
```jsx
// For standout projects, use larger metric display
<div className="border-l-4 border-border-primary pl-4">
  <div className="text-display-md font-bold">260K</div>
  <div className="text-body-sm text-text-secondary">Total Downloads</div>
</div>
```

**When to Use**:
- Hero section highlighting one major achievement
- Featured project card for most impactful work
- Limit to 1-2 featured metrics per page

### Metric Categories

**Acceptable Metrics** (demonstrate impact):
- Downloads / Installs
- GitHub stars (if substantial: >100)
- Active users / Monthly usage
- Contributions to open source
- Conference talks / Publications

**Avoid**:
- Lines of code written
- Years of experience (unless directly relevant)
- Self-assessed skill levels (e.g., "Expert in X")
- Vague claims ("Highly proficient", "Passionate about")

### Visual Styling for Metrics

**REQ-001 [P0]: Metric Display Styling**
- Metrics use `text-text-secondary` color to de-emphasize
- Icons use `w-4 h-4` sizing for subtle presence
- Metrics positioned in card footer or right-aligned in card header
- Featured metrics can use `border-l-4` accent with `pl-4` spacing

**Rationale**: Metrics provide credibility without dominating the design. They should be easy to find for evaluators but not scream for attention.

**Acceptance Criteria**:
- Metrics visible on all project cards
- Visual hierarchy: Project title > Description > Tech stack > Metrics
- Mobile layout stacks metrics vertically without text truncation
- Icon + number pairs have consistent spacing across all cards

---

## 7) Technical Architecture

### Tech Stack
- **Framework**: React 18+ (functional components, hooks)
- **Styling**: Tailwind CSS 3+ with custom theme extension
- **Build Tool**: Vite (fast dev server, optimized production builds)
- **Hosting**: Vercel (zero-config deployments, custom domain support)
- **Version Control**: Git + GitHub

### Folder Structure

```
/2025-profile
├── /public
│   ├── favicon.ico
│   └── /assets (images, icons)
├── /src
│   ├── /components
│   │   ├── /layout
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── /ui
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Tag.jsx
│   │   │   └── Link.jsx
│   │   └── /sections
│   │       ├── Hero.jsx
│   │       ├── Projects.jsx
│   │       ├── About.jsx
│   │       └── Skills.jsx
│   ├── /data
│   │   ├── projects.js (project data array)
│   │   └── skills.js (skills/tech stack data)
│   ├── /styles
│   │   ├── tokens.css (CSS variables for shadows)
│   │   └── global.css (Tailwind imports, base styles)
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js (DESIGN TOKEN SOURCE OF TRUTH)
├── vite.config.js
├── package.json
└── README.md
```

### Component Architecture Principles

**REQ-002 [P0]: Component Reusability**
- All UI components accept props for variants and state
- Components use Tailwind classes exclusively (no inline styles, no CSS modules)
- Variant logic handled via JavaScript template literals or `classnames` library
- Components are composable (e.g., Card wraps children, doesn't dictate content)

**Example: Card Component**
```jsx
// src/components/ui/Card.jsx
export const Card = ({
  variant = 'standard',
  className = '',
  children
}) => {
  const variants = {
    standard: 'bg-bg-card border-border-primary border-default shadow-brutal-lg p-card-md',
    featured: 'bg-bg-card-featured border-border-primary border-thick shadow-brutal-xl p-card-lg',
    inline: 'bg-bg-card-inline border-border-secondary border-thin shadow-brutal-sm p-card-sm',
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
```

**REQ-003 [P0]: Data-Driven Content**
- Project data stored in `/src/data/projects.js` as array of objects
- Components map over data arrays to generate UI
- Adding a new project = adding object to array, no component changes

**Example: Projects Data Structure**
```js
// src/data/projects.js
export const projects = [
  {
    id: 1,
    title: 'Project Name',
    description: 'Brief description of what this project does and why it matters.',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    metrics: {
      downloads: '260K',
      stars: 1200,
    },
    links: {
      github: 'https://github.com/username/repo',
      demo: 'https://demo-url.com',
    },
    featured: true,
  },
  // ... more projects
];
```

**REQ-004 [P1]: Performance Optimization**
- Code splitting for sections (lazy load About/Skills if below fold)
- Image optimization (WebP format, responsive sizes)
- Font subsetting (load only required weights/glyphs)
- Tailwind purge configuration removes unused utility classes

**Acceptance Criteria**:
- Production bundle < 200KB (JS + CSS)
- Lighthouse Performance score > 95
- First Contentful Paint < 1.5s on 3G connection
- No layout shift during load (CLS < 0.1)

### Non-Functional Requirements

**REQ-005 [P0]: Responsive Design**
- Mobile-first breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Navigation collapses to hamburger menu on mobile
- Project cards stack vertically on mobile, grid on desktop
- Typography scales down on mobile (e.g., h1: 48px → 36px)

**REQ-006 [P0]: Accessibility**
- Semantic HTML (nav, main, section, article tags)
- ARIA labels for icon-only buttons
- Keyboard navigation support (focus states visible)
- Color contrast ratios meet WCAG AA (4.5:1 for body text)
- Alt text for all images

**REQ-007 [P1]: Browser Compatibility**
- Support latest 2 versions of Chrome, Firefox, Safari, Edge
- Graceful degradation for older browsers (fallback fonts, no hard shadow)

**REQ-008 [P1]: SEO Optimization**
- Meta tags (title, description, og:image)
- Structured data (JSON-LD for Person schema)
- Sitemap.xml generation
- robots.txt configuration

---

## 8) Implementation Phases

### Phase 1: Foundation & Design Tokens [Week 1]
**Goal**: Establish project structure and design token system

**Deliverables**:
- [ ] Vite + React project initialized
- [ ] Tailwind CSS configured with custom theme extension
- [ ] Design tokens defined in `tailwind.config.js` and `tokens.css`
- [ ] Folder structure created (components, data, styles)
- [ ] Base typography and color system validated in Storybook or isolated page
- [ ] Git repository initialized with initial commit

**Success Criteria**:
- Changing one color in config updates all references
- Typography scale renders correctly across all sizes
- Shadow utilities apply hard shadows as specified

**REQ-009 [P0]: Design Token Validation**
- Create a "kitchen sink" page that displays all tokens (colors, shadows, typography)
- Verify that changing a token value updates all instances
- Document token naming conventions in README

---

### Phase 2: Core Components [Week 2]
**Goal**: Build reusable UI component library

**Deliverables**:
- [ ] Button component (3 variants: primary, secondary, ghost)
- [ ] Card component (3 variants: standard, featured, inline)
- [ ] Tag/Badge component for tech stack
- [ ] Link component (internal, external)
- [ ] Header navigation (desktop + mobile)
- [ ] Footer component

**Success Criteria**:
- All components use only Tailwind utility classes
- Zero hardcoded colors or spacing values
- Components accept variant props and className for extension
- Mobile navigation hamburger menu functional

**REQ-010 [P0]: Component Library Validation**
- Each component has example usage in a demo page
- Variants render correctly in all states (default, hover, active)
- Components are composable (can nest Card > Button without style conflicts)

---

### Phase 3: Content Sections [Week 2-3]
**Goal**: Build page sections with real content

**Deliverables**:
- [ ] Hero section with name, tagline, CTA
- [ ] Projects section with filterable/sortable cards
- [ ] About section with bio and experience
- [ ] Skills section with tech stack display
- [ ] Layout component tying sections together

**Success Criteria**:
- Projects render from `projects.js` data file
- Featured projects visually distinct from standard cards
- All sections responsive (mobile, tablet, desktop)
- Navigation links scroll to sections smoothly

**REQ-011 [P0]: Content Display Validation**
- Add at least 3 real projects to `projects.js`
- Verify metrics display correctly on project cards
- Test GitHub/demo links open in new tabs
- Validate mobile layout doesn't truncate text

---

### Phase 4: Polish & Deployment [Week 3]
**Goal**: Optimize, test, and deploy to production

**Deliverables**:
- [ ] Performance optimization (code splitting, image optimization)
- [ ] Accessibility audit (WCAG AA compliance)
- [ ] SEO meta tags and structured data
- [ ] Vercel deployment with custom domain
- [ ] Analytics integration (optional: Vercel Analytics or Plausible)
- [ ] Final cross-browser testing

**Success Criteria**:
- Lighthouse scores > 95 across all categories
- Site live on custom domain with HTTPS
- No console errors or warnings
- Mobile/desktop layouts tested on real devices

**REQ-012 [P0]: Production Readiness**
- All links functional (no 404s)
- Contact information or CTA drives measurable action
- Site loads in < 2s on 3G connection
- Favicon and og:image present and correct

---

## 9) In-Scope & Out-of-Scope

### In-Scope (Phase 1-4)
- Static portfolio website (no backend/database)
- Project showcase with metrics display
- About, Skills, and Contact sections
- Responsive design (mobile, tablet, desktop)
- Neobrutalist visual design system
- Deployment to Vercel with custom domain
- Basic SEO and accessibility
- Design token system for easy style updates

### Out-of-Scope (Future Iterations)
- **Forms/Input Fields**: No contact form (use mailto: link or external form service)
- **Interactive Elements**: No animations beyond hover/active states (Phase 1-4)
  - Future: Subtle transitions, scroll-based reveals, interactive project filters
- **Blog/CMS**: No content management system (static content only)
- **Backend API**: No server-side logic or database
- **User Authentication**: No login or user accounts
- **A/B Testing**: No experimentation framework (Phase 1-4)
- **Internationalization**: English-only (no i18n support)
- **Dark Mode Toggle**: Site is dark mode by default, no theme switcher

**Rationale**: Out-of-scope items add complexity without immediate ROI. Focus on delivering a polished, performant foundation before adding advanced features.

---

## 10) Critical Architectural Decisions (MUST ANSWER BEFORE CODING)

### Decision 1: Design Token Structure ✅ RESOLVED
**Question**: How should design tokens be structured to enable single-source-of-truth styling?

**Answer**:
- **Primary Source**: `/tailwind.config.js` extends `theme` with custom colors, spacing, typography, and references to shadows
- **Secondary Source**: `/src/styles/tokens.css` defines CSS variables for complex values (multi-part shadows)
- **Component Usage**: Components use ONLY Tailwind utility classes that reference tokens (e.g., `bg-primary`, `shadow-brutal-lg`)
- **Update Workflow**: Andrew edits `tailwind.config.js` to change colors/spacing; edits `tokens.css` to change shadows

**Validation**: Kitchen sink page in Phase 1 will verify that token changes propagate correctly.

---

### Decision 2: Component Folder Structure ✅ RESOLVED
**Question**: How should components be organized to maximize reusability and discoverability?

**Answer**:
```
/src/components
  /layout      → Page-level structure (Header, Footer, Layout wrapper)
  /ui          → Reusable primitives (Button, Card, Tag, Link)
  /sections    → Content sections (Hero, Projects, About, Skills)
```

**Rationale**:
- `/ui` components are pure and reusable (no direct data dependencies)
- `/sections` components consume data from `/src/data` and compose `/ui` components
- `/layout` components define page structure and apply site-wide styles

---

### Decision 3: Zero Style Duplication Strategy ✅ RESOLVED
**Question**: How do we ensure zero style duplication across components?

**Answer**:
- **Rule 1**: Components NEVER use inline styles (`style={{}}`)
- **Rule 2**: Components NEVER use hardcoded hex codes, pixel values, or arbitrary Tailwind values (e.g., `bg-[#FFFFFF]`)
- **Rule 3**: All visual properties pull from Tailwind utilities that reference tokens
- **Rule 4**: Variant logic uses JavaScript template literals or `classnames` library to compose utility classes

**Enforcement**:
- ESLint rule to flag inline styles (optional: `eslint-plugin-tailwindcss`)
- Code review checklist includes "No hardcoded values" check
- Component validation in Phase 2 verifies token usage

---

### Decision 4: Component Naming Convention ✅ RESOLVED
**Question**: What naming convention should be used for reusable components?

**Answer**:
- **Component Files**: PascalCase with `.jsx` extension (e.g., `Button.jsx`, `ProjectCard.jsx`)
- **Component Exports**: Named exports matching filename (e.g., `export const Button = () => {}`)
- **Props**: camelCase (e.g., `variant`, `className`, `isActive`)
- **Variants**: lowercase strings (e.g., `variant="primary"`, not `variant="Primary"`)
- **Data Files**: camelCase with `.js` extension (e.g., `projects.js`, `skills.js`)

**Rationale**: Follows React community conventions and ensures consistency across codebase.

---

### Decision 5: Project Data Management ✅ RESOLVED
**Question**: How should project content be stored and updated?

**Answer**:
- **Data Source**: `/src/data/projects.js` exports array of project objects
- **Schema**: Each project has `id`, `title`, `description`, `techStack`, `metrics`, `links`, `featured` (boolean)
- **Update Workflow**: Andrew edits `projects.js` to add/remove/update projects; no component changes required
- **Rendering**: `Projects.jsx` component maps over array and renders `ProjectCard` for each item

**Future Enhancement**: Move to CMS (Contentful, Sanity) if content updates become frequent.

---

## 11) Risks, Challenges, and Open Questions

### Known Risks

**RISK-001: Font Loading Performance** [Medium Severity]
- **Risk**: Custom fonts (Space Grotesk, Inter) may cause FOUT (Flash of Unstyled Text) or delay FCP
- **Mitigation**: Use `font-display: swap` in font-face declarations; subset fonts to include only required weights
- **Owner**: Andrew (Phase 4)

**RISK-002: Shadow Performance on Low-End Devices** [Low Severity]
- **Risk**: Hard box shadows on many elements may impact rendering performance on mobile
- **Mitigation**: Test on low-end Android devices; reduce shadow complexity if needed
- **Owner**: Andrew (Phase 4)

**RISK-003: Over-Engineering Component System** [Medium Severity]
- **Risk**: Building overly complex component library for a static site
- **Mitigation**: Follow YAGNI principle; only abstract when duplication occurs 2+ times
- **Owner**: Andrew (ongoing)

### Dependencies
- **Vercel Account**: Required for hosting (free tier sufficient)
- **Custom Domain**: DNS configuration needed for custom domain
- **Font Licenses**: Verify Inter and Space Grotesk are licensed for web use (both are open source)

### Open Questions
- **Q1**: Should projects be filterable by tech stack? (Nice-to-have, Phase 3 or later)
- **Q2**: Should there be a standalone Contact page or just a footer section? (Default: footer section)
- **Q3**: What analytics tool to use? (Options: Vercel Analytics, Plausible, Google Analytics)
- **Q4**: Should GitHub stars be fetched dynamically via API or hardcoded? (Default: hardcoded for simplicity)

---

## 12) Change History & Versioning

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-03 | Andrew | Initial visual specification (typography, buttons, cards, navigation) |
| 2.0 | 2025-10-03 | Andrew | Complete PRD refactor: added portfolio context, design token architecture, component inventory, implementation phases, critical architectural decisions |

---

## AI/LLM Best Practices Checklist

*(Note: This portfolio is a static website, not an AI/LLM product. Checklist included for PRD template compliance but not applicable to this project.)*

- [ ] N/A - No AI/LLM features in scope
- [ ] N/A - No model selection required
- [ ] N/A - No data sourcing/labeling needed
- [ ] N/A - No evaluation plan required
- [ ] N/A - No safety/toxicity concerns
- [ ] N/A - No bias mitigation needed

---

## PRD Verification & Validation

### Requirement Quality Check
- [x] Each requirement has a unique REQ-ID and is testable
- [x] Success metrics are measurable and tied to business objectives
- [x] Technical approach aligns with stated performance targets (Lighthouse > 95, < 200KB bundle)
- [x] Non-functional requirements are specific (REQ-005: responsive breakpoints, REQ-006: WCAG AA)

### Completeness Validation
- [x] All user personas have corresponding user stories (US-001, US-002, US-003)
- [x] Every component has clear acceptance criteria (Button variants, Card variants, etc.)
- [x] Risks have identified owners and mitigation strategies (RISK-001, RISK-002, RISK-003)
- [x] Dependencies explicitly called out (Vercel, custom domain, font licenses)

### Alignment Verification
- [x] Proposed solution directly addresses stated problem (showcase work with clean metrics display)
- [x] Technical complexity matches team capabilities (solo developer, React + Tailwind)
- [x] Resource requirements align with success metrics ROI (static site = low cost, high impact)
- [x] Scope boundaries are clear and defensible (no forms, no backend, no CMS in Phase 1-4)

---

## Gap Analysis & Next Steps

### Gap Analysis (What's Missing?)
- **Design Assets**: No mockups or wireframes yet (acceptable; neobrutalist style is well-defined)
- **Content**: Real project descriptions and metrics need to be written (Phase 3 deliverable)
- **Custom Domain**: Domain name not yet selected or purchased
- **Analytics Decision**: No decision on analytics tool (Q3 in Open Questions)

**Resolution**:
- Andrew to select and purchase custom domain before Phase 4
- Andrew to draft project descriptions during Phase 3
- Analytics decision deferred to Phase 4 (not blocking)

### Alignment Review (Does This Make Sense?)
- [x] Objectives align with proposed solution (distinctive portfolio + clean metrics display)
- [x] Technical approach matches constraints (solo developer, React + Tailwind)
- [x] Design token architecture achieves stated goal (single-source-of-truth styling)
- [x] Scope is achievable in 3-4 weeks

**No misalignments detected**. PRD is internally consistent.

### Next-Iteration Plan (How to Improve)

**Immediate Next Steps** (Before Phase 1):
1. **Domain Selection**: Choose and purchase custom domain
2. **Content Inventory**: List 5-10 projects to showcase, prioritize top 3 for Phase 3
3. **Font Validation**: Confirm Inter and Space Grotesk licenses allow web embedding

**Phase 1 Validation** (After Token Setup):
- Create kitchen sink page displaying all design tokens
- Test token changes propagate correctly (change primary color, verify all buttons update)
- Validate shadow utilities render hard shadows correctly

**Phase 2 Validation** (After Component Build):
- Review each component for hardcoded values (zero tolerance)
- Test component variants render correctly in isolation
- Verify mobile navigation hamburger menu functional

**Phase 3 Validation** (After Content Integration):
- Add 3+ real projects to `projects.js`
- Review metrics display for "clean, non-cocky" criteria
- Test responsive layouts on real mobile devices

**Phase 4 Validation** (Before Launch):
- Run Lighthouse audit (target: all scores > 95)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Accessibility audit with screen reader
- Final content review (typos, broken links)

**Approval Checkpoints**:
- **Phase 1 Complete**: Andrew approves design token system (kitchen sink page review)
- **Phase 2 Complete**: Andrew approves component library (demo page review)
- **Phase 3 Complete**: Andrew approves content and layout (full site preview)
- **Phase 4 Complete**: Andrew approves production deployment (final QA)

---

## Smallest Viable Improvement

**What's the minimum input needed to advance?**

This PRD is ready for implementation. No additional context required.

**Recommended immediate action**:
1. Initialize Vite + React project: `npm create vite@latest 2025-profile -- --template react`
2. Install Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
3. Create initial folder structure (`/components`, `/data`, `/styles`)
4. Define design tokens in `tailwind.config.js` (copy from Section 5)
5. Build kitchen sink page to validate tokens

**Next user input needed**: After Phase 1 validation, provide feedback on design token system (colors, shadows, typography). This will inform any adjustments before Phase 2 component build.

---

**PRD Status**: ✅ **APPROVED FOR IMPLEMENTATION**
**Next Milestone**: Phase 1 completion (design tokens + project structure)
**Estimated Timeline**: 3-4 weeks to production launch
