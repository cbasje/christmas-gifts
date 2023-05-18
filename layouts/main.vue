<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { useToast } from "vue-toastification/dist/index.mjs";
import "@/styles/main.css";

const userStore = useUserStore();

const router = useRouter();
const toast = useToast();
const online = useOnline();
const localePath = useLocalePath();

onMounted(async () => {
    try {
        if (!online.value) throw new Error("Not online");

        await userStore.loadCurrentUser();
    } catch (e) {
        if (e instanceof Error) {
            console.error(e);
            toast.error(
                `Loading user was not successful! Reason: ${e.message}`
            );
        }

        router.push(localePath("/login"));
    }
});
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
