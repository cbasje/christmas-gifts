<script lang="ts">
	import { t } from '$lib/translations';
	import { Toaster } from 'svelte-french-toast';
	import '../styles.postcss';
	import type { LayoutServerData } from './$types';
	import Footer from './Footer.svelte';
	import Navigation from './Navigation.svelte';

	export let data: LayoutServerData;
</script>

<svelte:head>
	<title>{$t('common.title')}</title>
</svelte:head>

<div>
	<Navigation {...data} />

	<main class="p-3 sm:flex sm:flex-col sm:items-center">
		<slot />
	</main>

	<footer>
		<Footer />
	</footer>
</div>

<Toaster />
