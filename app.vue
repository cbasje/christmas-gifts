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
        <Head>
            <Title>Christmas Gifts</Title>
            <Meta
                name="description"
                content="Christmas gifts tracker for Benjamins & Haugens"
            />
        </Head>

        <NuxtPage />
    </div>
</template>
