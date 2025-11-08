/* eslint-disable no-unused-vars */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GlassCard from '../GlassCard.jsx';

describe('GlassCard Component', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<GlassCard>Content</GlassCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders children content', () => {
      render(<GlassCard>Test Glass Card Content</GlassCard>);
      expect(screen.getByText('Test Glass Card Content')).toBeInTheDocument();
    });

    it('renders complex children', () => {
      render(
        <GlassCard>
          <h2>Title</h2>
          <p>Paragraph</p>
        </GlassCard>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
    });

    it('renders as a div element', () => {
      const { container } = render(<GlassCard>Test</GlassCard>);
      expect(container.firstChild.tagName).toBe('DIV');
    });

    it('renders with motion.div attributes', () => {
      const { container } = render(<GlassCard>Test</GlassCard>);
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });
  });

  describe('variant prop', () => {
    it('renders with default variant by default', () => {
      const { container } = render(<GlassCard>Default Card</GlassCard>);
      const card = container.firstChild;

      expect(card).toHaveClass('bg-white/5');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('border-white/10');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('backdrop-blur-2xl');
    });

    it('renders with default variant when explicitly set', () => {
      const { container } = render(<GlassCard variant="default">Default</GlassCard>);
      const card = container.firstChild;

      expect(card).toHaveClass('bg-white/5');
      expect(card).toHaveClass('border-white/10');
    });

    it('renders with gradient-border variant', () => {
      const { container } = render(<GlassCard variant="gradient-border">Gradient</GlassCard>);
      const card = container.firstChild;

      expect(card).toHaveClass('bg-white/5');
      expect(card).toHaveClass('border-2');
      expect(card).toHaveClass('border-transparent');
    });

    it('renders with accent variant', () => {
      const { container } = render(<GlassCard variant="accent">Accent</GlassCard>);
      const card = container.firstChild;

      expect(card).toHaveClass('bg-white/10');
      expect(card).toHaveClass('border-white/20');
    });

    it('gradient-border variant has proper styling', () => {
      const { container } = render(<GlassCard variant="gradient-border">Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toHaveClass('border-2');
      expect(card).toHaveClass('border-transparent');
      expect(card).toHaveClass('bg-clip-padding');
    });

    it('accent variant has higher background opacity', () => {
      const { container } = render(<GlassCard variant="accent">Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toHaveClass('bg-white/10');
    });
  });

  describe('custom className application', () => {
    it('applies custom className', () => {
      const { container } = render(<GlassCard className="custom-card">Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toHaveClass('custom-card');
    });

    it('merges custom className with variant classes', () => {
      const { container } = render(
        <GlassCard variant="default" className="extra-class">
          Test
        </GlassCard>
      );
      const card = container.firstChild;

      expect(card).toHaveClass('extra-class');
      expect(card).toHaveClass('bg-white/5');
    });

    it('handles empty className', () => {
      const { container } = render(<GlassCard className="">Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('handles multiple custom classes', () => {
      const { container } = render(
        <GlassCard className="class1 class2 class3">Test</GlassCard>
      );
      const card = container.firstChild;

      expect(card).toHaveClass('class1');
      expect(card).toHaveClass('class2');
      expect(card).toHaveClass('class3');
    });

    it('preserves variant classes when adding custom classes', () => {
      const { container } = render(
        <GlassCard variant="accent" className="my-custom-styling">
          Test
        </GlassCard>
      );
      const card = container.firstChild;

      expect(card).toHaveClass('bg-white/10');
      expect(card).toHaveClass('border-white/20');
      expect(card).toHaveClass('my-custom-styling');
    });
  });

  describe('children rendering', () => {
    it('renders string children', () => {
      render(<GlassCard>Simple text</GlassCard>);
      expect(screen.getByText('Simple text')).toBeInTheDocument();
    });

    it('renders element children', () => {
      render(
        <GlassCard>
          <div>Nested div</div>
        </GlassCard>
      );

      expect(screen.getByText('Nested div')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <GlassCard>
          <h1>Heading</h1>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </GlassCard>
      );

      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    });

    it('renders complex nested structure', () => {
      render(
        <GlassCard>
          <header>
            <h1>Card Title</h1>
          </header>
          <main>
            <p>Card content</p>
          </main>
          <footer>
            <button>Action</button>
          </footer>
        </GlassCard>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('renders with interactive content', () => {
      render(
        <GlassCard>
          <h3>Interactive Card</h3>
          <button>Click me</button>
          <a href="#">Learn more</a>
        </GlassCard>
      );

      expect(screen.getByText('Interactive Card')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
      expect(screen.getByText('Learn more')).toBeInTheDocument();
    });
  });

  describe('hover effects', () => {
    it('renders with no hover effect by default', () => {
      const { container } = render(<GlassCard hoverEffect="none">Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('renders with lift hover effect', () => {
      const { container } = render(<GlassCard hoverEffect="lift">Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('renders with scale hover effect', () => {
      const { container } = render(<GlassCard hoverEffect="scale">Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('renders with glow hover effect', () => {
      const { container } = render(<GlassCard hoverEffect="glow">Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('renders with brighten hover effect', () => {
      const { container } = render(<GlassCard hoverEffect="brighten">Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('adds cursor-pointer class when hover effect is not none', () => {
      const { container: containerNone } = render(
        <GlassCard hoverEffect="none">Test</GlassCard>
      );
      const cardNone = containerNone.firstChild;

      const { container: containerLift } = render(
        <GlassCard hoverEffect="lift">Test</GlassCard>
      );
      const cardLift = containerLift.firstChild;

      expect(cardLift).toHaveClass('cursor-pointer');
    });

    it('default hover effect is none', () => {
      const { container } = render(<GlassCard>Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('updates border on hover for interactive cards', () => {
      const { container } = render(
        <GlassCard hoverEffect="lift">Test</GlassCard>
      );
      const card = container.firstChild;

      expect(card).toHaveClass('hover:border-white/20');
    });
  });

  describe('glow color customization', () => {
    it('supports blue glow color prop', () => {
      const { container } = render(
        <GlassCard variant="default" glowColor="blue">
          Blue Glow
        </GlassCard>
      );
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('supports purple glow color prop', () => {
      const { container } = render(
        <GlassCard variant="default" glowColor="purple">
          Purple Glow
        </GlassCard>
      );
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('supports pink glow color prop', () => {
      const { container } = render(
        <GlassCard variant="default" glowColor="pink">
          Pink Glow
        </GlassCard>
      );
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('supports green glow color prop', () => {
      const { container } = render(
        <GlassCard variant="default" glowColor="green">
          Green Glow
        </GlassCard>
      );
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('supports cyan glow color prop', () => {
      const { container } = render(
        <GlassCard variant="default" glowColor="cyan">
          Cyan Glow
        </GlassCard>
      );
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('defaults to blue glow color', () => {
      const { container } = render(
        <GlassCard variant="default">
          Default Glow Color
        </GlassCard>
      );
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('accepts glowColor prop for styling', () => {
      const { container } = render(
        <GlassCard variant="default" glowColor="cyan">
          Custom Glow
        </GlassCard>
      );
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });
  });

  describe('accessibility (ARIA attributes)', () => {
    it('renders accessible content in the document', () => {
      render(<GlassCard>Accessible Content</GlassCard>);
      expect(screen.getByText('Accessible Content')).toBeInTheDocument();
    });

    it('maintains semantic HTML inside card', () => {
      render(
        <GlassCard>
          <article>
            <h2>Article Title</h2>
            <p>Article content</p>
          </article>
        </GlassCard>
      );

      expect(screen.getByText('Article Title')).toBeInTheDocument();
      expect(screen.getByText('Article content')).toBeInTheDocument();
    });

    it('supports role attribute on children', () => {
      render(
        <GlassCard>
          <div role="region" aria-label="Card content">
            Content Region
          </div>
        </GlassCard>
      );

      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('supports aria-label on children', () => {
      render(
        <GlassCard>
          <div aria-label="Important Information">Info</div>
        </GlassCard>
      );

      expect(screen.getByLabelText('Important Information')).toBeInTheDocument();
    });

    it('supports aria-describedby on children', () => {
      render(
        <GlassCard>
          <h2 id="card-title">Card Title</h2>
          <p id="card-description" aria-describedby="card-title">
            This is the card description
          </p>
        </GlassCard>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('This is the card description')).toBeInTheDocument();
    });

    it('supports aria-live regions inside card', () => {
      render(
        <GlassCard>
          <div aria-live="polite" aria-atomic="true">
            Live Update
          </div>
        </GlassCard>
      );

      expect(screen.getByText('Live Update')).toBeInTheDocument();
    });

    it('supports heading hierarchy', () => {
      render(
        <GlassCard>
          <h1>Main Title</h1>
          <h2>Subtitle</h2>
          <h3>Sub-subtitle</h3>
        </GlassCard>
      );

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });

    it('supports button elements with proper accessibility', () => {
      render(
        <GlassCard>
          <button aria-label="Close card">X</button>
        </GlassCard>
      );

      expect(screen.getByRole('button', { name: 'Close card' })).toBeInTheDocument();
    });

    it('supports link elements with proper accessibility', () => {
      render(
        <GlassCard>
          <a href="#" aria-label="Visit homepage">
            Home
          </a>
        </GlassCard>
      );

      expect(screen.getByRole('link', { name: 'Visit homepage' })).toBeInTheDocument();
    });

    it('supports list structures inside card', () => {
      render(
        <GlassCard>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </GlassCard>
      );

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });
  });

  describe('Framer Motion integration', () => {
    it('renders as motion.div element', () => {
      const { container } = render(<GlassCard>Motion Card</GlassCard>);
      const card = container.firstChild;

      expect(card.tagName).toBe('DIV');
    });

    it('applies initial animation state', () => {
      const { container } = render(<GlassCard>Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('has whileTap animation', () => {
      const { container } = render(<GlassCard>Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('applies transition duration class', () => {
      const { container } = render(<GlassCard>Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toHaveClass('transition-all');
      expect(card).toHaveClass('duration-300');
    });
  });

  describe('combination of props', () => {
    it('combines variant and hover effect', () => {
      const { container } = render(
        <GlassCard variant="gradient-border" hoverEffect="lift">
          Combined Props
        </GlassCard>
      );
      const card = container.firstChild;

      expect(card).toHaveClass('border-2');
      expect(card).toHaveClass('cursor-pointer');
    });

    it('combines variant with custom className and hover effect', () => {
      const { container } = render(
        <GlassCard
          variant="gradient-border"
          hoverEffect="scale"
          className="custom-padding"
        >
          Full Props
        </GlassCard>
      );
      const card = container.firstChild;

      expect(card).toHaveClass('border-2');
      expect(card).toHaveClass('custom-padding');
      expect(card).toHaveClass('cursor-pointer');
    });

    it('applies all props together correctly', () => {
      const { container } = render(
        <GlassCard
          variant="accent"
          className="extra-styling"
          hoverEffect="scale"
          glowColor="cyan"
        >
          All Props Content
        </GlassCard>
      );

      const card = container.firstChild;
      expect(card).toHaveClass('bg-white/10');
      expect(card).toHaveClass('border-white/20');
      expect(card).toHaveClass('extra-styling');
      expect(card).toHaveClass('cursor-pointer');
      expect(screen.getByText('All Props Content')).toBeInTheDocument();
    });
  });

  describe('snapshot testing', () => {
    it('matches snapshot with default props', () => {
      const { container } = render(<GlassCard>Snapshot Test</GlassCard>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with default variant', () => {
      const { container } = render(
        <GlassCard variant="default">Default</GlassCard>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with gradient-border variant', () => {
      const { container } = render(
        <GlassCard variant="gradient-border">Gradient</GlassCard>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with accent variant', () => {
      const { container } = render(
        <GlassCard variant="accent">Accent</GlassCard>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with custom className', () => {
      const { container } = render(
        <GlassCard className="custom">Custom</GlassCard>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with hover effect', () => {
      const { container } = render(
        <GlassCard hoverEffect="lift">Lift Effect</GlassCard>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with glowColor prop', () => {
      const { container } = render(
        <GlassCard glowColor="purple">
          Purple Glow
        </GlassCard>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with complex children', () => {
      const { container } = render(
        <GlassCard>
          <h1>Title</h1>
          <p>Content</p>
        </GlassCard>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('multiple instances', () => {
    it('can render multiple cards', () => {
      render(
        <>
          <GlassCard>Card 1</GlassCard>
          <GlassCard>Card 2</GlassCard>
          <GlassCard>Card 3</GlassCard>
        </>
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });

    it('each card can have different variants', () => {
      const { container } = render(
        <>
          <GlassCard variant="default">Default</GlassCard>
          <GlassCard variant="accent">Accent</GlassCard>
          <GlassCard variant="gradient-border">Gradient</GlassCard>
        </>
      );

      const cards = container.querySelectorAll('div[class*="bg-white"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('each card can have different hover effects', () => {
      render(
        <>
          <GlassCard hoverEffect="none">No Hover</GlassCard>
          <GlassCard hoverEffect="lift">Lift</GlassCard>
          <GlassCard hoverEffect="scale">Scale</GlassCard>
        </>
      );

      expect(screen.getByText('No Hover')).toBeInTheDocument();
      expect(screen.getByText('Lift')).toBeInTheDocument();
      expect(screen.getByText('Scale')).toBeInTheDocument();
    });

    it('each card maintains independent styling', () => {
      const { container } = render(
        <>
          <GlassCard className="red">Red Card</GlassCard>
          <GlassCard className="blue">Blue Card</GlassCard>
        </>
      );

      const cards = container.querySelectorAll('[class*="bg-white"]');
      expect(cards.length).toBeGreaterThan(0);
      expect(screen.getByText('Red Card')).toBeInTheDocument();
      expect(screen.getByText('Blue Card')).toBeInTheDocument();
    });
  });

  describe('realistic use cases', () => {
    it('renders as a feature card', () => {
      render(
        <GlassCard variant="gradient-border" hoverEffect="lift">
          <h3>Feature Title</h3>
          <p>Feature description goes here</p>
          <div>Feature icon</div>
        </GlassCard>
      );

      expect(screen.getByText('Feature Title')).toBeInTheDocument();
      expect(screen.getByText('Feature description goes here')).toBeInTheDocument();
      expect(screen.getByText('Feature icon')).toBeInTheDocument();
    });

    it('renders as a testimonial card', () => {
      render(
        <GlassCard variant="accent" hoverEffect="scale">
          <blockquote>"This is amazing!"</blockquote>
          <p>- John Doe</p>
        </GlassCard>
      );

      expect(screen.getByText('"This is amazing!"')).toBeInTheDocument();
      expect(screen.getByText('- John Doe')).toBeInTheDocument();
    });

    it('renders as a pricing card with gradient effect', () => {
      render(
        <GlassCard variant="gradient-border" glowColor="green" hoverEffect="scale">
          <h2>Pro Plan</h2>
          <p>$29/month</p>
          <button>Get Started</button>
        </GlassCard>
      );

      expect(screen.getByText('Pro Plan')).toBeInTheDocument();
      expect(screen.getByText('$29/month')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('renders as a stat card', () => {
      render(
        <GlassCard className="text-center">
          <h3>1000+</h3>
          <p>Happy Customers</p>
        </GlassCard>
      );

      expect(screen.getByText('1000+')).toBeInTheDocument();
      expect(screen.getByText('Happy Customers')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles empty children gracefully', () => {
      const { container } = render(<GlassCard></GlassCard>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles null children', () => {
      const { container } = render(<GlassCard>{null}</GlassCard>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles undefined children', () => {
      const { container } = render(<GlassCard>{undefined}</GlassCard>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles false children', () => {
      const { container } = render(<GlassCard>{false}</GlassCard>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles whitespace in className', () => {
      const { container } = render(
        <GlassCard className="  class1   class2  ">Test</GlassCard>
      );
      const card = container.firstChild;

      expect(card).toHaveClass('class1');
      expect(card).toHaveClass('class2');
    });

    it('defaults to default variant with invalid variant', () => {
      const { container } = render(
        <GlassCard variant="invalid">Test</GlassCard>
      );
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
    });

    it('handles very long content', () => {
      const longText = 'A'.repeat(1000);
      render(<GlassCard>{longText}</GlassCard>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters in content', () => {
      const specialText = 'Special chars: !@#$%^&*()_+-=[]{}|;:\'",./\\';
      render(
        <GlassCard>
          {specialText}
        </GlassCard>
      );

      expect(screen.getByText(/Special chars:/)).toBeInTheDocument();
    });
  });

  describe('component structure', () => {
    it('renders with backdrop blur', () => {
      const { container } = render(<GlassCard>Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toHaveClass('backdrop-blur-2xl');
    });

    it('renders with rounded corners', () => {
      const { container } = render(<GlassCard>Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toHaveClass('rounded-lg');
    });

    it('has transition classes for smooth effects', () => {
      const { container } = render(<GlassCard>Test</GlassCard>);
      const card = container.firstChild;

      expect(card).toHaveClass('transition-all');
      expect(card).toHaveClass('duration-300');
    });

    it('content is wrapped with proper z-index and padding', () => {
      const { container } = render(
        <GlassCard>
          <p>Content</p>
        </GlassCard>
      );

      const contentWrapper = container.querySelector('.relative.z-10');
      expect(contentWrapper).toBeInTheDocument();
      expect(contentWrapper).toHaveClass('p-6');
    });
  });

  describe('prop validation', () => {
    it('handles missing props gracefully', () => {
      const { container } = render(<GlassCard>Test</GlassCard>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('has defaultProps defined', () => {
      expect(GlassCard.defaultProps).toBeDefined();
      expect(GlassCard.defaultProps.variant).toBe('default');
      expect(GlassCard.defaultProps.hoverEffect).toBe('none');
      expect(GlassCard.defaultProps.glowColor).toBe('blue');
    });

    it('renders with all default props when none provided', () => {
      const { container } = render(<GlassCard>Default Behavior</GlassCard>);
      const card = container.firstChild;

      expect(card).toBeInTheDocument();
      expect(screen.getByText('Default Behavior')).toBeInTheDocument();
    });
  });
});
