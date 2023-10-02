import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import colors from 'tailwindcss/colors';
import aspectRatio from '@tailwindcss/aspect-ratio';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: [
		{
			pattern:
				/bg-(pink|purple|indigo|sky|teal|green|yellow|orange|gray|primary)-(100|300|600|900)/,
			variants: ['dark']
		},
		{
			pattern:
				/text-(pink|purple|indigo|sky|teal|green|yellow|orange|gray|primary)-(50|800|900)/,
			variants: ['dark']
		}
	],
	darkMode: 'media',
	theme: {
		colors: {
			transparent: colors.transparent,
			black: colors.black,
			gray: colors.zinc,
			white: colors.white,
			success: colors.emerald,
			danger: colors.rose,
			primary: colors.green,

			pink: colors.pink,
			purple: colors.purple,
			indigo: colors.indigo,
			sky: colors.sky,
			teal: colors.teal,
			green: colors.green,
			yellow: colors.yellow,
			orange: colors.orange
		},
		fontFamily: {
			sans: ['Atkinson Hyperlegible', 'sans-serif']
		},
		// container: {
		// 	center: true,
		// 	padding: '2rem',
		// 	screens: {
		// 		'2xl': '1440px'
		// 	}
		// },
		minWidth: {
			0: '0',
			'1/4': '25vw',
			'1/2': '50vw',
			'3/4': '75vw',
			full: '100%'
		},
		minHeight: {
			'4rem': '4rem'
		},
		extend: {
			// typography: (theme) => ({
			// 	DEFAULT: {
			// 		css: {
			// 			code: {
			// 				position: 'relative',
			// 				borderRadius: theme('borderRadius.md')
			// 			}
			// 		}
			// 	}
			// })
		}
	},
	variants: {
		extend: {
			dropShadow: ['dark']
		}
	},
	plugins: [
		aspectRatio,
		typography,
		forms,
		plugin(function ({ addVariant, matchUtilities, theme }) {
			addVariant('hocus', ['&:hover', '&:focus']);
			// Square utility
			matchUtilities(
				{
					square: (value) => ({
						width: value,
						height: value
					})
				},
				{ values: theme('spacing') }
			);
		})
	]
} satisfies Config;
