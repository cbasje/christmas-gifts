import { defineStore } from "pinia";
import { GiftItem, Group, MySession, User } from "~~/lib/types";

export type UserWithItemIds = User & { items?: Pick<GiftItem, "id">[] };
export const useUserStore = defineStore("user", () => {
    const { data: authData } = useAuth();

    const curDate = new Date();
    const groupId = useCookie<Group>("group", {
        expires: new Date(curDate.getFullYear() + 1, 0, 0),
    });
    const currentUserId = computed(
        () => (authData.value as MySession)?.user.id
    );
    const currentGroupId = computed(
        () => groupId.value ?? (authData.value as MySession)?.user.groups![0]
    );

    const userIds = ref<string[]>([]);
    const userEntities = ref<Record<string, UserWithItemIds>>({});

    const allUsers = computed(() => {
        return userIds.value.map((id: string) => userEntities.value[id]);
    });
    const currentUser = computed(() => {
        return (
            ((authData.value as MySession)?.user.id &&
                userEntities.value[
                    (authData.value as MySession)?.user.id ?? ""
                ]) ||
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
    function saveCurrentGroupId(id: Group) {
        groupId.value = id;
    }

    async function loadUsers() {
        const data = await $fetch("/api/user/all-users");
        saveAllUsers(data);
    }

    return {
        userEntities,
        allUsers,
        currentUser,
        currentUserId,
        currentGroupId,
        saveCurrentGroupId,
        loadUsers,
    };
});
