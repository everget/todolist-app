import { describe, expect, it } from 'vitest';
import { formatDate } from './format-date';

describe('Date formatting', () => {
    it('uses day/month/year order for English', () => {
        expect(formatDate(new Date(2023, 3, 15))).toBe('15/04/23');
    });

    it('uses day/month/year order for Brazilian Portuguese', () => {
        expect(formatDate(new Date(2023, 3, 15), 'pt-br')).toBe('15/04/23');
    });

    it('uses day/month/year order for Spanish', () => {
        expect(formatDate(new Date(2023, 3, 15), 'es')).toBe('15/04/23');
    });

    it('uses dots as separators for Ukrainian', () => {
        expect(formatDate(new Date(2023, 3, 15), 'ua')).toBe('15.04.23');
    });

    it('uses dots as separators for Russian', () => {
        expect(formatDate(new Date(2023, 3, 15), 'ru')).toBe('15.04.23');
    });

    it('handles last day of year', () => {
        expect(formatDate(new Date(2023, 11, 31))).toBe('31/12/23');
    });

    it('handles first day of year', () => {
        expect(formatDate(new Date(2023, 0, 1))).toBe('01/01/23');
    });

    it('handles leap year', () => {
        expect(formatDate(new Date(2024, 1, 29))).toBe('29/02/24');
    });
});
