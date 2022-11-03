import { joinURL } from "ufo";

export const usePath = () => {
    const fromLocale = (locale: string, path: string) => {
        const newPath = path.replaceAll(/\/(nl|en)/g, "");
        return joinURL(locale === "nl" ? "nl" : "", newPath);
    };

    return {
        fromLocale,
    };
};
