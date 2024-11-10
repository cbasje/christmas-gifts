<script lang="ts">
import { page } from '$app/stores';
import Input from '$lib/components/Input.svelte';
import { t } from '$lib/translations';
import Icon from '@iconify/svelte';
import { createTabs, melt } from '@melt-ui/svelte';
import toast from 'svelte-french-toast';
import { superForm } from 'sveltekit-superforms/client';
import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
import SizeChart from '$lib/components/size-chart/SizeChart.svelte';
import SizeChartEmpty from '$lib/components/size-chart/SizeChartEmpty.svelte';
import SizeChartSimple from '$lib/components/size-chart/SizeChartSimple.svelte';
import SizeChartSimpleEmpty from '$lib/components/size-chart/SizeChartSimpleEmpty.svelte';
import Header from '../Header.svelte';
import type { PageData } from './$types';

export let data: PageData;

const categories = ['Simple', 'Advanced'];

const {
	elements: { root, list, content, trigger },
} = createTabs();

const { form, enhance, constraints, errors, tainted } = superForm(data.form, {
	dataType: 'json',
	resetForm: false,
	onResult: ({ result }) => {
		if ('data' in result && result.data?.form?.valid) {
			toast.success('Saved your sizes successfully!');
		} else {
			toast.error('Saving sizes was not successful!');
		}
	},
	onError: ({ message }) => {
		toast.error(`Saving sizes was not successful! Reason: ${message}`);
		console.error(message);
	},
});

$: showDebug = $page.url.searchParams.get('d') === 'true';
</script>

<form method="POST" action="?/updateSizes" class="flex w-full flex-col" use:enhance>
	<Header>
		{$t('sizeChart.title')}

		<svelte:fragment slot="subtitle">
			{$t('sizeChart.description')}
		</svelte:fragment>

		<svelte:fragment slot="buttons">
			<button
				type="submit"
				class="flex items-center justify-center gap-3 self-end rounded-md border border-primary-700 bg-primary-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 enabled:hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={$tainted === undefined}
			>
				<Icon icon="solar:diskette-line-duotone" class="square-4" />
				<span>{$t('sizeChart.submit')}</span>
			</button>
		</svelte:fragment>
	</Header>

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

		<Input
			type="text"
			name="top"
			label={$t('sizeChart.areas.simple.top')}
			bind:value={$form.simple.top}
			placeholder="S, M, L, etc."
			messages={$errors.simple?.top}
			aria-invalid={$errors.simple?.top ? 'true' : undefined}
			outer-class="content-value right-[68.07%] top-[33.13%]"
			{...$constraints.simple?.top}
		/>
		<Input
			type="text"
			name="bottom"
			label={$t('sizeChart.areas.simple.bottom')}
			bind:value={$form.simple.bottom}
			placeholder="W33 L36, etc."
			messages={$errors.simple?.bottom}
			aria-invalid={$errors.simple?.bottom ? 'true' : undefined}
			outer-class="content-value right-[68.07%] top-[65.86%]"
			{...$constraints.simple?.bottom}
		/>
		<Input
			type="text"
			name="show"
			label={$t('sizeChart.areas.simple.shoe')}
			bind:value={$form.simple.shoe}
			placeholder="One big foot"
			messages={$errors.simple?.bottom}
			aria-invalid={$errors.simple?.bottom ? 'true' : undefined}
			outer-class="content-value right-[68.07%] top-[87.34%]"
			{...$constraints.simple?.shoe}
		/>
	</div>

	<div use:melt={$content('Advanced')} class="content-panel">
		<!-- MARK: Advanced SizeChart -->
		<SizeChartEmpty />
		<SizeChart />

		<Input
			type="text"
			name="head"
			label={$t('sizeChart.areas.advanced.head')}
			bind:value={$form.advanced.head}
			placeholder="17 inch, etc."
			messages={$errors.advanced?.head}
			aria-invalid={$errors.advanced?.head ? 'true' : undefined}
			outer-class="content-value right-[68.07%] top-[14.26%]"
			{...$constraints.advanced?.head}
		/>
		<Input
			type="text"
			name="sleeve"
			label={$t('sizeChart.areas.advanced.sleeve')}
			bind:value={$form.advanced.sleeve}
			placeholder="XL, 37 cm, etc."
			messages={$errors.advanced?.sleeve}
			aria-invalid={$errors.advanced?.sleeve ? 'true' : undefined}
			outer-class="content-value right-[68.07%] top-[54.02%]"
			{...$constraints.advanced?.sleeve}
		/>
		<Input
			type="text"
			name="chest"
			label={$t('sizeChart.areas.advanced.chest')}
			bind:value={$form.advanced.chest}
			placeholder="239 mm, etc."
			messages={$errors.advanced?.chest}
			aria-invalid={$errors.advanced?.chest ? 'true' : undefined}
			outer-class="content-value left-[68.47%] top-[32.53%]"
			{...$constraints.advanced?.chest}
		/>
		<Input
			type="text"
			name="waist"
			label={$t('sizeChart.areas.advanced.waist')}
			bind:value={$form.advanced.waist}
			placeholder="M, 0.5 m, 0.02 mile, etc."
			messages={$errors.advanced?.waist}
			aria-invalid={$errors.advanced?.waist ? 'true' : undefined}
			outer-class="content-value left-[68.47%] top-[41.77%]"
			{...$constraints.advanced?.waist}
		/>
		<Input
			type="text"
			name="hip"
			label={$t('sizeChart.areas.advanced.hip')}
			bind:value={$form.advanced.hip}
			placeholder="2 baguettes, etc."
			messages={$errors.advanced?.hip}
			aria-invalid={$errors.advanced?.hip ? 'true' : undefined}
			outer-class="content-value left-[68.47%] top-[49.40%]"
			{...$constraints.advanced?.hip}
		/>
		<Input
			type="text"
			name="inseam"
			label={$t('sizeChart.areas.advanced.inseam')}
			bind:value={$form.advanced.inseam}
			placeholder="0.5 Sebastiaan, etc."
			messages={$errors.advanced?.inseam}
			aria-invalid={$errors.advanced?.inseam ? 'true' : undefined}
			outer-class="content-value left-[68.47%] top-[84.94%]"
			{...$constraints.advanced?.inseam}
		/>
	</div>
</form>
<SuperDebug display={showDebug} data={form} />

<style lang="postcss">
	.content-panel {
		@apply relative mx-auto w-full max-w-4xl;

		:global(.content-value) {
			@apply md:absolute md:w-[17ch] md:-translate-y-10;
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
