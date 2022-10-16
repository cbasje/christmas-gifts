<script lang="ts" setup>
import { PhSpinnerGap } from "phosphor-vue";
import { GiftItem } from "~~/lib/types";
import { useGiftItemStore } from "~~/stores/gift-item";

const giftItemStore = useGiftItemStore();

const isLoading = ref(true);

const editItem = (item: GiftItem) => {
    alert(item.name);
};
const removeItem = async (item: GiftItem) => {
    const value: boolean = confirm("Are you sure?");

    if (value) {
        try {
            await giftItemStore.removeItem(item.id);
        } catch (error) {
            console.error(error);
            alert("Removing item was not successful");
        }
    }
};

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
            class="overflow-scroll container mx-auto"
            aria-label="Table"
        >
            <Table>
                <template #heading>
                    <TableHeading />
                </template>
                <template #body>
                    <TableRow
                        v-for="item in giftItemStore.wishList"
                        :key="item.id"
                        :item="item"
                        :allow-edit="true"
                        @editItem="editItem"
                        @removeItem="removeItem"
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
