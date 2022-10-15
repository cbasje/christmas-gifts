<script lang="ts" setup>
import { useUserStore } from "@/stores/user";

const users = useUserStore();

onMounted(() => {
    users.loadUsers();
    users.loadGroups();
});
</script>

<template>
    <div class="bg-gray-50 dark:bg-gray-900 h-screen overflow-scroll">
        <NuxtPage />
    </div>
</template>
