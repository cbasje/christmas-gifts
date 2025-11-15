import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

export default defineConfig({
	define: {
		SUPERFORMS_LEGACY: true,
	}
	plugins: [
		sveltekit(),
		icons({
			compiler: 'svelte',
			customCollections: {
				crush: FileSystemIconLoader('./assets/icons', (svg) =>
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
