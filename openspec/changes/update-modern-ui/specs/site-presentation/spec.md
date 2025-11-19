## ADDED Requirements
### Requirement: Layered Canvas
The landing page MUST present a multi-layered visual system (gradient base, noise/texture overlay, and glow accents) spanning the full viewport to avoid flat monochrome backgrounds.

#### Scenario: Background depth
- **GIVEN** the user loads any page section
- **THEN** the base background shows a dark-to-indigo gradient with a noise texture overlay
- **AND** at least two blurred glow elements anchor the hero and lower sections so the layout has depth.

### Requirement: Hero Social Proof
The hero MUST be a split layout combining typography, supporting copy, trust badges, and stat chips with two clear call-to-action buttons.

#### Scenario: Balanced hero layout
- **GIVEN** the hero renders on desktop
- **THEN** the left side shows heading, subheading, paragraph, and two CTA buttons styled differently
- **AND** the right side shows stacked stat/badge cards (e.g., availability badge plus metrics such as `Ship speed`)
- **SO THAT** visitors gain immediate trust in the services offered.

### Requirement: Premium Showcase Cards
Project cards MUST use glassmorphic surfaces with accent borders, high-contrast typography, and animated hover states to highlight the portfolio.

#### Scenario: Project emphasis
- **GIVEN** the projects grid renders
- **THEN** each card has a translucent background, gradient hairline border, and soft shadow
- **AND** hover states scale the thumbnail or border glow to reinforce interactivity
- **AND** tech tags remain pill-shaped with subdued tones to keep attention on the title and actions.

### Requirement: Cohesive Support Sections
Skills, contact, and footer sections MUST share the same surface system with translucent panels, subtle dividers, and consistent typography rhythm.

#### Scenario: Section cohesion
- **GIVEN** a visitor scrolls through supporting sections
- **THEN** each section features rounded containers, gradient strokes, or mesh backgrounds consistent with the hero
- **AND** spacing + typography scales match so the experience feels curated rather than AI-generated.
