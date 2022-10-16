import { Group, User } from "~~/lib/types";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
    const curDate = new Date();

    const currentUserId = useCookie("user", {
        expires: new Date(curDate.getFullYear() + 1, 0, 0),
        default: null,
    });
    const currentGroupId = useCookie("group", {
        expires: new Date(curDate.getFullYear() + 1, 0, 0),
        default: null,
    });

    const currentUser = ref<User>(null);

    function saveCurrentUserId(id: string) {
        currentUserId.value = id;
    }
    function saveCurrentGroupId(id: string) {
        currentGroupId.value = id;
    }

    async function loadCurrentUser(id: string = currentUserId.value) {
        const data = await $fetch("/api/user/user", {
            query: { id },
        });

        currentUser.value = data;
    }
    async function signOut() {
        currentUserId.value = null;
        currentGroupId.value = null;

        const router = useRouter();
        await router.push("/login");
    }
    async function signIn(password: string) {
        const data = await $fetch("/api/user/sign-in", {
            method: "POST",
            body: { password },
        });

        saveCurrentUserId(data.id);
        saveCurrentGroupId(data.groups[0]);

        await loadCurrentUser();

        const router = useRouter();
        router.push("/");
    }

    return {
        currentUser,
        currentUserId,
        currentGroupId,
        saveCurrentUserId,
        saveCurrentGroupId,
        loadCurrentUser,
        signIn,
        signOut,
    };
});
