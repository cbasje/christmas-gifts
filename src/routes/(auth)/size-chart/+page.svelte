<script lang="ts">
	import SizeChart from '$lib/components/size-chart/SizeChart.svelte';
	import SizeChartEmpty from '$lib/components/size-chart/SizeChartEmpty.svelte';
	import SizeChartSimple from '$lib/components/size-chart/SizeChartSimple.svelte';
	import SizeChartSimpleEmpty from '$lib/components/size-chart/SizeChartSimpleEmpty.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Tabs from '$lib/components/ui/tabs';
	import { UserSizesSchema } from '$lib/db/schema/user';
	import { t } from '$lib/translations';
	import Icon from '@iconify/svelte';
	import toast from 'svelte-french-toast';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import Header from '../Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, enhance, constraints, errors, tainted } = superForm(data.form, {
		validators: zodClient(UserSizesSchema),
		dataType: 'json',
		resetForm: false,
		onResult: ({ result }) => {
			if ('data' in result && result.data?.form?.valid) {
				toast.success(`Saved your sizes successfully!`);
			} else {
				toast.error(`Saving sizes was not successful!`);
			}
		},
		onError: ({ result }) => {
			toast.error(`Saving sizes was not successful! Reason: ${result?.error.message}`);
		}
	});
</script>

<form method="POST" action="?/updateSizes" class="flex w-full flex-col" use:enhance>
	<Header>
		{$t('sizeChart.title')}

		<svelte:fragment slot="subtitle">
			{$t('sizeChart.description')}
		</svelte:fragment>

		<svelte:fragment slot="buttons">
			<Button type="submit" disabled={$tainted === undefined}>
				<Icon icon="ph:floppy-disk-duotone" class="square-4" />
				<span>{$t('sizeChart.submit')}</span>
			</Button>
		</svelte:fragment>
	</Header>

	<Tabs.Root value="simple" class="w-[400px]">
		<Tabs.List>
			<Tabs.Trigger value="simple">Simple</Tabs.Trigger>
			<Tabs.Trigger value="advanced">Advanced</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="simple">
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
		</Tabs.Content>
		<Tabs.Content value="advanced">
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
		</Tabs.Content>
	</Tabs.Root>
</form>
