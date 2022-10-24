import { useUserStore } from "~~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const password = to.query.password;

    if (password != undefined && typeof password == "string") {
        const userStore = useUserStore();
        const localePath = usePath();

        try {
            await userStore.signIn(password);

            return navigateTo(localePath.fromRoute(from.name as string, "/"));
        } catch (error) {
            console.error(
                `🚨 Error in automatically signing in with password query! Reason: ${error}`
            );
        }
    }
});
