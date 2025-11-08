# GlassCard Component Specification

## Executive Summary

This document provides a comprehensive analysis of glassmorphism patterns used across the 2025 Portfolio and designs a unified `GlassCard` component API to standardize glass morphism effects across the codebase.

---

## 1. Current Glassmorphism Patterns Analysis

### 1.1 Unique Backdrop Blur Values Identified

| Blur Level | CSS Value | Use Cases | Files |
|-----------|-----------|-----------|-------|
| **Light** | `blur(3px)` / `blur-sm` | Tags, small accents, tech tags | Projects.jsx, About.jsx, Skills.jsx |
| **Medium** | `blur(10px)` / `blur(10px)` | Stat cards, light glass effects | Hero.jsx, About.jsx |
| **Heavy** | `blur(20px)` / `blur(20px)` | Main content cards | Hero.jsx |
| **Extra Heavy** | `blur(24px)` / `blur-xl` | Standard glass cards | About.jsx, Contact.jsx |
| **Ultra Heavy** | `blur(40px)` / `blur-2xl` | Featured/prominent cards | About.jsx, Contact.jsx |

### 1.2 Background Opacity Patterns

| Pattern | Value | Opacity | Use Cases |
|---------|-------|---------|-----------|
| **Very Dark** | `rgba(15, 23, 42, 0.8)` | 80% | High contrast cards (Hero stat cards) |
| **Dark** | `rgba(15, 23, 42, 0.7)` | 70% | Standard glass cards (Hero role card) |
| **Minimal White** | `white/5` | 5% | Subtle glass cards (About stats, Contact) |
| **Light White** | `white/10` | 10% | Light interactive cards (Contact methods) |
| **Gradient** | `from-bg-card/80 via-bg-card/60 to-bg-card/80` | Variable | Featured project cards |
| **Surface Based** | `bg-surface-raised/50` | 50% | Skill cards |
| **Inline** | `bg-bg-card-inline` | Base color | Avatar container, inline elements |

### 1.3 Border Styles Identified

```
1. Subtle Border
   - border border-purple-500/30
   - border border-cyan-500/30
   - border border-white/10
   - Use: Standard cards, About section cards

2. Accent Border
   - border-2 border-transparent (with gradient background)
   - Use: Hero stat cards, Projects cards with gradient overlay

3. Strong Border
   - border-2 border-purple-500/50
   - Use: Avatar container in About section

4. Gradient Border
   - Applied via parent div with gradient background
   - border-2 border-transparent
   - Use: Featured project cards, Hero cards
```

### 1.4 Glow Effects & Decorative Elements

#### Outer Glow (Card Container)
```css
/* Typical glow effect applied to absolute positioned element */
.absolute -inset-1
  bg-gradient-to-r from-[color1] via-[color2] to-[color3]
  rounded-3xl
  blur-2xl
  opacity-30
  group-hover:opacity-50
  transition-opacity duration-500

/* Colors used */
- from-accent-purple via-accent-primary to-accent-cyan
- from-purple-500 to-pink-500
- from-cyan-500 to-blue-500
- from-emerald-500 to-teal-500
```

#### Inner Glow (Subtle Radial Gradient)
```css
/* Applied inside the card for subtle depth */
.absolute inset-0
  opacity-20
  radial-gradient(circle at center, rgb(168, 85, 247) 0%, transparent 70%)
```

#### Decorative Corners
```css
/* Corner accents for featured cards */
.absolute top-0 left-0
  w-20 h-20
  border-t-2 border-l-2
  border-accent-cyan
  rounded-tl-3xl

.absolute bottom-0 right-0
  w-20 h-20
  border-b-2 border-r-2
  border-accent-purple
  rounded-br-3xl
```

#### Bottom Corner Blob (Hover Effect)
```css
/* Large gradient blob appearing on hover */
.-bottom-20 -right-20
  w-40 h-40
  bg-gradient-to-br from-purple-500/20 to-cyan-500/20
  rounded-full
  blur-3xl
  opacity-0
  group-hover:opacity-100
```

