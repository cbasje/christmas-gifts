<script lang="ts">
	import AddButton from '$lib/components/AddButton.svelte';
	import { t } from '$lib/translations';
	import { createSwitch, melt } from '@melt-ui/svelte';
	import Header from '../Header.svelte';
	import Table from '../Table.svelte';
	import TableContainer from '../TableContainer.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const {
		elements: { root, input },
		states: { checked: showPartner }
	} = createSwitch();
</script>

<Header>
	{$t('ideas.title')}

	<svelte:fragment slot="subtitle">
		{$t('ideas.description')}
	</svelte:fragment>
</Header>

<div class="container flex w-full justify-end gap-3 px-3">
	<label for="show-partner" class="text-gray-500">{$t('ideas.showPartner')}</label>
	<button
		use:melt={$root}
		id="show-partner"
		class="{$showPartner
			? 'bg-success-500'
			: 'bg-gray-200 dark:bg-gray-400'} relative inline-flex h-6 w-11 items-center rounded-full"
	>
		<span
			class="{$showPartner
				? 'translate-x-6'
				: 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-100"
		/>
	</button>

	<input use:melt={$input} />
</div>

{#if data.ideaList}
	<TableContainer>
		{#each Object.keys(data.ideaList) as id, index (id)}
			{@const items = data.ideaList[id]}
			<Table
				title={items.at(0)?.recipient.name ?? undefined}
				headerHue={items.at(0)?.recipient.hue ?? undefined}
				showBgColor={false}
				items={items.filter(
					(item) =>
						item.giftedById != null &&
						(item.giftedById === data.user.id ||
							($showPartner && item.giftedById === data.user.partnerId))
				) ?? undefined}
				allowPurchased
				allowEdit
				isCollapsable
				hasSummary
				pageData={data}
			/>
		{/each}
	</TableContainer>
{/if}

<AddButton {...data} />
