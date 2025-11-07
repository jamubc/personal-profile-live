import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ShieldBadge } from './ShieldBadge.jsx';

describe('ShieldBadge', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<ShieldBadge src="test.svg" alt="Test Badge" />);
      expect(screen.getByAltText('Test Badge')).toBeInTheDocument();
    });

    it('renders image with src attribute', () => {
      render(<ShieldBadge src="badge.svg" alt="Badge" />);
      const img = screen.getByAltText('Badge');
      expect(img).toHaveAttribute('src', 'badge.svg');
    });

    it('renders image with alt text', () => {
      render(<ShieldBadge src="test.svg" alt="Accessibility Text" />);
      const img = screen.getByAltText('Accessibility Text');
      expect(img).toBeInTheDocument();
    });
  });

  describe('without href (standalone image)', () => {
    it('renders just an image when href is not provided', () => {
      const { container } = render(<ShieldBadge src="standalone.svg" alt="Standalone" />);
      const img = screen.getByAltText('Standalone');

      expect(container.querySelector('a')).not.toBeInTheDocument();
      expect(img).toBeInTheDocument();
    });

    it('renders image as direct child when no href', () => {
      const { container } = render(<ShieldBadge src="direct.svg" alt="Direct" />);
      expect(container.firstChild.tagName).toBe('IMG');
    });
  });

  describe('with href (linked image)', () => {
    it('renders wrapped in anchor tag when href is provided', () => {
      render(<ShieldBadge src="linked.svg" alt="Linked" href="https://example.com" />);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('anchor has correct href attribute', () => {
      render(<ShieldBadge src="test.svg" alt="Test" href="https://github.com" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://github.com');
    });

    it('anchor opens in new tab', () => {
      render(<ShieldBadge src="test.svg" alt="Test" href="https://example.com" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('anchor has security attributes', () => {
      render(<ShieldBadge src="test.svg" alt="Test" href="https://example.com" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('anchor has inline-block class', () => {
      render(<ShieldBadge src="test.svg" alt="Test" href="https://example.com" />);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('inline-block');
    });

    it('image is inside anchor tag', () => {
      render(<ShieldBadge src="nested.svg" alt="Nested" href="https://example.com" />);
      const link = screen.getByRole('link');
      const img = screen.getByAltText('Nested');
      expect(link).toContainElement(img);
    });
  });

  describe('image attributes', () => {
    it('has inline-block class', () => {
      render(<ShieldBadge src="test.svg" alt="Test" />);
      const img = screen.getByAltText('Test');
      expect(img).toHaveClass('inline-block');
    });

    it('has correct height class', () => {
      render(<ShieldBadge src="test.svg" alt="Test" />);
      const img = screen.getByAltText('Test');
      expect(img).toHaveClass('h-6');
    });

    it('has loading lazy attribute', () => {
      render(<ShieldBadge src="test.svg" alt="Test" />);
      const img = screen.getByAltText('Test');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('has decoding async attribute', () => {
      render(<ShieldBadge src="test.svg" alt="Test" />);
      const img = screen.getByAltText('Test');
      expect(img).toHaveAttribute('decoding', 'async');
    });
  });

  describe('custom className', () => {
    it('applies custom className to image', () => {
      render(<ShieldBadge src="test.svg" alt="Test" className="custom-badge" />);
      const img = screen.getByAltText('Test');
      expect(img).toHaveClass('custom-badge');
    });

    it('merges custom className with default classes', () => {
      render(<ShieldBadge src="test.svg" alt="Test" className="extra-class" />);
      const img = screen.getByAltText('Test');
      expect(img).toHaveClass('extra-class');
      expect(img).toHaveClass('inline-block');
      expect(img).toHaveClass('h-6');
    });

    it('handles empty className', () => {
      render(<ShieldBadge src="test.svg" alt="Test" className="" />);
      const img = screen.getByAltText('Test');
      expect(img).toBeInTheDocument();
    });

    it('applies className to image even when wrapped in link', () => {
      render(
        <ShieldBadge
          src="test.svg"
          alt="Test"
          className="badge-style"
          href="https://example.com"
        />
      );
      const img = screen.getByAltText('Test');
      expect(img).toHaveClass('badge-style');
    });
  });

  describe('accessibility', () => {
    it('has alt text for screen readers', () => {
      render(<ShieldBadge src="npm-badge.svg" alt="NPM Version" />);
      expect(screen.getByAltText('NPM Version')).toBeInTheDocument();
    });

    it('link is keyboard accessible when href provided', () => {
      render(<ShieldBadge src="test.svg" alt="Test" href="https://example.com" />);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('image has meaningful alt text', () => {
      render(<ShieldBadge src="badge.svg" alt="Build Status: Passing" />);
      const img = screen.getByAltText('Build Status: Passing');
      expect(img).toBeInTheDocument();
    });
  });

  describe('security', () => {
    it('external link has noopener attribute', () => {
      render(<ShieldBadge src="test.svg" alt="Test" href="https://external.com" />);
      const link = screen.getByRole('link');
      expect(link.getAttribute('rel')).toContain('noopener');
    });

    it('external link has noreferrer attribute', () => {
      render(<ShieldBadge src="test.svg" alt="Test" href="https://external.com" />);
      const link = screen.getByRole('link');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    });
  });

  describe('props validation', () => {
    it('handles various src formats', () => {
      const sources = [
        'https://img.shields.io/badge/test',
        '/local/path/badge.svg',
        './relative/badge.svg',
        'badge.svg',
      ];

      sources.forEach((src, index) => {
        const { unmount } = render(<ShieldBadge src={src} alt={`Badge ${index}`} />);
        const img = screen.getByAltText(`Badge ${index}`);
        expect(img).toHaveAttribute('src', src);
        unmount();
      });
    });

    it('handles various href formats', () => {
      const hrefs = [
        'https://github.com/user/repo',
        'https://npmjs.com/package/name',
        'https://example.com',
      ];

      hrefs.forEach((href, index) => {
        const { unmount } = render(
          <ShieldBadge src="test.svg" alt={`Test ${index}`} href={href} />
        );
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', href);
        unmount();
      });
    });

    it('handles missing href gracefully', () => {
      render(<ShieldBadge src="test.svg" alt="Test" />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('handles undefined href', () => {
      render(<ShieldBadge src="test.svg" alt="Test" href={undefined} />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('handles null href', () => {
      render(<ShieldBadge src="test.svg" alt="Test" href={null} />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('handles empty string href', () => {
      render(<ShieldBadge src="test.svg" alt="Test" href="" />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('snapshot testing', () => {
    it('matches snapshot without href', () => {
      const { container } = render(<ShieldBadge src="test.svg" alt="Snapshot" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with href', () => {
      const { container } = render(
        <ShieldBadge src="test.svg" alt="Snapshot" href="https://example.com" />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with custom className', () => {
      const { container } = render(
        <ShieldBadge src="test.svg" alt="Snapshot" className="custom" />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('realistic use cases', () => {
    it('renders NPM badge', () => {
      render(
        <ShieldBadge
          src="https://img.shields.io/npm/v/package-name"
          alt="NPM Version"
          href="https://www.npmjs.com/package/package-name"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://www.npmjs.com/package/package-name');
      expect(screen.getByAltText('NPM Version')).toBeInTheDocument();
    });

    it('renders GitHub badge', () => {
      render(
        <ShieldBadge
          src="https://img.shields.io/github/stars/user/repo"
          alt="GitHub Stars"
          href="https://github.com/user/repo"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://github.com/user/repo');
    });

    it('renders build status badge', () => {
      render(
        <ShieldBadge
          src="https://img.shields.io/badge/build-passing-brightgreen"
          alt="Build Status"
        />
      );

      expect(screen.getByAltText('Build Status')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('multiple instances', () => {
    it('can render multiple badges', () => {
      render(
        <>
          <ShieldBadge src="badge1.svg" alt="Badge 1" />
          <ShieldBadge src="badge2.svg" alt="Badge 2" />
          <ShieldBadge src="badge3.svg" alt="Badge 3" />
        </>
      );

      expect(screen.getByAltText('Badge 1')).toBeInTheDocument();
      expect(screen.getByAltText('Badge 2')).toBeInTheDocument();
      expect(screen.getByAltText('Badge 3')).toBeInTheDocument();
    });

    it('each badge can have independent href', () => {
      render(
        <>
          <ShieldBadge src="b1.svg" alt="Badge 1" href="https://one.com" />
          <ShieldBadge src="b2.svg" alt="Badge 2" />
          <ShieldBadge src="b3.svg" alt="Badge 3" href="https://three.com" />
        </>
      );

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', 'https://one.com');
      expect(links[1]).toHaveAttribute('href', 'https://three.com');
    });
  });
});
