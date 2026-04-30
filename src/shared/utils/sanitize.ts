// Trims whitespace and strips basic HTML tags to prevent broken UI and ensure data integrity.
export function sanitize(text: string): string {
    return text.trim().replace(/<[^>]*>?/gm, '');
}
