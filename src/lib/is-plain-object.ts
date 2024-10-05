// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPlainObject(value: any): boolean {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}

	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}
