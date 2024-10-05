export function parseRemainingTime(remainingTime: string): number {
	const match = remainingTime.match(/(\d+)(\w+)/);
	if (!match) return 0;
	const [, value, unit] = match;
	const minutes =
		{
			min: 1,
			h: 60,
			d: 1440,
			w: 10080,
			m: 43200,
			y: 525600,
		}[unit] || 0;
	return parseInt(value) * minutes;
}
