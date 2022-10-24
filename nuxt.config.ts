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

    i18n: {
        locales: [
            { code: "en", file: "en-US.json" },
            { code: "nl", file: "nl-NL.json" },
        ],
        lazy: true,
        langDir: "lang/",
        vueI18n: {
            legacy: false,
            locale: "en",
            fallbackLocale: {
                se: ["nl"],
                no: ["nl"],
                default: ["en"],
            },
        },
    },
});
