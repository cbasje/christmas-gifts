<script lang="ts" setup>
const props = defineProps<{
    title: string;
}>();
</script>

<template>
    <span
        :class="[
            'px-3 inline-flex text-md font-medium rounded-full',
            `bg-${title.toLowerCase()}-200 dark:bg-${title.toLowerCase()}-600`,
            `text-${title.toLowerCase()}-900 dark:text-white`,
        ]"
    >
        {{ title }}
    </span>
</template>
