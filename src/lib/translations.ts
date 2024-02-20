import i18n, { type Config } from 'sveltekit-i18n';

export const Locales = ['en', 'nl' /*, 'fy', 'sv' */] as const;
export type Locale = (typeof Locales)[number];
export const defaultLocale: Locale = 'en';

const config: Config = {
	loaders: Locales.reduce<
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		{ locale: string; key: string; routes?: string[]; loader: () => Promise<any> }[]
	>((prevValue, currLocale) => {
		return [
			...prevValue,
			{
				locale: currLocale,
				key: 'common',
				loader: async () => (await import(`./${currLocale}/common.json`)).default
			},
			{
				locale: currLocale,
				key: 'overview',
				routes: ['/'],
				loader: async () => (await import(`./${currLocale}/overview.json`)).default
			},
			{
				locale: currLocale,
				key: 'login',
				routes: ['/login'],
				loader: async () => (await import(`./${currLocale}/login.json`)).default
			},
			{
				locale: currLocale,
				key: 'signup',
				routes: ['/signup'],
				loader: async () => (await import(`./${currLocale}/signup.json`)).default
			},
			{
				locale: currLocale,
				key: 'wishList',
				routes: ['/wish-list'],
				loader: async () => (await import(`./${currLocale}/wish-list.json`)).default
			},
			{
				locale: currLocale,
				key: 'ideas',
				routes: ['/ideas'],
				loader: async () => (await import(`./${currLocale}/ideas.json`)).default
			},
			{
				locale: currLocale,
				key: 'sizeChart',
				routes: ['/size-chart', '/', '/ideas'],
				loader: async () => (await import(`./${currLocale}/size-chart.json`)).default
			}
		];
	}, [])
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
