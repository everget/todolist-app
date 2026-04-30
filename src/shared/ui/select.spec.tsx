import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './select';

const OPTIONS = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
];

describe('Select', () => {
    it('renders all options', () => {
        render(<Select id="test" value="a" options={OPTIONS} onChange={vi.fn()} />);
        expect(screen.getAllByRole('option')).toHaveLength(3);
    });

    it('shows the current selected value', () => {
        render(<Select id="test" value="b" options={OPTIONS} onChange={vi.fn()} />);
        expect(screen.getByRole('combobox')).toHaveValue('b');
    });

    it('shows a label when one is provided', () => {
        render(
            <Select
                id="my-select"
                label="Priority"
                value="a"
                options={OPTIONS}
                onChange={vi.fn()}
            />
        );
        expect(screen.getByLabelText('Priority:')).toBeInTheDocument();
    });

    it('shows no label when none is provided', () => {
        render(<Select id="test" value="a" options={OPTIONS} onChange={vi.fn()} />);
        expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('calls onChange with the selected value', () => {
        const onChange = vi.fn();
        render(<Select id="test" value="a" options={OPTIONS} onChange={onChange} />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'c' } });
        expect(onChange).toHaveBeenCalledWith('c');
    });

    it('the label is linked to the dropdown for accessibility', () => {
        render(
            <Select id="priority" label="Priority" value="a" options={OPTIONS} onChange={vi.fn()} />
        );
        expect(screen.getByRole('combobox')).toHaveAttribute('id', 'priority');
    });
});
