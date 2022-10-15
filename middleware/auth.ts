export default defineNuxtRouteMiddleware(async (to, from) => {
    const userId = useCookie("user");

    if (!userId.value) {
        return navigateTo("/login");
    }
});
