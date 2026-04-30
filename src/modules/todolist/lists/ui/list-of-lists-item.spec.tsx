import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@/shared/i18n/i18n-context';
import type { TaskList } from '@/types';
import { ListOfListsItem } from './list-of-lists-item';

const list: TaskList = { id: '1', name: 'Work', isActive: false };
const activeList: TaskList = { id: '1', name: 'Work', isActive: true };

function renderItem(
    props: Partial<{
        list: TaskList;
        onSelect: (id: string) => void;
        onEdit: (list: TaskList) => void;
        onRemove: (id: string) => void;
    }> = {}
) {
    return render(
        <I18nProvider locale="en">
            <ListOfListsItem
                list={list}
                onSelect={vi.fn()}
                onEdit={vi.fn()}
                onRemove={vi.fn()}
                {...props}
            />
        </I18nProvider>
    );
}

describe('ListOfListsItem', () => {
    it('renders the list name', () => {
        renderItem();
        expect(screen.getByTestId('list-item-name')).toHaveTextContent('Work');
    });

    it('calls onSelect with the list id when clicked', () => {
        const onSelect = vi.fn();
        renderItem({ onSelect });
        fireEvent.click(screen.getByTestId('list-item'));
        expect(onSelect).toHaveBeenCalledWith('1');
    });

    it('calls onSelect on Enter key', () => {
        const onSelect = vi.fn();
        renderItem({ onSelect });
        fireEvent.keyDown(screen.getByTestId('list-item'), { key: 'Enter' });
        expect(onSelect).toHaveBeenCalledWith('1');
    });

    it('calls onSelect on Space key', () => {
        const onSelect = vi.fn();
        renderItem({ onSelect });
        fireEvent.keyDown(screen.getByTestId('list-item'), { key: ' ' });
        expect(onSelect).toHaveBeenCalledWith('1');
    });

    it('sets aria-current when the list is active', () => {
        renderItem({ list: activeList });
        expect(screen.getByTestId('list-item')).toHaveAttribute('aria-current', 'true');
    });

    it('does not set aria-current when the list is inactive', () => {
        renderItem();
        expect(screen.getByTestId('list-item')).not.toHaveAttribute('aria-current');
    });

    it('calls onEdit and does not trigger onSelect', () => {
        const onSelect = vi.fn();
        const onEdit = vi.fn();
        renderItem({ onSelect, onEdit });
        fireEvent.click(screen.getByRole('button', { name: 'Edit Work' }));
        expect(onEdit).toHaveBeenCalledWith(list);
        expect(onSelect).not.toHaveBeenCalled();
    });

    it('calls onRemove with the list id and does not trigger onSelect', () => {
        const onSelect = vi.fn();
        const onRemove = vi.fn();
        renderItem({ onSelect, onRemove });
        fireEvent.click(screen.getByRole('button', { name: 'Remove Work' }));
        expect(onRemove).toHaveBeenCalledWith('1');
        expect(onSelect).not.toHaveBeenCalled();
    });
});
