<script lang="ts" setup>
import { PhSpinnerGap } from "phosphor-vue";
import { GiftItem, User } from "@prisma/client";
import { useGiftItemStore } from "~~/stores/gift-item";
import { useUserStore } from "~~/stores/user";

export interface Group {
    user: User;
    elements: GiftItem[];
}

export type Grouped = Record<string, Group>;

const giftItemStore = useGiftItemStore();
const userStore = useUserStore();

const enabled = ref(true);

const editItem = (item: GiftItem) => {
    alert(item.name);
};
const switchPurchased = (payload: { item: GiftItem; purchased: boolean }) => {
    giftItemStore.togglePurchased(payload);
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

// FIXME: can prisma do this?
const groups = computed(() => {
    const elements = giftItemStore.overviewList;
    const users = userStore.userEntities;

    if (!elements || !users) {
        return null;
    }

    const grouped: Grouped = elements.reduce(
        (groups: Grouped, element: GiftItem) => {
            const key = element.recipientId;
            if (!groups[key]) {
                groups[key] = {
                    user: users[key],
                    elements: [],
                };
            }
            groups[key].elements.push(element);
            return groups;
        },
        {}
    );

    return sortObj(grouped).map((key: string) => grouped[key]);
});

onMounted(() => {
    giftItemStore.loadGiftItems();
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
            v-if="groups != null"
            class="overflow-scroll container mx-auto"
            aria-label="Table"
        >
            <Table v-for="group in groups" :key="group.user.id">
                <template #heading>
                    <TableHeading :group="group" :allow-purchased="true" />
                </template>
                <template #body>
                    <TableRow
                        v-for="item in group.elements"
                        :key="item.id"
                        :item="item"
                        :allow-purchased="true"
                        @switchPurchased="switchPurchased"
                        @editItem="editItem"
                    />
                </template>
            </Table>
        </div>

        <ph-spinner-gap
            v-else
            weight="bold"
            class="text-gray-900 dark:text-gray-100"
        />
    </NuxtLayout>
</template>
