<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/translations';
	import Header from './(auth)/Header.svelte';
	import './styles.postcss';

	const formatEnd = (value: Date) => {
		const formatter = new Intl.RelativeTimeFormat($page.data.locale);

		const minutes = (value.valueOf() - Date.now()) / 1000 / 60;
		if (minutes < 60) return formatter.format(Math.round(minutes), 'minute');
		else return formatter.format(Math.round(minutes / 60), 'hour');
	};
</script>

<div class="wrapper">
	<Header
		padding={false}
		style={{
			width: 'min(40ch, 100vw)'
		}}
	>
		{#if $page.status === 403}
			{$t('common.error.403')}
		{:else}
			Error {$page.status}
		{/if}

		<svelte:fragment slot="subtitle">
			{#if $page.status === 403}
				{$t('common.error.message', { message: $page.error?.message })}
			{:else}
				{$t('common.error.description')}
			{/if}
			{#if $page.error?.end}
				{$t('common.error.end', { end: formatEnd($page.error.end) })}
			{/if}
		</svelte:fragment>
	</Header>
</div>

<style lang="postcss">
	.wrapper {
		display: grid;
		place-content: center;
		height: 100vh;
		height: 100dvh;
	}
</style>
