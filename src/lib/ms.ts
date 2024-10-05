export type TimeUnit = 'min' | 'h' | 'd' | 'w' | 'm' | 'y';

const TIME_UNITS: Record<TimeUnit, number> = {
	min: 60 * 1000,
	h: 60 * 60 * 1000,
	d: 24 * 60 * 60 * 1000,
	w: 7 * 24 * 60 * 60 * 1000,
	m: 30 * 24 * 60 * 60 * 1000, // Approximation
	y: 365 * 24 * 60 * 60 * 1000, // Approximation
};

export function ms(timeString: string): number {
	const match = timeString.match(/^(-?\d+)(min|h|d|w|m|y)$/);
	if (!match) {
		throw new Error('Invalid time string format');
	}

	const [, value, unit] = match;
	const numericValue = parseInt(value, 10);

	if (isNaN(numericValue) || numericValue < 0) {
		throw new Error('Invalid numeric value');
	}

	return numericValue * TIME_UNITS[unit as TimeUnit];
}

export function msToString(milliseconds: number): `${number}${TimeUnit}` {
	if (milliseconds < 0) {
		throw new Error('Milliseconds must be a non-negative number');
	}

	const units: TimeUnit[] = ['y', 'm', 'w', 'd', 'h', 'min'];

	for (const unit of units) {
		const value = Math.floor(milliseconds / TIME_UNITS[unit]);
		if (value > 0) {
			return `${value}${unit}`;
		}
	}

	return '0min';
}

// Example usage:
// console.log(ms('30min')); // 1800000
// console.log(ms('2h')); // 7200000
// console.log(ms('1d')); // 86400000
// console.log(ms('1w')); // 604800000
// console.log(ms('1m')); // 2592000000
// console.log(ms('1y')); // 31536000000

// console.log(msToString(1800000)); // '30min'
// console.log(msToString(7200000)); // '2h'
// console.log(msToString(86400000)); // '1d'
// console.log(msToString(604800000)); // '1w'
// console.log(msToString(2592000000)); // '1m'
// console.log(msToString(31536000000)); // '1y'
