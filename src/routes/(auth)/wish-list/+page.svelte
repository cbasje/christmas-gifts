<script lang="ts">
import AddButton from '$lib/components/AddButton.svelte';
import { t } from '$lib/translations';
import Header from '../Header.svelte';
import Table from '../Table.svelte';
import TableContainer from '../TableContainer.svelte';
import type { PageData } from './$types';

export let data: PageData;
</script>

<Header>
	{$t('wishList.title')}

	<svelte:fragment slot="subtitle">
		{$t('wishList.description')}
	</svelte:fragment>
</Header>

{#if data.wishList}
	<TableContainer>
		<Table items={data.wishList} allowEdit={true} pageData={data} showBgColor={false} />
	</TableContainer>
{/if}

<AddButton {...data} />
