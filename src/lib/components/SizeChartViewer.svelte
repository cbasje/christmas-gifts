<script lang="ts">
import type { UserSizes } from '$lib/db/models';
import { t } from '$lib/translations';
import { createTabs, melt } from '@melt-ui/svelte';
import SizeChart from './size-chart/SizeChart.svelte';
import SizeChartEmpty from './size-chart/SizeChartEmpty.svelte';
import SizeChartSimple from './size-chart/SizeChartSimple.svelte';
import SizeChartSimpleEmpty from './size-chart/SizeChartSimpleEmpty.svelte';

export let sizes: UserSizes;
let categories = ['Simple', 'Advanced'];

const {
	elements: { root, list, content, trigger },
} = createTabs();
</script>

<div class="mx-auto w-full max-w-xl">
	<div use:melt={$root}>
		<div use:melt={$list} class="flex space-x-1 rounded-xl bg-primary-900/20 p-1">
			{#each categories as category (category)}
				<button use:melt={$trigger(category)} class="trigger">
					{category}
				</button>
			{/each}
		</div>
	</div>
</div>

<div use:melt={$content('Simple')} class="content-panel">
	<!-- MARK: Simple SizeChart -->
	<SizeChartSimpleEmpty />
	<SizeChartSimple />

	<div class="content-value right-[68.07%] top-[36.13%]">
		<span>{$t('sizeChart.areas.simple.top')}</span>
		<div>{sizes?.simple?.top ?? '?'}</div>
	</div>
	<div class="content-value right-[68.07%] top-[68.86%]">
		<span>{$t('sizeChart.areas.simple.bottom')}</span>
		<div>{sizes?.simple?.bottom ?? '?'}</div>
	</div>
	<div class="content-value right-[68.07%] top-[90.34%]">
		<span>{$t('sizeChart.areas.simple.shoe')}</span>
		<div>{sizes?.simple?.shoe ?? '?'}</div>
	</div>
</div>

<div use:melt={$content('Advanced')} class="content-panel">
	<!-- MARK: Advanced SizeChart -->
	<SizeChartEmpty />
	<SizeChart />

	<div class="content-value right-[68.07%] top-[17.26%]">
		<span>{$t('sizeChart.areas.advanced.head')}</span>
		<div>{sizes?.advanced?.head ?? '?'}</div>
	</div>
	<div class="content-value right-[68.07%] top-[57.02%]">
		<span>{$t('sizeChart.areas.advanced.sleeve')}</span>
		<div>{sizes?.advanced?.sleeve ?? '?'}</div>
	</div>
	<div class="content-value left-[68.47%] top-[35.53%]">
		<span>{$t('sizeChart.areas.advanced.chest')}</span>
		<div>{sizes?.advanced?.chest ?? '?'}</div>
	</div>
	<div class="content-value left-[68.47%] top-[44.77%]">
		<span>{$t('sizeChart.areas.advanced.waist')}</span>
		<div>{sizes?.advanced?.waist ?? '?'}</div>
	</div>
	<div class="content-value left-[68.47%] top-[52.40%]">
		<span>{$t('sizeChart.areas.advanced.hip')}</span>
		<div>{sizes?.advanced?.hip ?? '?'}</div>
	</div>
	<div class="content-value left-[68.47%] top-[87.94%]">
		<span>{$t('sizeChart.areas.advanced.inseam')}</span>
		<div>{sizes?.advanced?.inseam ?? '?'}</div>
	</div>
</div>

<style lang="postcss">
	.content-panel {
		@apply relative mx-auto w-full max-w-4xl text-gray-800 dark:text-gray-100;

		:global(.content-value) {
			@apply md:absolute md:w-[14ch] md:-translate-y-10;
		}
		span {
			@apply text-sm font-medium text-gray-600 dark:text-gray-300;
		}
	}

	.trigger {
		@apply w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-primary-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2;

		&[data-state='active'] {
			@apply bg-white shadow;
		}
		&[data-state='inactive'] {
			@apply text-primary-100 hover:bg-white/[0.12] hover:text-white;
		}
	}
</style>
