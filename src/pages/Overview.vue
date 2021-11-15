<template>
	<div class="flex flex-col">
		<div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
			<div
				v-if="groups != null"
				class="overflow-scroll"
				aria-label="Table"
			>
				<div
					v-for="group in groups"
					:key="group.user.id"
					class="
						min-w-full
						shadow
						border-b border-gray-200
						divide-gray-200
						rounded-lg
						mb-3
						bg-white
					"
					aria-label="Table Section"
				>
					<div class="bg-gray-50 rounded-lg overflow-hidden">
						<tr>
							<th class="px-6 py-3 text-left whitespace-nowrap">
								<span
									class="
										px-3
										inline-flex
										text-md
										font-semibold
										rounded-full
									"
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
					</div>
					<div class="divide-y">
						<tr
							class="grid grid-cols-table"
							v-for="item in group.elements"
							:key="item.email"
						>
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
									overflow-hidden overflow-ellipsis
									text-sm text-gray-500
									max-w-xs
								"
							>
								{{ item.price }}
							</td>
							<td
								class="
									px-6
									py-4
									whitespace-nowrap
									overflow-hidden overflow-ellipsis
									text-sm text-gray-500
									max-w-sm
								"
							>
								<a
									:href="item.link"
									target="_blank"
									rel="noopener noreferrer"
									class="underline text-cyan-500"
								>
									{{ item.link }}
								</a>
							</td>
							<td class="flex items-center">
								<div class="flex-shrink-0 h-10 w-10">
									<img
										class="h-10 w-10 rounded-full"
										:src="item.pic"
										alt=""
									/>
								</div>
							</td>
							<td class="px-6 py-3">
								<Switch
									:model-value="item.purchased"
									@update:model-value="
										(evt) => switchPurchased(item, evt)
									"
									:class="
										item.purchased
											? 'bg-green-500'
											: 'bg-gray-200'
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
											item.purchased
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
									class="text-cyan-600 hover:text-cyan-900"
									@click="editItem(item)"
								>
									Edit
								</a>
							</td>
						</tr>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';

import { Switch } from '@headlessui/vue';

import { GiftItem } from '@/types/gift-item';
import { User } from '@/types/user';

export interface Group {
	user: User;
	elements: any[];
}

export interface Grouped {
	[key: string]: Group;
}

function groupBy(item: GiftItem) {
	return item.recipient[0];
}

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
		switchPurchased(item: GiftItem, purchased: boolean) {
			console.log(item.id, purchased);
			this.togglePurchased({ item, purchased });
		},
		...mapMutations('giftItem', {
			selectCategory: 'selectCategory',
		}),
		...mapActions('giftItem', {
			loadGiftItems: 'loadGiftItems',
			togglePurchased: 'togglePurchased',
		}),
	},
	computed: {
		groups() {
			const elements = this.items;
			const users = this.users;

			if (!elements || !users) {
				return null;
			}

			const grouped: Grouped = elements.reduce(
				(groups: Grouped, element: GiftItem) => {
					const key = groupBy(element);
					console.log(element, users, key);
					if (!groups[key]) {
						groups[key] = {
							user: users[key],
							elements: [],
						};
					}
					groups[key].elements.push(element);
					return groups;
				},
				{}
			);

			return Object.keys(grouped).map((key) => grouped[key]);
		},
		...mapGetters('giftItem', {
			items: 'getQueryResults',
			// items: 'getAllGiftItems',
		}),
		...mapGetters('users', {
			users: 'getAllUsers',
		}),
	},
});
</script>
