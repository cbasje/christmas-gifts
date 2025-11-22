function isValidURL(input: string | null | undefined) {
	if (!input || !URL.canParse(input)) return false;
	const url = new URL(input);
	return /.+\..+/g.test(url.host); // Make sure the host includes a dot, e.g. 'embrosa.com'
}

export function forceToValidURL(input: string | null | undefined) {
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
