<script lang="ts">
	import AddButton from '$lib/components/AddButton.svelte';
	import SizeChartPopup from '$lib/components/SizeChartPopup.svelte';
	import { t } from '$lib/translations';
	import { Badge } from '$lib/components/ui/badge';
	import Header from '../Header.svelte';
	import Table from '../Table.svelte';
	import TableContainer from '../TableContainer.svelte';
	import type { PageData } from './$types';
	import { Switch } from '$lib/components/ui/switch';

	export let data: PageData;

	let showPartner = false;
</script>

<Header>
	{$t('ideas.title')}

	<svelte:fragment slot="subtitle">
		{$t('ideas.description')}
	</svelte:fragment>
</Header>

<div class="container flex w-full justify-end gap-3 px-3">
	<label for="show-partner" class="text-gray-500">{$t('ideas.showPartner')}</label>
	<Switch id="show-partner" bind:checked={showPartner} />
</div>

{#if data.ideaList}
	<TableContainer>
		{#each Object.keys(data.ideaList) as id (id)}
			{@const items =
				data.ideaList[id].filter(
					(item) =>
						item.giftedById === data.user.id ||
						(showPartner && item.giftedById === data.user.partnerId)
				) ?? undefined}
			{@const recipient = data.users.find((u) => u.id === id)}
			<Table
				showBgColor={false}
				{items}
				allowPurchased
				allowEdit
				isCollapsable
				hasSummary
				pageData={data}
			>
				<svelte:fragment slot="title">
					<Badge title={recipient?.name ?? ''} hue={recipient?.hue ?? 145} />

					<SizeChartPopup
						name={recipient?.name ?? ''}
						sizes={recipient?.sizes ?? undefined}
					/>
				</svelte:fragment>
			</Table>
		{/each}
	</TableContainer>
{/if}

<AddButton {...data} />
