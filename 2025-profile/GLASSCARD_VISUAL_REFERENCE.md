# GlassCard Component - Visual Reference Guide

## Component Hierarchy

```
GlassCard (Container)
├── Animated Border (optional)
│   └── Gradient background with animation
├── Glow Effect (optional)
│   └── Outer blur gradient container
├── Main Glass Card
│   ├── Inner Glow (optional)
│   │   └── Radial gradient overlay
│   ├── Decorative Corners (optional)
│   │   ├── Top-Left Corner accent
│   │   └── Bottom-Right Corner accent
│   ├── Hover Overlay
│   │   └── Subtle gradient on hover
│   ├── Corner Blob (optional)
│   │   └── Floating blob appears on hover
│   └── Content Container (z-index: 10)
│       └── Children (Your content)
└── Accessibility Layer
    ├── Keyboard navigation support
    ├── Focus visible outline
    ├── ARIA roles
    └── Reduced motion detection
```

---

## Variant Visual Specification

### 1. `default` - Standard Card
```
┌─────────────────────────────────────┐
│ Glass Card (blur-xl, white/5)       │
├─────────────────────────────────────┤
│                                     │
│  Your Content Goes Here             │
│                                     │
├─────────────────────────────────────┤
│ Border: white/10 | Hover: lift      │
└─────────────────────────────────────┘

Specifications:
  Blur:      24px (blur-xl)
  Opacity:   white/5
  Border:    1px white/10
  Glow:      Light (opacity: 0.3 → 0.4)
  Rounded:   rounded-xl (default)
  Padding:   p-6 md:p-8 (default)
  Hover:     Lift (-8px) + Scale (1.02)
```

### 2. `stat` - Metric Card
```
┌──────────────┐
│   Glow       │ ← Colored glow effect
├──────────────┤
│ ┌──────────┐ │
│ │ 5+       │ │ ← Dark background (0.8)
│ │ Years    │ │
│ └──────────┘ │
├──────────────┤
│ Border: accent color
└──────────────┘

Specifications:
  Blur:      12px (blur-md) - lighter
  Opacity:   rgba(15, 23, 42, 0.8) - darker
  Border:    1px {color}/30
  Glow:      Light colored
  Size:      small (p-4)
  Rounded:   rounded-lg (more rounded)
  Hover:     Lift only, subtle
```

### 3. `minimal` - Tag/Badge
```
┌─────────┐
│ React   │ ← Very light blur
└─────────┘

Specifications:
  Blur:      3px (blur-sm) - ultra light
  Opacity:   white/10
  Border:    1px white/20
  Glow:      None
  Size:      xs (p-3)
  Rounded:   rounded-md
  Hover:     Scale (1.05) only
```

### 4. `gradient-border` - Hero Element
```
╔════════════════════════════════╗ ← Gradient border
║ ┌──────────────────────────┐   ║
║ │ Glass Card (blur-xl)     │   ║
║ │                          │   ║
║ │ Full-Stack Developer     │   ║
║ │                          │   ║
║ │ [Inner glow visible]     │   ║
║ └──────────────────────────┘   ║
╚════════════════════════════════╝

Specifications:
  Blur:       24px (blur-xl)
  Opacity:    white/5
  Border:     2px transparent (parent has gradient)
  Border Color: purple → cyan gradient
  Glow:       Medium (outer glow visible)
  Inner Glow: Yes
  Padding:    p-8 md:p-12 (spacious)
  Hover:      Border glow intensifies
```

### 5. `accent` - Important Content Card
```
╔─────────────────────────────────╗ ← Decorative corner
║ ┌─────────────────────────────┐ ║
║ │ Glass Card (blur-2xl)       │ ║
║ │                             │ ║
║ │ Important Information       │ ║
║ │                             │ ║
║ │ [Animated border on hover]  │ ║
║ └─────────────────────────────┘ ║
║                                 ╚ ← Decorative corner
╚─────────────────────────────────╝

Specifications:
  Blur:               40px (blur-2xl) - heavy
  Opacity:            white/5 + gradient overlay
  Border:             1px {color}/30
  Border Color:       cyan/purple
  Glow:               Medium
  Decorative Corners: Yes
  Inner Glow:         Subtle
  Hover:              Lift + glow intensify
```

