import { defineConfig } from 'cypress';

const FRONTEND_URL = 'http://localhost:5173';

export default defineConfig({
	e2e: {
		baseUrl: FRONTEND_URL,
		specPattern: 'tests/e2e/cypress/**/*.cy.{js,jsx,ts,tsx}',
		// setupNodeEvents(on, config) {
		// 	// implement node event listeners here
		// },
	},
});
