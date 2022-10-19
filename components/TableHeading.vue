<script lang="ts" setup>
export interface Props {
    title?: string;
    allowPurchased?: boolean;
    allowEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: null,
    allowPurchased: false,
    allowEdit: false,
});
</script>

<template>
    <a
        v-if="title != null"
        :class="[
            'px-6 py-3 flex justify-between items-center whitespace-nowrap cursor-pointer',
            title != null
                ? `bg-${title.toLowerCase()}-50 dark:bg-${title.toLowerCase()}-800`
                : 'bg-gray-50 dark:bg-gray-700',
        ]"
        aria-label="Table Header"
    >
        <span
            :class="[
                'px-3 inline-flex text-md font-medium rounded-full',
                `bg-${title.toLowerCase()}-200 dark:bg-${title.toLowerCase()}-600`,
                `text-${title.toLowerCase()}-900 dark:text-white`,
            ]"
        >
            {{ title }}
        </span>
    </a>

    <div
        :class="[
            'grid',
            title != null
                ? `bg-${title.toLowerCase()}-50 dark:bg-${title.toLowerCase()}-800`
                : 'bg-gray-50 dark:bg-gray-700',
            allowEdit
                ? 'grid-cols-table-5-sm sm:grid-cols-table-5'
                : 'grid-cols-table-4-sm sm:grid-cols-table-4',
        ]"
    >
        <div
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        >
            Item
        </div>
        <div
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        >
            Price
        </div>
        <div
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
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
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
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
