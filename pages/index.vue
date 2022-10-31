<script lang="ts" setup>
import { useToast } from "vue-toastification/dist/index.mjs";

import { GiftItem, Group, User } from "~~/lib/types";
import { useGiftItemStore } from "~~/stores/gift-item";
import { useUserStore } from "~~/stores/user";

const giftItemStore = useGiftItemStore();
const userStore = useUserStore();

const toast = useToast();
const online = useOnline();

const isLoading = ref(true);

const sortByName = (a: User, b: User) => {
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;

    // names must be equal
    return 0;
};

const userList = computed(() => {
    const currentUserId = userStore.currentUserId;
    const currentGroupId = userStore.currentGroupId;

    if (!currentUserId || !currentGroupId) {
        return null;
    }

    return userStore.allUsers
        .filter((user: User) => {
            return (
                user.id != currentUserId &&
                user.groups.some((g) => Group[g] === currentGroupId)
            );
        })
        .sort(sortByName);
});

const switchPurchased = async (payload: {
    item: GiftItem;
    purchased: boolean;
}) => {
    try {
        if (!online.value) throw new Error("Not online");

        await giftItemStore.togglePurchased(payload);

        toast.success(
            `Changed purchase status of '${payload.item.name}' successfully!`
        );
    } catch (error) {
        console.error(error);
        toast.error(
            `Saving purchase status was not successful! Reason: ${error.message}`
        );
    }
};

onMounted(async () => {
    try {
        if (!online.value) throw new Error("Not online");

        await userStore.loadUsers();
        await giftItemStore.loadGiftItems();
    } catch (error) {
        console.error(error);
        toast.error(
            `Loading data was not successful! Reason: ${error.message}`
        );
    } finally {
        isLoading.value = false;
    }
});

definePageMeta({
    middleware: ["auth"],
});
</script>

<template>
    <NuxtLayout name="main">
        <Header>
            {{ $t("pages.overview.title") }}

            <template #subtitle>
                {{ $t("pages.overview.description") }}
            </template>
        </Header>

        <template v-if="userList != null || !isLoading">
            <TableContainer>
                <template v-for="user in userList" :key="user.id">
                    <Table
                        :title="user.name ?? null"
                        :items="
                            user.items
                                .map(
                                    (item) =>
                                        giftItemStore.itemEntities[item.id]
                                )
                                .filter((item) => item != undefined)
                        "
                        :allow-purchased="true"
                        is-collapsable
                        @switchPurchased="switchPurchased"
                    />
                </template>
            </TableContainer>
        </template>

        <Icon
            v-else
            name="spinner-gap-bold"
            class="animate-spin text-gray-900 dark:text-gray-100"
        />
    </NuxtLayout>
</template>
