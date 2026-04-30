import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@/shared/i18n/i18n-context';
import { config } from '@/config/config';
import { PrioritySelect } from './priority-select';

function renderSelect(value = 'none', onChange = vi.fn()) {
    return render(
        <I18nProvider locale="en">
            <PrioritySelect value={value} onChange={onChange} />
        </I18nProvider>
    );
}

describe('PrioritySelect', () => {
    it('renders one option per valid priority', () => {
        renderSelect();
        expect(screen.getAllByRole('option')).toHaveLength(config.tasks.validPriorities.length);
    });

    it('shows the current selected value', () => {
        renderSelect('high');
        expect(screen.getByRole('combobox')).toHaveValue('high');
    });

    it('calls onChange with the chosen priority', () => {
        const onChange = vi.fn();
        renderSelect('none', onChange);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'medium' } });
        expect(onChange).toHaveBeenCalledWith('medium');
    });

    it('label is linked to the combobox for accessibility', () => {
        renderSelect();
        expect(screen.getByLabelText('Priority:')).toBeInTheDocument();
    });

    it('renders translated option labels', () => {
        renderSelect();
        expect(screen.getByRole('option', { name: 'None' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'High' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Medium' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Low' })).toBeInTheDocument();
    });
});
