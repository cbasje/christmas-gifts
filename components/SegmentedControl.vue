<script lang="ts" setup>
import { TabGroup, TabList, Tab } from "@headlessui/vue";

interface Props {
    modelValue: number;
    categories: string[];
}
const props = defineProps<Props>();

const emits = defineEmits<{
    (e: "update:modelValue", id: number): void;
}>();

const changeTab = (index: number) => {
    emits("update:modelValue", index);
};
</script>

<template>
    <TabGroup :selectedIndex="modelValue" @change="changeTab">
        <TabList class="flex space-x-1 rounded-xl bg-primary-900/20 p-1">
            <Tab
                v-for="category in categories"
                as="template"
                :key="category"
                v-slot="{ selected }"
            >
                <button
                    :class="[
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-primary-700',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                        selected
                            ? 'bg-white shadow'
                            : 'text-primary-100 hover:bg-white/[0.12] hover:text-white',
                    ]"
                >
                    {{ category }}
                </button>
            </Tab>
        </TabList>
    </TabGroup>
</template>
