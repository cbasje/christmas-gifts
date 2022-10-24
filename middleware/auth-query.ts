import { useUserStore } from "~~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const regex = /___([\w-]+)$/g;
    const matches = [...from.name.toString().matchAll(regex)];
    const [_, locale] = matches[0];

    const password = to.query.password;

    if (password != undefined && typeof password == "string") {
        const userStore = useUserStore();

        try {
            await userStore.signIn(password);

            // FIXME: not very robust
            return navigateTo(`${locale === "nl" ? "/nl" : ""}/login`);
        } catch (error) {
            console.error(
                "🚨 Error in automatically signing in with password query"
            );
        }
    }
});
