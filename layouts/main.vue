<script lang="ts" setup>
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
    try {
        await userStore.loadCurrentUser();
    } catch (error) {
        console.error(error);
        alert("Loading user was not successful!");

        router.push("/login");
    }
});
</script>

<template>
    <div>
        <Navigation />

        <main class="p-3">
            <slot />
        </main>

        <footer>
            <Footer />
        </footer>
    </div>
</template>
