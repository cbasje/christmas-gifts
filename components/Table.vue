<script lang="ts" setup>
import { Color, GiftItem } from "~~/lib/types";

export interface Props {
    items: GiftItem[] | null;
    title?: string;
    headerColor?: Color;
    allowPurchased?: boolean;
    allowEdit?: boolean;
    isCollapsable?: boolean;
    hasStrikethrough?: boolean;
    hasSummary?: boolean;
    showBgColor?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: undefined,
    headerColour: "gray",
    allowPurchased: false,
    allowEdit: false,
    isCollapsable: false,
    hasStrikethrough: false,
    hasSummary: false,
    showBgColor: true,
});

const emits = defineEmits<{
    (
        e: "switchPurchased",
        payload: { item: GiftItem; purchased: boolean }
    ): void;
}>();

const isCollapsed = ref(!props.isCollapsable);

const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);
</script>

<template>
    <div
        :class="[
            'shadow hover:shadow-lg bg-white dark:bg-gray-800 rounded-lg overflow-hidden',
            !isCollapsed ? 'w-full' : 'w-min sm:w-full',
            items === null ||
            items.length === 0 ||
            (items.every((item) => 'purchased' in item && item.purchased) &&
                hasStrikethrough)
                ? 'opacity-30'
                : '',
        ]"
        aria-label="Table"
    >
        <TableHeading
            :title="title"
            :header-color="headerColor ?? 'gray'"
            :show-bg-color="showBgColor"
            :allow-purchased="allowPurchased"
            :allow-edit="allowEdit"
            :is-collapsable="isCollapsable"
            :has-summary="hasSummary"
            :summary-number="sum(items?.map((i) => Number(i.price)) ?? [])"
            v-model:is-collapsed="isCollapsed"
        />

        <template v-if="items === null || items.length > 0">
            <TableRow
                v-show="isCollapsed"
                v-for="item in items"
                :key="item.id"
                :item="item"
                :allow-purchased="allowPurchased"
                :allow-edit="allowEdit"
                :has-strikethrough="hasStrikethrough"
                @switchPurchased="(ev:any) => emits('switchPurchased', ev)"
            />
        </template>
    </div>
</template>
