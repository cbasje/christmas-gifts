import { defineStore } from "pinia";
import { GiftItem, User } from "~~/lib/types";

export type UserWithItemIds = User & { items?: Pick<GiftItem, "id">[] };
export const useUserStore = defineStore("user", () => {
    const curDate = new Date();

    const currentUserId = useCookie("user", {
        expires: new Date(curDate.getFullYear() + 1, 0, 0),
    });
    const currentGroupId = useCookie("group", {
        expires: new Date(curDate.getFullYear() + 1, 0, 0),
    });

    const userIds = ref<string[]>([]);
    const userEntities = ref<Record<string, UserWithItemIds>>({});

    const allUsers = computed(() => {
        return userIds.value.map((id: string) => userEntities.value[id]);
    });
    const currentUser = computed(() => {
        return (
            (currentUserId.value && userEntities.value[currentUserId.value]) ||
            null
        );
    });

    function saveAllUsers(payload: User[]) {
        const ids = payload.map((user) => user.id);
        const entities = payload.reduce(
            (entities: Record<string, User>, user: User) => {
                return { ...entities, [user.id]: user };
            },
            {}
        );

        userIds.value = ids;
        userEntities.value = entities;
    }
    function saveNewUser(user: User) {
        userIds.value = [...userIds.value, user.id];
        userEntities.value = {
            ...userEntities.value,
            [user.id]: user,
        };
    }
    function saveCurrentUserId(id: string) {
        currentUserId.value = id;
    }
    function saveCurrentGroupId(id: string) {
        currentGroupId.value = id;
    }

    async function loadUsers() {
        const data = await $fetch("/api/user/all-users", {
            query: {
                group: currentGroupId.value,
            },
        });
        saveAllUsers(data);
    }
    async function loadCurrentUser(id = currentUserId.value) {
        if (!id) throw new Error("No 'id' given");

        const data = await $fetch("/api/user/user", {
            query: { id },
        });

        if (data === null) throw new Error("No user found");

        saveNewUser(data);
    }
    function signOut() {
        currentUserId.value = null;
        currentGroupId.value = null;
    }
    async function signIn(password: string) {
        const data = await $fetch("/api/user/sign-in", {
            method: "POST",
            body: { password },
        });

        if (data === null) throw new Error("No user found");

        saveCurrentUserId(data.id);
        saveCurrentGroupId(data.groups[0]);

        await loadCurrentUser();
    }

    return {
        allUsers,
        currentUser,
        currentUserId,
        currentGroupId,
        saveCurrentUserId,
        saveCurrentGroupId,
        loadUsers,
        loadCurrentUser,
        signIn,
        signOut,
    };
});
