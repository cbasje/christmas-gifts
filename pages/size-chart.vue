<script lang="ts" setup>
import { useToast } from "vue-toastification/dist/index.mjs";
import SizeChartSimpleEmpty from "~/assets/SizeChartSimpleEmpty.svg";
import SizeChartEmpty from "~/assets/SizeChartEmpty.svg";
import SizeChartSimple from "~/assets/SizeChartSimple.svg";
import SizeChart from "~/assets/SizeChart.svg";
import SegmentedControl from "~/components/SegmentedControl.vue";

const selectedTab = ref(0);

definePageMeta({
    middleware: ["auth"],
});
</script>

<template>
    <NuxtLayout name="main">
        <Header>
            {{ $t("pages.size-chart.title") }}

            <template #subtitle>
                {{ $t("pages.size-chart.description") }}
            </template>
        </Header>

        <div class="max-w-xl mx-auto w-full">
            <SegmentedControl
                v-model="selectedTab"
                :categories="['Simple', 'Advanced']"
            />
        </div>
        <div class="max-w-4xl mx-auto w-full relative">
            <!-- Simple SizeChart -->
            <template v-if="selectedTab === 0">
                <SizeChartSimpleEmpty
                    class="hidden md:block max-w-3xl md:max-w-7xl mx-auto w-full h-[auto] text-primary-900 dark:text-primary-100"
                />
                <SizeChartSimple
                    class="md:hidden max-w-3xl md:max-w-7xl mx-auto w-full h-[auto] text-primary-900 dark:text-primary-100"
                />

                <FormKit
                    type="form"
                    form-class="md:absolute md:inset-0 space-y-6 md:space-y-0"
                    :actions="false"
                >
                    <FormKit
                        type="text"
                        :label="$t('pages.size-chart.areas.top')"
                        placeholder="S, M, L, etc."
                        outer-class="md:absolute right-[68.07%] top-[33.13%] md:w-[17ch] md:-translate-y-10"
                        label-class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        message-class="mt-1 block w-full text-sm text-danger-400"
                    />
                    <FormKit
                        type="text"
                        :label="$t('pages.size-chart.areas.bottom')"
                        placeholder="W33 L36, etc."
                        outer-class="md:absolute right-[68.07%] top-[65.86%] md:w-[17ch] md:-translate-y-10"
                        label-class="block text-sm font-medium text-gray-70 dark:text-gray-300"
                        input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        message-class="mt-1 block w-full text-sm text-danger-400"
                    />
                </FormKit>
            </template>

            <!-- Advanced SizeChart -->
            <template v-else>
                <SizeChartEmpty
                    class="hidden md:block max-w-3xl md:max-w-7xl mx-auto w-full h-[auto] text-primary-900 dark:text-primary-100"
                />
                <SizeChart
                    class="md:hidden max-w-3xl md:max-w-7xl mx-auto w-full h-[auto] text-primary-900 dark:text-primary-100"
                />

                <FormKit
                    type="form"
                    form-class="md:absolute md:inset-0 space-y-6 md:space-y-0"
                    :actions="false"
                >
                    <FormKit
                        type="text"
                        :label="$t('pages.size-chart.areas.head')"
                        placeholder="17 inch, etc."
                        outer-class="md:absolute right-[68.07%] top-[14.26%] md:w-[17ch] md:-translate-y-10"
                        label-class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        message-class="mt-1 block w-full text-sm text-danger-400"
                    />
                    <FormKit
                        type="text"
                        :label="$t('pages.size-chart.areas.sleeve')"
                        placeholder="XL, 37 cm, etc."
                        outer-class="md:absolute right-[68.07%] top-[54.02%] md:w-[17ch] md:-translate-y-10"
                        label-class="block text-sm font-medium text-gray-70 dark:text-gray-300"
                        input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        message-class="mt-1 block w-full text-sm text-danger-400"
                    />
                    <FormKit
                        type="text"
                        :label="$t('pages.size-chart.areas.chest')"
                        placeholder="239 mm, etc."
                        outer-class="md:absolute left-[68.47%] top-[32.53%] md:w-[17ch] md:-translate-y-10"
                        label-class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        message-class="mt-1 block w-full text-sm text-danger-400"
                    />
                    <FormKit
                        type="text"
                        :label="$t('pages.size-chart.areas.waist')"
                        placeholder="M, 0.5 m, 0.02 mile, etc."
                        outer-class="md:absolute left-[68.47%] top-[41.77%] md:w-[17ch] md:-translate-y-10"
                        label-class="block text-sm font-medium text-gray-70 dark:text-gray-300"
                        input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        message-class="mt-1 block w-full text-sm text-danger-400"
                    />
                    <FormKit
                        type="text"
                        :label="$t('pages.size-chart.areas.hip')"
                        placeholder="2 baguettes, etc."
                        outer-class="md:absolute left-[68.47%] top-[49.40%] md:w-[17ch] md:-translate-y-10"
                        label-class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        message-class="mt-1 block w-full text-sm text-danger-400"
                    />
                    <FormKit
                        type="text"
                        :label="$t('pages.size-chart.areas.inseam')"
                        placeholder="0.5 Sebastiaan, etc."
                        outer-class="md:absolute left-[68.47%] top-[84.94%] md:w-[17ch] md:-translate-y-10"
                        label-class="block text-sm font-medium text-gray-70 dark:text-gray-300"
                        input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        message-class="mt-1 block w-full text-sm text-danger-400"
                    />
                </FormKit>
            </template>
        </div>
    </NuxtLayout>
</template>
