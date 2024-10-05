import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: [
			'coverage',
			'dist',
			'tests/e2e/playwright/report/*',
			'tests/e2e/playwright/test-results/*',
			'cypress/*',
		],
	},
	{
		files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
];
