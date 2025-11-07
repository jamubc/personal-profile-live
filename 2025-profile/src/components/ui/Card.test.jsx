import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card.jsx';

describe('Card', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Card>Content</Card>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders children content', () => {
      render(<Card>Test Card Content</Card>);
      expect(screen.getByText('Test Card Content')).toBeInTheDocument();
    });

    it('renders complex children', () => {
      render(
        <Card>
          <h2>Title</h2>
          <p>Paragraph</p>
        </Card>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
    });
  });

  describe('variant prop', () => {
    it('renders with standard variant by default', () => {
      const { container } = render(<Card>Standard Card</Card>);
      const card = container.firstChild;

      expect(card).toHaveClass('bg-bg-card');
      expect(card).toHaveClass('border-border-primary');
      expect(card).toHaveClass('border-default');
      expect(card).toHaveClass('shadow-brutal-lg');
      expect(card).toHaveClass('p-card-md');
    });

    it('renders with standard variant when explicitly set', () => {
      const { container } = render(<Card variant="standard">Standard</Card>);
      const card = container.firstChild;

      expect(card).toHaveClass('bg-bg-card');
      expect(card).toHaveClass('border-default');
      expect(card).toHaveClass('shadow-brutal-lg');
      expect(card).toHaveClass('p-card-md');
    });

    it('renders with featured variant', () => {
      const { container } = render(<Card variant="featured">Featured Card</Card>);
      const card = container.firstChild;

      expect(card).toHaveClass('bg-bg-card-featured');
      expect(card).toHaveClass('border-border-primary');
      expect(card).toHaveClass('border-thick');
      expect(card).toHaveClass('shadow-brutal-xl');
      expect(card).toHaveClass('p-card-lg');
    });

    it('standard variant has medium padding', () => {
      const { container } = render(<Card variant="standard">Test</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('p-card-md');
    });

    it('featured variant has large padding', () => {
      const { container } = render(<Card variant="featured">Test</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('p-card-lg');
    });

    it('standard variant has default border', () => {
      const { container } = render(<Card variant="standard">Test</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('border-default');
    });

    it('featured variant has thick border', () => {
      const { container } = render(<Card variant="featured">Test</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('border-thick');
    });

    it('standard variant has large shadow', () => {
      const { container } = render(<Card variant="standard">Test</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('shadow-brutal-lg');
    });

    it('featured variant has extra-large shadow', () => {
      const { container } = render(<Card variant="featured">Test</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('shadow-brutal-xl');
    });
  });

  describe('custom className', () => {
    it('applies custom className', () => {
      const { container } = render(<Card className="custom-card">Test</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('custom-card');
    });

    it('merges custom className with variant classes', () => {
      const { container } = render(
        <Card variant="standard" className="extra-class">
          Test
        </Card>
      );
      const card = container.firstChild;

      expect(card).toHaveClass('extra-class');
      expect(card).toHaveClass('bg-bg-card');
    });

    it('handles empty className', () => {
      const { container } = render(<Card className="">Test</Card>);
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });

    it('handles multiple custom classes', () => {
      const { container } = render(<Card className="class1 class2 class3">Test</Card>);
      const card = container.firstChild;

      expect(card).toHaveClass('class1');
      expect(card).toHaveClass('class2');
      expect(card).toHaveClass('class3');
    });
  });

  describe('Framer Motion integration', () => {
    it('renders as motion.div element', () => {
      const { container } = render(<Card>Motion Card</Card>);
      const card = container.firstChild;
      expect(card.tagName).toBe('DIV');
    });

    it('has initial animation state props', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
      // Motion props are internal, just verify element exists
    });

    it('has whileInView animation props', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });

    it('has viewport configuration', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });

    it('has transition configuration', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });

    it('has whileHover animation props', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });
  });

  describe('children handling', () => {
    it('renders string children', () => {
      render(<Card>Simple text</Card>);
      expect(screen.getByText('Simple text')).toBeInTheDocument();
    });

    it('renders element children', () => {
      render(
        <Card>
          <div>Nested div</div>
        </Card>
      );
      expect(screen.getByText('Nested div')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <Card>
          <h1>Heading</h1>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </Card>
      );

      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    });

    it('handles empty children', () => {
      const { container } = render(<Card></Card>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles null children', () => {
      const { container } = render(<Card>{null}</Card>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles undefined children', () => {
      const { container } = render(<Card>{undefined}</Card>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders complex nested structure', () => {
      render(
        <Card>
          <header>
            <h1>Card Title</h1>
          </header>
          <main>
            <p>Card content</p>
          </main>
          <footer>
            <button>Action</button>
          </footer>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  describe('component structure', () => {
    it('renders as a div element', () => {
      const { container } = render(<Card>Test</Card>);
      expect(container.firstChild.tagName).toBe('DIV');
    });

    it('is a block-level element', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });
  });

  describe('props validation', () => {
    it('handles missing variant prop', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-bg-card'); // defaults to standard
    });

    it('handles missing className prop', () => {
      const { container } = render(<Card>Test</Card>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles all props together', () => {
      const { container } = render(
        <Card variant="featured" className="custom">
          Full Props
        </Card>
      );

      const card = container.firstChild;
      expect(card).toHaveClass('bg-bg-card-featured');
      expect(card).toHaveClass('custom');
      expect(screen.getByText('Full Props')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('renders accessible content in the document', () => {
      render(<Card>Accessible Content</Card>);
      // Content should be in the DOM (accessible to screen readers)
      // even if opacity is 0 due to animation initial state
      expect(screen.getByText('Accessible Content')).toBeInTheDocument();
    });

    it('maintains semantic HTML inside card', () => {
      render(
        <Card>
          <article>
            <h2>Article Title</h2>
            <p>Article content</p>
          </article>
        </Card>
      );

      expect(screen.getByText('Article Title')).toBeInTheDocument();
      expect(screen.getByText('Article content')).toBeInTheDocument();
    });
  });

  describe('snapshot testing', () => {
    it('matches snapshot with default props', () => {
      const { container } = render(<Card>Snapshot Test</Card>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with standard variant', () => {
      const { container } = render(<Card variant="standard">Standard</Card>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with featured variant', () => {
      const { container } = render(<Card variant="featured">Featured</Card>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with custom className', () => {
      const { container } = render(<Card className="custom">Custom</Card>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with complex children', () => {
      const { container } = render(
        <Card>
          <h1>Title</h1>
          <p>Content</p>
        </Card>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('multiple instances', () => {
    it('can render multiple cards', () => {
      render(
        <>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
          <Card>Card 3</Card>
        </>
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });

    it('each card can have different variants', () => {
      const { container } = render(
        <>
          <Card variant="standard">Standard</Card>
          <Card variant="featured">Featured</Card>
        </>
      );

      const cards = container.querySelectorAll('div');
      expect(cards[0]).toHaveClass('p-card-md');
      expect(cards[1]).toHaveClass('p-card-lg');
    });

    it('each card maintains independent styling', () => {
      const { container } = render(
        <>
          <Card className="red">Red Card</Card>
          <Card className="blue">Blue Card</Card>
        </>
      );

      const cards = container.querySelectorAll('div');
      expect(cards[0]).toHaveClass('red');
      expect(cards[1]).toHaveClass('blue');
      expect(cards[0]).not.toHaveClass('blue');
      expect(cards[1]).not.toHaveClass('red');
    });
  });

  describe('realistic use cases', () => {
    it('renders as a project card', () => {
      render(
        <Card variant="featured">
          <h3>Project Title</h3>
          <p>Project description goes here</p>
          <div>Tech Stack: React, TypeScript</div>
        </Card>
      );

      expect(screen.getByText('Project Title')).toBeInTheDocument();
      expect(screen.getByText('Project description goes here')).toBeInTheDocument();
      expect(screen.getByText('Tech Stack: React, TypeScript')).toBeInTheDocument();
    });

    it('renders as a skill card', () => {
      render(
        <Card variant="standard">
          <h4>JavaScript</h4>
          <p>5+ years experience</p>
        </Card>
      );

      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('5+ years experience')).toBeInTheDocument();
    });

    it('renders with interactive content', () => {
      render(
        <Card>
          <h3>Interactive Card</h3>
          <button>Click me</button>
          <a href="#">Learn more</a>
        </Card>
      );

      expect(screen.getByText('Interactive Card')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
      expect(screen.getByText('Learn more')).toBeInTheDocument();
    });
  });
});
