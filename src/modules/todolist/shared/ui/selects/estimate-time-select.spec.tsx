import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EstimateTimeSelect } from './estimate-time-select';
import { I18nProvider } from '@/shared/i18n/i18n-context';
import { vi } from 'vitest';

describe('Estimated time selector', () => {
    it('treats an empty input as no estimate', () => {
        const onChange = vi.fn();
        render(
            <I18nProvider locale="en">
                <EstimateTimeSelect value={3600} onChange={onChange} />
            </I18nProvider>
        );

        const input = screen.getByTestId('estimated-time-amount');
        fireEvent.change(input, { target: { value: '' } });
        expect(onChange).toHaveBeenCalledWith(null);
    });

    it('accepts zero as an input value', () => {
        const onChange = vi.fn();
        render(
            <I18nProvider locale="en">
                <EstimateTimeSelect value={null} onChange={onChange} />
            </I18nProvider>
        );

        const input = screen.getByTestId('estimated-time-amount');
        fireEvent.change(input, { target: { value: '0' } });
        // Even if min=1 is on the element, fireEvent can set it to 0
        expect(onChange).toHaveBeenCalledWith(0);
    });

    it('converts a large hour value to seconds correctly', () => {
        const onChange = vi.fn();
        render(
            <I18nProvider locale="en">
                <EstimateTimeSelect value={null} onChange={onChange} />
            </I18nProvider>
        );

        const input = screen.getByTestId('estimated-time-amount');
        const largeVal = '999999999';
        fireEvent.change(input, { target: { value: largeVal } });
        // 999999999 hours in seconds
        expect(onChange).toHaveBeenCalledWith(Number(largeVal) * 3600);
    });
});
