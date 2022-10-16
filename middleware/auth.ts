export default defineNuxtRouteMiddleware(async (to, from) => {
    const userId = useCookie("user", { default: null });

    if (!userId.value) {
        return navigateTo("/login");
    }
});
