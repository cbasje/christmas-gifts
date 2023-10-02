import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			includeAssets: ['favicon.ico', '/images/icon-ios.png'],
			manifest: {
				name: 'Christmas Gifts',
				short_name: 'Christmas',
				description: 'Christmas gifts tracker for Benjamins & Haugens.',
				orientation: 'portrait-primary',
				display: 'fullscreen',
				background_color: '#F4F4F5',
				theme_color: 'white',
				lang: 'en-US',
				id: '/',
				start_url: '/',
				scope: '/',

				icons: [
					{
						src: '/images/icon-1024x1024.png',
						sizes: '1024x1024',
						type: 'image/png',
						purpose: 'maskable'
					},
					{
						src: '/images/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/images/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/images/icon-1024x1024.png',
						sizes: '1024x1024',
						type: 'image/png',
						purpose: 'any'
					}
				]
			}
		})
	]
});
