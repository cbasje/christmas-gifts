<script lang="ts" setup>
import { GiftItem } from "@prisma/client";
import { useGiftItemStore } from "~~/stores/gift-item";

const giftItemStore = useGiftItemStore();

const editItem = (item: GiftItem) => {
    alert(item.name);
};
const removeItem = (item: GiftItem) => {
    const value: boolean = confirm("Are you sure?");
    if (value) giftItemStore.removeItem(item.id);
};

onMounted(() => {
    giftItemStore.loadGiftItems();
});

definePageMeta({
    middleware: ["auth"],
});
</script>

<template>
    <div>
        <Header>
            Wish list

            <template #subtitle>
                This is your own wish list. You can add, remove or edit items.
            </template>
        </Header>

        <div
            v-if="giftItemStore.wishList != null"
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
            class="text-gray-900 dark:text-gray-100"
        />
    </div>

    <AddButton />
</template>
