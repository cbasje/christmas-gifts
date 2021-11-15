const colors = require('tailwindcss/colors');

module.exports = {
	mode: 'jit',
	purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'media',
	theme: {
		colors: {
			transparent: colors.transparent,
			black: colors.black,
			gray: colors.gray,
			white: colors.white,
			green: colors.emerald,
			red: colors.rose,
			cyan: colors.cyan,
		},
		extend: {
			gridTemplateColumns: {
				table: '4fr 2fr 2fr 2fr 1fr',
			},
		},
	},
	variants: {
		extend: {
			dropShadow: ['dark'],
		},
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
	],
};
