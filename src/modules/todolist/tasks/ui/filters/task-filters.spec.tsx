import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterButton } from './task-filters';

describe('FilterButton', () => {
    it('renders the label text', () => {
        render(<FilterButton label="All" />);
        expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    });

    it('renders optional children alongside the label', () => {
        render(
            <FilterButton label="All">
                <span>(3)</span>
            </FilterButton>
        );
        expect(screen.getByRole('button')).toHaveTextContent('All(3)');
    });

    it('calls onClick when clicked', () => {
        const onClick = vi.fn();
        render(<FilterButton label="All" onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('can be disabled', () => {
        render(<FilterButton label="Clear" disabled />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('highlights itself when it is the active filter', () => {
        render(<FilterButton label="Active" active />);
        expect(screen.getByRole('button').className).toContain('bg-secondary');
    });

    it('does not highlight itself when inactive', () => {
        render(<FilterButton label="All" active={false} />);
        expect(screen.getByRole('button').className).not.toContain('bg-secondary');
    });
});
