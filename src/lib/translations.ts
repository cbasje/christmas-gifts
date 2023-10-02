import i18n, { type Config } from 'sveltekit-i18n';

const config: Config = {
	loaders: [
		{
			locale: 'en',
			key: 'common',
			loader: async () => (await import('./en/common.json')).default
		},
		{
			locale: 'en',
			key: 'overview',
			routes: ['/'],
			loader: async () => (await import('./en/overview.json')).default
		},
		{
			locale: 'en',
			key: 'login',
			routes: ['/login'],
			loader: async () => (await import('./en/login.json')).default
		},
		{
			locale: 'en',
			key: 'signup',
			routes: ['/signup'],
			loader: async () => (await import('./en/signup.json')).default
		},
		{
			locale: 'en',
			key: 'wishList',
			routes: ['/wish-list'],
			loader: async () => (await import('./en/wish-list.json')).default
		},
		{
			locale: 'en',
			key: 'ideas',
			routes: ['/ideas'],
			loader: async () => (await import('./en/ideas.json')).default
		},
		{
			locale: 'en',
			key: 'sizeChart',
			routes: ['/size-chart'],
			loader: async () => (await import('./en/size-chart.json')).default
		},
		{
			locale: 'nl',
			key: 'common',
			loader: async () => (await import('./nl/common.json')).default
		},
		{
			locale: 'nl',
			key: 'overview',
			routes: ['/'],
			loader: async () => (await import('./nl/overview.json')).default
		},
		{
			locale: 'nl',
			key: 'login',
			routes: ['/login'],
			loader: async () => (await import('./nl/login.json')).default
		},
		{
			locale: 'nl',
			key: 'signup',
			routes: ['/signup'],
			loader: async () => (await import('./nl/signup.json')).default
		},
		{
			locale: 'nl',
			key: 'wishList',
			routes: ['/wish-list'],
			loader: async () => (await import('./nl/wish-list.json')).default
		},
		{
			locale: 'nl',
			key: 'ideas',
			routes: ['/ideas'],
			loader: async () => (await import('./nl/ideas.json')).default
		},
		{
			locale: 'nl',
			key: 'sizeChart',
			routes: ['/size-chart'],
			loader: async () => (await import('./nl/size-chart.json')).default
		}
	]
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
