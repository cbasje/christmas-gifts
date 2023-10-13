<script lang="ts">
	import { t } from '$lib/translations';
	import Header from '../Header.svelte';
	import { createTabs, melt } from '@melt-ui/svelte';
	import SizeChartSimpleEmpty from './SizeChartSimpleEmpty.svelte';
	import SizeChartEmpty from './SizeChartEmpty.svelte';
	import SizeChartSimple from './SizeChartSimple.svelte';
	import SizeChart from './SizeChart.svelte';
	import Input from '$lib/components/Input.svelte';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { page } from '$app/stores';

	export let data: PageData;

	let categories = ['Simple', 'Advanced'];

	const {
		elements: { root, list, content, trigger }
	} = createTabs();

	const { form, enhance, constraints, errors, tainted } = superForm(data.form, {
		dataType: 'json'
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
			<Input
				type="submit"
				label={$t('sizeChart.submit')}
				icon="lucide:save"
				outer-class="self-end"
				icon-class="h-4 w-4 text-primary-400 group-hover:text-primary-300 [&>svg]:w-full [&>svg]:h-full"
				input-class="group relative flex justify-center item-center gap-3 py-2 px-4 border border-primary-700 text-sm font-medium rounded-md text-white bg-primary-600 enabled:hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={$tainted === undefined}
			/>
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

	<div use:melt={$content('Simple')} class="relative mx-auto w-full max-w-4xl">
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
			outer-class="md:absolute right-[68.07%] top-[33.13%] md:w-[17ch] md:-translate-y-10"
			label-class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
			message-class="mt-1 block w-full text-sm text-danger-400"
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
			outer-class="md:absolute right-[68.07%] top-[65.86%] md:w-[17ch] md:-translate-y-10"
			label-class="block text-sm font-medium text-gray-70 dark:text-gray-300"
			input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
			message-class="mt-1 block w-full text-sm text-danger-400"
			{...$constraints.simple?.bottom}
		/>
		<!-- FIXME:  -->
		<Input
			type="text"
			name="show"
			label={$t('sizeChart.areas.simple.shoe')}
			bind:value={$form.simple.shoe}
			placeholder="One big foot"
			messages={$errors.simple?.bottom}
			aria-invalid={$errors.simple?.bottom ? 'true' : undefined}
			outer-class="md:absolute right-[68.07%] top-[87.34%] md:w-[17ch] md:-translate-y-10"
			label-class="block text-sm font-medium text-gray-70 dark:text-gray-300"
			input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
			message-class="mt-1 block w-full text-sm text-danger-400"
			{...$constraints.simple?.shoe}
		/>
	</div>

	<div use:melt={$content('Advanced')} class="relative mx-auto w-full max-w-4xl">
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
			outer-class="md:absolute right-[68.07%] top-[14.26%] md:w-[17ch] md:-translate-y-10"
			label-class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
			message-class="mt-1 block w-full text-sm text-danger-400"
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
			outer-class="md:absolute right-[68.07%] top-[54.02%] md:w-[17ch] md:-translate-y-10"
			label-class="block text-sm font-medium text-gray-70 dark:text-gray-300"
			input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
			message-class="mt-1 block w-full text-sm text-danger-400"
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
			outer-class="md:absolute left-[68.47%] top-[32.53%] md:w-[17ch] md:-translate-y-10"
			label-class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
			message-class="mt-1 block w-full text-sm text-danger-400"
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
			outer-class="md:absolute left-[68.47%] top-[41.77%] md:w-[17ch] md:-translate-y-10"
			label-class="block text-sm font-medium text-gray-70 dark:text-gray-300"
			input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
			message-class="mt-1 block w-full text-sm text-danger-400"
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
			outer-class="md:absolute left-[68.47%] top-[49.40%] md:w-[17ch] md:-translate-y-10"
			label-class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
			message-class="mt-1 block w-full text-sm text-danger-400"
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
			outer-class="md:absolute left-[68.47%] top-[84.94%] md:w-[17ch] md:-translate-y-10"
			label-class="block text-sm font-medium text-gray-70 dark:text-gray-300"
			input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
			message-class="mt-1 block w-full text-sm text-danger-400"
			{...$constraints.advanced?.inseam}
		/>
	</div>
</form>
<SuperDebug display={showDebug} data={form} />

<style lang="postcss">
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
