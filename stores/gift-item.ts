import { GiftItem, Group } from "@prisma/client";
import { defineStore } from "pinia";
import { NewGiftItem } from "~~/lib/types";
import { useUserStore } from "./user";

type GiftItemWithGroups = GiftItem & {
    groups?: Group[];
};

export const useGiftItemStore = defineStore("gift-item", () => {
    const itemIds = ref<string[]>([]);
    const itemEntities = ref<Record<string, GiftItemWithGroups>>({});
    const selectedId = ref<string | null>(null);

    const allGiftItems = computed(() => {
        return itemIds.value.map((id: string) => itemEntities.value[id]);
    });
    const selectedGiftItem = computed(() => {
        return (
            (selectedId.value && itemEntities.value[selectedId.value]) || null
        );
    });
    const overviewList = computed(() => {
        const userStore = useUserStore();
        const currentUserId = userStore.currentUserId;
        const currentGroupId = userStore.currentGroupId;

        if (!currentUserId) {
            return [];
        }

        return allGiftItems.value.filter((item: GiftItemWithGroups) => {
            return (
                item.recipientId == currentUserId &&
                item.groups.findIndex((g) => g.id == currentGroupId) !== -1
            );
        });
    });
    const wishList = computed(() => {
        const userStore = useUserStore();
        const currentUserId = userStore.currentUserId;
        const currentGroupId = userStore.currentGroupId;

        if (!currentUserId) {
            return [];
        }

        return allGiftItems.value.filter((item: GiftItemWithGroups) => {
            return (
                item.recipientId == currentUserId &&
                item.groups.findIndex((g) => g.id == currentGroupId) !== -1
            );
        });
    });

    function saveAllGiftItems(payload: GiftItemWithGroups[]) {
        const ids = payload.map((giftItem) => giftItem.id);
        const entities = payload.reduce(
            (
                entities: Record<string, GiftItemWithGroups>,
                giftItem: GiftItemWithGroups
            ) => {
                return { ...entities, [giftItem.id]: giftItem };
            },
            {}
        );

        itemIds.value = ids;
        itemEntities.value = entities;
    }
    function savePurchased({
        id,
        purchased,
    }: {
        id: string;
        purchased: boolean;
    }) {
        itemEntities.value[id].purchased = purchased;
    }
    function saveNewItem(item: GiftItemWithGroups) {
        itemIds.value = [...itemIds.value, item.id];
        itemEntities.value = {
            ...itemEntities.value,
            [item.id]: item,
        };
    }
    function saveRemoveItem(id: string) {
        const index = itemIds.value.indexOf(id);
        if (index != -1) itemIds.value.splice(index, 1);

        delete itemEntities.value[id];
    }

    async function loadGiftItems() {
        const { data } = await apiService.loadGiftItems();
        saveAllGiftItems(data);
    }
    async function togglePurchased(payload: {
        item: GiftItem;
        purchased: boolean;
    }) {
        // FIXME: see if it needs to be shown as purchased before actually doing it
        savePurchased({
            id: payload.item.id,
            purchased: payload.purchased,
        });

        try {
            const { data } = await apiService.togglePurchased(
                payload.item.id,
                payload.purchased
            );
            savePurchased(data);
        } catch (e) {
            console.error(e);
            savePurchased({
                id: payload.item.id,
                purchased: !payload.purchased,
            });
        }
    }
    async function addItem(item: NewGiftItem) {
        const tempId = "randomid";
        const tempItem: GiftItemWithGroups = {
            id: tempId,
            ...item,
            createdAt: null,
            updatedAt: null,
        };
        // FIXME: see if it needs to be shown as added before actually doing it
        saveNewItem(tempItem);

        if (apiService.useMock()) return;

        try {
            const { data } = await apiService.addItem(tempItem);
            saveNewItem(data);
        } catch (e) {
            console.error(e);
        }

        saveRemoveItem(tempId);
    }
    async function removeItem(item: GiftItem) {
        try {
            const { data } = await apiService.removeItem(item.id);
            saveRemoveItem(data.id);
        } catch (e) {
            console.error(e);
        }
    }

    return {
        allGiftItems,
        selectedGiftItem,
        overviewList,
        wishList,
        selectedId,
        loadGiftItems,
        togglePurchased,
        addItem,
        removeItem,
    };
});