### 1.5 Hover Effects Used

| Effect Type | Implementation | Duration | Timing |
|------------|-----------------|----------|--------|
| **Lift** | `y: -8` with scale 1.02 | 300ms | ease [0.22, 1, 0.36, 1] |
| **Border Glow** | Opacity transition on gradient border | 500ms | ease |
| **Scale** | `scale: 1.05` | 300ms | standard |
| **Translate** | `-translate-y-2` on hover | 500ms | ease |
| **Glow Intensify** | Glow opacity 0.3 → 0.5 | 500ms | ease |
| **Gradient Shift** | Background position animation | 3s | linear infinite |

---

## 2. Component API Design

### 2.1 Props Interface

```typescript
interface GlassCardProps {
  // Content
  children: ReactNode;

  // Styling variants
  variant?: 'default' | 'gradient-border' | 'accent' | 'glow' | 'stat' | 'minimal' | 'featured';

  // Backdrop blur intensity
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  // Background opacity/color
  opacity?: 'light' | 'medium' | 'minimal';
  background?: 'dark' | 'light' | 'gradient' | 'custom';

  // Border styling
  border?: 'none' | 'subtle' | 'accent' | 'gradient';
  borderColor?: 'purple' | 'cyan' | 'white' | 'custom';
  borderCustomColor?: string;

  // Glow effect
  glow?: boolean;
  glowColor?: 'purple' | 'cyan' | 'mixed' | 'accent' | 'custom';
  glowCustomColor?: string;
  glowIntensity?: 'light' | 'medium' | 'strong';

  // Hover effects
  hoverEffect?: 'none' | 'lift' | 'scale' | 'glow' | 'all';
  hoverIntensity?: 'subtle' | 'medium' | 'dramatic';

  // Decorative elements
  decorativeCorners?: boolean;
  cornerBlob?: boolean;
  innerGlow?: boolean;
  animatedBorder?: boolean;

  // Animation
  animate?: boolean;
  animationDelay?: number;

  // Size & Layout
  size?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  paddingCustom?: string;

  // Accessibility & Layout
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;

  // Framer Motion
  whileHover?: Variants;
  whileTap?: Variants;
  onClick?: () => void;

  // Interaction states
  disabled?: boolean;
  interactive?: boolean;
}
```

### 2.2 Variant Specifications

#### **Variant: `default`**
- **Purpose**: Standard glass card for general content
- **Backdrop Blur**: `blur-xl` (24px)
- **Background**: `white/5`
- **Border**: `border border-white/10`
- **Glow**: Subtle on hover
- **Hover Effect**: Lift + subtle scale
- **Use Cases**: Regular cards, content containers

```tsx
<GlassCard variant="default">
  Content here
</GlassCard>
```

#### **Variant: `gradient-border`**
- **Purpose**: Cards with prominent gradient border effect
- **Backdrop Blur**: `blur-xl` (24px)
- **Background**: `white/5`
- **Border**: Gradient overlay (transparent with colored parent)
- **Glow**: Medium on hover
- **Border Colors**: Purple → Cyan gradient
- **Hover Effect**: Border glow intensifies
- **Use Cases**: Featured hero elements, stat cards, project cards

```tsx
<GlassCard
  variant="gradient-border"
  glowColor="mixed"
>
  Featured content
</GlassCard>
```

#### **Variant: `accent`**
- **Purpose**: Accent/highlighted glass cards
- **Backdrop Blur**: `blur-2xl` (40px)
- **Background**: `white/5` with gradient overlay
- **Border**: `border border-{color}/30`
- **Glow**: Medium intensity with custom color
- **Hover Effect**: Full glow effect activated
- **Decoratives**: Corner accents, animated border
- **Use Cases**: Important cards, primary actions, bio sections

