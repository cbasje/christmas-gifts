<script lang="ts">
	import { t } from '$lib/translations';
	import type { UserSizes } from '$lib/types';
	import Icon from '@iconify/svelte';
	import { createDialog, melt } from '@melt-ui/svelte';
	import { fade, scale } from 'svelte/transition';
	import SizeChartViewer from './SizeChartViewer.svelte';

	export let name: string;
	export let hue: number | undefined = undefined;
	export let sizes: UserSizes = { simple: {}, advanced: {} };

	console.log('🎄 -----------------🎄');
	console.log('🎄 ~ sizes:', sizes);
	console.log('🎄 -----------------🎄');
	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open }
	} = createDialog({
		forceVisible: true
	});
</script>

<button
	use:melt={$trigger}
	on:click|stopPropagation
	class="flex flex-row items-center justify-center gap-2 rounded-md text-sm font-semibold square-8 {hue
		? 'trigger'
		: 'bg-gray-300 dark:bg-gray-600'}"
	style={hue ? `--color-hue: ${hue}` : undefined}
>
	<Icon icon="solar:ruler-line-duotone" class="square-4" />
	<span class="sr-only">Open size chart popup</span>
</button>

<div use:melt={$portalled}>
	{#if $open}
		<div
			use:melt={$overlay}
			class="fixed inset-0 z-50 bg-black/50"
			transition:fade={{ duration: 150 }}
		/>
		<div
			class="fixed left-[50%] top-[50%] z-50 my-8 flex max-h-[85vh] w-full max-w-xl translate-x-[-50%] translate-y-[-50%] flex-col gap-4 overflow-scroll rounded-xl bg-gray-100 p-6 text-left align-middle shadow-xl dark:bg-gray-900"
			transition:scale={{
				duration: 150
			}}
			use:melt={$content}
		>
			<div>
				<h3
					use:melt={$title}
					class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100"
				>
					{$t('common.sizeChartPopup.title', { user: name ?? '' })}
				</h3>
				<p
					use:melt={$description}
					class="text-base leading-normal text-gray-500 dark:text-gray-400"
				>
					{$t('common.sizeChartPopup.description', { user: name ?? '' })}
				</p>
			</div>

			<SizeChartViewer {sizes} />

			<div class="self-end">
				<button
					use:melt={$close}
					type="button"
					class="inline-flex justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-100 dark:hover:bg-gray-700"
				>
					{$t('common.sizeChartPopup.close')}
				</button>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.trigger {
		background-color: var(--color-2);

		&:hover {
			background-color: var(--color-3);
		}
	}
	@media (prefers-color-scheme: dark) {
		.trigger {
			background-color: var(--color-11);

			&:hover {
				background-color: var(--color-10);
			}
		}
	}
</style>
