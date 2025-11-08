# GlassCard Component - Quick Reference Guide

## Variant Quick Reference

### 1. `default` - Standard Glass Card
```tsx
<GlassCard variant="default">
  <h3>Content Title</h3>
  <p>Standard glass card content</p>
</GlassCard>
```
- **Blur**: 24px (blur-xl)
- **Opacity**: white/5
- **Border**: subtle white/10
- **Best for**: Regular content containers

---

### 2. `stat` - Compact Metric Card
```tsx
<GlassCard variant="stat" borderColor="purple" glowColor="purple">
  <div className="text-3xl font-bold">5+</div>
  <div className="text-sm">Years Experience</div>
</GlassCard>
```
- **Blur**: 10px (blur-md) - lighter
- **Opacity**: rgba(15, 23, 42, 0.8) - darker
- **Border**: accent color
- **Best for**: Statistics, metrics, KPIs

---

### 3. `minimal` - Ultra-Light Tag
```tsx
<GlassCard variant="minimal" size="sm" padding="sm">
  React
</GlassCard>
```
- **Blur**: 3px (blur-sm) - very light
- **Opacity**: white/10
- **Border**: white/20
- **Best for**: Tags, badges, small elements

---

### 4. `gradient-border` - Hero Element
```tsx
<GlassCard variant="gradient-border" glowColor="mixed">
  <p className="text-5xl font-bold">
    Full-Stack Developer
  </p>
</GlassCard>
```
- **Blur**: 24px
- **Opacity**: white/5
- **Border**: gradient (parent wrapper)
- **Glow**: medium
- **Best for**: Hero cards, role displays, featured stats

---

### 5. `accent` - Important Card
```tsx
<GlassCard
  variant="accent"
  borderColor="cyan"
  glowColor="cyan"
  decorativeCorners={true}
>
  <h2>Important Content</h2>
  <p>Bio section, featured information</p>
</GlassCard>
```
- **Blur**: 40px (blur-2xl) - heavy
- **Opacity**: white/5 + gradient overlay
- **Border**: colored accent
- **Glow**: medium
- **Decoratives**: corner accents
- **Best for**: About sections, bio cards

---

### 6. `glow` - Highlight Container
```tsx
<GlassCard
  variant="glow"
  glowColor="mixed"
  glowIntensity="strong"
  cornerBlob={true}
>
  <h3>Connect With Me</h3>
  {/* contact methods */}
</GlassCard>
```
- **Blur**: 40px (blur-2xl)
- **Opacity**: white/5
- **Glow**: strong, always visible
- **Decoratives**: corner blob on hover
- **Best for**: Contact cards, CTAs, prominent sections

---

### 7. `featured` - Premium Card
```tsx
<GlassCard
  variant="featured"
  decorativeCorners={true}
  cornerBlob={true}
  innerGlow={true}
  animatedBorder={true}
>
  {/* full featured content */}
</GlassCard>
```
- **Blur**: 40px (blur-2xl)
- **Opacity**: gradient from-bg-card/80 via-bg-card/60
- **Border**: gradient + animated
- **Glow**: strong
- **Decoratives**: all effects
- **Best for**: Featured projects, premium cards

---

## Prop Quick Reference

### Essential Props
```tsx
<GlassCard
  // Content
  children={ReactNode}

  // Visual variant
  variant="default" | "stat" | "minimal" | "gradient-border" | "accent" | "glow" | "featured"

  // Blur intensity
  blur="sm" | "md" | "lg" | "xl" | "2xl"

  // Glow effect
  glow={true}
  glowColor="purple" | "cyan" | "mixed" | "accent"
  glowIntensity="light" | "medium" | "strong"

  // Border
  border="subtle" | "accent" | "gradient" | "none"
  borderColor="purple" | "cyan" | "white"

  // Hover
  hoverEffect="lift" | "scale" | "glow" | "all"
  hoverIntensity="subtle" | "medium" | "dramatic"
/>
```

### Size & Spacing
```tsx
<GlassCard
  size="sm" | "md" | "lg" | "xl"
  padding="sm" | "md" | "lg" | "xl"
  rounded="sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
/>
```

### Decoratives
```tsx
<GlassCard
  decorativeCorners={true}  // Corner accent lines
  cornerBlob={true}         // Bottom-right floating blob
  innerGlow={true}          // Radial gradient inside
  animatedBorder={true}     // Animated gradient border
/>
```

### Animation & Interaction
```tsx
<GlassCard
  animate={true}           // Enable animations
  animationDelay={0}        // Animation delay in ms
  interactive={true}        // Enable hover/click states
  disabled={false}          // Disable interactions
  onClick={() => {}}        // Click handler
/>
```

---

## Color Schemes Quick Reference

