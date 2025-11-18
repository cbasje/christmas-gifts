<script lang="ts" module>
let isVisible = $state(false);

export const confetti = {
	error: async (message: string) => {
		isVisible = false;
		await tick();
		isVisible = true;
	},
	success: async (message: string) => {
		isVisible = false;
		await tick();
		isVisible = true;
	},
};
</script>

<script lang="ts">
import type { LayoutProps } from './$types';
import { confetti as showConfetti } from '@neoconfetti/svelte';
import { tick } from 'svelte';

import '../lib/styles/global.css';

let { children }: LayoutProps = $props();
</script>

{#if isVisible}
    <aside aria-hidden="true" class="confetti-wrapper">
        <div use:showConfetti></div>
    </aside>
{/if}

{@render children()}

<style>
    .confetti-wrapper {
        display: flex;
        justify-content: center;
    }
</style>
