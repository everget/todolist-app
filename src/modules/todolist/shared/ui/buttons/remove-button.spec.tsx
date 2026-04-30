import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RemoveButton } from './remove-button';

describe('RemoveButton', () => {
    it('uses aria-label as accessible name', () => {
        render(<RemoveButton label="Remove item" />);
        expect(screen.getByRole('button', { name: 'Remove item' })).toBeInTheDocument();
    });

    it('shows an icon', () => {
        render(<RemoveButton label="Remove" />);
        expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const onClick = vi.fn();
        render(<RemoveButton label="Remove" onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });
});
