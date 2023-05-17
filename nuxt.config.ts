// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: [
        "@pinia/nuxt",
        "@nuxtjs/tailwindcss",
        "@vueuse/nuxt",
        "@formkit/nuxt",
        "nuxt-icon",
        "@nuxtjs/i18n",
    ],
    css: ["vue-toastification/dist/index.css"],
    nitro: {
        preset: "netlify",
    },

    i18n: {
        strategy: "prefix_except_default",
        defaultLocale: "en",
        locales: [
            { code: "en", iso: "en", file: "en.json" },
            { code: "nl", iso: "nl", file: "nl.json" },
        ],
        lazy: true,
        langDir: "lang/",
        vueI18n: {
            legacy: false,
            locale: "en",
            fallbackLocale: {
                sv: ["nl"],
                no: ["nl"],
                default: ["en", "nl"],
            },
        },
    },
});
