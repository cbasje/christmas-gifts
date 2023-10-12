import { preprocessMeltUI } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
import sequence from 'svelte-sequential-preprocessor';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
	vitePlugin: {
		inspector: true
	},
	kit: {
		adapter: adapter()
	}
};

export default config;
