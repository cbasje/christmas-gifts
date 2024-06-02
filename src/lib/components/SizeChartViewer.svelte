<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import type { UserSizes } from '$lib/db/schema/user';
	import { t } from '$lib/translations';
	import SizeChart from './size-chart/SizeChart.svelte';
	import SizeChartEmpty from './size-chart/SizeChartEmpty.svelte';
	import SizeChartSimple from './size-chart/SizeChartSimple.svelte';
	import SizeChartSimpleEmpty from './size-chart/SizeChartSimpleEmpty.svelte';

	export let sizes: UserSizes;
</script>

<Tabs.Root value="simple">
	<Tabs.List>
		<Tabs.Trigger value="simple">Simple</Tabs.Trigger>
		<Tabs.Trigger value="advanced">Advanced</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="account">
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
	</Tabs.Content>
	<Tabs.Content value="advanced">
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
	</Tabs.Content>
</Tabs.Root>
