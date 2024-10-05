import { describe, expect, it, vi } from 'vitest';
import { formatDate, formatDateShort } from '../../src/lib/format-date';
import { TranslationService } from '../../src/services/translation-service';

describe('Date Formatting Functions', () => {
	describe('formatDateShort', () => {
		it('should format date correctly for default locale (en)', () => {
			const date = new Date(2023, 3, 15); // April 15, 2023
			expect(formatDateShort(date)).toBe('15/04/23');
		});

		it('should format date correctly for pt-br locale', () => {
			const date = new Date(2023, 3, 15); // April 15, 2023
			expect(formatDateShort(date, 'pt-br')).toBe('15/04/23');
		});

		it('should format date correctly for es locale', () => {
			const date = new Date(2023, 3, 15); // April 15, 2023
			expect(formatDateShort(date, 'es')).toBe('15/04/23');
		});

		it('should format date correctly for ua locale', () => {
			const date = new Date(2023, 3, 15); // April 15, 2023
			expect(formatDateShort(date, 'ua')).toBe('15.04.23');
		});

		it('should format date correctly for ru locale', () => {
			const date = new Date(2023, 3, 15); // April 15, 2023
			expect(formatDateShort(date, 'ru')).toBe('15.04.23');
		});

		it('should handle edge case: last day of the year', () => {
			const date = new Date(2023, 11, 31); // December 31, 2023
			expect(formatDateShort(date)).toBe('31/12/23');
		});

		it('should handle edge case: first day of the year', () => {
			const date = new Date(2023, 0, 1); // January 1, 2023
			expect(formatDateShort(date)).toBe('01/01/23');
		});

		it('should handle edge case: leap year', () => {
			const date = new Date(2024, 1, 29); // February 29, 2024 (leap year)
			expect(formatDateShort(date)).toBe('29/02/24');
		});
	});

	describe('formatDate', () => {
		beforeEach(() => {
			vi.mock('@/services/translation-service', () => ({
				TranslationService: {
					t: vi.fn().mockReturnValue('at'),
				},
			}));
		});

		it('should format date correctly for default locale (en)', () => {
			const date = new Date(2023, 3, 15, 14, 30); // April 15, 2023, 2:30 PM
			expect(formatDate(date)).toBe('Saturday, 15 Apr 2023 at 2:30 pm');
		});

		it('should format date correctly for pt-br locale', () => {
			const date = new Date(2023, 3, 15, 14, 30); // April 15, 2023, 14:30
			expect(formatDate(date, 'pt-br')).toBe('sábado, 15 de abr. de 2023 at 14:30');
		});

		it('should format date correctly for es locale', () => {
			const date = new Date(2023, 3, 15, 14, 30); // April 15, 2023, 14:30
			expect(formatDate(date, 'es')).toBe('sábado, 15 abr 2023 at 14:30');
		});

		it('should format date correctly for ua locale', () => {
			const date = new Date(2023, 3, 15, 14, 30); // April 15, 2023, 14:30
			expect(formatDate(date, 'ua')).toBe('субота, 15 квіт. 2023 р. at 14:30');
		});

		it('should format date correctly for ru locale', () => {
			const date = new Date(2023, 3, 15, 14, 30); // April 15, 2023, 14:30
			expect(formatDate(date, 'ru')).toBe('суббота, 15 апр. 2023 г. at 14:30');
		});

		it('should handle edge case: midnight', () => {
			const date = new Date(2023, 3, 15, 0, 0); // April 15, 2023, 00:00
			expect(formatDate(date)).toBe('Saturday, 15 Apr 2023 at 12:00 am');
		});

		it('should handle edge case: noon', () => {
			const date = new Date(2023, 3, 15, 12, 0); // April 15, 2023, 12:00
			expect(formatDate(date)).toBe('Saturday, 15 Apr 2023 at 12:00 pm');
		});

		it('should handle edge case: last minute of the year', () => {
			const date = new Date(2023, 11, 31, 23, 59); // December 31, 2023, 23:59
			expect(formatDate(date)).toBe('Sunday, 31 Dec 2023 at 11:59 pm');
		});

		it('should use the correct translation for "at"', () => {
			const date = new Date(2023, 3, 15, 14, 30);
			formatDate(date);
			expect(TranslationService.t).toHaveBeenCalledWith('tasks.at');
		});
	});
});
