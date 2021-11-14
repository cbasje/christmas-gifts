<template>
	<div class="flex flex-col">
		<div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
			<div
				class="
					shadow
					overflow-hidden
					border-b border-gray-200
					rounded-lg
				"
			>
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left">
								<h2>Hay</h2>
							</th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
						</tr>
						<tr>
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
							<th scope="col" class="relative px-6 py-3">
								<span class="sr-only">Edit</span>
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr v-for="item in items" :key="item.email">
							<td class="px-6 py-4 max-w-sm">
								<h3 class="text-sm font-medium text-gray-900">
									{{ item.name }}
								</h3>
								<p
									class="
										text-sm text-gray-500
										whitespace-nowrap
										overflow-hidden overflow-ellipsis
									"
								>
									{{ item.notes }}
								</p>
							</td>
							<td
								class="
									px-6
									py-4
									whitespace-nowrap
									text-sm text-gray-500
								"
							>
								{{ item.price }}
							</td>
							<!-- <td class="px-6 py-4 whitespace-nowrap">
									<span
										class="
											px-2
											inline-flex
											text-xs
											leading-5
											font-semibold
											rounded-full
											bg-green-100
											text-green-800
										"
									>
										{{ item.recipient.name }}
									</span>
								</td> -->
							<td
								class="
									px-6
									py-4
									whitespace-nowrap
									text-sm text-gray-500
									max-w-sm
								"
							>
								<a
									:href="item.link"
									target="_blank"
									rel="noopener noreferrer"
								>
									{{ item.link }}
								</a>
							</td>
							<td>
								<div class="flex items-center">
									<div class="flex-shrink-0 h-10 w-10">
										<img
											class="h-10 w-10 rounded-full"
											:src="item.pic"
											alt=""
										/>
									</div>
								</div>
							</td>
							<td class="px-6 py-3">
								<Switch
									v-model="enabled"
									:class="
										enabled
											? 'bg-green-900'
											: 'bg-green-700'
									"
									class="
										relative
										inline-flex
										items-center
										h-6
										rounded-full
										w-11
									"
								>
									<span class="sr-only">
										Enable notifications
									</span>
									<span
										:class="
											enabled
												? 'translate-x-6'
												: 'translate-x-1'
										"
										class="
											inline-block
											w-4
											h-4
											transform
											bg-white
											rounded-full
										"
									/>
								</Switch>
							</td>
							<td
								class="
									px-6
									py-4
									whitespace-nowrap
									text-right text-sm
									font-medium
								"
							>
								<a
									class="text-amber-600 hover:text-amber-900"
									@click="editItem(item)"
								>
									Edit
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';

import { GiftItem } from '@/types/gift-item';

import { Switch } from '@headlessui/vue';

export default defineComponent({
	components: { Switch },
	data() {
		return {
			enabled: true,
		};
	},
	mounted() {
		this.loadGiftItems();

		console.log(process.env.NODE_ENV);
	},
	methods: {
		editItem(item: GiftItem) {
			alert(item.name);
		},
		...mapMutations('giftItem', {
			selectCategory: 'selectCategory',
		}),
		...mapActions('giftItem', {
			loadGiftItems: 'loadGiftItems',
		}),
	},
	computed: {
		...mapGetters('giftItem', {
			items: 'getQueryResults',
			// items: 'getAllGiftItems',
		}),
	},
});
</script>