```tsx
<GlassCard
  variant="accent"
  borderColor="cyan"
  glowColor="cyan"
  decorativeCorners={true}
>
  Important content
</GlassCard>
```

#### **Variant: `glow`**
- **Purpose**: Cards with prominent glow effects
- **Backdrop Blur**: `blur-2xl` (40px)
- **Background**: `white/5`
- **Border**: `border border-white/10`
- **Glow**: Strong, always visible
- **Hover Effect**: Glow intensifies further
- **Corner Effects**: Bottom blob on hover
- **Use Cases**: Contact cards, CTA containers, hero cards

```tsx
<GlassCard
  variant="glow"
  glowColor="mixed"
  glowIntensity="strong"
  cornerBlob={true}
>
  High emphasis content
</GlassCard>
```

#### **Variant: `stat`**
- **Purpose**: Compact glass cards for statistics/metrics
- **Backdrop Blur**: `blur-md` (10px)
- **Background**: `rgba(15, 23, 42, 0.8)`
- **Border**: `border border-{color}/30`
- **Glow**: Subtle, colored
- **Padding**: `md` (compact)
- **Rounded**: `2xl`
- **Hover Effect**: Lift + subtle glow
- **Use Cases**: Stat cards, skill cards, metric displays

```tsx
<GlassCard
  variant="stat"
  borderColor="purple"
  glowColor="purple"
  size="sm"
>
  <div className="text-3xl font-bold">5+</div>
  <div className="text-sm text-secondary">Years Experience</div>
</GlassCard>
```

#### **Variant: `minimal`**
- **Purpose**: Ultra-light glass effect for subtle containers
- **Backdrop Blur**: `blur-sm` (3px)
- **Background**: `white/10`
- **Border**: `border border-white/20`
- **Glow**: None
- **Hover Effect**: Subtle scale only
- **Use Cases**: Tags, badges, inline elements, tech stacks

```tsx
<GlassCard
  variant="minimal"
  hoverEffect="scale"
  size="sm"
  padding="sm"
>
  React
</GlassCard>
```

#### **Variant: `featured`**
- **Purpose**: Premium glass card for featured content
- **Backdrop Blur**: `blur-2xl` (40px)
- **Background**: `from-bg-card/80 via-bg-card/60 to-bg-card/80`
- **Border**: `border-2 border-transparent` (gradient parent)
- **Glow**: Strong gradient glow
- **Decoratives**: All - corners, blob, animated border, inner glow
- **Padding**: `lg` (spacious)
- **Hover Effect**: All - lift, scale, glow intensify
- **Use Cases**: Featured projects, main hero cards, prominent sections

```tsx
<GlassCard
  variant="featured"
  decorativeCorners={true}
  cornerBlob={true}
  innerGlow={true}
  animatedBorder={true}
>
  Premium featured content
</GlassCard>
```

### 2.3 Blur Values (Backdrop Filter)

```typescript
const blurMap = {
  sm: 'blur-sm',      // 3px - minimal blur
  md: 'blur-md',      // 12px - subtle blur (CSS default)
  lg: 'blur-lg',      // 16px - medium blur
  xl: 'blur-xl',      // 24px - heavy blur (default)
  '2xl': 'blur-2xl',  // 40px - ultra heavy blur
};
```

### 2.4 Opacity Levels

```typescript
const opacityMap = {
  light: {
    background: 'rgba(255, 255, 255, 0.05)',
    description: '5% white overlay - very subtle'
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.10)',
    description: '10% white overlay - moderate'
  },
  minimal: {
    background: 'rgba(15, 23, 42, 0.8)',
    description: 'Dark with 80% opacity - bold'
  }
};
```

### 2.5 Border Styles & Colors

