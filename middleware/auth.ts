export default defineNuxtRouteMiddleware(async (to, from) => {
    const userId = useCookie("user", { default: null });

    if (!userId.value) {
        const localePath = usePath();

        return navigateTo(localePath.fromRoute(from.name as string, "/login"));
    }
});
