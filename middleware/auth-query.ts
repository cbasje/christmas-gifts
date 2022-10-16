import { useUserStore } from "~~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const password = to.query.password;

    if (password != undefined && typeof password == "string") {
        const userStore = useUserStore();

        try {
            await userStore.signIn(password);

            return navigateTo("/");
        } catch (error) {
            console.error(
                "🚨 Error in automatically signing in with password query"
            );
        }
    }
});
