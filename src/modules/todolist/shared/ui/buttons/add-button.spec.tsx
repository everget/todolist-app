import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AddButton } from './add-button';

describe('AddButton', () => {
    it('renders the label as accessible name', () => {
        render(<AddButton label="Add List" />);
        expect(screen.getByRole('button', { name: 'Add List' })).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const onClick = vi.fn();
        render(<AddButton label="Add" onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledOnce();
    });
});
