<script lang="ts">
	import type { UserSizes } from '$lib/db/schema/user';
	import { t } from '$lib/translations';
	import Icon from '@iconify/svelte';
	import SizeChartViewer from './SizeChartViewer.svelte';
	import * as Sheet from './ui/sheet';

	export let name: string;
	export let hue: number | undefined = undefined;
	export let sizes: UserSizes | null = { simple: {}, advanced: {} };
</script>

<Sheet.Root>
	<Sheet.Trigger>
		<Icon icon="ph:ruler-duotone" class="square-4" />
		<span class="sr-only">Open size chart popup</span>
	</Sheet.Trigger>

	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>
				{$t('common.sizeChartPopup.title', { user: name ?? '' })}
			</Sheet.Title>
			<Sheet.Description>
				{$t('common.sizeChartPopup.description', { user: name ?? '' })}
			</Sheet.Description>
		</Sheet.Header>

		<SizeChartViewer {sizes} />

		<Sheet.Footer>
			<Sheet.Close>
				{$t('common.sizeChartPopup.close')}
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
