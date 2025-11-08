# Typography System Documentation

## Overview

This project uses a **hybrid typography system** combining **Tailwind CSS custom utilities** with **CSS custom properties (variables)** to provide maximum flexibility and consistency across the design.

### System Architecture

- **Primary Framework**: Tailwind CSS v4 with extended configuration
- **Semantic Variables**: CSS custom properties (CSS variables) for token management
- **Font Rendering**: Self-hosted Web Fonts (IBM Plex Sans, Inter)
- **Responsive Approach**: Fluid typography using `clamp()` for viewport-responsive sizing
- **Design Philosophy**: Neobrutalist aesthetic with modern 2025 design trends

---

## Font Families

### Primary Fonts

| Font | Family | Weights | Usage |
|------|--------|---------|-------|
| **IBM Plex Sans** | Sans-serif | 400, 500, 600, 700 | Body text, UI elements, default |
| **Inter** | Sans-serif | 400, 500, 600, 700 | Display text, headings, brand emphasis |

### Font Stack Hierarchy

```css
/* Body/Sans-serif stack */
font-family: "IBM Plex Sans", Inter, Helvetica, Arial, sans-serif;

/* Display/Headlines stack */
font-family: Inter, "IBM Plex Sans", Helvetica, Arial, sans-serif;
```

---

## Complete Type Scale

### Tailwind CSS Custom Font Sizes

These are available as Tailwind utility classes (`text-{size}`):

| Class | Size | Line Height | Font Weight | Use Case |
|-------|------|-------------|-------------|----------|
| `text-display-xl` | 72px | 1.2 | 700 | Page hero titles, major statements |
| `text-display-lg` | 60px | 1.2 | 700 | Large display headings |
| `text-display-md` | 48px | 1.2 | 700 | Display headings, large titles |
| `text-h1` | 48px | 1.2 | 700 | Primary page heading |
| `text-h2` | 36px | 1.3 | 700 | Secondary section heading |
| `text-h3` | 28px | 1.3 | 700 | Tertiary section heading |
| `text-h4` | 24px | 1.3 | 700 | Minor section heading, card title |
| `text-body-lg` | 18px | 1.5 | 400 | Large body text, introduction |
| `text-body` | 16px | 1.5 | 400 | Default body text, content |
| `text-body-sm` | 14px | 1.5 | 400 | Secondary body text, meta information |
| `text-caption` | 12px | 1.5 | 400 | Small captions, labels, helper text |

### CSS Variable Font Sizes (Fluid Typography)

These use responsive `clamp()` for automatic scaling between viewport sizes:

| Variable | Mobile → Desktop | Use Case |
|----------|------------------|----------|
| `--font-size-xs` | 12px → 14px | Extra small text, tiny labels |
| `--font-size-sm` | 14px → 16px | Small text, helper text |
| `--font-size-base` | 16px → 18px | Base body text (default) |
| `--font-size-md` | 18px → 20px | Medium body text |
| `--font-size-lg` | 20px → 24px | Large body text |
| `--font-size-xl` | 24px → 30px | Extra large text, small headings |
| `--font-size-2xl` | 30px → 36px | Secondary heading |
| `--font-size-3xl` | 36px → 48px | Large heading |
| `--font-size-4xl` | 48px → 60px | Extra large heading |
| `--font-size-5xl` | 60px → 72px | Hero/display heading |

#### Fluid Typography Formula
```css
/* Format: clamp(min, preferred, max) */
--font-size-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
```

This automatically scales font size smoothly between minimum and maximum values as the viewport changes, eliminating the need for multiple media queries.

---

## Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Normal | 400 | Body text, regular content |
| Medium | 500 | Emphasized text, secondary headings |
| Semibold | 600 | Strong emphasis, button text |
| Bold | 700 | Headings, primary emphasis, strong text |

### Tailwind Classes for Font Weights

```html
<!-- Using Tailwind font-weight utilities -->
<p class="font-normal">Regular weight text (400)</p>
<p class="font-medium">Medium weight text (500)</p>
<p class="font-semibold">Semibold weight text (600)</p>
<p class="font-bold">Bold weight text (700)</p>
```

