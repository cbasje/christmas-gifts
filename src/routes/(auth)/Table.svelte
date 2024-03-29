<script lang="ts">
	import { formatPrice, getPriceNumber, sum } from '$lib/utils/price';
	import type { PageData as OverviewData } from '../../routes/(auth)/$types';
	import type { PageData as IdeasData } from '../../routes/(auth)/ideas/$types';
	import type { PageData as WishData } from '../../routes/(auth)/wish-list/$types';
	import TableHeading from './TableHeading.svelte';
	import TableRow from './TableRow.svelte';

	export let items:
		| IdeasData['ideaList'][string]
		| WishData['wishList']
		| OverviewData['overviewList'][string];
	export let pageData: IdeasData | WishData | undefined = undefined;

	export let headerHue: number | undefined = undefined;
	export let allowPurchased = false;
	export let allowEdit = false;
	export let isCollapsable = false;
	export let hasSummary = false;
	export let showBgColor = true;

	let isCollapsed = !!isCollapsable;
</script>

<table
	class="table border-collapse overflow-hidden rounded-lg bg-white shadow hover:shadow-lg dark:bg-gray-800
        {!isCollapsed ? 'w-full' : 'w-min sm:w-full'}
        {items.every((item) => 'purchased' in item && item.purchased) ? 'opacity-30' : ''}"
	aria-label="Table"
>
	<TableHeading
		{headerHue}
		{showBgColor}
		{allowPurchased}
		{allowEdit}
		{isCollapsable}
		bind:isCollapsed
	>
		<svelte:fragment slot="title">
			<slot name="title" />
		</svelte:fragment>

		<svelte:fragment slot="summary">
			{#if hasSummary}
				<span class="text-sm">
					<span class="text-xs uppercase opacity-75">sum</span>
					{formatPrice(sum(items?.map((i) => getPriceNumber(i.price)) ?? []))}
				</span>
				<span class="text-sm">
					<span class="text-xs uppercase opacity-75">purchased</span>
					{formatPrice(
						sum(
							items
								?.filter((i) => !('purchased' in i) || i.purchased)
								.map((i) => getPriceNumber(i.price)) ?? []
						)
					)}
				</span>
			{/if}
		</svelte:fragment>
	</TableHeading>

	{#if items !== null && items.length > 0 && (!isCollapsable || !isCollapsed)}
		<tbody>
			{#each items as item (item.id)}
				<TableRow
					{item}
					{allowPurchased}
					{allowEdit}
					formData={pageData?.formData}
					currentUserGroups={pageData?.currentUserGroups}
					users={pageData !== undefined && 'users' in pageData
						? pageData.users
						: undefined}
				/>
			{/each}
		</tbody>
	{/if}
</table>

<style lang="postcss">
	.table {
		table-layout: fixed;
	}
	@media (max-width: 640px) {
		.table {
			width: max(calc(100vw - 1.5rem), 100%);
		}
	}
</style>
