/**
 * Adapted from https://github.com/mktj/parsecurrency/blob/master/index.js
 */

const currencyMatcher =
	/^(?:([-+]{1}) ?)?(?:([A-Z]{3}) ?)?(?:([^\d ]+?) ?)?(?:([-+]{1}) ?)?(((?:\d{1,3}([,. ’'\u00A0\u202F]))*?\d{1,})(([,.])\d{1,2})?)(?: ?([^\d]+?))??(?: ?([A-Z]{3}))?$/;
const gr = /^\d{1,3}([,. ’'\u00A0\u202F]\d{3})*$/; // validate groups
const ind = /^\d{1,2}(,\d{2})*(,\d{3})?$/; // exception for Indian number format
const symbolToCurrency = {
	$: 'USD',
	'€': 'EUR',
	'£': 'GBP',
	'¥': 'JPY',
	'₹': 'INR',
	'₽': 'RUB',
	'₩': 'KRW',
	Fr: 'CHF',
	'₪': 'ILS',
	'₺': 'TRY',
	R$: 'BRL',
	A$: 'AUD',
	C$: 'CAD',
};

function getCurrencyCode(symbol: string) {
	return symbolToCurrency[symbol as keyof typeof symbolToCurrency];
}

export function parseCurrency(priceStr: string) {
	if (!priceStr || !priceStr.match) return null;
	priceStr = priceStr.trim();
	const match = priceStr.match(currencyMatcher);
	if (!match) return null;
	const groupSeparator = match[7] || '';
	const decimalSeparator = match[9] || '';
	if (groupSeparator === decimalSeparator && decimalSeparator) {
		return null;
	}
	const isNeg = match[1] === '-' || match[4] === '-';
	const integer = isNeg ? '-' + match[6] : match[6];
	if (groupSeparator && !match[6].match(gr) && !match[6].match(ind)) {
		return null;
	}
	let value = match[5];
	if (!value) return null;
	if (groupSeparator) {
		value = value.replace(RegExp('\\' + groupSeparator, 'g'), '');
	}
	if (decimalSeparator) {
		value = value.replace(decimalSeparator, '.');
	}
	const numericVal = isNeg ? Number(value) * -1 : Number(value);
	if (typeof numericVal !== 'number' || Number.isNaN(numericVal)) {
		return null;
	}
	return {
		raw: priceStr,
		value: numericVal,
		integer: integer || '',
		decimals: match[8] || '',
		symbol: match[3] || match[10] || '',
		currency: match[2] || match[11] || getCurrencyCode(match[3] || match[10]),
		decimalSeparator: decimalSeparator,
		groupSeparator: groupSeparator,
		sign: match[1] || match[4] || '',
	};
}