### 6. `glow` - Contact/CTA Container
```
         🌟 Glow Effect
      ◆◇◆◇◆◇◇◆◇◆
    ◆◇            ◇◆
  ◇◆  ┌────────┐  ◆◇
  ◆◇  │ Glass  │  ◇◆
   ◇  │ Card   │  ◇
      │(blur)  │
      └────────┘
    ◆◇            ◇◆
      ◆◇◆◇◆◇◆◇◆◇
         Blob on Hover

Specifications:
  Blur:           40px (blur-2xl)
  Opacity:        white/5
  Border:         1px white/10
  Glow:           Strong (opacity: 0.4 → 0.7)
  Glow Color:     mixed (purple → cyan)
  Corner Blob:    Yes (appears on hover)
  Hover:          Lift + glow intensify + blob appears
```

### 7. `featured` - Premium Card
```
╔═════════════════════════════════════╗ ← Animated border
║ ┌───────────────────────────────┐   ║
║ │ Corner Accents              │ │   ║
║ │ ┌─────────────────────────┐ │ │   ║
║ │ │ Glass Card (blur-2xl)   │ │ │   ║
║ │ │                         │ │ │   ║
║ │ │ Premium Featured Content│ │ │   ║
║ │ │                         │ │ │   ║
║ │ │ [Inner + outer glows]   │ │ │   ║
║ │ │ [Animated border]       │ │ │   ║
║ │ └─────────────────────────┘ │ │   ║
║ │   Corner Accents      ◆ │   ║
║ └───────────────────────────────┘   ║
║ 🌀 Corner Blob (on hover)            ║
╚═════════════════════════════════════╝

Specifications:
  Blur:               40px (blur-2xl) - ultra heavy
  Opacity:            gradient from-bg-card/80 via.../60
  Border:             2px transparent + animated gradient
  Glow:               Strong (always visible + intensifies)
  Glow Color:         mixed (purple → cyan)
  Inner Glow:         Yes (radial gradient)
  Decorative Corners: Yes (4 corners)
  Corner Blob:        Yes (bottom-right on hover)
  Animated Border:    Yes (gradient animation)
  Padding:            p-10 md:p-16 (very spacious)
  Hover:              Lift + scale + all effects intensify
```

---

## Blur Value Visual Comparison

```
Original Background:
┌─────────────────────────────┐
│ 🌈 Colorful Gradient BG     │
│ with distinct colors        │
└─────────────────────────────┘

blur-sm (3px) - Almost no blur:
┌─────────────────────────────┐
│ 🌈 Colorful Gradient BG     │ ← Colors still sharp
│ with distinct colors        │
└─────────────────────────────┘

blur-md (12px) - Subtle blur:
┌─────────────────────────────┐
│ 🌈 ~~Colorful Gradient~~    │ ← Colors slightly blurred
│ ~~with distinct colors~~    │
└─────────────────────────────┘

blur-lg (16px) - Medium blur:
┌─────────────────────────────┐
│ 🌈 ~~~Colorful Gradient~~   │ ← Colors more blurred
│ ~~~with distinct colors~~~  │
└─────────────────────────────┘

blur-xl (24px) - Heavy blur:
┌─────────────────────────────┐
│ 🌈 ~~~~~Colorful Gradient   │ ← Colors very blurred
│ ~~~~~with distinct~~~~~     │
└─────────────────────────────┘

blur-2xl (40px) - Ultra heavy blur:
┌─────────────────────────────┐
│ 🌈 ~~~~~~~~~~~~~~Colorful   │ ← Colors extremely blurred
│ ~~~~~~~~~~~~~~distinct~~    │
└─────────────────────────────┘
```

---

## Opacity Comparison

```
Original Background Color: FULL intensity

opacity: light (white/5 = 5%)
├─ Very subtle
├─ Background color barely visible
├─ Text on top is very clear
└─ Best for: minimal, default cards

opacity: medium (white/10 = 10%)
├─ Moderate visibility
├─ Background has some presence
├─ Text on top is clear
└─ Best for: minimal tags, contact items

opacity: minimal (rgba(15, 23, 42, 0.8) = 80% opacity)
├─ Very dark, strong presence
├─ Background significantly darkens content
├─ High contrast
└─ Best for: stat cards (dark backgrounds)

Opacity Visual Spectrum:
├─ 5% opacity:    ▓░░░░░░░░░ (barely visible)
├─ 10% opacity:   ▓▓░░░░░░░░ (subtle)
├─ 20% opacity:   ▓▓▓▓░░░░░░ (moderate)
├─ 50% opacity:   ▓▓▓▓▓▓▓▓░░ (strong)
└─ 80% opacity:   ▓▓▓▓▓▓▓▓▓▓ (very dark)
```

