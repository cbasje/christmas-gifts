import Toast, { POSITION, TYPE } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
    const options = {
        position: POSITION.TOP_RIGHT,
        timeout: 3000,
        toastDefaults: {
            // ToastOptions object for each type of toast
            [TYPE.ERROR]: {
                timeout: 10000,
                closeButton: false,
            },
            [TYPE.SUCCESS]: {
                hideProgressBar: true,
            },
        },
    };

    nuxtApp.vueApp.use(Toast, options);
});
