<script lang="ts" setup>
import { Color } from "~~/lib/types";

export interface Props {
    title?: string;
    headerColor: Color;
    allowPurchased?: boolean;
    allowEdit?: boolean;
    isCollapsable?: boolean;
    isCollapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: null,
    allowPurchased: false,
    allowEdit: false,
    isCollapsable: false,
    isCollapsed: true,
});

const emits = defineEmits<{
    (e: "update:isCollapsed", value: boolean): void;
}>();

const toggleCollapsed = () => {
    emits("update:isCollapsed", !props.isCollapsed);
};
</script>

<template>
    <a
        v-if="title != null"
        :class="[
            'px-6 py-3 flex justify-between items-center whitespace-nowrap cursor-pointer select-none',
            headerColor != 'gray'
                ? `bg-${headerColor}-100 dark:bg-${headerColor}-900`
                : 'bg-gray-200 dark:bg-gray-700',
        ]"
        @click="toggleCollapsed"
        aria-label="Table Header"
    >
        <Badge :title="title" :color="headerColor" />

        <Icon
            v-if="isCollapsable"
            name="ph:caret-down-bold"
            :class="[
                'transition-transform duration-200 text-gray-600 dark:text-gray-300',
                isCollapsed ? '-rotate-180' : 'rotate-0',
            ]"
        />
    </a>

    <div
        v-show="isCollapsed"
        :class="[
            'grid text-gray-600 dark:text-gray-300',
            headerColor != 'gray'
                ? `bg-${headerColor}-100 dark:bg-${headerColor}-900`
                : 'bg-gray-200 dark:bg-gray-700',
            allowEdit
                ? 'grid-cols-table-5-sm sm:grid-cols-table-5'
                : 'grid-cols-table-4-sm sm:grid-cols-table-4',
        ]"
    >
        <div
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
        >
            {{ $t("item.name") }} + {{ $t("item.notes") }}
        </div>
        <div
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
        >
            {{ $t("item.price") }}
        </div>
        <div
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
        >
            {{ $t("item.link") }}
        </div>
        <!-- FIXME -->
        <!-- <div
				scope="col"
				class=""
			>
				Picture
			</div> -->
        <div
            v-if="allowPurchased"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
        >
            {{ $t("table.purchased") }}
        </div>
        <div v-if="allowEdit" scope="col" class="relative px-6 py-3">
            <span class="sr-only">
                {{ $t("table.edit") }}
            </span>
        </div>
        <div v-if="allowEdit" scope="col" class="relative px-6 py-3">
            <span class="sr-only">
                {{ $t("table.remove") }}
            </span>
        </div>
    </div>
</template>
