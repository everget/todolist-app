/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./*.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		screen: {
			'3xl': '1920px',
			'4xl': '2560px',
		},
		extend: {
			maxWidth: {
				'1/5': '20%',
				'1/4': '25%',
				'2/5': '40%',
				'1/2': '50%',
				'3/5': '60%',
				'3/4': '75%',
				'4/5': '80%',
			},
			colors: {
				background: 'var(--color-background)',
				text: 'var(--color-text)',
				primary: 'var(--color-primary)',
				'primary-hover': 'var(--color-primary-hover)',
				secondary: 'var(--color-secondary)',
				border: 'var(--color-border)',
				remove: 'var(--color-remove)',
				'remove-hover': 'var(--color-remove-hover)',
			},
		},
	},
	plugins: [],
};
