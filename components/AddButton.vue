<script lang="ts" setup>
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import { PhPlus, PhImage } from "phosphor-vue";

import { useGiftItemStore } from "~~/stores/gift-item";
import { useUserStore } from "~~/stores/user";
import { NewGiftItem } from "~~/lib/types";

const giftItemStore = useGiftItemStore();
const userStore = useUserStore();

const isOpen = ref(false);
const formData = reactive({
    name: "",
    price: "",
    notes: "",
    link: "",
    groups: [userStore.currentGroupId],
});

const closeModal = () => {
    isOpen.value = false;
};
const openModal = () => {
    isOpen.value = true;
};

const resetForm = () => {
    formData.name = "";
    formData.price = "";
    formData.notes = "";
    userStore.currentUserId = "";
    formData.groups = [userStore.currentGroupId];
    formData.link = "";
};
const submitForm = async () => {
    const newItem: NewGiftItem = {
        name: formData.name,
        price: formData.price,
        notes: formData.notes,
        recipientId: userStore.currentUserId,
        groups: formData.groups,
        link: formData.link,
        purchased: false,
    };

    try {
        giftItemStore.addItem(newItem);
        resetForm();
    } catch (e) {
        console.error(e);
    } finally {
        closeModal();
    }
};
</script>

<template>
    <div class="fixed bottom-6 right-6">
        <button
            type="button"
            @click="openModal"
            class="flex justify-center items-center w-16 h-16 drop-shadow-md text-sm font-medium text-white bg-cyan-600 rounded-full hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
            <ph-plus
                weight="bold"
                class="h-6 w-6 text-white group-hover:text-cyan-400"
            />
        </button>
    </div>

    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal">
            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="min-h-screen px-4 text-center">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <DialogOverlay
                            class="fixed inset-0 bg-black opacity-30"
                        />
                    </TransitionChild>

                    <span
                        class="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <div
                            class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
                        >
                            <DialogTitle
                                as="h3"
                                class="text-lg font-medium leading-6 text-gray-900 mb-2"
                            >
                                Add a wish list item
                            </DialogTitle>
                            <FormKit
                                type="form"
                                id="newItemForm"
                                submit-label="Add item"
                                @submit="submitForm"
                                form-class="space-y-6 py-6"
                                :actions="false"
                            >
                                <FormKit
                                    type="text"
                                    label="Name"
                                    v-model="formData.name"
                                    autocomplete="name"
                                    validation="required"
                                    label-class="block text-sm font-medium text-gray-700"
                                    input-class="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    message-class="mt-1 block w-full text-sm text-red-400"
                                />
                                <FormKit
                                    type="text"
                                    label="Price"
                                    v-model="formData.price"
                                    autocomplete="transaction-amount"
                                    validation="number"
                                    label-class="block text-sm font-medium text-gray-700"
                                    input-class="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    message-class="mt-1 block w-full text-sm text-red-400"
                                />
                                <FormKit
                                    type="textarea"
                                    label="Notes"
                                    v-model="formData.notes"
                                    rows="3"
                                    placeholder="Type here more information about the item..."
                                    label-class="block text-sm font-medium text-gray-700"
                                    input-class="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                    message-class="mt-1 block w-full text-sm text-red-400"
                                />
                                <FormKit
                                    type="url"
                                    label="Link"
                                    v-model="formData.link"
                                    placeholder="www.example.com..."
                                    validation="url"
                                    label-class="block text-sm font-medium text-gray-700"
                                    input-class="mt-1 focus:ring-cyan-500 focus:border-cyan-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                    message-class="mt-1 block w-full text-sm text-red-400"
                                />
                                <template
                                    v-if="
                                        userStore.currentUser.groups.length > 1
                                    "
                                >
                                    <FormKit
                                        v-model="formData.groups"
                                        type="select"
                                        multiple
                                        label="Groups"
                                        validation="required"
                                        help="Select all that apply by holding command (macOS) or control (PC)."
                                        label-class="block text-sm font-medium text-gray-700"
                                        input-class="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                        help-class="mt-1 block w-full text-sm text-gray-500"
                                        :options="
                                            userStore.allGroups.map((g) => ({
                                                label: g.name,
                                                value: g.id,
                                            }))
                                        "
                                    />
                                </template>
                                <FormKit
                                    type="submit"
                                    label="Add item"
                                    wrapper-class="text-right"
                                    input-class="inline-flex justify-center px-4 py-2 text-sm font-medium text-cyan-900 bg-cyan-100 rounded-md hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                />
                            </FormKit>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
