const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH = 17; // 1 character from timestamp + 16 random characters

export function generateUniqueId(): string {
	const timestamp = Date.now().toString(36); // Convert timestamp to base 36 for shorter representation
	const randomPart = generateRandomString(ID_LENGTH - 1);
	const timestampChar = timestamp[Math.floor(Math.random() * timestamp.length)];

	return timestampChar + randomPart;
}

function generateRandomString(length: number): string {
	return Array.from({ length }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join(
		''
	);
}

// Optional: Add a function to check the probability of collision
// export function calculateCollisionProbability(numIds: number): number {
// 	const totalPossibleIds = ALPHABET.length ** ID_LENGTH;
// 	return 1 - Math.exp((-numIds * (numIds - 1)) / (2 * totalPossibleIds));
// }
