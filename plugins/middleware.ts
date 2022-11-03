import { joinURL } from "ufo";
import { useUserStore } from "~~/stores/user";

export default defineNuxtPlugin((nuxtApp) => {
    addRouteMiddleware(
        "route-prefix",
        (to, from) => {
            const locale = useBrowserLocale();
            const localePath = usePath();

            if (to.path === "en") {
                return navigateTo(localePath.fromLocale(locale, "/"));
            } else if (locale !== "en" && !new RegExp(locale).test(to.path)) {
                return navigateTo(localePath.fromLocale(locale, to.path));
            }
        },
        { global: true }
    );

    addRouteMiddleware("auth", async (to, from) => {
        const locale = useBrowserLocale();
        const localePath = usePath();

        const userId = useCookie("user", { default: null });

        if (!userId.value) {
            return navigateTo(localePath.fromLocale(locale, "/login"));
        }
    });

    addRouteMiddleware("auth-query", async (to, from) => {
        const locale = useBrowserLocale();
        const password = to.query.password;

        if (password != undefined && typeof password == "string") {
            const userStore = useUserStore();
            const localePath = usePath();

            try {
                await userStore.signIn(password);

                return navigateTo(localePath.fromLocale(locale, "/"));
            } catch (error) {
                console.error(
                    `🚨 Error in automatically signing in with password query! Reason: ${error}`
                );
            }
        }
    });
});
