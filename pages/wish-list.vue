<script lang="ts" setup>
import { useToast } from "vue-toastification/dist/index.mjs";

import { useGiftItemStore } from "~~/stores/gift-item";

const giftItemStore = useGiftItemStore();

const toast = useToast();
const online = useOnline();

const isLoading = ref(true);

onMounted(async () => {
    try {
        if (!online.value) throw new Error("Not online");

        await giftItemStore.loadWishList();
    } catch (error) {
        console.error(error);
        toast.error(
            `Loading your wish list was not successful! Reason: ${error.message}`
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
            {{ $t("pages.wishList.title") }}

            <template #subtitle>
                {{ $t("pages.wishList.description") }}
            </template>
        </Header>

        <template v-if="giftItemStore.wishList != null || !isLoading">
            <TableContainer>
                <Table :items="giftItemStore.wishList" :allow-edit="true" />
            </TableContainer>
        </template>

        <Icon
            v-else
            name="spinner-gap-bold"
            class="animate-spin text-gray-900 dark:text-gray-100"
        />

        <AddButton />
    </NuxtLayout>
</template>
