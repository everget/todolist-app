import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@/shared/i18n/i18n-context';
import type { TaskList } from '@/types';
import { ListForm } from './list-form';

const list: TaskList = { id: '1', name: 'My List', isActive: false };

function renderForm(
    props: Partial<{
        editingList: TaskList | null;
        onSubmit: (name: string) => void;
        onCancel: () => void;
    }> = {}
) {
    return render(
        <I18nProvider locale="en">
            <ListForm editingList={null} onSubmit={vi.fn()} onCancel={vi.fn()} {...props} />
        </I18nProvider>
    );
}

describe('ListForm', () => {
    it('renders an Add button when not editing', () => {
        renderForm();
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('renders an Update button when editing', () => {
        renderForm({ editingList: list });
        expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
    });

    it('shows a cancel button only when editing', () => {
        renderForm({ editingList: list });
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('does not show a cancel button when not editing', () => {
        renderForm();
        expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });

    it('pre-fills the input with the editing list name', () => {
        renderForm({ editingList: list });
        expect(screen.getByTestId('new-list-input')).toHaveValue('My List');
    });

    it('calls onSubmit with the trimmed name', () => {
        const onSubmit = vi.fn();
        renderForm({ onSubmit });
        fireEvent.change(screen.getByTestId('new-list-input'), { target: { value: '  Work  ' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        expect(onSubmit).toHaveBeenCalledWith('Work');
    });

    it('does not call onSubmit when the input is blank', () => {
        const onSubmit = vi.fn();
        renderForm({ onSubmit });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('clears the input after a successful submit', () => {
        renderForm();
        const input = screen.getByTestId('new-list-input');
        fireEvent.change(input, { target: { value: 'Errands' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        expect(input).toHaveValue('');
    });

    it('submits on Enter key', () => {
        const onSubmit = vi.fn();
        renderForm({ onSubmit });
        const input = screen.getByTestId('new-list-input');
        fireEvent.change(input, { target: { value: 'Work' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(onSubmit).toHaveBeenCalledWith('Work');
    });

    it('calls onCancel when the cancel button is clicked', () => {
        const onCancel = vi.fn();
        renderForm({ editingList: list, onCancel });
        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(onCancel).toHaveBeenCalledOnce();
    });
});
