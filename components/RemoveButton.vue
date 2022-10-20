<script lang="ts" setup>
import { useGiftItemStore } from "~~/stores/gift-item";
import { GiftItem } from "~~/lib/types";
import { useToast } from "vue-toastification/dist/index.mjs";

const giftItemStore = useGiftItemStore();

const toast = useToast();
const online = useOnline();

interface Props {
    item: GiftItem;
}

const props = defineProps<Props>();

const removeItem = async () => {
    const value: boolean = confirm("Are you sure?");

    if (value) {
        try {
            if (!online.value) throw new Error("Not online");

            await giftItemStore.removeItem(props.item.id);
        } catch (error) {
            console.error(error);
            toast.error(
                `Removing item was not successful! Reason: ${error.message}`
            );
        }
    }
};
</script>

<template>
    <a
        class="cursor-pointer font-normal text-red-500 dark:text-red-600 hover:text-red-700 dark:hover:text-red-800"
        @click="() => removeItem()"
    >
        <Icon name="ph:trash-bold" class="h-6 w-6" />
    </a>
</template>
