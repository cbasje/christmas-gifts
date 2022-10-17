<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { useToast } from "vue-toastification/dist/index.mjs";

const userStore = useUserStore();

const router = useRouter();
const toast = useToast();
const online = useOnline();

onMounted(async () => {
    try {
        if (!online.value) throw new Error("Not online");

        await userStore.loadCurrentUser();
    } catch (error) {
        console.error(error);
        toast.error(
            `Loading user was not successful! Reason: ${error.message}`
        );

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
