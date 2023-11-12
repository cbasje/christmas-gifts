<script lang="ts">
	import { t } from '$lib/translations';
	import { formatPrice } from '$lib/utils/price';
	import Icon from '@iconify/svelte';
	import Badge from './Badge.svelte';

	export let title = '';
	export let headerHue: number | undefined;
	export let allowPurchased = false;
	export let allowEdit = false;
	export let isCollapsable = false;
	export let isCollapsed = true;
	export let hasSummary = false;
	export let showBgColor = true;
	export let summaryNumber = 0;

	const toggleCollapsed = () => {
		isCollapsed = !isCollapsed;
	};
</script>

{#if title}
	<caption>
		<button
			class="flex w-full cursor-pointer select-none items-center justify-between whitespace-nowrap px-6 py-3 {showBgColor
				? `show-bg-color`
				: 'bg-gray-200 dark:bg-gray-700'}"
			style="--color-hue: {headerHue}"
			on:click={toggleCollapsed}
			aria-label="Table Header"
		>
			<Badge {title} hue={headerHue ?? 145} />

			<div class="flex items-center gap-3 text-gray-600 dark:text-gray-300">
				{#if hasSummary}
					<span class="text-sm">
						<span class="text-xs uppercase opacity-75">sum</span>
						{formatPrice(summaryNumber)}
					</span>
				{/if}
				{#if isCollapsable}
					<Icon
						icon="lucide:chevron-down"
						class="block h-6 w-6 transition-transform duration-200 {!isCollapsed
							? '-rotate-180'
							: 'rotate-0'}"
					/>
				{/if}
			</div>
		</button>
	</caption>
{/if}

<thead>
	<tr
		class=" text-gray-600 dark:text-gray-300 {isCollapsed && title && 'hidden'} {showBgColor
			? `show-bg-color`
			: 'bg-gray-200 dark:bg-gray-700'}"
		style="--color-hue: {headerHue}"
	>
		<th scope="col" class="w-36">{$t('common.item.pic')}</th>
		<th scope="col">
			{$t('common.item.name')} + {$t('common.item.notes')}
		</th>
		<th scope="col" class="w-[6rem] sm:w-[10%]">
			{$t('common.item.price')}
		</th>
		<th scope="col" class="w-[10rem] sm:w-[20%]">
			{$t('common.item.link')}
		</th>
		{#if allowPurchased}
			<th scope="col" class="w-[8rem] sm:w-[10%]">
				{$t('common.table.purchased')}
			</th>
		{/if}
		{#if allowEdit}
			<th scope="col" class="w-[8rem] sm:w-[10%]">
				<span class="sr-only">
					{$t('common.table.actions')}
				</span>
			</th>
		{/if}
	</tr>
</thead>

<style lang="postcss">
	th {
		@apply relative px-6 py-3 text-left text-xs font-medium uppercase tracking-wider;
	}

	.show-bg-color {
		color: var(--color-12);
		background-color: var(--color-1);
	}
	@media (prefers-color-scheme: dark) {
		.show-bg-color {
			color: var(--color-1);
			background-color: var(--color-12);
		}
	}
</style>
