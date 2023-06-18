import { defineStore } from "pinia";
import {
    EditGiftItem,
    GiftItem,
    Group,
    NewGiftItem,
    OverviewGiftItem,
} from "~~/lib/types";
import { UserWithItemIds, useUserStore } from "./user";

export const useGiftItemStore = defineStore("gift-item", () => {
    const userStore = useUserStore();
    const { data: authData } = useAuth();

    const itemIds = ref<string[]>([]);
    const itemEntities = ref<Record<string, GiftItem>>({});

    const allGiftItems = computed(() => {
        return itemIds.value.map((id: string) => itemEntities.value[id]);
    });

    const sortByName = (a: UserWithItemIds, b: UserWithItemIds) => {
        const nameA = a.name?.toUpperCase();
        const nameB = b.name?.toUpperCase();

        if (!nameA || !nameB) return 0;

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
    };
    const groupBy = <T extends Record<string, any>, K extends keyof T>(
        arr: T[],
        key: K
    ): Record<string, T[]> => {
        return arr.reduce(
            (acc, item) => (
                (acc[item[key]] = [...(acc[item[key]] || []), item]), acc
            ),
            {} as Record<string, T[]>
        );
    };

    const overviewList = computed(() => {
        const currentUserId = userStore.currentUserId;
        const currentGroupId = userStore.currentGroupId;

        if (!currentUserId || !currentGroupId) {
            return null;
        }

        const filterItems = (item: GiftItem) => {
            const isUndefined = item === undefined;
            if (isUndefined) return false;

            const isNotIdea = !item.idea;

            const isRecipientNotCurrentUser = item.recipientId != currentUserId;
            const isCurrentGroup = item.groups?.some(
                (g) => Group[g] === currentGroupId
            );

            return isNotIdea && isRecipientNotCurrentUser && isCurrentGroup;
        };

        return groupBy(allGiftItems.value.filter(filterItems), "recipientId");
    });
    const wishList = computed(() => {
        const currentUserId = userStore.currentUserId;
        const currentGroupId = userStore.currentGroupId;

        if (!currentUserId || !currentGroupId) {
            return null;
        }

        return allGiftItems.value.filter((item: GiftItem) => {
            const isRecipientCurrentUser = item.recipientId == currentUserId;
            const isCurrentGroup = item.groups.some(
                (g) => Group[g] === currentGroupId
            );

            const isNotIdea = !item.idea;

            return isRecipientCurrentUser && isCurrentGroup && isNotIdea;
        });
    });
    const ideaList = computed(() => {
        const currentUserId = userStore.currentUserId;
        const currentGroupId = userStore.currentGroupId;

        if (!currentUserId || !currentGroupId) {
            return null;
        }

        const filterItems = (item: GiftItem) => {
            const isUndefined = item === undefined;
            if (isUndefined) return false;

            const isIdea = "idea" in item && item.idea;

            const isRecipientNotCurrentUser = item.recipientId != currentUserId;
            const isCurrentGroup = item.groups?.some(
                (g) => Group[g] === currentGroupId
            );

            return isIdea && isRecipientNotCurrentUser && isCurrentGroup;
        };

        return groupBy(allGiftItems.value.filter(filterItems), "recipientId");
    });

    function saveGiftItems(payload: GiftItem[]) {
        const ids = payload.map((giftItem) => giftItem.id);
        const entities = payload.reduce(
            (entities: Record<string, GiftItem>, giftItem: GiftItem) => {
                return { ...entities, [giftItem.id]: giftItem };
            },
            {}
        );

        itemIds.value = ids;
        itemEntities.value = entities;
    }
    function savePurchased({
        id,
        giftedById,
        purchased,
    }: Pick<OverviewGiftItem, "id" | "giftedById" | "purchased">) {
        itemEntities.value[id] = {
            ...itemEntities.value[id],
            giftedById,
            purchased,
        };
    }
    function saveNewItem(item: GiftItem) {
        itemIds.value = [...itemIds.value, item.id];
        itemEntities.value = {
            ...itemEntities.value,
            [item.id]: item,
        };
    }
    function saveEditItem(item: GiftItem) {
        itemEntities.value[item.id] = item;
    }
    function saveRemoveItem(id: string) {
        const index = itemIds.value.indexOf(id);
        if (index != -1) itemIds.value.splice(index, 1);

        delete itemEntities.value[id];
    }

    async function loadGiftItems() {
        const group = userStore.currentGroupId;

        const data = await $fetch("/api/gift-item/all-items", {
            query: {
                group,
            },
        });
        saveGiftItems(data);
    }
    async function loadWishList() {
        const group = userStore.currentGroupId;

        const data = await $fetch("/api/gift-item/wish-list", {
            query: {
                group,
            },
        });
        saveGiftItems(data);
    }
    async function togglePurchased(payload: {
        item: GiftItem;
        purchased: boolean;
    }) {
        const data = await $fetch("/api/gift-item/update-purchased", {
            method: "PUT",
            query: {
                id: payload.item.id,
                purchased: payload.purchased,
                isIdea: payload.item.idea,
                hasIdeaLink: payload.item.ideaLinkId != null,
            },
        });
        savePurchased(data);
    }
    async function addItem(item: NewGiftItem) {
        const data = await $fetch("/api/gift-item/create-item", {
            method: "POST",
            body: item,
        });
        saveNewItem(data);
    }
    async function editItem(item: EditGiftItem) {
        const data = await $fetch("/api/gift-item/edit-item", {
            method: "PUT",
            body: item,
        });
        saveEditItem(data);
    }
    async function removeItem(id: string) {
        const data = await $fetch("/api/gift-item/delete-item", {
            method: "DELETE",
            query: {
                id,
            },
        });
        saveRemoveItem(data.id);
    }

    return {
        itemEntities,
        allGiftItems,
        overviewList,
        wishList,
        ideaList,
        loadGiftItems,
        loadWishList,
        togglePurchased,
        addItem,
        editItem,
        removeItem,
    };
});
