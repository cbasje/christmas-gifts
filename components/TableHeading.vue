<script lang="ts" setup>
import { Group } from "~~/pages/index.vue";

export interface Props {
    group?: Group;
    allowPurchased?: boolean;
    allowEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    group: null,
    allowPurchased: false,
    allowEdit: false,
});
</script>

<template>
    <div
        v-if="group != null"
        :class="[
            'px-6 py-3 text-left whitespace-nowrap',
            group != null
                ? `bg-${group.user.name.toLowerCase()}-50`
                : 'bg-gray-50',
        ]"
        aria-label="Table Header"
    >
        <span
            :class="[
                'px-3 inline-flex text-md font-medium rounded-full',
                `bg-${group.user.name.toLowerCase()}-200`,
                `text-${group.user.name.toLowerCase()}-900`,
            ]"
        >
            {{ group.user.name }}
        </span>
    </div>

    <div
        :class="[
            'grid',
            group != null
                ? `bg-${group.user.name.toLowerCase()}-50`
                : 'bg-gray-50',
            allowEdit
                ? 'grid-cols-table-5-sm sm:grid-cols-table-5'
                : 'grid-cols-table-4',
        ]"
    >
        <div
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
            Item
        </div>
        <div
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
            Price
        </div>
        <div
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
            Link
        </div>
        <!-- FIXME -->
        <!-- <div
				scope="col"
				class="
					px-6
					py-3
					text-left text-xs
					font-medium
					text-gray-500
					uppercase
					tracking-wider
				"
			>
				Picture
			</div> -->
        <div
            v-if="allowPurchased"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
            Purchased?
        </div>
        <div v-if="allowEdit" scope="col" class="relative px-6 py-3">
            <span class="sr-only">Edit</span>
        </div>
        <div v-if="allowEdit" scope="col" class="relative px-6 py-3">
            <span class="sr-only">Delete</span>
        </div>
    </div>
</template>
