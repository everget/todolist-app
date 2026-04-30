// Enforces a maximum length on a string.
export function truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) : text;
}
