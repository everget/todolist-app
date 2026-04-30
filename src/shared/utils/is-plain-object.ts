export function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }

    const proto = Object.getPrototypeOf(value) as unknown;
    return proto === Object.prototype || proto === null;
}