### CSS Variables for Font Weights

```html
<!-- Using CSS variables (available via custom properties) -->
<p style="font-weight: var(--font-weight-normal);">Regular (400)</p>
<p style="font-weight: var(--font-weight-medium);">Medium (500)</p>
<p style="font-weight: var(--font-weight-semibold);">Semibold (600)</p>
<p style="font-weight: var(--font-weight-bold);">Bold (700)</p>
```

---

## Line Heights

| Variable | Value | Usage |
|----------|-------|-------|
| `--line-height-tight` | 1.2 | Large headings, display text |
| `--line-height-snug` | 1.3 | Medium headings |
| `--line-height-normal` | 1.5 | Body text (minimum comfortable) |
| `--line-height-relaxed` | 1.6 | Long-form body text |
| `--line-height-loose` | 1.75 | Spacious reading experience |

### Usage Examples

```css
/* In CSS */
h1 {
  line-height: var(--line-height-tight);  /* 1.2 */
}

body {
  line-height: var(--line-height-relaxed); /* 1.6 */
}
```

```html
<!-- Inline with Tailwind (if configured) -->
<p class="leading-tight">Tight heading (1.2)</p>
<p class="leading-normal">Normal text (1.5)</p>
<p class="leading-relaxed">Relaxed text (1.6)</p>
```

---

## Letter Spacing

| Variable | Value | Usage |
|----------|-------|-------|
| `--letter-spacing-tighter` | -0.05em | Large headings (tracking tightness) |
| `--letter-spacing-tight` | -0.025em | Medium headings |
| `--letter-spacing-normal` | 0 | Body text (default) |
| `--letter-spacing-wide` | 0.025em | Small text, buttons |
| `--letter-spacing-wider` | 0.05em | All caps, labels, badges |

### Usage Examples

```css
/* Display text with tight letter spacing */
h1 {
  letter-spacing: var(--letter-spacing-tighter);
  font-size: var(--font-size-5xl);
}

/* Button text with slight widening */
.button {
  letter-spacing: var(--letter-spacing-wide);
  font-weight: var(--font-weight-semibold);
}

/* All-caps labels */
.label {
  letter-spacing: var(--letter-spacing-wider);
  text-transform: uppercase;
}
```

---

## HTML Element Styling

The project includes semantic HTML element styling with sensible defaults:

### Headings

```html
<h1>Primary Page Heading (48px, bold, tight line-height)</h1>
<h2>Secondary Heading (36px, bold, 1.3 line-height)</h2>
<h3>Tertiary Heading (28px, bold, 1.3 line-height)</h3>
<h4>Subheading (24px, bold)</h4>
<h5>Minor Heading (20px, bold)</h5>
<h6>Small Heading (18px, bold)</h6>
```

**CSS Applied:**
```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);  /* Inter-first stack */
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

h1 {
  font-size: var(--font-size-4xl);
  letter-spacing: var(--letter-spacing-tighter);
}
```

### Paragraphs

```html
<p>Default body text uses 16px with 1.6 line-height for comfortable reading.</p>
```

**CSS Applied:**
```css
p {
  line-height: var(--line-height-relaxed);  /* 1.6 */
  margin: 0;  /* Reset margin, use spacing utilities instead */
}
```

### Links

```html
<a href="/page">Links inherit color and use smooth color transitions</a>
```

**CSS Applied:**
```css
a {
  color: inherit;
  text-decoration: inherit;
  transition: var(--transition-colors);
}
```

---

## Usage Examples

### Basic Text Classes

#### Using Tailwind Font Size Utilities

```html
<!-- Display and Heading Levels -->
<div class="text-display-xl">Hero title (72px)</div>
<h1 class="text-h1">Page heading (48px)</h1>
<h2 class="text-h2">Section heading (36px)</h2>

<!-- Body Text Hierarchy -->
<p class="text-body-lg">Large introductory text (18px)</p>
<p class="text-body">Default body text (16px)</p>
<p class="text-body-sm">Secondary text (14px)</p>
<span class="text-caption">Small label (12px)</span>
```

