<template>
	<div>
		<tr v-if="group != null">
			<th class="px-6 py-3 text-left whitespace-nowrap">
				<span
					class="px-3 inline-flex text-md font-medium rounded-full"
					:style="`background-color: ${group.user.color}; color: ${group.user.colorDark};`"
				>
					{{ group.user.name }}
				</span>
			</th>
			<th></th>
			<th></th>
			<th></th>
			<th></th>
			<th></th>
		</tr>
		<tr class="grid grid-cols-table">
			<th
				scope="col"
				class="
					px-6
					py-3
					text-left text-xs
					font-medium
					text-gray-500
					uppercase
					tracking-wider
				"
			>
				Item
			</th>
			<th
				scope="col"
				class="
					px-6
					py-3
					text-left text-xs
					font-medium
					text-gray-500
					uppercase
					tracking-wider
				"
			>
				Price
			</th>
			<th
				scope="col"
				class="
					px-6
					py-3
					text-left text-xs
					font-medium
					text-gray-500
					uppercase
					tracking-wider
				"
			>
				Link
			</th>
			<th
				scope="col"
				class="
					px-6
					py-3
					text-left text-xs
					font-medium
					text-gray-500
					uppercase
					tracking-wider
				"
			>
				Picture
			</th>
			<th
				v-if="allowPurchased"
				scope="col"
				class="
					px-6
					py-3
					text-left text-xs
					font-medium
					text-gray-500
					uppercase
					tracking-wider
				"
			>
				Purchased?
			</th>
			<th v-if="allowEdit" scope="col" class="relative px-6 py-3">
				<span class="sr-only">Edit</span>
			</th>
		</tr>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		group: {
			type: Object,
			default: null,
			required: false,
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
