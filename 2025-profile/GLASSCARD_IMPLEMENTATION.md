# GlassCard Component - Implementation Guide

## Component File Structure

```
src/
├── components/
│   └── ui/
│       ├── GlassCard/
│       │   ├── GlassCard.jsx          (Main component)
│       │   ├── GlassCard.types.ts     (TypeScript definitions)
│       │   ├── GlassCard.module.css   (Styles)
│       │   ├── GlassCard.test.jsx     (Tests)
│       │   └── index.js               (Exports)
│       └── ...other components
└── ...
```

---

## Complete GlassCard Component Implementation

### 1. GlassCard.jsx

```jsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './GlassCard.module.css';

/**
 * GlassCard Component
 *
 * A versatile glass morphism card component with multiple variants,
 * customizable effects, and animation support.
 *
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
export const GlassCard = ({
  // Content
  children,

  // Styling
  variant = 'default',
  blur = 'xl',
  opacity = 'light',
  background = 'light',
  border = 'subtle',
  borderColor = 'white',
  borderCustomColor = undefined,

  // Glow effect
  glow = true,
  glowColor = 'purple',
  glowIntensity = 'light',
  glowCustomColor = undefined,

  // Border animation
  animatedBorder = false,

  // Hover effects
  hoverEffect = 'lift',
  hoverIntensity = 'medium',

  // Decorative elements
  decorativeCorners = false,
  cornerBlob = false,
  innerGlow = false,

  // Animation
  animate = true,
  animationDelay = 0,

  // Size & Layout
  size = 'md',
  padding = 'md',
  rounded = 'xl',

  // Accessibility & behavior
  disabled = false,
  interactive = true,
  className = '',
  onClick = undefined,
  whileHover = undefined,
  whileTap = undefined,
}) => {
  // State for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Variant configurations
  const variantConfigs = {
    default: {
      blur: 'blur-xl',
      opacity: 'white/5',
      border: 'border border-white/10',
      glow: true,
      glowIntensity: 'light',
      hoverEffect: 'lift',
    },
    'gradient-border': {
      blur: 'blur-xl',
      opacity: 'white/5',
      border: 'border-2 border-transparent',
      glow: true,
      glowIntensity: 'medium',
      padding: 'p-8',
    },
    accent: {
      blur: 'blur-2xl',
      opacity: 'white/5',
      border: 'border border-{color}/30',
      glow: true,
      glowIntensity: 'medium',
      decorativeCorners: true,
    },
    glow: {
      blur: 'blur-2xl',
      opacity: 'white/5',
      border: 'border border-white/10',
      glow: true,
      glowIntensity: 'strong',
      cornerBlob: true,
    },
    stat: {
      blur: 'blur-md',
      opacity: 'rgba(15, 23, 42, 0.8)',
      border: 'border border-{color}/30',
      glow: true,
      glowIntensity: 'light',
      size: 'sm',
      padding: 'p-6',
    },
    minimal: {
      blur: 'blur-sm',
      opacity: 'white/10',
      border: 'border border-white/20',
      glow: false,
      hoverEffect: 'scale',
      size: 'sm',
      padding: 'p-4',
    },
    featured: {
      blur: 'blur-2xl',
      opacity: 'from-bg-card/80 via-bg-card/60 to-bg-card/80',
      border: 'border-2 border-transparent',
      glow: true,
      glowIntensity: 'strong',
      decorativeCorners: true,
      cornerBlob: true,
      innerGlow: true,
      animatedBorder: true,
      padding: 'p-10',
    },
  };

  // Get config from variant
  const config = variantConfigs[variant] || variantConfigs.default;

  // Merge with overrides
  const finalBlur = blur || config.blur;
  const finalOpacity = opacity === 'light' ? 'white/5' : opacity === 'medium' ? 'white/10' : opacity;
  const finalBorder = border || config.border;
  const finalGlow = glow !== undefined ? glow : config.glow;
  const finalGlowIntensity = glowIntensity || config.glowIntensity;
  const finalHoverEffect = hoverEffect || config.hoverEffect;
  const finalDecorativeCorners = decorativeCorners || config.decorativeCorners;
  const finalCornerBlob = cornerBlob || config.cornerBlob;
  const finalInnerGlow = innerGlow || config.innerGlow;

  // Blur value mapping
  const blurMap = {
    sm: 'blur-sm',
    md: 'blur-md',
    lg: 'blur-lg',
    xl: 'blur-xl',
    '2xl': 'blur-2xl',
  };

  // Size mapping
  const sizeMap = {
    sm: 'p-4',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-12',
    xl: 'p-12 md:p-16',
  };

  // Padding mapping
  const paddingMap = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
    custom: padding,
  };

  // Rounded mapping
  const roundedMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };

  // Glow color mapping
  const glowColorMap = {
    purple: 'from-purple-500 to-pink-500',
    cyan: 'from-cyan-500 to-blue-500',
    mixed: 'from-accent-purple via-accent-primary to-accent-cyan',
    accent: 'from-accent-primary to-accent-secondary',
    custom: glowCustomColor,
  };

  // Glow intensity mapping
  const glowIntensityMap = {
    light: {
      container: 'opacity-20 group-hover:opacity-30',
      blur: 'blur-xl',
    },
    medium: {
      container: 'opacity-30 group-hover:opacity-50',
      blur: 'blur-2xl',
    },
    strong: {
      container: 'opacity-40 group-hover:opacity-70',
      blur: 'blur-2xl',
    },
  };

  // Hover effect mapping
  const hoverEffectMap = {
    none: {},
    lift: { y: -8, scale: 1.02 },
    scale: { scale: 1.05 },
    glow: { scale: 1.02 },
    all: { y: -8, scale: 1.02 },
  };

  const hoverIntensityMap = {
    subtle: { y: -4, scale: 1.01 },
    medium: { y: -8, scale: 1.02 },
    dramatic: { y: -12, scale: 1.05 },
  };

  // Get hover values
  const hoverValues = hoverEffect === 'none'
    ? {}
    : { ...hoverIntensityMap[hoverIntensity] };

  const glowIntensityConfig = glowIntensityMap[finalGlowIntensity];

  // Border color mapping
  const borderColorMap = {
    purple: 'border-purple-500',
    cyan: 'border-cyan-500',
    white: 'border-white',
    custom: borderCustomColor,
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: animationDelay,
      },
    },
  };

  const animatedBorderVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  // Build className
  const baseClasses = `
    relative
    group
    ${roundedMap[rounded] || 'rounded-xl'}
    overflow-hidden
    transition-all
    duration-300
    ${!disabled && interactive ? 'cursor-pointer' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  const glassClasses = `
    relative
    ${blurMap[finalBlur] || 'blur-xl'}
    ${typeof finalOpacity === 'string' && finalOpacity.includes('/')
      ? `bg-${finalOpacity}`
      : finalOpacity}
    backdrop-blur-xl
    ${finalBorder}
    ${finalBorder.includes('{color}')
      ? finalBorder.replace('{color}', borderColorMap[borderColor])
      : ''}
    shadow-xl
    ${!disabled && interactive ? 'group-hover:shadow-2xl' : ''}
  `;

  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      variants={animate && !prefersReducedMotion ? containerVariants : {}}
      initial={animate && !prefersReducedMotion ? 'hidden' : 'visible'}
      whileInView={animate && !prefersReducedMotion ? 'visible' : {}}
      viewport={animate && !prefersReducedMotion ? { once: true, margin: '-100px' } : {}}
      whileHover={
        !disabled && !prefersReducedMotion && (hoverEffect !== 'none' || whileHover)
          ? { ...hoverValues, ...whileHover }
          : undefined
      }
      whileTap={!disabled && !prefersReducedMotion ? { scale: 0.98 } : undefined}
      onClick={!disabled && interactive ? onClick : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          onClick();
        }
      }}
    >
      {/* Animated Border Gradient (if enabled) */}
      {animatedBorder && (
        <motion.div
          className={`absolute -inset-[1px] rounded-${rounded} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
          style={{
            background: `linear-gradient(90deg, rgba(168, 85, 247, 0.4), rgba(6, 182, 212, 0.4), rgba(168, 85, 247, 0.4))`,
            backgroundSize: '200% 100%',
          }}
          variants={animatedBorderVariants}
          animate="animate"
        />
      )}

      {/* Glow Effect (outer) */}
      {finalGlow && (
        <div
          className={`
            absolute -inset-1 rounded-${rounded}
            bg-gradient-to-r ${glowColorMap[glowColor]}
            blur-2xl
            ${glowIntensityConfig.container}
            transition-opacity duration-500
            pointer-events-none
            -z-10
          `}
        />
      )}

      {/* Main Glass Card */}
      <div className={`${glassClasses} h-full`}>
        {/* Inner Glow (subtle radial) */}
        {finalInnerGlow && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgb(168, 85, 247) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Decorative Top-Left Corner */}
        {finalDecorativeCorners && (
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-accent-cyan rounded-tl-3xl" />
        )}

        {/* Decorative Bottom-Right Corner */}
        {finalDecorativeCorners && (
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-accent-purple rounded-br-3xl" />
        )}

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Corner Blob (hover effect) */}
        {finalCornerBlob && (
          <div className="
            absolute -bottom-20 -right-20 w-40 h-40
            bg-gradient-to-br from-purple-500/20 to-cyan-500/20
            rounded-full blur-3xl
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
            pointer-events-none
          " />
        )}

        {/* Content */}
        <div className={`relative z-10 ${sizeMap[size] || paddingMap[padding]}`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default GlassCard;
```

### 2. GlassCard.types.ts

```typescript
import { ReactNode, HTMLAttributes } from 'react';
import { TargetAndTransition } from 'framer-motion';

export type GlassCardVariant =
  | 'default'
  | 'gradient-border'
  | 'accent'
  | 'glow'
  | 'stat'
  | 'minimal'
  | 'featured';

export type BlurSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type OpacityLevel = 'light' | 'medium' | 'minimal';

export type BorderStyle = 'none' | 'subtle' | 'accent' | 'gradient';

export type BorderColor = 'purple' | 'cyan' | 'white' | 'custom';

export type GlowColor = 'purple' | 'cyan' | 'mixed' | 'accent' | 'custom';

export type GlowIntensity = 'light' | 'medium' | 'strong';

export type HoverEffect = 'none' | 'lift' | 'scale' | 'glow' | 'all';

export type HoverIntensity = 'subtle' | 'medium' | 'dramatic';

export type CardSize = 'sm' | 'md' | 'lg' | 'xl';

export type PaddingSize = 'sm' | 'md' | 'lg' | 'xl' | 'custom';

export type BorderRadius = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  // Content
  children: ReactNode;

  // Styling variants
  variant?: GlassCardVariant;

  // Backdrop blur intensity
  blur?: BlurSize;

  // Background opacity/color
  opacity?: OpacityLevel | string;
  background?: 'dark' | 'light' | 'gradient' | 'custom';

  // Border styling
  border?: BorderStyle;
  borderColor?: BorderColor;
  borderCustomColor?: string;

  // Glow effect
  glow?: boolean;
  glowColor?: GlowColor;
  glowCustomColor?: string;
  glowIntensity?: GlowIntensity;

  // Border animation
  animatedBorder?: boolean;

  // Hover effects
  hoverEffect?: HoverEffect;
  hoverIntensity?: HoverIntensity;

  // Decorative elements
  decorativeCorners?: boolean;
  cornerBlob?: boolean;
  innerGlow?: boolean;

  // Animation
  animate?: boolean;
  animationDelay?: number;

  // Size & Layout
  size?: CardSize;
  padding?: PaddingSize;
  rounded?: BorderRadius;

  // Accessibility & behavior
  disabled?: boolean;
  interactive?: boolean;
  onClick?: () => void;

  // Framer Motion
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;

  // HTML attributes
  className?: string;
}
```

### 3. GlassCard.test.jsx

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlassCard } from './GlassCard';

describe('GlassCard Component', () => {
  describe('Rendering', () => {
    it('should render with default variant', () => {
      render(<GlassCard>Test Content</GlassCard>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <GlassCard className="custom-class">Content</GlassCard>
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <GlassCard>
          <h3>Title</h3>
          <p>Description</p>
        </GlassCard>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    const variants = ['default', 'stat', 'minimal', 'accent', 'glow', 'featured', 'gradient-border'];

    variants.forEach(variant => {
      it(`should render with variant="${variant}"`, () => {
        const { container } = render(
          <GlassCard variant={variant}>Content</GlassCard>
        );
        expect(container.querySelector('[class*="blur"]')).toBeInTheDocument();
      });
    });
  });

  describe('Blur Effects', () => {
    const blurs = ['sm', 'md', 'lg', 'xl', '2xl'];

    blurs.forEach(blur => {
      it(`should apply blur-${blur} class`, () => {
        const { container } = render(
          <GlassCard blur={blur}>Content</GlassCard>
        );
        expect(container.querySelector(`[class*="blur-${blur}"]`)).toBeInTheDocument();
      });
    });
  });

  describe('Glow Effects', () => {
    it('should render glow effect when glow=true', () => {
      const { container } = render(
        <GlassCard glow={true}>Content</GlassCard>
      );
      const glowElement = container.querySelector('[class*="blur-2xl"]');
      expect(glowElement).toBeInTheDocument();
    });

    it('should not render glow when glow=false', () => {
      const { container } = render(
        <GlassCard glow={false}>Content</GlassCard>
      );
      const glowElements = container.querySelectorAll('[class*="blur-2xl"]');
      expect(glowElements.length).toBe(0);
    });
  });

  describe('Decorative Elements', () => {
    it('should render corner elements when decorativeCorners=true', () => {
      const { container } = render(
        <GlassCard decorativeCorners={true}>Content</GlassCard>
      );
      const corners = container.querySelectorAll('[class*="border-t-2"]');
      expect(corners.length).toBeGreaterThan(0);
    });

    it('should render inner glow when innerGlow=true', () => {
      const { container } = render(
        <GlassCard innerGlow={true}>Content</GlassCard>
      );
      const innerGlowDiv = container.querySelector('[style*="radial-gradient"]');
      expect(innerGlowDiv).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should handle click events', async () => {
      const handleClick = jest.fn();
      render(
        <GlassCard onClick={handleClick}>Clickable</GlassCard>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Clickable'));
      expect(handleClick).toHaveBeenCalled();
    });

    it('should be disabled when disabled=true', async () => {
      const handleClick = jest.fn();
      render(
        <GlassCard disabled={true} onClick={handleClick}>
          Disabled
        </GlassCard>
      );

      const user = userEvent.setup();
      await user.click(screen.getByText('Disabled'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should have role="button" when onClick is provided', () => {
      const { container } = render(
        <GlassCard onClick={() => {}}>Clickable</GlassCard>
      );
      expect(container.querySelector('[role="button"]')).toBeInTheDocument();
    });
  });

  describe('Sizing', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'];

    sizes.forEach(size => {
      it(`should apply size="${size}"`, () => {
        const { container } = render(
          <GlassCard size={size}>Content</GlassCard>
        );
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });

  describe('Border Radius', () => {
    const radiuses = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];

    radiuses.forEach(radius => {
      it(`should apply rounded-${radius}`, () => {
        const { container } = render(
          <GlassCard rounded={radius}>Content</GlassCard>
        );
        expect(container.querySelector(`[class*="rounded-${radius}"]`)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible when interactive', async () => {
      const handleClick = jest.fn();
      const { container } = render(
        <GlassCard onClick={handleClick} interactive={true}>
          Interactive
        </GlassCard>
      );

      const card = container.querySelector('[role="button"]');
      card?.focus();
      expect(card).toHaveFocus();
    });

    it('should handle Enter key', async () => {
      const handleClick = jest.fn();
      const { container } = render(
        <GlassCard onClick={handleClick}>Keyboard</GlassCard>
      );

      const card = container.querySelector('[role="button"]');
      const user = userEvent.setup();
      card?.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Animation', () => {
    it('should render animation variants when animate=true', () => {
      const { container } = render(
        <GlassCard animate={true}>Animated</GlassCard>
      );
      expect(container.querySelector('[class*="group"]')).toBeInTheDocument();
    });

    it('should not apply animations when animate=false', () => {
      const { container } = render(
        <GlassCard animate={false}>Static</GlassCard>
      );
      expect(container.querySelector('[class*="motion"]')).toBeInTheDocument();
    });
  });
});
```

### 4. GlassCard Module CSS (Optional)

```css
/* src/components/ui/GlassCard/GlassCard.module.css */

.container {
  position: relative;
  display: flex;
  flex-direction: column;
}

.glass {
  backdrop-filter: var(--glass-blur-xl);
  -webkit-backdrop-filter: var(--glass-blur-xl);
  background-clip: padding-box;
  border: var(--border-thin) solid;
}

.glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  filter: blur(32px);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.container:hover .glow {
  opacity: 1;
}

.content {
  position: relative;
  z-index: 10;
}

@media (prefers-reduced-motion: reduce) {
  .glow {
    animation: none !important;
    transition: none !important;
  }

  .container {
    animation: none !important;
    transition: none !important;
  }
}
```

### 5. index.js (Barrel Export)

```javascript
export { GlassCard, default } from './GlassCard';
export type * from './GlassCard.types';
```

---

## Integration Examples

### Integrating into About.jsx

```jsx
import { GlassCard } from '../ui/GlassCard';
import { motion } from 'framer-motion';

export const About = () => {
  const stats = [
    { label: 'Focus', value: 'Web Performance & DX', icon: '⚡' },
    { label: 'Experience', value: 'Full-Stack Development', icon: '🚀' },
    { label: 'Approach', value: 'Pragmatic & Measurable', icon: '📊' },
  ];

  return (
    <section id="about" className="relative section-divider py-32">
      {/* ... background elements ... */}

      <div className="page-gutter relative z-10">
        {/* Stats Cards - Using GlassCard */}
        <motion.div className="space-y-4 mt-12">
          {stats.map((stat, index) => (
            <GlassCard
              key={stat.label}
              variant="default"
              borderColor="purple"
              glowColor="purple"
              glowIntensity="medium"
              hoverEffect="lift"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{stat.icon}</div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-purple-400 uppercase">
                    {stat.label}
                  </div>
                  <div className="text-body font-bold text-text-primary">
                    {stat.value}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Bio Card - Using featured variant */}
        <GlassCard
          variant="accent"
          borderColor="cyan"
          glowColor="cyan"
          decorativeCorners={true}
        >
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full">
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                My Story
              </span>
            </div>
            <p className="text-body-lg text-text-primary leading-relaxed">
              I build developer tools and performant web apps with a focus on clarity, reliability, and speed.
            </p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
```

### Integrating into Hero.jsx

```jsx
import { GlassCard } from '../ui/GlassCard';

export const Hero = () => {
  return (
    <section id="hero" className="page-gutter min-h-screen flex flex-col justify-center">
      {/* ... background ... */}

      {/* Role Card with Gradient Border wrapper */}
      <div className="mb-16 inline-block"
        style={{
          background: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(34, 211, 238))',
        }}
        className="rounded-3xl p-1 overflow-hidden">
        <GlassCard
          variant="gradient-border"
          blur="2xl"
          innerGlow={true}
          padding="lg"
        >
          <p className="text-6xl font-bold bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-purple bg-clip-text text-transparent">
            Full-Stack Developer
          </p>
        </GlassCard>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard variant="stat" borderColor="purple" glowColor="purple">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-purple">5+</div>
            <div className="text-sm text-gray-400">Years Experience</div>
          </div>
        </GlassCard>

        <GlassCard variant="stat" borderColor="cyan" glowColor="cyan">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-cyan">50+</div>
            <div className="text-sm text-gray-400">Projects Built</div>
          </div>
        </GlassCard>

        <GlassCard variant="stat" borderColor="purple" glowColor="mixed">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">∞</div>
            <div className="text-sm text-gray-400">Ideas to Code</div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
```

---

## CSS Custom Properties

Update `src/styles/tokens.css`:

```css
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
  --glass-glow-purple: 0 0 24px rgba(168, 85, 247, 0.3);
  --glass-glow-cyan: 0 0 24px rgba(34, 211, 238, 0.3);
  --glass-glow-mixed: 0 0 36px rgba(168, 85, 247, 0.3), 0 0 24px rgba(34, 211, 238, 0.3);
}
```

---

## Performance Optimization Tips

### 1. Lazy Load Animations

```jsx
const [isVisible, setIsVisible] = useState(false);
const ref = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting),
    { threshold: 0.1 }
  );

  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);

<GlassCard ref={ref} animate={isVisible}>
  Content
</GlassCard>
```

### 2. Disable Animations for Lists

```jsx
{cards.map((card, index) => (
  <GlassCard
    key={card.id}
    animate={false}  // Disable individual animations
    glow={false}     // Reduce complexity
  >
    {card.content}
  </GlassCard>
))}
```

### 3. Use CSS containment

```css
.glass-card {
  contain: layout style paint;
  will-change: transform, opacity;
}
```

---

This implementation guide provides everything needed to create and integrate the comprehensive GlassCard component system into the portfolio application.