### Purple-Focused
```tsx
<GlassCard
  borderColor="purple"
  glowColor="purple"
>
  Languages, Important Content
</GlassCard>
```

### Cyan-Focused
```tsx
<GlassCard
  borderColor="cyan"
  glowColor="cyan"
>
  About section, Secondary Information
</GlassCard>
```

### Mixed (Purple → Cyan)
```tsx
<GlassCard
  glowColor="mixed"
>
  Hero cards, Featured content
</GlassCard>
```

### Custom
```tsx
<GlassCard
  glowColor="custom"
  glowCustomColor="from-emerald-500 to-teal-500"
/>
```

---

## Common Patterns by Use Case

### Pattern 1: Stat Card Grid
```tsx
<div className="grid grid-cols-3 gap-6">
  <GlassCard variant="stat" borderColor="purple">
    <div className="text-3xl font-bold">5+</div>
    <div className="text-sm text-gray-400">Years</div>
  </GlassCard>

  <GlassCard variant="stat" borderColor="cyan">
    <div className="text-3xl font-bold">50+</div>
    <div className="text-sm text-gray-400">Projects</div>
  </GlassCard>

  <GlassCard variant="stat" borderColor="purple" glowColor="mixed">
    <div className="text-3xl font-bold">∞</div>
    <div className="text-sm text-gray-400">Ideas</div>
  </GlassCard>
</div>
```

### Pattern 2: Skill Card with Nested Tags
```tsx
<GlassCard variant="default" borderColor="purple">
  <div className="mb-6">
    <h3 className="text-2xl font-bold mb-4">Languages</h3>
    <div className="grid grid-cols-2 gap-4">
      {['JavaScript', 'TypeScript', 'Python', 'Go'].map(lang => (
        <GlassCard key={lang} variant="minimal" size="sm">
          {lang}
        </GlassCard>
      ))}
    </div>
  </div>
</GlassCard>
```

### Pattern 3: Featured Project Card
```tsx
<GlassCard
  variant="featured"
  decorativeCorners={true}
  cornerBlob={true}
  innerGlow={true}
>
  <div className="h-48 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg mb-6" />

  <h2 className="text-3xl font-bold mb-4">Project Name</h2>
  <p className="text-gray-300 mb-6">Description</p>

  <div className="flex gap-3">
    <a href="#">GitHub</a>
    <a href="#">Demo</a>
  </div>
</GlassCard>
```

### Pattern 4: Contact Card
```tsx
<GlassCard
  variant="glow"
  glowColor="mixed"
  glowIntensity="strong"
  cornerBlob={true}
  padding="lg"
>
  <h3 className="text-2xl font-bold mb-8">Connect With Me</h3>

  <div className="grid grid-cols-2 gap-6">
    {contactMethods.map(method => (
      <a key={method.label} href={method.href}>
        <div className="flex items-center gap-3">
          <div className="text-2xl">{method.icon}</div>
          <div>
            <div className="text-xs text-gray-400">{method.label}</div>
            <div className="text-sm font-semibold">{method.value}</div>
          </div>
        </div>
      </a>
    ))}
  </div>
</GlassCard>
```

### Pattern 5: Gradient Border Hero
```tsx
<div
  className="relative rounded-3xl p-1 overflow-hidden"
  style={{
    background: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(34, 211, 238))'
  }}
>
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
```

---

## Blur Value Comparison

| Value | CSS | Intensity | Use Case |
|-------|-----|-----------|----------|
| `sm` | `blur-sm` (3px) | Very light | Tags, small elements |
| `md` | `blur-md` (12px) | Light | Stat cards, secondary |
| `lg` | `blur-lg` (16px) | Medium | Interactive elements |
| `xl` | `blur-xl` (24px) | Heavy | Standard cards (default) |
| `2xl` | `blur-2xl` (40px) | Ultra heavy | Featured/prominent cards |

---

## Border Styles Comparison

| Style | Look | Use Case |
|-------|------|----------|
| `none` | No border | Minimal, clean look |
| `subtle` | `border border-white/10` | Standard cards |
| `accent` | `border border-{color}/30` | Emphasized cards |
| `gradient` | Parent gradient, child transparent | Hero elements, featured cards |

---

## Hover Effects Comparison

| Effect | Movement | Scale | Glow | Best For |
|--------|----------|-------|------|----------|
| `none` | — | — | — | Static content |
| `lift` | -8px ↑ | 1.02x | Subtle | Standard cards |
| `scale` | — | 1.05x | — | Small elements, tags |
| `glow` | — | — | Intensify | Emphasis effect |
| `all` | -8px ↑ | 1.02x | Intensify | Interactive cards |

---

## Glow Intensity Levels

