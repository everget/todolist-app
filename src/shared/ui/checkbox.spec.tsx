import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
    it('renders as unchecked', () => {
        render(<Checkbox checked={false} onChange={vi.fn()} />);
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders as checked', () => {
        render(<Checkbox checked={true} onChange={vi.fn()} />);
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('reports true when ticked', () => {
        const onChange = vi.fn();
        render(<Checkbox checked={false} onChange={onChange} />);
        fireEvent.click(screen.getByRole('checkbox'));
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('reports false when unticked', () => {
        const onChange = vi.fn();
        render(<Checkbox checked={true} onChange={onChange} />);
        fireEvent.click(screen.getByRole('checkbox'));
        expect(onChange).toHaveBeenCalledWith(false);
    });

    it('uses an accessible label when provided', () => {
        render(<Checkbox checked={false} onChange={vi.fn()} ariaLabel="Complete task" />);
        expect(screen.getByRole('checkbox', { name: 'Complete task' })).toBeInTheDocument();
    });

    it('is discoverable by its label text (accessibility)', () => {
        render(<Checkbox checked={false} onChange={vi.fn()} ariaLabel="Mark as completed" />);
        expect(screen.getByLabelText('Mark as completed')).toBeInTheDocument();
    });
});
