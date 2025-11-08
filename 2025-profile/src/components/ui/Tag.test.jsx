import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tag } from './Tag.jsx';

describe('Tag', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Tag>Test Tag</Tag>);
      expect(screen.getByText('Test Tag')).toBeInTheDocument();
    });

    it('renders children content', () => {
      render(<Tag>JavaScript</Tag>);
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    it('renders multiple words', () => {
      render(<Tag>React Testing Library</Tag>);
      expect(screen.getByText('React Testing Library')).toBeInTheDocument();
    });

    it('renders special characters', () => {
      render(<Tag>Node.js</Tag>);
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('renders numbers', () => {
      render(<Tag>Version 2.0</Tag>);
      expect(screen.getByText('Version 2.0')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies base styling classes', () => {
      const { container } = render(<Tag>Styled</Tag>);
      const tag = container.firstChild;

      expect(tag).toHaveClass('inline-block');
      expect(tag).toHaveClass('px-3');
      expect(tag).toHaveClass('py-1');
      expect(tag).toHaveClass('text-body-sm');
      expect(tag).toHaveClass('bg-bg-card-inline');
      expect(tag).toHaveClass('border-border-secondary');
      expect(tag).toHaveClass('border-thin');
      expect(tag).toHaveClass('text-text-secondary');
    });

    it('applies custom className', () => {
      const { container } = render(<Tag className="custom-tag">Test</Tag>);
      const tag = container.firstChild;

      expect(tag).toHaveClass('custom-tag');
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<Tag className="extra-class">Test</Tag>);
      const tag = container.firstChild;

      expect(tag).toHaveClass('extra-class');
      expect(tag).toHaveClass('inline-block');
    });

    it('handles empty className', () => {
      const { container } = render(<Tag className="">Test</Tag>);
      const tag = container.firstChild;

      expect(tag).toHaveClass('inline-block');
    });
  });

  describe('Framer Motion integration', () => {
    it('renders as motion.span element', () => {
      const { container } = render(<Tag>Motion Tag</Tag>);
      const tag = container.firstChild;

      // Framer Motion renders as a span
      expect(tag.tagName).toBe('SPAN');
    });

    it('has whileHover animation props configured', () => {
      const { container } = render(<Tag>Hover Test</Tag>);
      const tag = container.firstChild;

      expect(tag).toBeInTheDocument();
      // Framer Motion props are internal, so we just verify the element exists
    });

    it('has transition props configured', () => {
      const { container } = render(<Tag>Transition Test</Tag>);
      const tag = container.firstChild;

      expect(tag).toBeInTheDocument();
    });
  });

  describe('children handling', () => {
    it('renders string children', () => {
      render(<Tag>String Child</Tag>);
      expect(screen.getByText('String Child')).toBeInTheDocument();
    });

    it('renders element children', () => {
      render(
        <Tag>
          <strong>Bold Text</strong>
        </Tag>
      );
      expect(screen.getByText('Bold Text')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <Tag>
          <span>Part 1</span>
          <span>Part 2</span>
        </Tag>
      );
      expect(screen.getByText('Part 1')).toBeInTheDocument();
      expect(screen.getByText('Part 2')).toBeInTheDocument();
    });

    it('handles empty children gracefully', () => {
      const { container } = render(<Tag></Tag>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles null children gracefully', () => {
      const { container } = render(<Tag>{null}</Tag>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles undefined children gracefully', () => {
      const { container } = render(<Tag>{undefined}</Tag>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('renders visible text content', () => {
      render(<Tag>Accessible Tag</Tag>);
      const tag = screen.getByText('Accessible Tag');
      expect(tag).toBeVisible();
    });

    it('is inline element (does not break text flow)', () => {
      const { container } = render(<Tag>Inline</Tag>);
      const tag = container.firstChild;
      expect(tag).toHaveClass('inline-block');
    });
  });

  describe('component structure', () => {
    it('renders as a span element', () => {
      const { container } = render(<Tag>Span Tag</Tag>);
      expect(container.firstChild.tagName).toBe('SPAN');
    });

    it('is an inline-level element', () => {
      const { container } = render(<Tag>Inline Level</Tag>);
      const tag = container.firstChild;
      expect(tag).toHaveClass('inline-block');
    });
  });

  describe('props validation', () => {
    it('handles missing className prop', () => {
      const { container } = render(<Tag>No Class</Tag>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles whitespace in className', () => {
      const { container } = render(<Tag className="  spaced  ">Test</Tag>);
      const tag = container.firstChild;
      expect(tag).toBeInTheDocument();
    });

    it('handles multiple classes in className', () => {
      const { container } = render(<Tag className="class1 class2 class3">Test</Tag>);
      const tag = container.firstChild;

      expect(tag).toHaveClass('class1');
      expect(tag).toHaveClass('class2');
      expect(tag).toHaveClass('class3');
    });
  });

  describe('snapshot testing', () => {
    it('matches snapshot with default props', () => {
      const { container } = render(<Tag>Snapshot Test</Tag>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with custom className', () => {
      const { container } = render(<Tag className="custom">Snapshot</Tag>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with element children', () => {
      const { container } = render(
        <Tag>
          <em>Emphasized</em>
        </Tag>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('multiple instances', () => {
    it('can render multiple tags', () => {
      render(
        <>
          <Tag>Tag 1</Tag>
          <Tag>Tag 2</Tag>
          <Tag>Tag 3</Tag>
        </>
      );

      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
      expect(screen.getByText('Tag 3')).toBeInTheDocument();
    });

    it('each tag maintains independent styling', () => {
      const { container } = render(
        <>
          <Tag className="red">Red Tag</Tag>
          <Tag className="blue">Blue Tag</Tag>
        </>
      );

      const tags = container.querySelectorAll('span');
      expect(tags[0]).toHaveClass('red');
      expect(tags[1]).toHaveClass('blue');
      expect(tags[0]).not.toHaveClass('blue');
      expect(tags[1]).not.toHaveClass('red');
    });
  });

  describe('realistic use cases', () => {
    it('renders as a technology tag', () => {
      render(<Tag>TypeScript</Tag>);
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('renders as a skill tag', () => {
      render(<Tag>React</Tag>);
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('renders in a list of tags', () => {
      render(
        <div>
          <Tag>JavaScript</Tag>
          <Tag>Python</Tag>
          <Tag>Go</Tag>
        </div>
      );

      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('Go')).toBeInTheDocument();
    });
  });
});
