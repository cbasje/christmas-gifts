<script lang="ts" setup>
import "@/assets/styles/main.css";
</script>

<template>
    <div>
        <Navigation />

        <main class="p-3 sm:flex sm:flex-col sm:items-center">
            <slot />
        </main>

        <footer>
            <Footer />
        </footer>
    </div>
</template>
