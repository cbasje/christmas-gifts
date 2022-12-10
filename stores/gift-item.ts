import { defineStore } from "pinia";
import { EditGiftItem, GiftItem, Group, NewGiftItem } from "~~/lib/types";
import { useUserStore } from "./user";

export const useGiftItemStore = defineStore("gift-item", () => {
    const userStore = useUserStore();

    const itemIds = ref<string[]>([]);
    const itemEntities = ref<Record<string, GiftItem>>({});

    const allGiftItems = computed(() => {
        return itemIds.value.map((id: string) => itemEntities.value[id]);
    });
    const wishList = computed(() => {
        const currentUserId = userStore.currentUserId;
        const currentGroupId = userStore.currentGroupId;

        if (!currentUserId || !currentGroupId) {
            return null;
        }

        return allGiftItems.value.filter((item: GiftItem) => {
            return (
                item.recipientId == currentUserId &&
                item.groups.findIndex((g) => Group[g] === currentGroupId) !== -1
            );
        });
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
        purchased,
    }: {
        id: string;
        purchased: boolean;
    }) {
        // @ts-expect-error
        itemEntities.value[id].purchased = purchased;
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
        const data = await $fetch("/api/gift-item/all-items", {
            query: {
                group: userStore.currentGroupId,
            },
        });
        saveGiftItems(data);
    }
    async function loadWishList() {
        const data = await $fetch("/api/gift-item/wish-list", {
            query: {
                id: userStore.currentUserId,
                group: userStore.currentGroupId,
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
            },
        });
        savePurchased(data);
    }
    async function addItem(item: NewGiftItem) {
        const tempId = "randomid";
        const tempItem: NewGiftItem & { id: string } = {
            id: tempId,
            ...item,
        };
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
        wishList,
        loadGiftItems,
        loadWishList,
        togglePurchased,
        addItem,
        editItem,
        removeItem,
    };
});
