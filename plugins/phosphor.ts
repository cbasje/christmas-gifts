import {
    PhImage,
    PhList,
    PhLockSimple,
    PhPencil,
    PhPlus,
    PhSpinnerGap,
    PhTrash,
    PhX,
} from "phosphor-vue";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("PhImage", PhImage);
    nuxtApp.vueApp.component("PhList", PhList);
    nuxtApp.vueApp.component("PhLockSimple", PhLockSimple);
    nuxtApp.vueApp.component("PhPencil", PhPencil);
    nuxtApp.vueApp.component("PhPlus", PhPlus);
    nuxtApp.vueApp.component("PhSpinnerGap", PhSpinnerGap);
    nuxtApp.vueApp.component("PhTrash", PhTrash);
    nuxtApp.vueApp.component("PhX", PhX);
});
