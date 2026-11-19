import { describe, expect, it } from 'vitest';
import { parseCurrency } from '#lib/utils/price.ts';

describe('parseCurrency', () => {
	it('returns null for empty input', () => {
		expect(parseCurrency('')).toBeNull();
		expect(parseCurrency(undefined as unknown as string)).toBeNull();
	});

	it('returns null for garbage', () => {
		expect(parseCurrency('abc')).toBeNull();
		expect(parseCurrency('!!')).toBeNull();
	});

	it('parses a plain decimal', () => {
		const result = parseCurrency('12.50');
		expect(result?.value).toBe(12.5);
		expect(result?.decimalSeparator).toBe('.');
	});

	it('parses a comma decimal', () => {
		const result = parseCurrency('12,50');
		expect(result?.value).toBe(12.5);
		expect(result?.decimalSeparator).toBe(',');
	});

	it('parses a symbol and returns the currency code', () => {
		expect(parseCurrency('€12,50')).toMatchObject({ value: 12.5, currency: 'EUR' });
		expect(parseCurrency('$9.99')).toMatchObject({ value: 9.99, currency: 'USD' });
	});

	it('parses an explicit currency code', () => {
		expect(parseCurrency('12.50 USD')).toMatchObject({ value: 12.5, currency: 'USD' });
	});

	it('parses thousand separators', () => {
		expect(parseCurrency('1.234,56 €')).toMatchObject({ value: 1234.56, currency: 'EUR' });
		expect(parseCurrency('1,234.56')).toMatchObject({ value: 1234.56 });
	});

	it('accepts Indian-style grouping', () => {
		expect(parseCurrency('12,34.56')).toMatchObject({ value: 1234.56 });
	});

	it('rejects ambiguous separators', () => {
		expect(parseCurrency('12.345.67')).toBeNull();
	});

	it('parses negative amounts', () => {
		expect(parseCurrency('-12.50')).toMatchObject({ value: -12.5 });
	});
});