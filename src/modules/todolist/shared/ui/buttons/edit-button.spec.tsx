import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EditButton } from './edit-button';

describe('EditButton', () => {
    it('uses aria-label as accessible name', () => {
        render(<EditButton label="Edit item" />);
        expect(screen.getByRole('button', { name: 'Edit item' })).toBeInTheDocument();
    });

    it('shows an icon', () => {
        render(<EditButton label="Edit" />);
        expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const onClick = vi.fn();
        render(<EditButton label="Edit" onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });
});
