<script lang="ts">
	import type { Color } from '$lib/types';
	import { getPriceNumber, sum } from '$lib/utils/price';
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

	export let title: string | undefined = undefined;
	export let headerColor: Color = 'gray';
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
		{title}
		headerColor={headerColor ?? 'gray'}
		{showBgColor}
		{allowPurchased}
		{allowEdit}
		{isCollapsable}
		bind:isCollapsed
		{hasSummary}
		summaryNumber={sum(items?.map((i) => getPriceNumber(i.price)) ?? [])}
	/>

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
</style>