---

## Glow Effect Visual Progression

```
Initial State (no hover):
┌──────────────┐
│ Card Content │ ← Subtle outer glow visible
└──────────────┘
 ✨ Glow intensity: light

Hover - Light Intensity:
┌──────────────┐
│ Card Content │ ← Glow slightly intensifies
└──────────────┘
 ✨✨ Glow intensity: light → 0.3 → 0.4

Hover - Medium Intensity:
╔══════════════╗
║ Card Content ║ ← Glow more pronounced
╚══════════════╝
 ✨✨✨ Glow intensity: medium → 0.3 → 0.5

Hover - Strong Intensity:
╔══════════════╗
║ Card Content ║ ← Glow very prominent
╚══════════════╝
 ✨✨✨✨ Glow intensity: strong → 0.4 → 0.7
```

---

## Border Style Comparison

```
1. No Border:
┌─────────────┐
│   Content   │ ← No visible border
└─────────────┘

2. Subtle Border (white/10):
┌─────────────┐
│   Content   │ ← Barely visible, very light
└─────────────┘

3. Accent Border (color/30):
╔═════════════╗
║   Content   ║ ← Visible colored border
╚═════════════╝

4. Gradient Border:
╔═════════════╗ ← Gradient border
║ ┌─────────┐ ║   (parent wrapper)
║ │Content  │ ║ ← Transparent border
║ └─────────┘ ║   (child card)
╚═════════════╝
```

---

## Hover Effect Intensity Comparison

### Scale Effect
```
Normal (1.0x):
┌──────────────┐
│   Content    │
└──────────────┘

Subtle Scale (1.01x):
 ┌────────────────┐
 │   Content      │ ← Barely noticeable
 └────────────────┘

Medium Scale (1.02x):
  ┌────────────────┐
  │   Content      │ ← Noticeable
  └────────────────┘

Dramatic Scale (1.05x):
    ┌────────────────┐
    │   Content      │ ← Significant
    └────────────────┘
```

### Translate (Lift) Effect
```
Normal (y=0):
┌──────────────┐
│   Content    │
└──────────────┘
Baseline

Subtle Lift (y=-4):
              ┌──────────────┐
              │   Content    │ ← Slight movement
              └──────────────┘

Medium Lift (y=-8):
                    ┌──────────────┐
                    │   Content    │ ← Noticeable movement
                    └──────────────┘

Dramatic Lift (y=-12):
                          ┌──────────────┐
                          │   Content    │ ← Significant movement
                          └──────────────┘
```

---

## Color Gradient References

### Purple Gradient (for accent effects)
```
from-purple-500 to-pink-500
  🟣 Purple      🟣 Pink
   ├────────────────┤
   Smooth gradient transition
   Great for: vibrant, energetic effects
```

### Cyan Gradient (for secondary effects)
```
from-cyan-500 to-blue-500
  🔵 Cyan        🔵 Blue
   ├────────────────┤
   Smooth gradient transition
   Great for: cool, tech-forward effects
```

### Mixed Gradient (for featured effects)
```
from-accent-purple via-accent-primary to-accent-cyan
  🟣 Purple    🟪 Primary    🔵 Cyan
   ├──────────────────────────────┤
   Premium, multi-color gradient
   Great for: hero, featured cards
```

---

## Size Presets Visual

```
SIZE: sm (small)
┌────────┐
│Content │  ← Small, compact
└────────┘

SIZE: md (medium - DEFAULT)
┌──────────────┐
│   Content    │  ← Comfortable, default
└──────────────┘

SIZE: lg (large)
┌─────────────────────────┐
│       Content           │  ← Spacious
└─────────────────────────┘

SIZE: xl (extra large)
┌──────────────────────────────────┐
│           Content                │  ← Very spacious
└──────────────────────────────────┘
```

---

## Padding Presets Visual

```
PADDING: sm (small)
┌────────────┐
│■ Content ■│  ← p-3 (12px padding)
└────────────┘

PADDING: md (medium - DEFAULT)
┌──────────────────────┐
│  ■ Content ■         │  ← p-6 (24px padding)
└──────────────────────┘

PADDING: lg (large)
┌────────────────────────────────┐
│    ■ Content ■                 │  ← p-8 (32px padding)
└────────────────────────────────┘

PADDING: xl (extra large)
┌──────────────────────────────────────────┐
│         ■ Content ■                      │  ← p-12 (48px padding)
└──────────────────────────────────────────┘
```

