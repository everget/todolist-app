import { describe, expect, it } from 'vitest';
import { parseRemainingTime } from '../../src/lib/parse-remaining-time';

describe('parseRemainingTime', () => {
	it('should correctly parse minutes', () => {
		expect(parseRemainingTime('30min')).toBe(30);
	});

	it('should correctly parse hours', () => {
		expect(parseRemainingTime('2h')).toBe(120);
	});

	it('should correctly parse days', () => {
		expect(parseRemainingTime('3d')).toBe(4320);
	});

	it('should correctly parse weeks', () => {
		expect(parseRemainingTime('1w')).toBe(10080);
	});

	it('should correctly parse months', () => {
		expect(parseRemainingTime('2m')).toBe(86400);
	});

	it('should correctly parse years', () => {
		expect(parseRemainingTime('1y')).toBe(525600);
	});

	it('should return 0 for invalid unit', () => {
		expect(parseRemainingTime('5x')).toBe(0);
	});

	it('should handle single-digit values', () => {
		expect(parseRemainingTime('1h')).toBe(60);
	});

	it('should handle multi-digit values', () => {
		expect(parseRemainingTime('100min')).toBe(100);
	});

	it('should return 0 for empty string', () => {
		expect(parseRemainingTime('')).toBe(0);
	});

	it('should return 0 for invalid format', () => {
		expect(parseRemainingTime('invalid')).toBe(0);
	});

	it('should handle leading zeros', () => {
		expect(parseRemainingTime('01h')).toBe(60);
	});

	it('should handle very large values', () => {
		expect(parseRemainingTime('1000000min')).toBe(1000000);
	});

	it('should handle zero value', () => {
		expect(parseRemainingTime('0h')).toBe(0);
	});

	// it('should ignore case for units', () => {
	// 	expect(parseRemainingTime('1H')).toBe(60);
	// 	expect(parseRemainingTime('1D')).toBe(1440);
	// });

	// it('should handle whitespace', () => {
	// 	expect(parseRemainingTime('  2  h  ')).toBe(120);
	// });
});
