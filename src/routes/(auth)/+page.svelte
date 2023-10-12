<script lang="ts">
	import { t } from '$lib/translations';
	import type { PageData } from './$types';
	import Header from './Header.svelte';
	import Table from './Table.svelte';
	import TableContainer from './TableContainer.svelte';

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
		{#each Object.keys(data.overviewList) as id (id)}
			{@const items = data.overviewList[id]}
			<Table
				title={items.at(0)?.recipient.name ?? undefined}
				headerHue={items.at(0)?.recipient.hue ?? undefined}
				{items}
				allowPurchased
				allowEdit
				isCollapsable
			/>
		{/each}
	</TableContainer>
{/if}
