export const getColorString = (input: string, seed: number) => {
	const hash = input.split('').reduce((a, b) => {
		a = (a << 5) - a + b.charCodeAt(0);
		return a & a;
	}, 0);
	const h = (hash % 360) + seed;
	return `oklch(72% 0.192 ${h})`;
};
