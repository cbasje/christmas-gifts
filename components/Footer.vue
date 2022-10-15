<script lang="ts" setup>
const formatted = useDateFormat(useNow(), "YYYY");
</script>

<template>
    <p class="p-16 text-gray-300 dark:text-gray-700 text-center">
        &copy; Sebastiaan Benjamins, {{ formatted }}
    </p>
</template>
