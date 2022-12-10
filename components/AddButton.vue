<script lang="ts" setup>
import { useGiftItemStore } from "~~/stores/gift-item";
import { useUserStore } from "~~/stores/user";
import { Group, NewGiftItem } from "~~/lib/types";
import { EditFormData } from "./EditModal.vue";
import { useToast } from "vue-toastification/dist/index.mjs";

const giftItemStore = useGiftItemStore();
const userStore = useUserStore();

const router = useRouter();
const localePath = useLocalePath();
const toast = useToast();
const online = useOnline();

const isOpen = ref(false);

const closeModal = () => {
    isOpen.value = false;
};
const openModal = () => {
    isOpen.value = true;
};

const formData = {
    id: "",
    name: "",
    price: "",
    notes: "",
    link: "",
    groups: userStore.currentGroupId ? [Group[userStore.currentGroupId]] : [],
};

const submitForm = async (data: EditFormData) => {
    try {
        if (userStore.currentUserId === null) {
            await router.push(localePath("/login"));
            throw new Error("Not logged in correctly");
        }

        const newItem: NewGiftItem = {
            name: data.name,
            price: data.price,
            notes: data.notes,
            recipientId: userStore.currentUserId,
            groups: data.groups.map((g) => Group[g]),
            link: data.link,
            purchased: false,
        };

        if (!online.value) throw new Error("Not online");

        giftItemStore.addItem(newItem);

        toast.success(`Added '${newItem.name}' to your wishlist successfully!`);
        closeModal();
    } catch (e) {
        if (e instanceof Error) {
            console.error(e);
            toast.error(`Adding item was not successful! Reason: ${e.message}`);
        }
    }
};
</script>

<template>
    <div class="fixed bottom-6 right-6">
        <button
            type="button"
            @click="openModal"
            class="group flex justify-center items-center w-16 h-16 drop-shadow-md rounded-full text-sm font-medium text-white bg-primary-600 dark:bg-primary-700 hover:bg-primary-800 dark:hover:bg-primary-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
            <Icon
                name="ph:plus-bold"
                class="h-6 w-6 text-white group-hover:text-gray-300"
            />
        </button>
    </div>

    <EditModal
        :title="$t('editModal.create.title')"
        :submitLabel="$t('editModal.create.submit')"
        v-model:isOpen="isOpen"
        :formData="formData"
        :showGroups="
            userStore.currentUser != null &&
            userStore.currentUser.groups.length > 1
        "
        @submitForm="submitForm"
    />
</template>