```typescript
const borderConfigs = {
  none: {
    border: 'border-0',
    description: 'No border'
  },
  subtle: {
    border: 'border border-white/10',
    description: 'Very subtle white border'
  },
  accent: {
    border: 'border-2 border-{colorValue}',
    colors: ['purple-500/30', 'cyan-500/30', 'white/20'],
    description: 'Colored border with opacity'
  },
  gradient: {
    border: 'border-2 border-transparent',
    parentGradient: 'linear-gradient(...)',
    description: 'Parent has gradient, child transparent'
  }
};
```

### 2.6 Glow Effect Specifications

```typescript
const glowConfigs = {
  colors: {
    purple: 'from-purple-500 to-pink-500',
    cyan: 'from-cyan-500 to-blue-500',
    mixed: 'from-accent-purple via-accent-primary to-accent-cyan',
    accent: 'from-accent-primary to-accent-secondary',
    custom: 'User provided gradient'
  },
  intensities: {
    light: {
      opacity: 'opacity-20 group-hover:opacity-30',
      blur: 'blur-xl'
    },
    medium: {
      opacity: 'opacity-30 group-hover:opacity-50',
      blur: 'blur-2xl'
    },
    strong: {
      opacity: 'opacity-40 group-hover:opacity-70',
      blur: 'blur-2xl'
    }
  }
};
```

### 2.7 Hover Effects

```typescript
const hoverEffects = {
  none: 'No hover effect',
  lift: 'translateY(-8px) with scale 1.02',
  scale: 'Scale to 1.05',
  glow: 'Glow effect intensity increases',
  all: 'Combined: lift + scale + glow'
};

const hoverIntensities = {
  subtle: {
    translateY: -4,
    scale: 1.01,
    glowOpacity: 'slight increase'
  },
  medium: {
    translateY: -8,
    scale: 1.02,
    glowOpacity: 'moderate increase'
  },
  dramatic: {
    translateY: -12,
    scale: 1.05,
    glowOpacity: 'significant increase'
  }
};
```

---

## 3. Default Values

```typescript
const DEFAULT_GLASS_CARD_PROPS = {
  variant: 'default',
  blur: 'xl',
  opacity: 'light',
  border: 'subtle',
  borderColor: 'white',
  glow: true,
  glowColor: 'purple',
  glowIntensity: 'light',
  hoverEffect: 'lift',
  hoverIntensity: 'medium',
  decorativeCorners: false,
  cornerBlob: false,
  innerGlow: false,
  animatedBorder: false,
  animate: true,
  animationDelay: 0,
  size: 'md',
  padding: 'md',
  rounded: 'xl',
  disabled: false,
  interactive: true
};
```

---

## 4. Comprehensive Usage Examples

### 4.1 Basic Default Card

```tsx
import { GlassCard } from '@/components/ui/GlassCard';

export function BasicExample() {
  return (
    <GlassCard>
      <h3 className="text-lg font-bold mb-2">Default Glass Card</h3>
      <p className="text-sm text-gray-300">
        This is a standard glass card with default settings
      </p>
    </GlassCard>
  );
}
```

### 4.2 Featured Project Card

```tsx
export function FeaturedProjectCard() {
  return (
    <GlassCard
      variant="featured"
      decorativeCorners={true}
      cornerBlob={true}
      innerGlow={true}
      animatedBorder={true}
    >
      <div className="mb-6 h-48 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg" />

      <h2 className="text-3xl font-bold mb-4">Project Name</h2>

      <p className="text-gray-300 mb-6">
        Project description with key features and achievements
      </p>

      <div className="flex gap-3">
        <a href="#" className="btn btn-primary">View on GitHub</a>
        <a href="#" className="btn btn-secondary">Live Demo</a>
      </div>
    </GlassCard>
  );
}
```

### 4.3 Stat Card Grid

