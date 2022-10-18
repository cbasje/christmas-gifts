import { EditGiftItem, GiftItem, Group, User } from "~~/lib/types";
import { defineStore } from "pinia";
import { NewGiftItem } from "~~/lib/types";
import { useUserStore } from "./user";

export type GiftItemWithRecipient = GiftItem & { recipient?: User };
export const useGiftItemStore = defineStore("gift-item", () => {
    const itemIds = ref<string[]>([]);
    const itemEntities = ref<Record<string, GiftItemWithRecipient>>({});

    const allGiftItems = computed(() => {
        return itemIds.value.map((id: string) => itemEntities.value[id]);
    });
    const overviewList = computed(() => {
        const userStore = useUserStore();
        const currentUserId = userStore.currentUserId;
        const currentGroupId = userStore.currentGroupId;

        if (!currentUserId || !currentGroupId) {
            return null;
        }

        return allGiftItems.value.filter((item: GiftItemWithRecipient) => {
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

        if (!currentUserId || !currentGroupId) {
            return null;
        }

        return allGiftItems.value.filter((item: GiftItemWithRecipient) => {
            return (
                item.recipientId == currentUserId &&
                item.groups.findIndex((g) => Group[g] === currentGroupId) !== -1
            );
        });
    });

    function saveAllGiftItems(payload: GiftItemWithRecipient[]) {
        const ids = payload.map((giftItem) => giftItem.id);
        const entities = payload.reduce(
            (
                entities: Record<string, GiftItemWithRecipient>,
                giftItem: GiftItemWithRecipient
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
        const data = await $fetch("/api/gift-item/all-items");
        saveAllGiftItems(data);
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
        overviewList,
        wishList,
        loadGiftItems,
        togglePurchased,
        addItem,
        editItem,
        removeItem,
    };
});
