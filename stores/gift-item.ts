import { GiftItem, Group, User } from "~~/lib/types";
import { defineStore } from "pinia";
import { NewGiftItem } from "~~/lib/types";
import { useUserStore } from "./user";

export type GiftItemWithRecipient = GiftItem & { recipient?: User };
export const useGiftItemStore = defineStore("gift-item", () => {
    const giftItems = ref<GiftItemWithRecipient[]>([]);

    const overviewList = computed(() => {
        const userStore = useUserStore();
        const currentUserId = userStore.currentUserId;
        const currentGroupId = userStore.currentGroupId;

        if (!currentUserId || !currentGroupId) {
            return null;
        }

        return giftItems.value.filter((item: GiftItem) => {
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

        return giftItems.value.filter((item: GiftItem) => {
            return (
                item.recipientId == currentUserId &&
                item.groups.findIndex((g) => Group[g] === currentGroupId) !== -1
            );
        });
    });

    function savePurchased({
        id,
        purchased,
    }: {
        id: string;
        purchased: boolean;
    }) {
        const i = giftItems.value.findIndex((i) => i.id === id);
        if (i != -1) giftItems.value[i].purchased = purchased;
    }
    function saveNewItem(item: GiftItem) {
        giftItems.value = [...giftItems.value, item];
    }
    function saveRemoveItem(id: string) {
        const i = giftItems.value.findIndex((i) => i.id === id);
        if (i != -1) giftItems.value.splice(i, 1);
    }

    async function loadGiftItems() {
        const data = await $fetch("/api/gift-item/all-items");
        giftItems.value = data;
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
        removeItem,
    };
});