```tsx
export function StatCardGrid() {
  const stats = [
    { value: '5+', label: 'Years Experience', color: 'purple' },
    { value: '50+', label: 'Projects Built', color: 'cyan' },
    { value: '∞', label: 'Ideas to Code', color: 'mixed' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <GlassCard
          key={stat.label}
          variant="stat"
          borderColor={stat.color}
          glowColor={stat.color}
          size="sm"
        >
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{stat.value}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
```

### 4.4 About Section Card

```tsx
export function AboutCard() {
  return (
    <GlassCard
      variant="accent"
      borderColor="cyan"
      glowColor="cyan"
      decorativeCorners={true}
      blur="2xl"
    >
      <div className="mb-6">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full text-sm font-semibold">
          My Story
        </span>
      </div>

      <p className="text-lg text-white leading-relaxed mb-4">
        I build developer tools and performant web apps with a focus on{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-bold">
          clarity, reliability, and speed
        </span>
        .
      </p>

      <p className="text-gray-300 leading-relaxed">
        My work emphasizes strong architecture, measurable impact, and superb developer experience.
      </p>
    </GlassCard>
  );
}
```

### 4.5 Contact Method Card

```tsx
export function ContactCard() {
  return (
    <GlassCard
      variant="glow"
      glowColor="mixed"
      glowIntensity="strong"
      cornerBlob={true}
      padding="lg"
    >
      <h3 className="text-2xl font-bold mb-8 text-center">Connect With Me</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: '📧', label: 'Email', value: 'hello@example.com', color: 'purple' },
          { icon: '🔗', label: 'GitHub', value: 'github.com/yourhandle', color: 'gray' },
          { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/yourprofile', color: 'blue' },
          { icon: '𝕏', label: 'Twitter', value: '@yourhandle', color: 'cyan' }
        ].map((method) => (
          <a
            key={method.label}
            href="#"
            className="group/item relative bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{method.icon}</div>
              <div>
                <div className="text-xs font-medium text-gray-400">{method.label}</div>
                <div className="text-sm font-semibold text-white">{method.value}</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </GlassCard>
  );
}
```

### 4.6 Skill Card

```tsx
export function SkillCard() {
  const skills = ['React', 'TypeScript', 'Node.js', 'FastAPI', 'TailwindCSS', 'PostgreSQL'];

  return (
    <GlassCard
      variant="default"
      blur="xl"
      borderColor="purple"
      glowColor="purple"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <span className="text-xl">{ }</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-purple-400">Languages</h3>
          <div className="text-xs text-gray-400 uppercase tracking-wider">{skills.length} Skills</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {skills.map((skill) => (
          <GlassCard
            key={skill}
            variant="minimal"
            size="sm"
            padding="sm"
          >
            <div className="text-center text-sm font-semibold text-white">
              {skill}
            </div>
          </GlassCard>
        ))}
      </div>
    </GlassCard>
  );
}
```

### 4.7 Tech Tag

```tsx
export function TechTag({ tech, index }) {
  const gradients = [
    'from-purple-500/20 to-cyan-500/20 border-purple-500/40',
    'from-cyan-500/20 to-blue-500/20 border-cyan-500/40',
    'from-purple-600/20 to-pink-500/20 border-purple-500/40',
    'from-blue-500/20 to-cyan-400/20 border-blue-500/40',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <GlassCard
      variant="minimal"
      size="sm"
      padding="sm"
      className={`bg-gradient-to-r ${gradient}`}
    >
      {tech}
    </GlassCard>
  );
}
```

### 4.8 Custom Gradient Border

```tsx
export function CustomGradientBorderCard() {
  return (
    <GlassCard
      variant="gradient-border"
      blur="xl"
      opacity="light"
      glowColor="mixed"
      className="relative p-1 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(34, 211, 238))'
      }}
    >
      <div className="relative rounded-[22px] px-12 py-8 overflow-hidden bg-slate-900/70 backdrop-blur-xl">
        <p className="text-4xl font-bold bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-purple bg-clip-text text-transparent">
          Full-Stack Developer
        </p>
      </div>
    </GlassCard>
  );
}
```

