<template>
	<div class="flex flex-col">
		<Header>
			Wish list

			<template #subtitle>
				This is your own wish list. You can add, remove or edit items.
			</template>
		</Header>

		<div
			v-if="items != null"
			class="min-w-full"
			aria-label="Table"
		>
			<Table>
				<template #heading>
					<TableHeading />
				</template>
				<template #body>
					<TableRow
						v-for="item in items"
						:key="item.id"
						:item="item"
						:allow-edit="true"
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

export default defineComponent({
	components: { Loader, Header, Table, TableRow, TableHeading },
	mounted() {
		this.loadGiftItems();
	},
	methods: {
		editItem(item: GiftItem) {
			alert(item.name);
		},
		...mapActions('giftItem', {
			loadGiftItems: 'loadGiftItems',
		}),
	},
	computed: {
		...mapGetters('giftItem', {
			items: 'getWishList',
		}),
	},
});
</script>
