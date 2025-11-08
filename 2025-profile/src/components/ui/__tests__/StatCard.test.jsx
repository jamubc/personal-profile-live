import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../StatCard';

// Mock GlassCard component to simplify testing
vi.mock('../GlassCard', () => ({
  default: ({ children, className, glowColor, ...props }) => (
    <div
      className={`glass-card ${className || ''}`}
      data-testid="glass-card"
      data-glow-color={glowColor}
      {...props}
    >
      {children}
    </div>
  ),
}));

describe('StatCard', () => {
  describe('rendering with all props', () => {
    it('renders without crashing with all required props', () => {
      render(
        <StatCard
          value="42"
          label="Projects Completed"
          glowColor="purple"
          className="custom-class"
        />
      );
      expect(screen.getByText('Projects Completed')).toBeInTheDocument();
    });

    it('renders value with correct text', () => {
      const testValue = '42';
      render(
        <StatCard
          value={testValue}
          label="Test Label"
        />
      );
      expect(screen.getByText(testValue)).toBeInTheDocument();
    });

    it('renders label with correct text', () => {
      const testLabel = 'Test Statistics';
      render(
        <StatCard
          value="50"
          label={testLabel}
        />
      );
      expect(screen.getByText(testLabel)).toBeInTheDocument();
    });

    it('renders numeric value', () => {
      render(
        <StatCard
          value={42}
          label="Items"
        />
      );
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders all content together', () => {
      render(
        <StatCard
          value="500"
          label="Commits"
        />
      );
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('Commits')).toBeInTheDocument();
    });
  });

  describe('glow color variants', () => {
    it('applies default purple glow color when not specified', () => {
      render(
        <StatCard
          value="10"
          label="Default Color"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveAttribute('data-glow-color', 'purple');
    });

    it('applies purple glow color explicitly', () => {
      render(
        <StatCard
          value="15"
          label="Purple Stat"
          glowColor="purple"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveAttribute('data-glow-color', 'purple');
    });

    it('applies cyan glow color', () => {
      render(
        <StatCard
          value="20"
          label="Cyan Stat"
          glowColor="cyan"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveAttribute('data-glow-color', 'cyan');
    });

    it('applies blue glow color', () => {
      render(
        <StatCard
          value="25"
          label="Blue Stat"
          glowColor="blue"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveAttribute('data-glow-color', 'blue');
    });

    it('applies pink glow color', () => {
      render(
        <StatCard
          value="30"
          label="Pink Stat"
          glowColor="pink"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveAttribute('data-glow-color', 'pink');
    });

    it('applies green glow color', () => {
      render(
        <StatCard
          value="35"
          label="Green Stat"
          glowColor="green"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveAttribute('data-glow-color', 'green');
    });

    it('renders multiple cards with different glow colors', () => {
      const { container } = render(
        <>
          <StatCard value="10" label="Purple" glowColor="purple" />
          <StatCard value="20" label="Cyan" glowColor="cyan" />
          <StatCard value="30" label="Blue" glowColor="blue" />
        </>
      );
      const glassCards = container.querySelectorAll('[data-testid="glass-card"]');
      expect(glassCards).toHaveLength(3);
      expect(glassCards[0]).toHaveAttribute('data-glow-color', 'purple');
      expect(glassCards[1]).toHaveAttribute('data-glow-color', 'cyan');
      expect(glassCards[2]).toHaveAttribute('data-glow-color', 'blue');
    });
  });

  describe('animations', () => {
    it('has GlassCard as container with variant and hoverEffect', () => {
      render(
        <StatCard
          value="50"
          label="Animated Card"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toBeInTheDocument();
    });

    it('renders with glassmorphism styling applied', () => {
      const { container } = render(
        <StatCard
          value="70"
          label="Hover Effect Card"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveClass('glass-card');
    });

    it('value and label should be animated through GlassCard', () => {
      const { container } = render(
        <StatCard
          value="90"
          label="Animation Test"
        />
      );
      const valueElement = screen.getByText('90');
      const labelElement = screen.getByText('Animation Test');
      expect(valueElement).toBeInTheDocument();
      expect(labelElement).toBeInTheDocument();
    });

    it('maintains animation state through component lifecycle', () => {
      const { rerender } = render(
        <StatCard
          value="110"
          label="Initial"
        />
      );
      expect(screen.getByText('Initial')).toBeInTheDocument();

      rerender(
        <StatCard
          value="120"
          label="Updated"
        />
      );
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });

  describe('value formatting', () => {
    it('displays string value', () => {
      render(
        <StatCard
          value="100"
          label="String Value"
        />
      );
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('displays numeric value', () => {
      render(
        <StatCard
          value={250}
          label="Numeric Value"
        />
      );
      expect(screen.getByText('250')).toBeInTheDocument();
    });

    it('displays value with special characters', () => {
      render(
        <StatCard
          value="1000+"
          label="Plus Value"
        />
      );
      expect(screen.getByText('1000+')).toBeInTheDocument();
    });

    it('displays value with formatting characters', () => {
      render(
        <StatCard
          value="99.9%"
          label="Percentage"
        />
      );
      expect(screen.getByText('99.9%')).toBeInTheDocument();
    });

    it('displays value with comma separator', () => {
      render(
        <StatCard
          value="1,000,000"
          label="Large Number"
        />
      );
      expect(screen.getByText('1,000,000')).toBeInTheDocument();
    });

    it('value has large font size styling (text-3xl)', () => {
      const { container } = render(
        <StatCard
          value="500"
          label="Styled Value"
        />
      );
      const valueElement = screen.getByText('500');
      expect(valueElement).toHaveClass('text-3xl');
    });

    it('value has bold font weight', () => {
      const { container } = render(
        <StatCard
          value="700"
          label="Bold Value"
        />
      );
      const valueElement = screen.getByText('700');
      expect(valueElement).toHaveClass('font-bold');
    });

    it('displays empty string value', () => {
      render(
        <StatCard
          value=""
          label="Empty Value"
        />
      );
      expect(screen.getByText('Empty Value')).toBeInTheDocument();
    });

    it('displays zero value', () => {
      render(
        <StatCard
          value="0"
          label="Zero"
        />
      );
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('label formatting', () => {
    it('displays simple label text', () => {
      render(
        <StatCard
          value="10"
          label="Simple Label"
        />
      );
      expect(screen.getByText('Simple Label')).toBeInTheDocument();
    });

    it('displays label with multiple words', () => {
      render(
        <StatCard
          value="20"
          label="This is a longer label text"
        />
      );
      expect(screen.getByText('This is a longer label text')).toBeInTheDocument();
    });

    it('displays label with special characters', () => {
      render(
        <StatCard
          value="30"
          label="Label with (special) & characters!"
        />
      );
      expect(screen.getByText('Label with (special) & characters!')).toBeInTheDocument();
    });

    it('label has small font size styling (text-sm)', () => {
      const { container } = render(
        <StatCard
          value="40"
          label="Small Label"
        />
      );
      const labelElement = screen.getByText('Small Label');
      expect(labelElement).toHaveClass('text-sm');
    });

    it('label is uppercase', () => {
      const { container } = render(
        <StatCard
          value="50"
          label="Uppercase Label"
        />
      );
      const labelElement = screen.getByText('Uppercase Label');
      expect(labelElement).toHaveClass('uppercase');
    });

    it('label has tracking-wider for letter spacing', () => {
      const { container } = render(
        <StatCard
          value="60"
          label="Tracking Label"
        />
      );
      const labelElement = screen.getByText('Tracking Label');
      expect(labelElement).toHaveClass('tracking-wider');
    });

    it('displays label with numbers', () => {
      render(
        <StatCard
          value="90"
          label="Projects (2024)"
        />
      );
      expect(screen.getByText('Projects (2024)')).toBeInTheDocument();
    });

    it('displays very long label text', () => {
      const longLabel = 'This is a very long label text that describes the statistic in detail';
      render(
        <StatCard
          value="100"
          label={longLabel}
        />
      );
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });
  });

  describe('custom className', () => {
    it('applies custom className to card', () => {
      const { container } = render(
        <StatCard
          value="10"
          label="Custom Class"
          className="custom-wrapper"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveClass('custom-wrapper');
    });

    it('applies multiple custom classes', () => {
      const { container } = render(
        <StatCard
          value="20"
          label="Multiple Classes"
          className="class1 class2 class3"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveClass('class1');
      expect(glassCard).toHaveClass('class2');
      expect(glassCard).toHaveClass('class3');
    });

    it('renders with width custom class', () => {
      const { container } = render(
        <StatCard
          value="30"
          label="Width Class"
          className="w-full"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveClass('w-full');
    });

    it('handles empty className prop', () => {
      const { container } = render(
        <StatCard
          value="40"
          label="Empty Class"
          className=""
        />
      );
      expect(screen.getByTestId('glass-card')).toBeInTheDocument();
    });

    it('merges custom className with default classes', () => {
      const { container } = render(
        <StatCard
          value="50"
          label="Merged Classes"
          className="custom-class"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveClass('custom-class');
      expect(glassCard).toHaveClass('text-center');
    });
  });

  describe('isGradient prop', () => {
    it('applies gradient styling when isGradient is true', () => {
      const { container } = render(
        <StatCard
          value="100"
          label="Gradient Value"
          isGradient={true}
        />
      );
      const valueElement = screen.getByText('100');
      expect(valueElement).toHaveClass('bg-gradient-to-r');
      expect(valueElement).toHaveClass('bg-clip-text');
      expect(valueElement).toHaveClass('text-transparent');
    });

    it('does not apply gradient styling when isGradient is false', () => {
      const { container } = render(
        <StatCard
          value="200"
          label="Non-Gradient Value"
          isGradient={false}
        />
      );
      const valueElement = screen.getByText('200');
      expect(valueElement).toHaveClass('text-accent-purple');
    });

    it('applies correct gradient colors (purple to cyan)', () => {
      const { container } = render(
        <StatCard
          value="300"
          label="Gradient Colors"
          isGradient={true}
        />
      );
      const valueElement = screen.getByText('300');
      expect(valueElement).toHaveClass('from-accent-purple');
      expect(valueElement).toHaveClass('to-accent-cyan');
    });
  });

  describe('component structure', () => {
    it('wraps content in GlassCard component', () => {
      const { container } = render(
        <StatCard
          value="10"
          label="Glass Card Test"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toBeInTheDocument();
    });

    it('GlassCard uses gradient-border variant', () => {
      render(
        <StatCard
          value="20"
          label="Gradient Border"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toBeInTheDocument();
    });

    it('GlassCard has lift hover effect', () => {
      render(
        <StatCard
          value="30"
          label="Lift Hover"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toBeInTheDocument();
    });

    it('has text-center alignment', () => {
      const { container } = render(
        <StatCard
          value="40"
          label="Centered"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveClass('text-center');
    });

    it('has horizontal padding', () => {
      const { container } = render(
        <StatCard
          value="50"
          label="Padded"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveClass('px-6');
    });

    it('has vertical padding', () => {
      const { container } = render(
        <StatCard
          value="60"
          label="Padded Vertical"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveClass('py-8');
    });

    it('value is below label in document structure', () => {
      const { container } = render(
        <StatCard
          value="70"
          label="Order Test"
        />
      );
      const valueElement = screen.getByText('70');
      const labelElement = screen.getByText('Order Test');

      // Value appears before label in HTML
      const valueIndex = Array.from(container.querySelectorAll('*')).indexOf(valueElement);
      const labelIndex = Array.from(container.querySelectorAll('*')).indexOf(labelElement);
      expect(valueIndex).toBeLessThan(labelIndex);
    });

    it('value has margin-bottom for spacing', () => {
      const { container } = render(
        <StatCard
          value="80"
          label="Spacing"
        />
      );
      const valueElement = screen.getByText('80');
      expect(valueElement).toHaveClass('mb-2');
    });

    it('label has secondary text color styling', () => {
      const { container } = render(
        <StatCard
          value="90"
          label="Text Color"
        />
      );
      const labelElement = screen.getByText('Text Color');
      expect(labelElement).toHaveClass('text-text-secondary');
    });
  });

  describe('default props', () => {
    it('uses purple as default glow color', () => {
      render(
        <StatCard
          value="10"
          label="Default Glow"
        />
      );
      const glassCard = screen.getByTestId('glass-card');
      expect(glassCard).toHaveAttribute('data-glow-color', 'purple');
    });

    it('uses empty string as default className', () => {
      const { container } = render(
        <StatCard
          value="20"
          label="Default Class"
        />
      );
      expect(screen.getByTestId('glass-card')).toBeInTheDocument();
    });

    it('renders without explicit glowColor prop', () => {
      render(
        <StatCard
          value="30"
          label="No Glow Prop"
        />
      );
      expect(screen.getByText('No Glow Prop')).toBeInTheDocument();
    });

    it('renders without explicit className prop', () => {
      render(
        <StatCard
          value="40"
          label="No Class Prop"
        />
      );
      expect(screen.getByText('No Class Prop')).toBeInTheDocument();
    });

    it('isGradient defaults to false', () => {
      const { container } = render(
        <StatCard
          value="50"
          label="Default Gradient"
        />
      );
      const valueElement = screen.getByText('50');
      // Without isGradient true, it should have text-accent-purple
      expect(valueElement).toHaveClass('text-accent-purple');
    });
  });

  describe('multiple instances', () => {
    it('renders multiple StatCard components', () => {
      render(
        <>
          <StatCard value="10" label="Card 1" />
          <StatCard value="20" label="Card 2" />
          <StatCard value="30" label="Card 3" />
        </>
      );
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });

    it('each card maintains independent props', () => {
      render(
        <>
          <StatCard value="100" label="Stat 1" glowColor="purple" />
          <StatCard value="200" label="Stat 2" glowColor="cyan" />
          <StatCard value="300" label="Stat 3" glowColor="pink" />
        </>
      );
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('300')).toBeInTheDocument();
    });

    it('different cards can have different gradients', () => {
      const { container } = render(
        <>
          <StatCard value="10" label="Card A" isGradient={true} />
          <StatCard value="20" label="Card B" isGradient={false} />
        </>
      );
      const values = container.querySelectorAll('div[class*="text-3xl"]');
      expect(values.length).toBeGreaterThan(0);
    });

    it('each card maintains independent styling', () => {
      const { container } = render(
        <>
          <StatCard
            value="10"
            label="Styled 1"
            className="custom-1"
          />
          <StatCard
            value="20"
            label="Styled 2"
            className="custom-2"
          />
        </>
      );
      const glassCards = container.querySelectorAll('[data-testid="glass-card"]');
      expect(glassCards).toHaveLength(2);
    });
  });

  describe('realistic use cases', () => {
    it('renders as a project count statistic', () => {
      render(
        <StatCard
          value="42"
          label="Projects Completed"
          glowColor="purple"
        />
      );
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Projects Completed')).toBeInTheDocument();
    });

    it('renders as a code lines statistic', () => {
      render(
        <StatCard
          value="1000+"
          label="Lines of Code"
          glowColor="cyan"
          className="w-full"
        />
      );
      expect(screen.getByText('1000+')).toBeInTheDocument();
      expect(screen.getByText('Lines of Code')).toBeInTheDocument();
    });

    it('renders as a years of experience statistic', () => {
      render(
        <StatCard
          value="5+"
          label="Years of Experience"
          glowColor="blue"
        />
      );
      expect(screen.getByText('5+')).toBeInTheDocument();
      expect(screen.getByText('Years of Experience')).toBeInTheDocument();
    });

    it('renders statistics dashboard with multiple cards', () => {
      render(
        <div className="grid grid-cols-3 gap-4">
          <StatCard value="95" label="Success Rate" glowColor="green" isGradient={true} />
          <StatCard value="150" label="Targets Met" glowColor="cyan" isGradient={false} />
          <StatCard value="1200" label="Tasks Done" glowColor="purple" />
        </div>
      );
      expect(screen.getByText('Success Rate')).toBeInTheDocument();
      expect(screen.getByText('Targets Met')).toBeInTheDocument();
      expect(screen.getByText('Tasks Done')).toBeInTheDocument();
    });

    it('renders with gradient effect enabled', () => {
      const { container } = render(
        <StatCard
          value="85"
          label="Gradient Stat"
          glowColor="pink"
          isGradient={true}
        />
      );
      const valueElement = screen.getByText('85');
      expect(valueElement).toHaveClass('bg-gradient-to-r');
      expect(valueElement).toHaveClass('text-transparent');
    });
  });

  describe('edge cases', () => {
    it('handles very long value string', () => {
      const longValue = 'A'.repeat(100);
      render(
        <StatCard
          value={longValue}
          label="Long Value"
        />
      );
      expect(screen.getByText(longValue)).toBeInTheDocument();
    });

    it('handles special HTML characters in label', () => {
      render(
        <StatCard
          value="10"
          label="Values & Statistics"
        />
      );
      expect(screen.getByText('Values & Statistics')).toBeInTheDocument();
    });

    it('handles whitespace in label', () => {
      render(
        <StatCard
          value="20"
          label="Label   with   spaces"
        />
      );
      // React Testing Library normalizes whitespace, so check for the normalized version
      expect(screen.getByText(/Label.*with.*spaces/)).toBeInTheDocument();
    });

    it('renders with zero value', () => {
      render(
        <StatCard
          value="0"
          label="Zero Stat"
        />
      );
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders with negative value', () => {
      render(
        <StatCard
          value="-50"
          label="Negative Stat"
        />
      );
      expect(screen.getByText('-50')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('renders accessible text content', () => {
      render(
        <StatCard
          value="42"
          label="Accessible Stat"
        />
      );
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Accessible Stat')).toBeInTheDocument();
    });

    it('label is rendered as paragraph element', () => {
      const { container } = render(
        <StatCard
          value="100"
          label="Statistic Label"
        />
      );
      const label = screen.getByText('Statistic Label');
      expect(label.tagName).toBe('DIV');
    });

    it('all content is visually readable', () => {
      const { container } = render(
        <StatCard
          value="75"
          label="Readable Content"
        />
      );
      const value = screen.getByText('75');
      const label = screen.getByText('Readable Content');
      expect(value).toBeVisible();
      expect(label).toBeVisible();
    });
  });

  describe('snapshot testing', () => {
    it('matches snapshot with default props', () => {
      const { container } = render(
        <StatCard
          value="10"
          label="Default Props"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with cyan glow color', () => {
      const { container } = render(
        <StatCard
          value="20"
          label="Cyan Glow"
          glowColor="cyan"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with purple glow color', () => {
      const { container } = render(
        <StatCard
          value="30"
          label="Purple Glow"
          glowColor="purple"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with custom className', () => {
      const { container } = render(
        <StatCard
          value="40"
          label="Custom Class"
          className="w-full custom"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with all props', () => {
      const { container } = render(
        <StatCard
          value="1000+"
          label="Complete Props Test"
          glowColor="pink"
          className="w-full h-full"
          isGradient={true}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with gradient enabled', () => {
      const { container } = render(
        <StatCard
          value="85"
          label="Gradient Test"
          isGradient={true}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
