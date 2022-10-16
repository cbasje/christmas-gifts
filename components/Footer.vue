<script lang="ts" setup>
const year = useDateFormat(useNow(), "YYYY");
</script>

<template>
    <p class="p-16 text-gray-300 dark:text-gray-700 text-center">
        &copy; Sebastiaan Benjamins, {{ year }}
    </p>
</template>
