<script lang="ts" setup>
const slots = useSlots();

const hasSubtitle = computed(() => {
    return !!slots.subtitle;
});
</script>

<template>
    <header
        class="max-w-3xl md:max-w-7xl mx-auto px-2 py-5 sm:px-6 lg:px-8 w-full"
    >
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
            <slot />
        </h1>

        <p
            v-if="hasSubtitle"
            class="text-lg font-regular mb-3 text-gray-700 dark:text-gray-300"
        >
            <slot name="subtitle" />
        </p>
    </header>
</template>
