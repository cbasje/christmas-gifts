<script lang="ts">
	import { t } from '$lib/translations';
	import type { Color } from '$lib/types';
	import type { PageData } from './$types';
	import Header from './Header.svelte';
	import Table from './Table.svelte';
	import TableContainer from './TableContainer.svelte';

	const headerColors: Color[] = [
		'pink',
		'purple',
		'indigo',
		'sky',
		'teal',
		'green',
		'yellow',
		'orange'
	];

	export let data: PageData;
</script>

<Header>
	{$t('overview.title')}

	<svelte:fragment slot="subtitle">
		{$t('overview.description')}
	</svelte:fragment>
</Header>

{#if data.overviewList}
	<TableContainer>
		{#each Object.keys(data.overviewList) as id, index (id)}
			{@const items = data.overviewList[id]}
			<Table
				title={items.at(0)?.recipient.name ?? undefined}
				headerColor={headerColors[index]}
				{items}
				allowPurchased
				allowEdit
				isCollapsable
			/>
		{/each}
	</TableContainer>
{/if}
