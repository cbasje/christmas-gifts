<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';

	export let source: string;
</script>

<section class="{$$props.class} prose prose-sm h-auto">
	<SvelteMarkdown {source} />
</section>

<style lang="postcss">
	:global(.group:not(:hover)) .prose {
		height: 1lh;
		overflow: hidden;

		> :global(p) {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.prose :global(a) {
		@apply cursor-pointer font-normal  text-primary-500 hover:text-primary-700 dark:text-primary-600 dark:hover:text-primary-800;
	}
</style>
