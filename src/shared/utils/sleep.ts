// Simulates async network latency with ±50% random variance.
export const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, Math.round(ms * (0.5 + Math.random()))));
