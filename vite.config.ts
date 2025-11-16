import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

export default defineConfig({
	plugins: [
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['preferredLanguage', 'baseLocale'],
		}),
		icons({
			compiler: 'svelte',
			customCollections: {
				chunk: FileSystemIconLoader('./assets/icons', (svg) =>
					svg.replace(/fill="black"/gi, 'fill="currentColor"')
				),
			},
		}),
	],

	css: {
		transformer: 'lightningcss',
		lightningcss: {
			drafts: {
				customMedia: true,
			},
		},
	},
	build: {
		cssMinify: 'lightningcss',
	},
});
