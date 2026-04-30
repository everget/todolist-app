import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListHeader } from './list-header';

describe('ListHeader', () => {
    it('renders the primary text as a heading', () => {
        render(<ListHeader text="Lists" />);
        expect(screen.getByRole('heading', { name: 'Lists' })).toBeInTheDocument();
    });

    it('renders only the primary text when no second part is given', () => {
        render(<ListHeader text="Tasks" />);
        const heading = screen.getByRole('heading');
        expect(heading).toHaveTextContent('Tasks');
        expect(heading).not.toHaveTextContent(' - ');
    });

    it('renders both parts joined by a dash when a subtitle is provided', () => {
        render(<ListHeader text="Tasks" textSecondPart="My List" />);
        expect(screen.getByRole('heading')).toHaveTextContent('Tasks - My List');
    });

    it('uses a second-level heading', () => {
        render(<ListHeader text="Lists" />);
        expect(screen.getByRole('heading').tagName).toBe('H2');
    });
});