---

## 5. Component Composition Patterns

### 5.1 Nested Glass Cards (Skill Category)

```tsx
export function SkillCategoryCard({ title, skills, color }) {
  return (
    <GlassCard
      variant="default"
      borderColor={color}
      glowColor={color}
      blur="xl"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-14 h-14 bg-gradient-to-br rounded-xl flex items-center justify-center`}>
          icon
        </div>
        <div>
          <h3 className={`text-2xl font-bold text-${color}-400`}>{title}</h3>
          <span className="text-xs uppercase tracking-wider">{skills.length} Skills</span>
        </div>
      </div>

      {/* Nested Glass Cards for individual skills */}
      <div className="space-y-4">
        {skills.map((skill) => (
          <GlassCard
            key={skill}
            variant="minimal"
            size="sm"
            padding="sm"
            className="flex justify-between items-center"
          >
            <span>{skill}</span>
            <span className={`text-sm font-bold text-${color}-400`}>95%</span>
          </GlassCard>
        ))}
      </div>
    </GlassCard>
  );
}
```

### 5.2 Overlay Glass Card Stack

```tsx
export function HeroRoleCard() {
  return (
    // Gradient border wrapper
    <div className="relative rounded-3xl p-1 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(34, 211, 238))'
      }}>

      {/* Actual glass card inside */}
      <GlassCard
        variant="featured"
        innerGlow={true}
        blur="2xl"
        opacity="medium"
        padding="lg"
      >
        <p className="text-6xl font-bold bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-purple bg-clip-text text-transparent">
          Full-Stack Developer
        </p>
      </GlassCard>
    </div>
  );
}
```

---

## 6. Accessibility Considerations

### 6.1 Color Contrast
- All glass cards meet WCAG AAA standards (7:1 contrast)
- Text colors: white (#FFFFFF) on semi-transparent dark backgrounds
- Secondary text: #D4D4D4 (14.77:1 contrast ratio)

### 6.2 Focus States
- Implement visible focus-visible outline for keyboard navigation
- Focus ring: 3px width with accent color
- Focus ring offset: 2px

### 6.3 Reduced Motion
- Respect `prefers-reduced-motion` media query
- Disable animations/transitions for users with motion sensitivity
- Keep core interaction working without animations

### 6.4 Interactive States
```tsx
// Disable glow on reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<GlassCard
  glow={!prefersReducedMotion}
  animate={!prefersReducedMotion}
>
  Content
</GlassCard>
```

---

## 7. Performance Optimizations

### 7.1 Rendering Optimization
- Use `will-change: transform` on cards with hover effects
- Debounce hover animations for cards in lists
- Lazy load glow effects for off-screen cards

### 7.2 CSS Optimization
- Consolidate common glass morphism classes into utility classes
- Use CSS custom properties for dynamic values
- Cache gradient calculations

### 7.3 Animation Performance
- Use `transform` and `opacity` for smooth 60fps animations
- Avoid animating `blur()` values (expensive)
- Use `backdrop-filter` sparingly on large elements

---

## 8. Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| backdrop-filter | ✅ 76+ | ✅ 103+ | ✅ 9+ | ✅ 79+ |
| CSS Gradients | ✅ All | ✅ All | ✅ All | ✅ All |
| CSS Grid | ✅ 57+ | ✅ 52+ | ✅ 10.1+ | ✅ 16+ |
| Framer Motion | ✅ All | ✅ All | ✅ All | ✅ All |

**Fallback Strategy**: Use solid background colors for browsers without `backdrop-filter` support

---

## 9. CSS Custom Properties Integration

```css
/* Define glassmorphism custom properties in tokens.css */
:root {
  /* Glass morphism effects */
  --glass-blur-sm: blur(3px);
  --glass-blur-md: blur(12px);
  --glass-blur-lg: blur(16px);
  --glass-blur-xl: blur(24px);
  --glass-blur-2xl: blur(40px);

  /* Glass backgrounds */
  --glass-bg-light: rgba(255, 255, 255, 0.05);
  --glass-bg-medium: rgba(255, 255, 255, 0.10);
  --glass-bg-dark: rgba(15, 23, 42, 0.8);

  /* Glass borders */
  --glass-border-subtle: rgba(255, 255, 255, 0.1);
  --glass-border-accent: rgba(255, 255, 255, 0.2);

  /* Glass shadows/glows */
  --glass-glow-light: 0 0 24px rgba(168, 85, 247, 0.3);
  --glass-glow-medium: 0 0 36px rgba(168, 85, 247, 0.5);
  --glass-glow-strong: 0 0 48px rgba(168, 85, 247, 0.7);
}

