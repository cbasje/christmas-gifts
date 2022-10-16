import { GiftItem, Group } from "~~/lib/types";
import { defineStore } from "pinia";
import { NewGiftItem } from "~~/lib/types";
import { useUserStore } from "./user";

export const useGiftItemStore = defineStore("gift-item", () => {
    const itemIds = ref<string[]>([]);
    const itemEntities = ref<Record<string, GiftItem>>({});
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

        return allGiftItems.value.filter((item: GiftItem) => {
            return (
                item.recipientId != currentUserId &&
                item.groups.findIndex((g) => Group[g] === currentGroupId) !== -1
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

        return allGiftItems.value.filter((item: GiftItem) => {
            return (
                item.recipientId == currentUserId &&
                item.groups.findIndex((g) => Group[g] === currentGroupId) !== -1
            );
        });
    });

    function saveAllGiftItems(payload: GiftItem[]) {
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
        purchased,
    }: {
        id: string;
        purchased: boolean;
    }) {
        itemEntities.value[id].purchased = purchased;
    }
    function saveNewItem(item: GiftItem) {
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
        const data = await $fetch("/api/gift-item/all-items");
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
            const data = await $fetch("/api/gift-item/update-purchased", {
                method: "PUT",
                query: {
                    id: payload.item.id,
                    purchased: payload.purchased,
                },
            });
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
        const tempItem: NewGiftItem & { id: string } = {
            id: tempId,
            ...item,
        };
        // FIXME: see if it needs to be shown as added before actually doing it

        try {
            const data = await $fetch("/api/gift-item/create-item", {
                method: "POST",
                body: item,
            });
            saveNewItem(data);
        } catch (e) {
            console.error(e);
        }

        saveRemoveItem(tempId);
    }
    async function removeItem(id: string) {
        try {
            const data = await $fetch("/api/gift-item/delete-item", {
                method: "DELETE",
                query: {
                    id,
                },
            });
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
