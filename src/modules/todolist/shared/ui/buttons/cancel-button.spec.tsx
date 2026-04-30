import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CancelButton } from './cancel-button';

describe('CancelButton', () => {
    it('renders the label as accessible name', () => {
        render(<CancelButton label="Cancel Action" />);
        expect(screen.getByRole('button', { name: 'Cancel Action' })).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const onClick = vi.fn();
        render(<CancelButton label="Cancel" onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });
});
