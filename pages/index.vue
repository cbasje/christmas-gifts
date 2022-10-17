<script lang="ts" setup>
import { PhSpinnerGap } from "phosphor-vue";
import { useToast } from "vue-toastification";
import { GiftItem, User } from "~~/lib/types";
import { GiftItemWithRecipient, useGiftItemStore } from "~~/stores/gift-item";

export interface Group {
    user: User;
    items: GiftItem[];
}

export type Grouped = Record<string, Group>;

const giftItemStore = useGiftItemStore();

const toast = useToast();
const online = useOnline();

const isLoading = ref(true);

const switchPurchased = async (payload: {
    item: GiftItem;
    purchased: boolean;
}) => {
    try {
        if (!online.value) throw new Error("Not online");

        await giftItemStore.togglePurchased(payload);
    } catch (error) {
        console.error(error);
        toast.error(
            `Saving purchase status was not successful! Reason: ${error.message}`
        );
    }
};
const sortObj = (obj: Grouped) => {
    return Object.keys(obj).sort((a, b) => {
        if (!obj[a].user || !obj[b].user) return 0;

        var nameA = obj[a].user.name.toUpperCase();
        var nameB = obj[b].user.name.toUpperCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
    });
};

const groups = computed(() => {
    const items = giftItemStore.overviewList;

    if (!items) {
        return null;
    }

    const grouped: Grouped = items.reduce(
        (groups: Grouped, item: GiftItemWithRecipient) => {
            const key = item.recipientId;
            if (!groups[key]) {
                groups[key] = {
                    user: item.recipient,
                    items: [],
                };
            }
            groups[key].items.push(item);
            return groups;
        },
        {}
    );

    return sortObj(grouped).map((key: string) => grouped[key]);
});

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
            Gift Tracker

            <template #subtitle>
                This is the overview of all the gifts. Please let everyone know
                if you have bought an item!
            </template>
        </Header>

        <div
            v-if="groups != null || !isLoading"
            class="overflow-scroll container mt-5 mx-auto"
            aria-label="Table"
        >
            <Table v-for="group in groups" :key="group.user.id">
                <template #heading>
                    <TableHeading :group="group" :allow-purchased="true" />
                </template>
                <template #body>
                    <TableRow
                        v-for="item in group.items"
                        :key="item.id"
                        :item="item"
                        :allow-purchased="true"
                        @switchPurchased="switchPurchased"
                    />
                </template>
            </Table>
        </div>

        <ph-spinner-gap
            v-else
            weight="bold"
            class="animate-spin text-gray-900 dark:text-gray-100"
        />
    </NuxtLayout>
</template>
