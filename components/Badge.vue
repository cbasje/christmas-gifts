<script lang="ts" setup>
import { Color } from "~~/lib/types";

const props = defineProps<{
    title: string;
    color: Color;
}>();
</script>

<template>
    <span
        :class="[
            'px-3 inline-flex text-md font-medium rounded-full',
            `bg-${color}-300 dark:bg-${color}-600`,
            `text-${color}-900 dark:text-white`,
        ]"
    >
        {{ title }}
    </span>
</template>
