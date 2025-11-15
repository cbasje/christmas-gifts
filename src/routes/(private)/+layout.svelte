<script lang="ts">
import Menu from '$components/Menu.svelte';
import { m } from '$lib/paraglide/messages';
import type { LayoutProps } from './$types';

let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
    <title>{m.title()}</title>
</svelte:head>

<Menu />

{@render children()}
