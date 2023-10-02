export const getHSLColorString = (name: string) => {
	const hash = name.split('').reduce((a, b) => {
		a = (a << 5) - a + b.charCodeAt(0);
		return a & a;
	}, 0);
	const h = hash % 360;
	return `hsl(${h}, 60%, 80%)`;
};
