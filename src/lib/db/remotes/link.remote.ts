import { query } from '$app/server';
import { error } from '@sveltejs/kit';
import ogs from 'open-graph-scraper-lite';
import z from 'zod';

export const getPreview = query(z.url().optional(), async (url) => {
	if (!url) return;

	const response = await fetch(url);
	const html = await response.text();
	if (!html) error(401);

	const { error: hasError, result } = await ogs({ html });
	if (hasError) console.log(result.errorDetails);
	return result;
});