#### Using CSS Variables

```html
<!-- For more control with CSS variables -->
<p style="
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  letter-spacing: var(--letter-spacing-normal);
">
  Paragraph with explicit CSS variable typography
</p>
```

### Practical Component Examples

#### Hero Section

```html
<section class="text-center">
  <h1 class="text-display-xl font-bold">
    Transform Your Ideas
  </h1>
  <p class="text-body-lg text-text-secondary mt-4">
    Build beautiful digital experiences with our design system
  </p>
</section>
```

**CSS:**
```css
h1 {
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tighter);
  color: var(--color-text-primary);
}

p {
  line-height: var(--line-height-relaxed);
}
```

#### Card with Title and Description

```html
<article class="bg-bg-card p-6 border-2 border-border-primary">
  <h3 class="text-h3 mb-3">Feature Title</h3>
  <p class="text-body text-text-secondary leading-relaxed">
    This is a detailed description of the feature with comfortable reading line-height.
  </p>
  <small class="text-caption text-text-tertiary block mt-4">
    Published on November 8, 2025
  </small>
</article>
```

#### Button with Typography

```html
<button class="px-6 py-3 font-semibold text-body">
  Click Me
</button>
```

**CSS:**
```css
button {
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-wide);
  transition: var(--transition-colors);
}
```

#### Long-form Article

```html
<article class="max-w-3xl mx-auto prose">
  <h1 class="text-h1 mb-8">Article Title</h1>

  <p class="text-body leading-relaxed mb-6">
    Long-form content with relaxed line-height for comfort.
  </p>

  <h2 class="text-h2 mt-8 mb-4">Section Heading</h2>
  <p class="text-body leading-relaxed mb-6">
    More body text in comfortable reading size.
  </p>
</article>
```

---

## Color Integration

Typography works seamlessly with the color system:

### Text Color Classes

```html
<p class="text-text-primary">Primary text (white, 21:1 contrast)</p>
<p class="text-text-secondary">Secondary text (lighter gray, 14.77:1 contrast)</p>
<p class="text-text-tertiary">Tertiary text (medium gray, 8.59:1 contrast)</p>
<p class="text-text-muted">Muted text (gray, 4.54:1 contrast - WCAG AA for large text)</p>
<p class="text-text-disabled">Disabled text (dark gray)</p>
```

### Text Color + Font Size Combinations

```html
<!-- Large headline with primary color -->
<h1 class="text-h1 text-text-primary">
  Bold Headline
</h1>

<!-- Small secondary text -->
<p class="text-caption text-text-tertiary">
  Supporting information
</p>

<!-- Accent-colored text -->
<span class="text-accent-primary font-semibold">
  Highlighted text
</span>
```

---

## Migration Guide

If you're updating from an older typography system, follow this guide:

### From Generic Tailwind Sizes to Semantic Custom Sizes

**Before:**
```html
<h1 class="text-5xl font-bold">Heading</h1>
<p class="text-base font-normal">Body text</p>
<p class="text-sm font-medium">Secondary text</p>
```

**After (Recommended):**
```html
<h1 class="text-h1">Heading</h1>
<p class="text-body">Body text</p>
<p class="text-body-sm font-medium">Secondary text</p>
```

### From Inline Styles to CSS Classes

**Before:**
```html
<p style="font-size: 16px; line-height: 1.5; color: #D4D4D4;">
  Body text
</p>
```

**After (Using classes):**
```html
<p class="text-body text-text-secondary leading-relaxed">
  Body text
</p>
```

**After (Using CSS variables):**
```html
<p style="
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
">
  Body text
</p>
```

### From Fixed Breakpoints to Fluid Typography

**Before:**
```css
p {
  font-size: 14px;
}

@media (min-width: 1024px) {
  p {
    font-size: 16px;
  }
}
```

