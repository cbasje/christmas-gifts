import { describe, expect, it } from 'vitest';
import { forceToValidURL } from '#lib/utils/link.ts';

describe('forceToValidURL', () => {
	it('returns undefined for empty input', () => {
		expect(forceToValidURL('')).toBeUndefined();
		expect(forceToValidURL(null)).toBeUndefined();
		expect(forceToValidURL(undefined)).toBeUndefined();
	});

	it('keeps valid https URLs', () => {
		expect(forceToValidURL('https://embrosa.com')).toBe('https://embrosa.com');
		expect(forceToValidURL('https://example.com/path?q=1')).toBe(
			'https://example.com/path?q=1'
		);
	});

	it('upgrades http to https', () => {
		expect(forceToValidURL('http://embrosa.com')).toBe('https://embrosa.com');
	});

	it('adds https to a protocol-less domain', () => {
		expect(forceToValidURL('embrosa.com')).toBe('https://embrosa.com');
	});

	it('trims surrounding whitespace', () => {
		expect(forceToValidURL('  embrosa.com  ')).toBe('https://embrosa.com');
	});

	it('rejects hosts without a dot', () => {
		expect(forceToValidURL('localhost')).toBeUndefined();
	});

	it('accepts hosts with a dot, including IPs', () => {
		expect(forceToValidURL('127.0.0.1')).toBe('https://127.0.0.1');
	});
});