const priceRegex = /(?<code>(?:[$€])?)\s?(?<price>\d+(?:[,.]\d+)?)/g;

export const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

export const getPriceNumber = (priceString: string | null): number => {
	if (!priceString) return 0;

	const matches = [...priceString.matchAll(priceRegex)];

	if (!matches || !matches.length) return 0;

	const [_, _code, price] = matches[0];
	const priceNumber = price.replace(',', '.');

	return Number(priceNumber) ?? 0;
};

// export const formatPrice = (priceNumber: number) => {
// 	const defaultReturn = '-';

// 	if (!priceNumber) return defaultReturn;

// 	const defaultFormatter = new Intl.NumberFormat('default', {
// 		style: 'currency',
// 		currency: 'EUR',
// 		maximumFractionDigits: 2
// 	});

// 	return defaultFormatter.format(priceNumber);
// };
export const formatPrice = (priceString: string | number | null) => {
	const defaultReturn = '-';

	if (!priceString) return defaultReturn;

	const sekFormatter = new Intl.NumberFormat('nl-NL', {
		style: 'currency',
		currency: 'SEK',
		maximumFractionDigits: 2
	});
	const eurFormatter = new Intl.NumberFormat('nl-NL', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits: 2
	});
	const usdFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 2
	});
	const defaultFormatter = new Intl.NumberFormat('default', {
		style: 'decimal',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});

	let currencyCode = '';
	let priceNumber: number;
	if (typeof priceString === 'string') {
		const matches = [...priceString.matchAll(priceRegex)];

		if (!matches || !matches.length) return defaultReturn;

		currencyCode = matches[0][1];
		priceNumber = Number(matches[0][2].replace(',', '.'));
	} else {
		priceNumber = priceString;
	}

	switch (currencyCode) {
		case 'SEK':
			return sekFormatter.format(priceNumber);
		case '€':
			return eurFormatter.format(priceNumber);
		case '$':
			return usdFormatter.format(priceNumber);
		default:
			return defaultFormatter.format(priceNumber);
	}
};
