<template>
	<tr class="grid grid-cols-table">
		<td class="flex flex-col justify-center px-6 py-4 min-w-full">
			<h3 class="text-sm font-medium text-gray-900">
				{{ item.name }}
			</h3>
			<p
				v-if="item.notes"
				class="min-w-full
					text-sm text-gray-500
					whitespace-nowrap
					overflow-hidden overflow-ellipsis
				"
			>
				{{ item.notes }}
			</p>
		</td>
		<td class="flex items-center min-w-full">
			<span
				class="
					px-6
					py-4
					whitespace-nowrap
					overflow-hidden overflow-ellipsis
					text-sm text-gray-500
				"
			>
				{{ item.price }}
			</span>
		</td>
		<td class="flex items-center min-w-full">
			<a
				:href="item.link"
				target="_blank"
				rel="noopener noreferrer"
				class="
					px-6
					py-4
					whitespace-nowrap
					overflow-hidden overflow-ellipsis
					text-sm
					underline
					text-cyan-500
				"
			>
				{{ item.link }}
			</a>
		</td>
		<td class="flex items-center px-6 py-3">
			<div class="flex-shrink-0 h-10 w-10">
				<img
					v-if="item.pic"
					class="h-10 w-10 rounded-md"
					:src="item.pic[0].url"
					alt=""
				/>
			</div>
		</td>
		<td
			v-if="allowPurchased"
			class="flex justify-center items-center px-6 py-3"
		>
			<Switch
				:model-value="item.purchased"
				@update:model-value="
					(evt) => $emit('switchPurchased', item, evt)
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
		</td>
		<!-- FIXME -->
		<!-- <td
			v-if="allowEdit"
			class="
				flex
				justify-center
				items-center
				px-6
				py-4
				whitespace-nowrap
				text-right text-sm
				font-medium
			"
		>
			<a
				class="text-cyan-600 hover:text-cyan-900"
				@click="$emit('editItem', item)"
			>
				<PencilIcon class="h-6 w-6" aria-hidden="true" />
			</a>
		</td> -->
		<td
			v-if="allowEdit"
			class="
				flex
				justify-center
				items-center
				px-6
				py-4
				whitespace-nowrap
				text-right text-sm
				font-medium
			"
		>
			<a
				class="text-red-600 hover:text-red-900"
				@click="$emit('removeItem', item)"
			>
				<TrashIcon class="h-6 w-6" aria-hidden="true" />
			</a>
		</td>
	</tr>
</template>

<script lang="ts">
import { GiftItem } from '@/types/gift-item';
import { defineComponent } from 'vue';

import { Switch } from '@headlessui/vue';
import { PencilIcon, TrashIcon } from '@heroicons/vue/outline';

export default defineComponent({
	components: { Switch, PencilIcon, TrashIcon },
	props: {
		item: {
			type: Object,
			default: {} as GiftItem,
			required: true,
		},
		allowPurchased: {
			type: Boolean,
			default: false,
			required: false,
		},
		allowEdit: {
			type: Boolean,
			default: false,
			required: false,
		},
	},
});
</script>
