import { useUserStore } from "~~/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore();

    const userId = useLocalStorage("user", null);
    const groupId = useLocalStorage("group", null);

    if (userId.value == null) {
        return navigateTo("/login");
    } else {
        userStore.saveCurrentUserId(userId.value);
        userStore.saveCurrentGroupId(groupId.value);
    }
});
