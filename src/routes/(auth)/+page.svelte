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
			{@const recipient = data.users.find((u) => u.id === id)}
			<Table headerHue={recipient?.hue ?? undefined} {items} allowPurchased isCollapsable>
				<svelte:fragment slot="title">
					<Badge title={recipient?.name ?? ''} hue={recipient?.hue ?? 145} />

					<SizeChartPopup
						name={recipient?.name ?? ''}
						hue={recipient?.hue ?? 145}
						sizes={recipient?.sizes}
					/>
				</svelte:fragment>
			</Table>
		{/each}
	</TableContainer>
{/if}
