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

    const userIds = ref<string[]>([]);
    const userEntities = ref<Record<string, User>>({});

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
        const data = await $fetch("/api/user/all-users");
        saveAllUsers(data);
    }
    async function loadCurrentUser(id: string = currentUserId.value) {
        const data = await $fetch("/api/user/user", {
            query: { id },
        });

        saveNewUser(data);
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
        loadUsers,
        loadCurrentUser,
        signIn,
        signOut,
    };
});
