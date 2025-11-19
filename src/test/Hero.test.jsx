import { render, screen } from '@testing-library/react';
import { Hero } from '../components/sections/Hero';
import { describe, it, expect } from 'vitest';

describe('Hero Component', () => {
    it('renders the main heading', () => {
        render(<Hero />);
        expect(screen.getByText('Andrew')).toBeInTheDocument();
    });

    it('renders the CTA button', () => {
        render(<Hero />);
        expect(screen.getByText('View My Work')).toBeInTheDocument();
    });
});
