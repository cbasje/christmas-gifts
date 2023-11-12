<script lang="ts">
	import { t } from '$lib/translations';
	import Header from '../Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Header>
	{$t('users.title')}

	<svelte:fragment slot="subtitle">
		{$t('users.description')}
	</svelte:fragment>
</Header>

<ul>
	{#each data.users as user}
		<li>{user.name}</li>
	{/each}
</ul>
