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
    const groupIds = ref<string[]>([]);
    const groupEntities = ref<Record<string, Group>>({});

    const allUsers = computed(() => {
        return userIds.value.map((id: string) => userEntities.value[id]);
    });
    const allGroups = computed(() => {
        return groupIds.value.map((id: string) => groupEntities.value[id]);
    });
    const currentUser = computed(() => {
        return (
            (currentUserId.value && userEntities.value[currentUserId.value]) ||
            null
        );
    });
    const currentGroup = computed(() => {
        return (
            (currentGroupId.value &&
                groupEntities.value[currentGroupId.value]) ||
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
    function saveGroups(payload: Group[]) {
        const loadedGroups = payload;

        const ids = loadedGroups.map((group) => group.id);
        const entities = loadedGroups.reduce(
            (entities: Record<string, Group>, group: Group) => {
                return { ...entities, [group.id]: group };
            },
            {}
        );

        groupIds.value = ids;
        groupEntities.value = entities;
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
    async function loadGroups() {
        const data = await $fetch("/api/group/all-groups");
        saveGroups(data);
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
        currentUser,
        currentUserId,
        currentGroup,
        currentGroupId,
        saveCurrentUserId,
        saveCurrentGroupId,
        loadUsers,
        loadGroups,
        signIn,
        signOut,
    };
});
