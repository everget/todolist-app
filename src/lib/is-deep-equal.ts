// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDeepEqual(obj1: any, obj2: any): boolean {
	// Check if both arguments are of the same type
	if (typeof obj1 !== typeof obj2) {
		return false;
	}

	// If both are null or undefined, they're equal
	if (obj1 === null || obj1 === undefined) {
		return obj2 === null || obj2 === undefined;
	}

	// If they're not objects, compare directly
	if (typeof obj1 !== 'object') {
		return obj1 === obj2;
	}

	// If they're arrays, check length and each element
	if (Array.isArray(obj1)) {
		if (!Array.isArray(obj2) || obj1.length !== obj2.length) {
			return false;
		}
		for (let i = 0; i < obj1.length; i++) {
			if (!isDeepEqual(obj1[i], obj2[i])) {
				return false;
			}
		}
		return true;
	}

	// If they're objects, compare keys and values
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key])) {
			return false;
		}
	}

	return true;
}
