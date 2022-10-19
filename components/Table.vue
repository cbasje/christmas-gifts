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
</script>

<template>
    <div
        class="w-min sm:w-full shadow bg-white rounded-lg overflow-hidden"
        aria-label="Table"
    >
        <TableHeading
            :title="title"
            :allow-purchased="allowPurchased"
            :allow-edit="allowEdit"
        />

        <TableRow
            v-for="item in items"
            :key="item.id"
            :item="item"
            :allow-purchased="allowPurchased"
            :allow-edit="allowEdit"
        />
        <!-- @switchPurchased="switchPurchased" -->
    </div>
</template>
