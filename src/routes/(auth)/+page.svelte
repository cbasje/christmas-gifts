<script lang="ts">
	import SizeChartPopup from '$lib/components/SizeChartPopup.svelte';
	import { t } from '$lib/translations';
	import type { PageData } from './$types';
	import Badge from './Badge.svelte';
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
				headerHue={items.at(0)?.recipient.hue ?? undefined}
				{items}
				allowPurchased
				isCollapsable
			>
				<svelte:fragment slot="title">
					<Badge
						title={items.at(0)?.recipient.name ?? ''}
						hue={items.at(0)?.recipient.hue ?? 145}
					/>

					<SizeChartPopup
						name={items.at(0)?.recipient.name ?? ''}
						hue={items.at(0)?.recipient.hue ?? 145}
					/>
				</svelte:fragment>
			</Table>
		{/each}
	</TableContainer>
{/if}
