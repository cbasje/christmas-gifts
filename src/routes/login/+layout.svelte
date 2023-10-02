<script lang="ts">
	import { t } from '$lib/translations';
	import { Toaster } from 'svelte-french-toast';
	import '../styles.css';
</script>

<svelte:head>
	<title>{$t('common.title')}</title>
</svelte:head>

<div class="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<main class="w-full max-w-md space-y-8">
		<slot />
	</main>
</div>

<Toaster />
