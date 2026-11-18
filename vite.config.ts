import { paraglideVitePlugin } from '@inlang/paraglide-js';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				experimental: { async: true },
			},

			adapter: adapter(),
			experimental: {
				remoteFunctions: true,
				explicitEnvironmentVariables: true,
			},
		}),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true,
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
