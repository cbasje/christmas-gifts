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
			cyan: colors.cyan,
		},
		extend: {
			gridTemplateColumns: {
				table: '2fr 1fr 1fr 1fr 1fr 1fr',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
	],
};
