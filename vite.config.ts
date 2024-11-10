import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		origin: 'http://christmas.benjami.in',
		host: 'christmas.benjami.in',
		port: 3000
	},
	define: {
		SUPERFORMS_LEGACY: true,
	}
});