**After (Using fluid typography):**
```css
p {
  font-size: var(--font-size-base);  /* 16px → 18px responsively */
}
```

### Updating Heading Styles

**Before:**
```html
<div class="text-4xl font-bold">Custom Heading</div>
```

**After:**
```html
<h2 class="text-h2">Semantic Heading</h2>
```

---

## Best Practices

### 1. Use Semantic HTML Elements

Always prefer HTML heading elements over divs styled as headings:

```html
<!-- Good -->
<h1 class="text-h1">Page Title</h1>

<!-- Avoid -->
<div class="text-h1">Page Title</div>
```

**Why:** Better accessibility, SEO, and semantic meaning for screen readers.

### 2. Maintain Text Hierarchy

Use the type scale consistently to establish clear visual hierarchy:

```html
<!-- Proper hierarchy -->
<h1 class="text-h1">Main Title</h1>
<h2 class="text-h2">Section</h2>
<h3 class="text-h3">Subsection</h3>
<p class="text-body">Body content</p>
```

### 3. Pair Font Sizes with Appropriate Line Heights

Larger text typically needs tighter line-height; smaller text needs looser line-height:

```css
/* Display text: tight line-height */
.display {
  font-size: var(--font-size-5xl);
  line-height: var(--line-height-tight);      /* 1.2 */
}

/* Body text: relaxed line-height */
body {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);    /* 1.6 */
}
```

### 4. Use Color Classes for Accessibility

Always ensure sufficient contrast for readability:

```html
<!-- Good: High contrast combinations -->
<p class="text-body text-text-primary">Primary text on dark background</p>

<!-- Caution: Lower contrast for secondary info -->
<p class="text-body text-text-secondary">Secondary info only</p>

<!-- Avoid on light backgrounds -->
<p class="text-text-tertiary">Not accessible on light backgrounds</p>
```

**Contrast Ratios:**
- Primary (white): 21:1 - AAA compliant
- Secondary: 14.77:1 - AAA compliant
- Tertiary: 8.59:1 - AA compliant
- Muted: 4.54:1 - AA compliant for large text only

### 5. Leverage Fluid Typography

Use CSS variable font sizes for responsive layouts without media queries:

```css
/* Automatic responsive sizing */
h1 {
  font-size: var(--font-size-4xl);  /* 48px → 60px based on viewport */
}

p {
  font-size: var(--font-size-base);  /* 16px → 18px based on viewport */
}
```

### 6. Letter Spacing for All-Caps Text

When using uppercase text, increase letter spacing:

```html
<button>
  <span style="
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wider);
  ">
    Action Button
  </span>
</button>
```

### 7. Group Related Typography

Use CSS custom properties to create consistent text groups:

```css
.article-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-snug);
  letter-spacing: var(--letter-spacing-tight);
}

.article-body {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
}
```

### 8. Responsive Text Spacing

Use margin and padding utilities with typography for breathing room:

```html
<section>
  <h1 class="text-h1 mb-6">Heading with bottom margin</h1>
  <p class="text-body leading-relaxed mb-4">
    Paragraph with bottom margin
  </p>
  <p class="text-body-sm text-text-tertiary">
    Secondary text
  </p>
</section>
```

### 9. Avoid Redundant Font Weights

The design system already applies appropriate weights per element:

```html
<!-- Good: Let the system handle weights -->
<h1 class="text-h1">Heading (already 700)</h1>

<!-- Unnecessary: Avoid overriding -->
<h1 class="text-h1 font-bold">Heading (redundant bold)</h1>
```

### 10. Test Readability on Small Screens

Fluid typography scales automatically, but always test:

```html
<!-- Readable on all screens due to fluid sizing -->
<p class="text-body">Automatically scales from 16px to 18px</p>

<!-- For very small screens, ensure minimum readability -->
<p class="text-body-sm">Scales from 14px to 16px</p>
```

---

## Accessibility Considerations

### WCAG Compliance

The typography system is designed with WCAG 2.1 AAA standards in mind:

- **Color Contrast**: Primary text achieves 21:1 contrast ratio (AAA)
- **Font Sizing**: Minimum 12px base size with responsive scaling
- **Line Height**: 1.5 minimum for body text (WCAG requirement)
- **Letter Spacing**: Proper spacing for readability

### Focus States

When elements receive focus, use visible focus indicators:

```css
*:focus-visible {
  outline: 3px solid currentColor;
  outline-offset: 2px;
}
```

### Font Smoothing

All text uses optimized font smoothing for better rendering:

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## Performance Optimizations

### Font Loading Strategy

The project uses **self-hosted fonts** with `font-display: swap` for optimal performance:

```css
@font-face {
  font-family: 'Inter';
  font-display: swap;  /* Show fallback immediately, swap when ready */
  src: url('/fonts/inter-latin-400-normal.woff2') format('woff2');
}
```

**Why:** Prevents font loading delays and ensures text is always visible.

### Reducing Font Files

Only necessary weights are loaded:
- 400 (normal)
- 500 (medium)
- 600 (semibold)
- 700 (bold)

---

## Configuration Files

### Tailwind Configuration
**File:** `/2025-profile/tailwind.config.js`

```javascript
fontSize: {
  'display-xl': ['72px', { lineHeight: '1.2', fontWeight: '700' }],
  'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
  'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
  // ... more sizes
}
```

### CSS Variables
**File:** `/2025-profile/src/styles/tokens.css`

Contains all CSS custom properties for typography including font-size, line-height, letter-spacing, and font-weight variables.

### Global Styles
**File:** `/2025-profile/src/styles/global.css`

Includes:
- Font face declarations for all weights
- HTML element styling (h1-h6, p, a, etc.)
- Custom utility classes for typography combinations

---

## Quick Reference Table

| Use Case | Class/Variable | Size | Weight | Line Height |
|----------|----------------|------|--------|-------------|
| Hero Title | `text-display-xl` | 72px | 700 | 1.2 |
| Main Heading | `text-h1` | 48px | 700 | 1.2 |
| Section Heading | `text-h2` | 36px | 700 | 1.3 |
| Subsection | `text-h3` | 28px | 700 | 1.3 |
| Large Body | `text-body-lg` | 18px | 400 | 1.5 |
| Body Text | `text-body` | 16px | 400 | 1.5 |
| Small Text | `text-body-sm` | 14px | 400 | 1.5 |
| Labels/Captions | `text-caption` | 12px | 400 | 1.5 |

---

## Troubleshooting

### Font Not Rendering

**Issue:** Custom fonts not appearing

**Solution:**
1. Check font files exist in `/public/fonts/`
2. Verify `@font-face` declarations in `global.css`
3. Clear browser cache
4. Check font MIME types are correct (.woff2)

### Line Height Too Tight

**Issue:** Text appears cramped

**Solution:**
- Use `leading-relaxed` or `line-height: var(--line-height-relaxed)`
- Ensure minimum 1.5 line-height for body text

### Unresponsive Typography

**Issue:** Text size not changing on responsive layouts

**Solution:**
- Use CSS variables instead of fixed pixel sizes
- Variables use `clamp()` for automatic responsive scaling
- Avoid overriding with fixed `font-size` values

### Color Contrast Issues

**Issue:** Text not readable enough

**Solution:**
- Use `text-text-primary` for main content
- Ensure contrast ratio meets WCAG AA minimum (4.5:1)
- Test with accessibility tools
- Avoid `text-text-tertiary` on light backgrounds

---

## Resources

- Tailwind CSS Documentation: https://tailwindcss.com/docs/font-size
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- IBM Plex Font Family: https://github.com/IBM/plex
- Inter Font Family: https://rsms.me/inter/
- Fluid Typography Guide: https://www.smashingmagazine.com/2022/01/fluid-typography-css-clamp/

---

**Last Updated:** November 8, 2025
**System Version:** 2025 Design System v1.0
**Status:** Complete and Production-Ready