### Light
```css
opacity: 0.3 → 0.4 on hover
blur: 24px
```

### Medium
```css
opacity: 0.3 → 0.5 on hover
blur: 40px
```

### Strong
```css
opacity: 0.4 → 0.7 on hover
blur: 40px
```

---

## Responsive Behavior

### Mobile Optimizations
```tsx
<GlassCard
  size="sm"           // Smaller on mobile
  padding="md"        // Reasonable padding
  rounded="lg"        // Moderate border radius
  hoverEffect="none"  // No hover on mobile
/>
```

### Desktop Enhancements
```tsx
<GlassCard
  size="lg"                    // Larger on desktop
  padding="lg"                 // More generous padding
  decorativeCorners={true}     // Show decoratives
  cornerBlob={true}            // Show animated blobs
  hoverEffect="all"            // Full hover effects
/>
```

---

## TypeScript Types Reference

```typescript
type GlassCardVariant =
  | 'default'
  | 'gradient-border'
  | 'accent'
  | 'glow'
  | 'stat'
  | 'minimal'
  | 'featured';

type BlurSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type OpacityLevel = 'light' | 'medium' | 'minimal';

type BorderStyle = 'none' | 'subtle' | 'accent' | 'gradient';

type BorderColor = 'purple' | 'cyan' | 'white' | 'custom';

type GlowColor = 'purple' | 'cyan' | 'mixed' | 'accent' | 'custom';

type GlowIntensity = 'light' | 'medium' | 'strong';

type HoverEffect = 'none' | 'lift' | 'scale' | 'glow' | 'all';

type HoverIntensity = 'subtle' | 'medium' | 'dramatic';

type CardSize = 'sm' | 'md' | 'lg' | 'xl';

type PaddingSize = 'sm' | 'md' | 'lg' | 'xl' | 'custom';

type BorderRadius = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
```

---

## Best Practices

### ✅ DO:
- Use `variant` to define the card's role
- Combine `borderColor` and `glowColor` for consistency
- Enable decoratives on featured cards only
- Use `size="sm"` for nested/inline cards
- Set `animate={false}` for lists with many cards
- Use `glow={false}` for low-emphasis cards

### ❌ DON'T:
- Mix multiple glow colors on the same card
- Enable all decoratives on every card (save for featured)
- Use blur values higher than necessary
- Add custom inline styles when variants exist
- Forget accessibility (test with keyboard)
- Use opacity values below 0.05 (loses visibility)

---

## Performance Tips

1. **Large Lists**: Disable animations
   ```tsx
   <GlassCard animate={false}>...</GlassCard>
   ```

2. **Multiple Glows**: Use lighter intensity
   ```tsx
   <GlassCard glowIntensity="light">...</GlassCard>
   ```

3. **Nested Cards**: Use `minimal` variant
   ```tsx
   <GlassCard variant="minimal">...</GlassCard>
   ```

4. **Off-Screen Cards**: Lazy load with Intersection Observer
   ```tsx
   const [isVisible, setIsVisible] = useState(false);
   <GlassCard animate={isVisible}>...</GlassCard>
   ```

---

## Accessibility Checklist

- [ ] Text contrast ratio ≥ 4.5:1
- [ ] Focus-visible outline visible
- [ ] Hover effects work with keyboard
- [ ] Reduced motion is respected
- [ ] Interactive cards are keyboard accessible
- [ ] No color-only information (use icons/text)
- [ ] Button-like cards have `role="button"`

---

## Testing Scenarios

### Unit Tests
```typescript
describe('GlassCard', () => {
  test('renders with default variant', () => {});
  test('applies blur classes correctly', () => {});
  test('renders glow effect when enabled', () => {});
  test('applies hover effects on hover', () => {});
  test('disables interactions when disabled=true', () => {});
});
```

### Visual Tests
- Blur rendering on different browsers
- Glow effect opacity transitions
- Hover animation smoothness
- Responsive behavior on mobile/tablet/desktop
- Dark mode visibility

### Accessibility Tests
- WCAG contrast ratio compliance
- Keyboard navigation
- Screen reader compatibility
- Focus indicator visibility
- Reduced motion preferences

---

## Common Issues & Solutions

### Issue: Glow effect not visible
**Solution**: Increase `glowIntensity` or use darker background

### Issue: Border not showing
**Solution**: Use `border="accent"` or `border="gradient"`

### Issue: Text hard to read
**Solution**: Reduce `opacity` or increase blur value

### Issue: Performance lag with many cards
**Solution**: Set `animate={false}` and `glow={false}`

### Issue: Decorative corners invisible
**Solution**: Increase `padding` or use larger `size`

---

This quick reference provides everything needed to use the GlassCard component effectively across the portfolio.
