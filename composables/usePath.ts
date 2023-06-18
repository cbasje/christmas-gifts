export const usePath = () => {
    const fromLocale = (locale: string, path: string) => {
        const newPath = path.replaceAll(/\/(nl|en)/g, "");
        return new URL(newPath, locale === "nl" ? "nl" : "");
    };

    return {
        fromLocale,
    };
};
