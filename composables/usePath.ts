export const usePath = () => {
    // FIXME: not very robust
    const fromRoute = (routeName: string, path: string) => {
        const regex = /___([\w-]+)$/g;
        const matches = [...routeName.toString().matchAll(regex)];
        const [_, locale] = matches[0];

        return `${locale === "nl" ? "/nl" : ""}${path}`;
    };

    return {
        fromRoute,
    };
};
