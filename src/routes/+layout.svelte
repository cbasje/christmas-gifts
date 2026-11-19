<script lang="ts" module>
import { browser } from '$app/env';
import { play } from '@foleyjs/core';
import { tick } from 'svelte';

let isVisible = $state(false);

// Every success/error flow in the app funnels through here, so the foley cue
// plays right where the confetti flies. New mutations should call
// confetti.success()/confetti.error() rather than play() directly — see AGENTS.md.
export const confetti = {
	error: async (message: string) => {
		if (browser) play('error');
		isVisible = false;
		await tick();
		isVisible = true;
	},
	success: async (message: string) => {
		if (browser) play('success');
		isVisible = false;
		await tick();
		isVisible = true;
	},
};
</script>

<script lang="ts">
import type { LayoutProps } from './$types';
import { confetti as showConfetti } from '@neoconfetti/svelte';

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
