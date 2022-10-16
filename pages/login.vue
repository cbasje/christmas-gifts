<script lang="ts" setup>
import { useUserStore } from "~~/stores/user";
import { PhLockSimple } from "phosphor-vue";

const userStore = useUserStore();

const online = useOnline();

const password = ref("");

const submitForm = () => {
    try {
        if (!online.value) throw new Error("Not online");

        userStore.signIn(password.value);
    } catch (error) {
        console.error(error);
        alert(`Signing in was not successful! Reason: ${error.message}`);
    }
};

definePageMeta({
    middleware: ["auth-query"],
});
</script>

<template>
    <NuxtLayout name="login">
        <div>
            <h2
                class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100"
            >
                Please enter your password
            </h2>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="submitForm">
            <div class="rounded-md shadow-sm -space-y-px">
                <div>
                    <label for="password" class="sr-only">Password</label>
                    <input
                        id="password"
                        name="password"
                        v-model="password"
                        type="password"
                        autocomplete="current-password"
                        required
                        class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    class="group relative w-full flex justify-center py-2 px-4 border border-primary-700 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <span
                        class="absolute left-0 inset-y-0 flex items-center pl-3"
                    >
                        <ph-lock-simple
                            weight="bold"
                            class="h-5 w-5 text-primary-400 group-hover:text-primary-300"
                        />
                    </span>
                    Sign in
                </button>
            </div>
        </form>
    </NuxtLayout>
</template>
