import { query } from '$app/server';
import { error } from '@sveltejs/kit';
import ogs from 'open-graph-scraper-lite';
import z from 'zod';

function isValidURL(input: string | null | undefined) {
	if (!input || !URL.canParse(input)) return false;
	const url = new URL(input);
	return /.+\..+/g.test(url.host); // Make sure the host includes a dot, e.g. 'embrosa.com'
}

function forceToValidURL(input: string | null | undefined) {
	if (!input) return;

	let url = input.trim().replace('http://', 'https://');

	// If already valid, return as-is
	if (isValidURL(url)) {
		return url;
	}

	// Add protocol if missing
	if (!url.startsWith('https://')) {
		url = 'https://' + url;
		if (isValidURL(url)) {
			return url;
		}
	}
}

export const getPreview = query(z.string().nullish(), async (input) => {
	const url = forceToValidURL(input);
	if (!url) return;

	const response = await fetch(url);
	const html = await response.text();
	if (!html) error(401);

	const { error: hasError, result } = await ogs({ html });
	if (hasError) console.log(result.errorDetails);
	return result;
});
