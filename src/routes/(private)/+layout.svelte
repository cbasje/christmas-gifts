<script lang="ts">
import Menu from '$components/Menu.svelte';
import type { LayoutProps } from './$types';

let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
    <title>Christmas</title>
</svelte:head>

<Menu />

{@render children()}
