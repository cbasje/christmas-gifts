<script lang="ts" setup>
import { Switch } from "@headlessui/vue";
import { useToast } from "vue-toastification/dist/index.mjs";

import { Color, GiftItem } from "~~/lib/types";
import { useGiftItemStore } from "~~/stores/gift-item";
import { useUserStore } from "~~/stores/user";

const giftItemStore = useGiftItemStore();
const userStore = useUserStore();

const toast = useToast();
const online = useOnline();

const isLoading = ref(true);
const showPartner = ref(false);
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

const filterItems = (item: GiftItem) => {
    const isGiftedByCurrentUser =
        "giftedById" in item &&
        item.giftedById != null &&
        (item.giftedById === userStore.currentUserId ||
            (showPartner.value &&
                item.giftedById === userStore.currentUser?.partnerId));

    return isGiftedByCurrentUser;
};

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
</script>

<template>
    <NuxtLayout name="main">
        <Header>
            {{ $t("pages.ideas.title") }}

            <template #subtitle>
                {{ $t("pages.ideas.description") }}
            </template>
        </Header>

        <div class="container w-full flex justify-end gap-3 px-3">
            <span class="text-gray-500">{{
                $t("pages.ideas.showPartner")
            }}</span>
            <Switch
                v-model="showPartner"
                :class="
                    showPartner
                        ? 'bg-success-500'
                        : 'bg-gray-200 dark:bg-gray-400'
                "
                class="relative inline-flex items-center h-6 rounded-full w-11"
            >
                <span class="sr-only">Show partner</span>
                <span
                    :class="showPartner ? 'translate-x-6' : 'translate-x-1'"
                    class="inline-block w-4 h-4 transform bg-white dark:bg-gray-100 rounded-full"
                />
            </Switch>
        </div>

        <template v-if="giftItemStore.ideaList != null || !isLoading">
            <TableContainer>
                <template
                    v-for="(items, key, index) in giftItemStore.ideaList"
                    :key="key"
                >
                    <Table
                        :title="userStore.userEntities[key].name ?? null"
                        :header-color="headerColors[index]"
                        :show-bg-color="false"
                        :items="items.filter(filterItems) ?? null"
                        allow-purchased
                        allow-edit
                        is-collapsable
                        has-summary
                        @switchPurchased="switchPurchased"
                    />
                </template>
            </TableContainer>
        </template>

        <Icon
            v-else
            name="ph:spinner-gap-bold"
            class="animate-spin text-gray-900 dark:text-gray-100"
        />

        <AddIdeaButton />
    </NuxtLayout>
</template>
