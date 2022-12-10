<script lang="ts" setup>
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from "@headlessui/vue";
import { GiftItem, Group } from "~~/lib/types";

export type EditFormData = { [key: string]: any } & Pick<
    GiftItem,
    "id" | "name" | "price" | "notes" | "link" | "groups"
>;

const formData = reactive<EditFormData>({
    id: "",
    name: "",
    price: "",
    notes: "",
    link: "",
    groups: [],
});

interface Props {
    isOpen: boolean;
    formData: EditFormData;
    showGroups: boolean;
    title: string;
    submitLabel: string;
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: false,
    title: "Add a wish list item",
    submitLabel: "Add item",
});

const emits = defineEmits<{
    (e: "update:isOpen", value: boolean): void;
    (e: "submitForm", data: EditFormData): void;
}>();

const setForm = (data: EditFormData) => {
    for (const key in formData) {
        formData[key] = data[key];
    }
};

const capitalizeGroupName = ([first, ...rest]: string): string =>
    `${first.toUpperCase()}${rest.join("").toLowerCase()}`;

watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) setForm(props.formData);
    }
);
</script>

<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="emits('update:isOpen', false)">
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
                                {{ title }}
                            </DialogTitle>
                            <FormKit
                                type="form"
                                id="newItemForm"
                                submit-label="Add item"
                                @submit="emits('submitForm', formData)"
                                form-class="space-y-6 py-6"
                                :actions="false"
                            >
                                <FormKit
                                    type="text"
                                    :label="$t('item.name')"
                                    v-model="formData.name"
                                    autocomplete="name"
                                    validation="required"
                                    label-class="block text-sm font-medium text-gray-700"
                                    input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    message-class="mt-1 block w-full text-sm text-red-400"
                                />
                                <FormKit
                                    type="text"
                                    :label="$t('item.price')"
                                    v-model="formData.price"
                                    autocomplete="transaction-amount"
                                    :validation="[
                                        [
                                            'matches',
                                            /(?:[$€])?\s?\d+(?:[,.]\d+)?/,
                                        ],
                                    ]"
                                    :validation-messages="{
                                        matches:
                                            'Price must consist of numbers with currency codes.',
                                    }"
                                    label-class="block text-sm font-medium text-gray-700"
                                    input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    message-class="mt-1 block w-full text-sm text-red-400"
                                />
                                <FormKit
                                    type="textarea"
                                    :label="$t('item.notes')"
                                    v-model="formData.notes"
                                    rows="3"
                                    placeholder="Type here more information about the item..."
                                    label-class="block text-sm font-medium text-gray-700"
                                    input-class="shadow-sm focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                    message-class="mt-1 block w-full text-sm text-red-400"
                                />
                                <FormKit
                                    type="url"
                                    :label="$t('item.link')"
                                    v-model="formData.link"
                                    placeholder="www.example.com..."
                                    validation="url"
                                    label-class="block text-sm font-medium text-gray-700"
                                    input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                    message-class="mt-1 block w-full text-sm text-red-400"
                                />
                                <template v-if="showGroups">
                                    <FormKit
                                        v-model="formData.groups"
                                        type="select"
                                        multiple
                                        :label="$t('item.groups')"
                                        validation="required"
                                        help="Select all that apply by holding command (macOS) or control (PC)."
                                        label-class="block text-sm font-medium text-gray-700"
                                        input-class="shadow-sm focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                        help-class="mt-1 block w-full text-sm text-gray-500"
                                        :options="
                                            Object.keys(Group).map((g) => ({
                                                label: capitalizeGroupName(
                                                    Group[g as Group]
                                                ),
                                                value: g,
                                            }))
                                        "
                                    />
                                </template>
                                <FormKit
                                    type="submit"
                                    :label="submitLabel"
                                    wrapper-class="text-right"
                                    input-class="inline-flex justify-center px-4 py-2 text-sm font-medium text-primary-900 bg-primary-100 rounded-md hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                />
                            </FormKit>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
