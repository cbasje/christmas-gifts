<script lang="ts" setup>
import { PhSpinnerGap } from "phosphor-vue";
import { useToast } from "vue-toastification/dist/index.mjs";

import { useGiftItemStore } from "~~/stores/gift-item";

const giftItemStore = useGiftItemStore();

const toast = useToast();
const online = useOnline();

const isLoading = ref(true);

onMounted(async () => {
    try {
        if (!online.value) throw new Error("Not online");

        await giftItemStore.loadGiftItems();
    } catch (error) {
        console.error(error);
        toast.error(
            `Loading items was not successful! Reason: ${error.message}`
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
            Wish list

            <template #subtitle>
                This is your own wish list. You can add, remove or edit items.
            </template>
        </Header>

        <template v-if="giftItemStore.wishList != null || !isLoading">
            <TableContainer>
                <Table :items="giftItemStore.wishList" :allow-edit="true" />
            </TableContainer>
        </template>

        <ph-spinner-gap
            v-else
            weight="bold"
            class="animate-spin text-gray-900 dark:text-gray-100"
        />

        <AddButton />
    </NuxtLayout>
</template>
