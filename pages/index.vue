<script lang="ts" setup>
import { useToast } from "vue-toastification/dist/index.mjs";

import { Color, GiftItem, Group, User } from "~~/lib/types";
import { useGiftItemStore } from "~~/stores/gift-item";
import { useUserStore } from "~~/stores/user";

const giftItemStore = useGiftItemStore();
const userStore = useUserStore();

const toast = useToast();
const online = useOnline();

const isLoading = ref(true);
const headerColors: Color[] = [
    "pink",
    "purple",
    "indigo",
    "sky",
    "teal",
    "green",
    "yellow",
    "orange",
];

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
    } catch (e) {
        if (e instanceof Error) {
            console.error(e);
            toast.error(
                `Saving purchase status was not successful! Reason: ${e.message}`
            );
        }
    }
};

onMounted(async () => {
    try {
        if (!online.value) throw new Error("Not online");

        await userStore.loadUsers();
        await giftItemStore.loadGiftItems();
    } catch (e) {
        if (e instanceof Error) {
            console.error(e);
            toast.error(
                `Loading data was not successful! Reason: ${e.message}`
            );
        }
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

        <template v-if="giftItemStore.overviewList != null || !isLoading">
            <TableContainer>
                <template
                    v-for="(items, key, index) in giftItemStore.overviewList"
                    :key="key"
                >
                    <Table
                        :title="userStore.userEntities[key].name ?? null"
                        :header-color="headerColors[index]"
                        :items="items"
                        :allow-purchased="true"
                        is-collapsable
                        has-strikethrough
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
