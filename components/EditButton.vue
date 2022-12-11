<script lang="ts" setup>
import { useGiftItemStore } from "~~/stores/gift-item";
import { useUserStore } from "~~/stores/user";
import { EditGiftItem, GiftItem, Group } from "~~/lib/types";
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

interface Props {
    item: GiftItem;
}

const props = defineProps<Props>();

const formData = reactive<EditFormData>({
    id: "",
    name: "",
    price: "",
    notes: "",
    link: "",
    recipientId: userStore.currentUserId ?? "",
    groups: userStore.currentGroupId ? [Group[userStore.currentGroupId]] : [],
    idea: false,
    ideaLinkId: null,
});
const setForm = (data: EditFormData) => {
    for (const key in formData) {
        formData[key] = data[key];
    }
};

const submitForm = async (data: EditFormData) => {
    try {
        if (userStore.currentUserId === null) {
            await router.push(localePath("/login"));
            throw new Error("Not logged in correctly");
        }

        const item: EditGiftItem = {
            id: data.id,
            name: data.name,
            price: data.price,
            notes: data.notes,
            recipientId: data.recipientId,
            groups: data.groups.map((g) => Group[g]),
            link: data.link,
            purchased: false,
            idea: data.idea,
            ideaLinkId: data.ideaLinkId,
        };

        if (!online.value) throw new Error("Not online");

        giftItemStore.editItem(item);

        toast.success(`Edited '${item.name}' successfully!`);
        closeModal();
    } catch (e) {
        if (e instanceof Error) {
            console.error(e);
            toast.error(
                `Editing item was not successful! Reason: ${e.message}`
            );
        }
    }
};

const editItem = () => {
    setForm(props.item as unknown as EditFormData); // FIXME: this is kinda ugly

    openModal();
};
</script>

<template>
    <a
        class="cursor-pointer font-normal text-primary-500 dark:text-primary-600 hover:text-primary-700 dark:hover:text-primary-800"
        @click="editItem()"
    >
        <Icon name="ph:pencil-bold" class="h-6 w-6" />
    </a>

    <EditModal
        :title="$t('editModal.edit.title', { item: item.name })"
        :submitLabel="$t('editModal.edit.submit')"
        v-model:isOpen="isOpen"
        :formData="formData"
        :showGroups="
            userStore.currentUser != null &&
            userStore.currentUser.groups.length > 1
        "
        @submitForm="submitForm"
    />
</template>
