import { describe, expect, it } from 'vitest';
import { generateUniqueId } from '../../src/lib/generate-unique-id';

describe('Function: generateUniqueId', () => {
	const ID_LENGTH = 17;

	it('should generate a unique ID of correct length', () => {
		const id = generateUniqueId();
		expect(id).toHaveLength(ID_LENGTH);
	});

	it('should generate unique IDs', () => {
		const id1 = generateUniqueId();
		const id2 = generateUniqueId();
		expect(id1).not.toBe(id2);
	});

	it('should generate an ID with characters from the allowed alphabet', () => {
		const id = generateUniqueId();
		expect(id).toMatch(new RegExp(`[A-Za-z\\d]{${ID_LENGTH}}`));
	});

	it('should use one character from the timestamp in the generated ID', () => {
		const timestamp = Date.now().toString(36);
		const id = generateUniqueId();
		expect(timestamp).toContain(id[0]);
	});

	it('should handle very fast consecutive calls and still return unique IDs', () => {
		const ids = new Set();
		for (let i = 0; i < 10000; i++) {
			ids.add(generateUniqueId());
		}
		expect(ids.size).toBe(10000);
	});
});
