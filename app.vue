<script lang="ts" setup>
import { useUserStore } from "@/stores/user";

import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer.vue";

const users = useUserStore();

onMounted(() => {
    users.loadUsers();
    users.loadGroups();
});
</script>

<template>
    <div class="bg-gray-50 dark:bg-gray-900 h-screen overflow-scroll">
        <header>
            <Navigation />
        </header>

        <div class="p-3">
            <NuxtPage />
        </div>

        <Footer />
    </div>
</template>
