export default defineNuxtRouteMiddleware(async (to, from) => {
    const regex = /___([\w-]+)$/g;
    const matches = [...from.name.toString().matchAll(regex)];
    const [_, locale] = matches[0];

    const userId = useCookie("user", { default: null });

    if (!userId.value) {
        // FIXME: not very robust
        return navigateTo(`${locale === "nl" ? "/nl" : ""}/login`);
    }
});
