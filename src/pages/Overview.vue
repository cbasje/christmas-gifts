<template>
	<div class="flex flex-col">
		<div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div
				class="
					py-2
					align-middle
					inline-block
					min-w-full
					sm:px-6
					lg:px-8
				"
			>
				<div
					class="
						shadow
						overflow-hidden
						border-b border-gray-200
						sm:rounded-lg
					"
				>
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left">Hay</th>
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
									Name
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
									Notes
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
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div class="flex-shrink-0 h-10 w-10">
											<img
												class="h-10 w-10 rounded-full"
												:src="item.image"
												alt=""
											/>
										</div>
										<div class="ml-4">
											<div
												class="
													text-sm
													font-medium
													text-gray-900
												"
											>
												{{ item.name }}
											</div>
											<div class="text-sm text-gray-500">
												{{ item.email }}
											</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">
										{{ item.title }}
									</div>
									<div class="text-sm text-gray-500">
										{{ item.department }}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
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
										Active
									</span>
								</td>
								<td
									class="
										px-6
										py-4
										whitespace-nowrap
										text-sm text-gray-500
									"
								>
									{{ item.role }}
								</td>
								<td class="p-4">
									<Switch
										v-model="enabled"
										:class="
											enabled
												? 'bg-teal-900'
												: 'bg-teal-700'
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
										class="
											text-amber-600
											hover:text-amber-900
										"
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
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';

import { GiftItem } from '@/types/gift-item';

import { Switch } from '@headlessui/vue';

const people = [
	{
		name: 'Jane Cooper',
		title: 'Regional Paradigm Technician',
		department: 'Optimization',
		role: 'Admin',
		email: 'jane.cooper@example.com',
		image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
	},
	// More people...
];

export default defineComponent({
	components: { Switch },
	data() {
		return {
			enabled: true,
		};
	},
	mounted() {
		this.loadGiftItems();
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
		}),
	},
});
</script>
