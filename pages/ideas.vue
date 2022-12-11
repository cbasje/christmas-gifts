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

const getPriceNumber = (priceString: string | null) => {
    if (!priceString) return "0";

    const regex = /(?<code>(?:[$€])?)\s?(?<price>\d+(?:[,\.]\d+)?)/g;
    const matches = [...priceString.matchAll(regex)];

    if (!matches || !matches.length) return "0";

    const [_, _code, price] = matches[0];
    const priceNumber = price.replace(",", ".");

    return priceNumber ?? "0";
};

const sortByName = (a: User, b: User) => {
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;

    // names must be equal
    return 0;
};

const filterItems = (item: GiftItem) => {
    const isUndefined = item === undefined;
    if (isUndefined) return false;

    const isIdea = "idea" in item && item.idea;
    const isGiftedByCurrentUser =
        "giftedById" in item &&
        item.giftedById != null &&
        (item.giftedById === userStore.currentUserId ||
            item.giftedById === userStore.currentUser?.partnerId);

    return isIdea && isGiftedByCurrentUser;
};

const userList = computed(() => {
    const currentUserId = userStore.currentUserId;
    const currentGroupId = userStore.currentGroupId;

    if (!currentUserId || !currentGroupId) {
        return null;
    }

    return userStore.allUsers
        .filter((user: User) => {
            const isRecipientNotCurrentUser = user.id != currentUserId;
            const isCurrentGroup = user.groups.some(
                (g) => Group[g] === currentGroupId
            );

            return isRecipientNotCurrentUser && isCurrentGroup;
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
            {{ $t("pages.ideas.title") }}

            <template #subtitle>
                {{ $t("pages.ideas.description") }}
            </template>
        </Header>

        <template v-if="userList != null || !isLoading">
            <TableContainer>
                <template v-for="(user, index) in userList" :key="user.id">
                    <Table
                        :title="user.name ?? null"
                        :header-color="headerColors[index]"
                        :items="
                            user.items
                                ?.map((item) => ({
                                    ...giftItemStore.itemEntities[item.id],
                                    price: getPriceNumber(
                                        giftItemStore.itemEntities[item.id]
                                            ?.price
                                    ),
                                }))
                                .filter(filterItems) ?? null
                        "
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
            name="spinner-gap-bold"
            class="animate-spin text-gray-900 dark:text-gray-100"
        />

        <AddIdeaButton />
    </NuxtLayout>
</template>
