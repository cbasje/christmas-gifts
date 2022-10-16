import { Group, User } from "@prisma/client";
import { defineStore } from "pinia";

type UserWithGroup = User & { groups: Group[] };

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

    const userIds = ref<string[]>([]);
    const userEntities = ref<Record<string, UserWithGroup>>({});

    const allUsers = computed(() => {
        return userIds.value.map((id: string) => userEntities.value[id]);
    });
    const currentUser = computed(() => {
        return (
            (currentUserId.value && userEntities.value[currentUserId.value]) ||
            null
        );
    });

    function saveAllUsers(payload: UserWithGroup[]) {
        const ids = payload.map((user) => user.id);
        const entities = payload.reduce(
            (entities: Record<string, UserWithGroup>, user: UserWithGroup) => {
                return { ...entities, [user.id]: user };
            },
            {}
        );

        userIds.value = ids;
        userEntities.value = entities;
    }
    function saveCurrentUserId(id: string) {
        currentUserId.value = id;
    }
    function saveCurrentGroupId(id: string) {
        currentGroupId.value = id;
    }
    function signOut() {
        currentUserId.value = null;
        currentGroupId.value = null;
    }

    async function loadUsers() {
        const data = await $fetch("/api/user/all-users");
        saveAllUsers(data);
    }
    async function signIn(password: string) {
        return new Promise<string>((resolve, reject) => {
            const result = userIds.value.find((id: string) => {
                return userEntities.value[id].password == password;
            });
            if (result != undefined) {
                saveCurrentUserId(result);

                const groups = userEntities.value[result].groups;
                if (groups) saveCurrentGroupId(groups[0].id);

                resolve(result);
            } else reject();
        });
    }
    async function setGroupId(name: string) {
        return new Promise<string>((resolve, reject) => {
            const result = groupIds.value.find((id: string) => {
                return (
                    groupEntities.value[id].name.toUpperCase() ===
                    name.toUpperCase()
                );
            });
            if (result != undefined) {
                saveCurrentGroupId(result);
                resolve(result);
            } else reject(new Error("Not able to find the group."));
        });
    }

    return {
        userEntities,
        allUsers,
        currentUser,
        currentUserId,
        currentGroupId,
        saveCurrentUserId,
        saveCurrentGroupId,
        loadUsers,
        signIn,
        signOut,
    };
});
