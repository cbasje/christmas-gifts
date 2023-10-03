export const formatLink = (linkString: string | null) => {
	if (!linkString) return '';

	const regex = /\b(?:http(?:s)?:\/\/)?((?:\w+\.)?\w+\.[\w/.\-_]*)/g;
	const matches = [...linkString.matchAll(regex)];

	if (!matches || !matches.length) return linkString;
	const extractedLink = matches[0][1];

	return extractedLink.replace('www.', '');
};
