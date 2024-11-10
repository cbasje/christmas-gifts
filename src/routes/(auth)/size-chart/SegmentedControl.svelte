<script lang="ts">
import { createTabs, melt } from '@melt-ui/svelte';

type TabType = 'Simple' | 'Advanced';

export let selectedTab: TabType;
export let categories: TabType[];

const {
	elements: { root, list, trigger },
	states: { value },
} = createTabs({
	onValueChange: ({ next }) => {
		return (selectedTab = next as TabType);
	},
	defaultValue: selectedTab,
});
</script>

<div use:melt={$root}>
	<div use:melt={$list} class="flex space-x-1 rounded-xl bg-primary-900/20 p-1">
		{#each categories as category (category)}
			<button
				use:melt={$trigger(category)}
				class="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-primary-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2 {$value ===
				category
					? 'bg-white shadow'
					: 'text-primary-100 hover:bg-white/[0.12] hover:text-white'}"
			>
				{category}
			</button>
		{/each}
	</div>
</div>
