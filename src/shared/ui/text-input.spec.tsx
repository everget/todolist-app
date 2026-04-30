import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TextInput } from './text-input';

describe('TextInput', () => {
    it('renders with the given value', () => {
        render(<TextInput value="hello" onChange={vi.fn()} />);
        expect(screen.getByRole('textbox')).toHaveValue('hello');
    });

    it('renders with a placeholder', () => {
        render(<TextInput value="" onChange={vi.fn()} placeholder="New List..." />);
        expect(screen.getByPlaceholderText('New List...')).toBeInTheDocument();
    });

    it('calls onChange with the new value when the user types', () => {
        const onChange = vi.fn();
        render(<TextInput value="" onChange={onChange} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
        expect(onChange).toHaveBeenCalledWith('hello');
    });

    it('calls onEnter when the Enter key is pressed', () => {
        const onEnter = vi.fn();
        render(<TextInput value="task" onChange={vi.fn()} onEnter={onEnter} />);
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
        expect(onEnter).toHaveBeenCalledOnce();
    });

    it('does not call onEnter for other keys', () => {
        const onEnter = vi.fn();
        render(<TextInput value="task" onChange={vi.fn()} onEnter={onEnter} />);
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });
        expect(onEnter).not.toHaveBeenCalled();
    });

    it('uses an accessible label when provided', () => {
        render(<TextInput value="" onChange={vi.fn()} ariaLabel="New task" />);
        expect(screen.getByRole('textbox', { name: 'New task' })).toBeInTheDocument();
    });

    it('is discoverable by its label text (accessibility)', () => {
        render(<TextInput value="" onChange={vi.fn()} ariaLabel="Add new task" />);
        expect(screen.getByLabelText('Add new task')).toBeInTheDocument();
    });

    it('applies extra CSS classes when provided', () => {
        render(<TextInput value="" onChange={vi.fn()} className="extra" />);
        expect(screen.getByRole('textbox').className).toContain('extra');
    });
});
