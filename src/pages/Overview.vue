<template>
	<div>
		<Header>
			Gift Tracker

			<template #subtitle>
				This is the overview of all the gifts. Please let everyone know
				if you have bought an item!
			</template>
		</Header>

		<div
			v-if="groups != null"
			class="overflow-scroll container mx-auto"
			aria-label="Table"
		>
			<Table v-for="group in groups" :key="group.user.id">
				<template #heading>
					<TableHeading :group="group" :allow-purchased="true" />
				</template>
				<template #body>
					<TableRow
						v-for="item in group.elements"
						:key="item.id"
						:item="item"
						:allow-purchased="true"
						@switchPurchased="switchPurchased"
						@editItem="editItem"
					/>
				</template>
			</Table>
		</div>

		<Loader v-else class="text-gray-900 dark:text-gray-100" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';

import Loader from '@/components/icons/Loader.vue';
import Header from '@/components/Header.vue';
import Table from '@/components/Table.vue';
import TableRow from '@/components/TableRow.vue';
import TableHeading from '@/components/TableHeading.vue';

import { GiftItem } from '@/types/gift-item';
import { User } from '@/types/user';

export interface Group {
	user: User;
	elements: GiftItem[];
}

export interface Grouped {
	[key: string]: Group;
}

function groupBy(item: GiftItem) {
	return item.recipients[0];
}

export default defineComponent({
	components: { Loader, Header, Table, TableRow, TableHeading },
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
			this.togglePurchased({ item, purchased });
		},
		sortObj(obj: Grouped) {
			return Object.keys(obj).sort((a, b) => {
				var nameA = obj[a].user.name.toUpperCase();
				var nameB = obj[b].user.name.toUpperCase();

				if (nameA < nameB) return -1;
				if (nameA > nameB) return 1;

				// names must be equal
				return 0;
			});
		},
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

			return this.sortObj(grouped).map((key: string) => grouped[key]);
		},
		...mapGetters('giftItem', {
			items: 'getOverviewList',
		}),
		...mapGetters('users', {
			users: 'getUserEntities',
		}),
	},
});
</script>
