import Toast from "vue-toastification/dist/index.mjs";

export default defineNuxtPlugin((nuxtApp) => {
    const options = {
        position: "top-right",
        timeout: 3000,
        toastDefaults: {
            // ToastOptions object for each type of toast
            error: {
                timeout: 10000,
                closeButton: false,
            },
            success: {
                hideProgressBar: true,
            },
        },
    };

    nuxtApp.vueApp.use(Toast, options);
});