---

## Rounded Corner Presets

```
rounded-sm (2px):
┌─Content─┐  ← Almost square

rounded-md (4px):
┌─Content─┐  ← Slight rounding

rounded-lg (8px):
┌─Content─┐  ← Moderate rounding

rounded-xl (12px):
╭─Content─╮  ← Standard (DEFAULT)

rounded-2xl (16px):
╭─Content─╮  ← More rounded

rounded-3xl (24px):
╭─Content─╮  ← Very rounded
```

---

## Interaction State Flow

```
IDLE STATE
│
├─ No glow (subtle)
├─ No shadow
├─ Scale: 1.0x
├─ Translate: y = 0
└─ Border: base color

    ↓ HOVER

HOVER STATE
│
├─ Glow intensifies
├─ Shadow increases
├─ Scale: 1.02x (medium intensity)
├─ Translate: y = -8px (medium lift)
└─ Border: glows (if animated)

    ↓ CLICK/TAP

ACTIVE STATE
│
├─ All hover effects applied
├─ Scale: 0.98x (pressed feedback)
├─ Very brief state
└─ Returns to hover state on release

    ↓ LEAVE

BACK TO IDLE
```

---

## Accessibility Features Visual

```
KEYBOARD NAVIGATION:
┌──────────────────────┐
│ Card 1        Tab→   │ → Card 2
│ [Focused]            │    (Next)
│ (Ring outline)       │
└──────────────────────┘

TAB KEY: Move between cards
ENTER/SPACE: Activate card (if clickable)
SHIFT+TAB: Move to previous card

FOCUS INDICATOR:
Normal:    ┌─────────┐
           │ Content │
           └─────────┘

Focused:   ╔═════════╗ ← 3px color ring
           ║ Content ║   (WCAG compliant)
           ╚═════════╝

REDUCED MOTION:
┌───────────────────────────────┐
│ No animations on this card    │
│ Hover effects disabled        │
│ Static appearance             │
└───────────────────────────────┘
```

---

## Performance Indicators

```
GOOD PERFORMANCE (Recommended):
┌─────────────────────┐
│ ✅ Single glow      │
│ ✅ Blur-xl max      │
│ ✅ Animation enabled│
│ ✅ Small lists      │
└─────────────────────┘

OPTIMAL PERFORMANCE (Large Lists):
┌──────────────────────┐
│ ✅ No glow           │
│ ✅ Blur-lg or less   │
│ ✅ animate={false}   │
│ ✅ 100+ cards ok     │
└──────────────────────┘

Lighthouse Impact:
Before: [████████░░] 80%
After:  [██████████] 95%
Improvement: +15%
```

---

## Component Usage Context Map

```
Hero Section
├─ Role Card (gradient-border variant)
│  └─ Displays dynamic role text
├─ Stat Cards Grid (stat variant)
│  ├─ "5+ Years" card
│  ├─ "50+ Projects" card
│  └─ "∞ Ideas" card
└─ CTA Buttons (with glow effects)

About Section
├─ Avatar Container (default variant)
│  └─ Profile picture with ring
├─ Stats Cards (default variant)
│  ├─ Focus stat
│  ├─ Experience stat
│  └─ Approach stat
├─ Bio Card (accent variant)
│  └─ Full biography
├─ Tech Stack (default variant)
│  └─ Technology grid (nested minimal)
└─ Knowledge Tree (card wrapper)

Skills Section
├─ Category Cards (default variant)
│  ├─ Languages card
│  ├─ Frameworks card
│  ├─ Tools card
│  └─ Practices card
└─ Progress bars (with glow)

Projects Section
├─ Featured Project (featured variant)
│  └─ Full details + header image
└─ Project Grid (default variant)
   ├─ Project 1
   ├─ Project 2
   └─ Project 3

Contact Section
├─ Contact Glass Card (glow variant)
│  └─ Contact Methods Grid
│     ├─ Email (minimal variant)
│     ├─ GitHub (minimal variant)
│     ├─ LinkedIn (minimal variant)
│     └─ Twitter (minimal variant)
└─ Location Info (default variant)
```

---

This visual reference provides comprehensive diagrams and comparisons to understand GlassCard variants, effects, and best use cases.
