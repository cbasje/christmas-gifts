<script lang="ts">
	import { t } from '$lib/translations';
	import { Toaster } from 'svelte-french-toast';
	import '../styles.css';
	import type { LayoutServerData } from './$types';
	import Footer from './Footer.svelte';
	import Navigation from './Navigation.svelte';
	import { pwaInfo } from 'virtual:pwa-info';

	export let data: LayoutServerData;

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	<title>{$t('common.title')}</title>
	{@html webManifestLink}
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
