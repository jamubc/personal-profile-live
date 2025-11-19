# Change: Modern Navbar

## Why
The user requested a more modern navbar with specific hover effects to enhance the visual experience and focus.
The current navbar is functional but lacks the requested dynamic "blur others on hover" effect.

## What Changes
- Update `Navbar.tsx` to implement a group-hover effect.
- When hovering over the navigation container, all links will slightly blur.
- The specific link being hovered will remain sharp (no blur) and scale up slightly.
- This creates a depth-of-field effect that focuses attention on the active element.

## Impact
- Affected specs: `navigation`
- Affected code: `src/components/Navbar.tsx`
