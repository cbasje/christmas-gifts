const colors = require('tailwindcss/colors');

module.exports = {
	mode: 'jit',
	purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'media',
	theme: {
		colors: {
			black: colors.black,
			gray: colors.gray,
			white: colors.white,
			amber: colors.yellow,
			green: colors.emerald,
		},
		fontFamily: {
			display: ['Poppins', 'sans-serif'],
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
