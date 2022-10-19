<script lang="ts" setup>
import { GiftItem } from "~~/lib/types";
import { Switch } from "@headlessui/vue";
import { PhPencil, PhTrash } from "phosphor-vue";
import { useUserStore } from "~~/stores/user";

export interface Props {
    item: GiftItem;
    allowPurchased?: boolean;
    allowEdit?: boolean;
}

const userStore = useUserStore();

const props = withDefaults(defineProps<Props>(), {
    allowPurchased: false,
    allowEdit: false,
});
const emits = defineEmits<{
    (
        e: "switchPurchased",
        payload: { item: GiftItem; purchased: boolean }
    ): void;
    (e: "editItem", value: GiftItem): void;
    (e: "removeItem", value: GiftItem): void;
}>();

const formatPrice = (priceString: string) => {
    const defaultReturn = "-";

    if (!priceString) return defaultReturn;

    const sekFormatter = new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "SEK",
        maximumFractionDigits: 2,
    });
    const eurFormatter = new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
    });
    const usdFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    });
    const defaultFormatter = new Intl.NumberFormat("default", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const regex = /(?<code>(?:[$€])?)(?<price>\d+(?:[,\.]\d+)?)/g;
    const matches = [...priceString.matchAll(regex)];

    if (!matches || !matches.length) return defaultReturn;

    const [_, currencyCode, price] = matches[0];

    switch (currencyCode) {
        case "SEK":
            return sekFormatter.format(Number(price));
        case "€":
            return eurFormatter.format(Number(price));
        case "$":
            return usdFormatter.format(Number(price));
        default:
            return defaultFormatter.format(Number(price));
    }
};
</script>

<template>
    <div
        :class="[
            'group grid border-b border-gray-200',
            item.purchased && item.recipientId != userStore.currentUserId
                ? 'opacity-30'
                : '',
            allowEdit
                ? 'grid-cols-table-5-sm sm:grid-cols-table-5'
                : 'grid-cols-table-4-sm sm:grid-cols-table-4',
        ]"
    >
        <div class="flex flex-col justify-center px-6 py-4 min-h-4rem">
            <h3 class="text-sm font-medium text-gray-900">
                {{ item.name }}
            </h3>
            <MarkdownDisplay v-if="item.notes" class="min-w-full text-gray-500">
                {{ item.notes }}
            </MarkdownDisplay>
        </div>
        <div class="flex items-center min-w-full">
            <span class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatPrice(item.price) }}
            </span>
        </div>
        <div class="flex items-center min-w-full">
            <a
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis text-sm underline cursor-pointer font-normal text-primary-500 hover:text-primary-600"
            >
                {{ item.link }}
            </a>
        </div>
        <!-- FIXME -->
        <!-- <div class="flex items-center px-6 py-3">
			<div class="flex-shrink-0 h-10 w-10">
				<img
					v-if="item.pic"
					class="h-10 w-10 rounded-md"
					:src="item.pic[0].url"
					alt=""
				/>
			</div>
		</div> -->
        <div
            v-if="allowPurchased"
            class="flex justify-center items-center px-6 py-3"
        >
            <Switch
                :model-value="item.purchased"
                @update:model-value="
                    (evt) =>
                        emits('switchPurchased', {
                            item,
                            purchased: evt,
                        })
                "
                :class="item.purchased ? 'bg-green-500' : 'bg-gray-200'"
                class="relative inline-flex items-center h-6 rounded-full w-11"
            >
                <span class="sr-only">Item purchased</span>
                <span
                    :class="item.purchased ? 'translate-x-6' : 'translate-x-1'"
                    class="inline-block w-4 h-4 transform bg-white rounded-full"
                />
            </Switch>
        </div>
        <div
            v-if="allowEdit"
            class="flex justify-center items-center px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
        >
            <EditButton :item="item" />
        </div>
        <div
            v-if="allowEdit"
            class="flex justify-center items-center px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
        >
            <RemoveButton :item="item" />
        </div>
    </div>
</template>
