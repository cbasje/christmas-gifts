<script lang="ts">
	// import { remark } from "remark";
	// import remarkParse from "remark-parse";
	// import remarkRehype from "remark-rehype";
	// // import rehypeFormat from "rehype-format";
	// import rehypeSanitize from "rehype-sanitize";
	// import rehypeStringify from "rehype-stringify";

	// const slots = useSlots();
	// const html = ref("");

	// onMounted(async () => {
	//     const defaultSlot = slots.default ? slots.default() : undefined;

	//     if (!defaultSlot || defaultSlot.length === 0 || !defaultSlot[0].children)
	//         return;

	//     const markdownToHtml = await remark()
	//         .use(remarkParse)
	//         .use(remarkRehype)
	//         .use(rehypeSanitize)
	//         .use(rehypeStringify)
	//         .process(defaultSlot[0].children.toString());

	//     html.value = markdownToHtml.value.toString();
	// });
</script>

<section class="{$$props.class} prose prose-sm h-auto">
	<slot />
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
