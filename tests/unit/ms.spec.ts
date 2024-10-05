import { describe, expect, it } from 'vitest';
import { ms, msToString, TimeUnit } from '../../src/lib/ms';

describe('ms function', () => {
	it('converts time strings to milliseconds correctly', () => {
		expect(ms('30min')).toBe(1800000);
		expect(ms('2h')).toBe(7200000);
		expect(ms('1d')).toBe(86400000);
		expect(ms('1w')).toBe(604800000);
		expect(ms('1m')).toBe(2592000000);
		expect(ms('1y')).toBe(31536000000);
	});

	it('handles single-digit values correctly', () => {
		expect(ms('1min')).toBe(60000);
		expect(ms('1h')).toBe(3600000);
	});

	it('throws an error for invalid time string format', () => {
		expect(() => ms('30 min')).toThrow('Invalid time string format');
		expect(() => ms('2hours')).toThrow('Invalid time string format');
		expect(() => ms('1.5d')).toThrow('Invalid time string format');
	});

	it('throws an error for invalid numeric values', () => {
		expect(() => ms('-1min')).toThrow('Invalid numeric value');
		expect(() => ms('abc1h')).toThrow('Invalid time string format');
	});
});

describe('msToString function', () => {
	it('converts milliseconds to time strings correctly', () => {
		expect(msToString(1800000)).toBe('30min');
		expect(msToString(7200000)).toBe('2h');
		expect(msToString(86400000)).toBe('1d');
		expect(msToString(604800000)).toBe('1w');
		expect(msToString(2592000000)).toBe('1m');
		expect(msToString(31536000000)).toBe('1y');
	});

	it('returns the largest possible unit', () => {
		expect(msToString(86400000 + 3600000)).toBe('1d'); // 1 day and 1 hour
		expect(msToString(31536000000 + 2592000000)).toBe('1y'); // 1 year and 1 month
	});

	it('handles edge cases correctly', () => {
		expect(msToString(0)).toBe('0min');
		expect(msToString(59999)).toBe('0min'); // Just under 1 minute
	});

	it('throws an error for negative milliseconds', () => {
		expect(() => msToString(-1)).toThrow('Milliseconds must be a non-negative number');
	});
});

describe('Roundtrip conversion', () => {
	it('converts from string to ms and back to string correctly', () => {
		const testCases: `${number}${TimeUnit}`[] = ['30min', '2h', '1d', '1w', '1m', '1y'];
		testCases.forEach((testCase) => {
			expect(msToString(ms(testCase))).toBe(testCase);
		});
	});

	it("handles conversions that don't round-trip exactly", () => {
		expect(msToString(ms('61min'))).toBe('1h');
		expect(msToString(ms('25h'))).toBe('1d');
	});
});
