// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: [
        "nuxt-icon",
        "nuxt-svgo",
        "@pinia/nuxt",
        "@nuxtjs/tailwindcss",
        "@vueuse/nuxt",
        "@formkit/nuxt",
        "@nuxtjs/i18n",
    ],
    css: ["vue-toastification/dist/index.css"],

    svgo: {
        defaultImport: "component",
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
        vueI18n: "./i18n.config.ts",
    },
});
