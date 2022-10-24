<script lang="ts" setup>
import { useUserStore } from "~~/stores/user";
import { useToast } from "vue-toastification/dist/index.mjs";

const userStore = useUserStore();

const online = useOnline();
const toast = useToast();

const password = ref("");

const submitForm = () => {
    try {
        if (!online.value) throw new Error("Not online");

        userStore.signIn(password.value);
    } catch (error) {
        console.error(error);
        toast.error(`Signing in was not successful! Reason: ${error.message}`);
    }
};

definePageMeta({
    middleware: ["auth-query"],
});
</script>

<template>
    <NuxtLayout name="login">
        <Header :padding="false">
            {{ $t("pages.login.title") }}

            <template #subtitle>
                {{ $t("pages.login.description") }}
            </template>
        </Header>

        <FormKit
            type="form"
            id="newItemForm"
            :submit-label="$t('signIn')"
            @submit="submitForm"
            form-class="space-y-6 mt-8"
            :actions="false"
        >
            <FormKit
                type="password"
                :label="$t('user.password')"
                :placeholder="$t('user.password')"
                v-model="password"
                autocomplete="current-password"
                validation="required"
                label-class="sr-only"
                input-class="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                message-class="mt-1 block w-full text-sm text-red-400"
            />
            <FormKit
                type="submit"
                :label="$t('signIn')"
                prefix-icon="ph:lock-simple-bold"
                prefix-icon-class="h-5 w-5 text-primary-400 group-hover:text-primary-300 [&>svg]:w-full [&>svg]:h-full"
                input-class="group relative w-full flex justify-center item-center gap-3 py-2 px-4 border border-primary-700 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            />
        </FormKit>
    </NuxtLayout>
</template>
