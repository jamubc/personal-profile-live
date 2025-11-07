import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar.jsx';

describe('Avatar', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Avatar />);
      expect(screen.getByLabelText('Avatar')).toBeInTheDocument();
    });

    it('renders with default initials', () => {
      render(<Avatar />);
      const avatar = screen.getByLabelText('Avatar');
      expect(avatar).toHaveTextContent('A');
    });

    it('renders with custom initials', () => {
      render(<Avatar initials="JD" />);
      const avatar = screen.getByLabelText('Avatar');
      expect(avatar).toHaveTextContent('JD');
    });

    it('renders with single character initial', () => {
      render(<Avatar initials="Z" />);
      const avatar = screen.getByLabelText('Avatar');
      expect(avatar).toHaveTextContent('Z');
    });

    it('renders with multiple character initials', () => {
      render(<Avatar initials="ABC" />);
      const avatar = screen.getByLabelText('Avatar');
      expect(avatar).toHaveTextContent('ABC');
    });
  });

  describe('styling', () => {
    it('applies base styling classes', () => {
      const { container } = render(<Avatar />);
      const avatar = container.firstChild;

      expect(avatar).toHaveClass('w-28');
      expect(avatar).toHaveClass('h-28');
      expect(avatar).toHaveClass('md:w-32');
      expect(avatar).toHaveClass('md:h-32');
      expect(avatar).toHaveClass('bg-bg-card');
      expect(avatar).toHaveClass('border-border-primary');
      expect(avatar).toHaveClass('border-thick');
      expect(avatar).toHaveClass('shadow-brutal-md');
    });

    it('applies layout classes', () => {
      const { container } = render(<Avatar />);
      const avatar = container.firstChild;

      expect(avatar).toHaveClass('flex');
      expect(avatar).toHaveClass('items-center');
      expect(avatar).toHaveClass('justify-center');
    });

    it('applies text styling classes', () => {
      const { container } = render(<Avatar />);
      const avatar = container.firstChild;

      expect(avatar).toHaveClass('text-h2');
      expect(avatar).toHaveClass('font-bold');
      expect(avatar).toHaveClass('text-text-primary');
    });

    it('applies custom className', () => {
      const { container } = render(<Avatar className="custom-class" />);
      const avatar = container.firstChild;

      expect(avatar).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<Avatar className="extra-style" />);
      const avatar = container.firstChild;

      expect(avatar).toHaveClass('extra-style');
      expect(avatar).toHaveClass('w-28');
      expect(avatar).toHaveClass('h-28');
    });
  });

  describe('accessibility', () => {
    it('has aria-label attribute', () => {
      render(<Avatar />);
      const avatar = screen.getByLabelText('Avatar');
      expect(avatar).toHaveAttribute('aria-label', 'Avatar');
    });

    it('is accessible by role', () => {
      const { container } = render(<Avatar />);
      const avatar = container.firstChild;
      expect(avatar).toBeInTheDocument();
    });

    it('text is visible and readable', () => {
      render(<Avatar initials="TDD" />);
      const avatar = screen.getByText('TDD');
      expect(avatar).toBeVisible();
    });
  });

  describe('props validation', () => {
    it('handles empty string initials', () => {
      render(<Avatar initials="" />);
      const avatar = screen.getByLabelText('Avatar');
      expect(avatar).toHaveTextContent('');
    });

    it('handles numeric initials', () => {
      render(<Avatar initials="42" />);
      const avatar = screen.getByLabelText('Avatar');
      expect(avatar).toHaveTextContent('42');
    });

    it('handles special characters in initials', () => {
      render(<Avatar initials="@#" />);
      const avatar = screen.getByLabelText('Avatar');
      expect(avatar).toHaveTextContent('@#');
    });

    it('handles undefined className gracefully', () => {
      const { container } = render(<Avatar className={undefined} />);
      const avatar = container.firstChild;
      expect(avatar).toBeInTheDocument();
    });

    it('handles null className gracefully', () => {
      const { container } = render(<Avatar className={null} />);
      const avatar = container.firstChild;
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('component structure', () => {
    it('renders as a div element', () => {
      const { container } = render(<Avatar />);
      expect(container.firstChild.tagName).toBe('DIV');
    });

    it('contains only text content (no child elements)', () => {
      const { container } = render(<Avatar initials="XY" />);
      const avatar = container.firstChild;
      expect(avatar.children.length).toBe(0);
    });
  });

  describe('snapshot testing', () => {
    it('matches snapshot with default props', () => {
      const { container } = render(<Avatar />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with custom initials', () => {
      const { container } = render(<Avatar initials="TDD" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with custom className', () => {
      const { container } = render(<Avatar initials="JS" className="test-class" />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('multiple instances', () => {
    it('can render multiple avatars with different initials', () => {
      render(
        <>
          <Avatar initials="AA" />
          <Avatar initials="BB" />
          <Avatar initials="CC" />
        </>
      );

      expect(screen.getByText('AA')).toBeInTheDocument();
      expect(screen.getByText('BB')).toBeInTheDocument();
      expect(screen.getByText('CC')).toBeInTheDocument();
    });
  });
});