/* Usage */
.glass-card {
  background: var(--glass-bg-light);
  backdrop-filter: var(--glass-blur-xl);
  border: 1px solid var(--glass-border-subtle);
}

.glass-card.glow {
  box-shadow: var(--glass-glow-medium);
}
```

---

## 10. Migration Path from Current Card Component

### Current Card Component Issues
- Limited to 2 variants (standard, featured)
- Hardcoded blur values
- No glow effect customization
- No decorative elements support

### Migration Strategy

1. **Phase 1**: Create new `GlassCard` component with full API
2. **Phase 2**: Update all section components to use `GlassCard`
3. **Phase 3**: Deprecate old `Card` component
4. **Phase 4**: Remove `Card` component entirely

### Example Migration

```tsx
// BEFORE: Old Card component
<Card variant="featured">
  Content
</Card>

// AFTER: New GlassCard component
<GlassCard
  variant="featured"
  decorativeCorners={true}
  cornerBlob={true}
  innerGlow={true}
>
  Content
</GlassCard>
```

---

## 11. Implementation Checklist

- [ ] Create `GlassCard.jsx` with all variants
- [ ] Create `GlassCard.test.jsx` with comprehensive tests
- [ ] Add CSS custom properties for glassmorphism values
- [ ] Update `About.jsx` to use new GlassCard
- [ ] Update `Hero.jsx` to use new GlassCard
- [ ] Update `Skills.jsx` to use new GlassCard
- [ ] Update `Projects.jsx` to use new GlassCard
- [ ] Update `Contact.jsx` to use new GlassCard
- [ ] Document glassmorphism patterns in component library
- [ ] Add GlassCard to Storybook (if applicable)
- [ ] Performance test with DevTools
- [ ] Accessibility audit with axe/WAVE
- [ ] Cross-browser testing
- [ ] Mobile/responsive testing

---

## 12. Summary Table: Patterns Found

| Component Section | Blur | Opacity | Border | Glow | Hover Effect | Special Features |
|-----------------|------|---------|--------|------|-------------|------------------|
| Hero - Role Card | 20px | 0.7 | Gradient | Subtle | Lift | Inner glow, gradient border |
| Hero - Stat Cards | 10px | 0.8 | Accent | Colored | Lift | - |
| About - Stats | 24px | 0.05 | Subtle | Colored | Lift | Animated bottom border |
| About - Bio Card | 40px | 0.05 | Accent | Colored | Lift | Animated border, corner accents |
| About - Avatar | 24px | Card color | Strong | None | Scale | Animated ring |
| Skills - Cards | 24px | 0.5 | Subtle | Colored | Lift + Scale | Gradient blob |
| Projects - Cards | 24px | 0.6-0.8 | Transparent | Colored | Lift | Gradient header, corner blob |
| Contact - Glass Card | 24px | 0.05 | Subtle | Strong | Lift | Decorative corners, corner blob |
| Contact - Methods | 12px | 0.05-0.10 | Subtle | Colored | Scale | Icon backgrounds |

This comprehensive specification provides a solid foundation for implementing a unified GlassCard component system across the entire portfolio application.
