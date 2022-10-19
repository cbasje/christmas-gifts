<script lang="ts" setup>
import { GiftItem } from "~~/lib/types";

export interface Props {
    items: GiftItem[];
    title?: string;
    allowPurchased?: boolean;
    allowEdit?: boolean;
    isCollapsable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: null,
    allowPurchased: false,
    allowEdit: false,
    isCollapsable: false,
});

const emits = defineEmits<{
    (
        e: "switchPurchased",
        payload: { item: GiftItem; purchased: boolean }
    ): void;
}>();

const isCollapsed = ref(!props.isCollapsable);
</script>

<template>
    <div
        class="w-min sm:w-full shadow hover:shadow-lg bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
        aria-label="Table"
    >
        <TableHeading
            :title="title"
            :allow-purchased="allowPurchased"
            :allow-edit="allowEdit"
            :is-collapsable="isCollapsable"
            v-model:is-collapsed="isCollapsed"
        />

        <TableRow
            v-show="isCollapsed"
            v-for="item in items"
            :key="item.id"
            :item="item"
            :allow-purchased="allowPurchased"
            :allow-edit="allowEdit"
            @switchPurchased="(ev) => emits('switchPurchased', ev)"
        />
    </div>
</template>
