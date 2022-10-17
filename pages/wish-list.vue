<script lang="ts" setup>
import { PhSpinnerGap } from "phosphor-vue";
import { useGiftItemStore } from "~~/stores/gift-item";

const giftItemStore = useGiftItemStore();

const isLoading = ref(true);

onMounted(async () => {
    try {
        await giftItemStore.loadGiftItems();
    } catch (error) {
        console.error(error);
        alert("Loading items was not successful");
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

        <div
            v-if="giftItemStore.wishList != null || !isLoading"
            class="overflow-scroll container mt-5 mx-auto"
            aria-label="Table"
        >
            <Table>
                <template #heading>
                    <TableHeading :allow-edit="true" />
                </template>
                <template #body>
                    <TableRow
                        v-for="item in giftItemStore.wishList"
                        :key="item.id"
                        :item="item"
                        :allow-edit="true"
                    />
                </template>
            </Table>
        </div>

        <ph-spinner-gap
            v-else
            weight="bold"
            class="animate-spin text-gray-900 dark:text-gray-100"
        />

        <AddButton />
    </NuxtLayout>
</template>
