<template>
	<article
		class="
			prose prose-sm
			sm:prose
			lg:prose-lg
			xl:prose-xl
			dark:text-white
            mx-auto
		"
		v-html="compiledMarkdown"
	/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		markdown: {
			type: String,
			required: true,
		},
	},
	computed: {
		compiledMarkdown() {
			return this.markdown;
		},
	},
});
</script>

<style>
.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
	@apply dark:text-gray-100;
}
.prose p,
.prose li {
	@apply dark:text-gray-300;
}
.prose a {
    @apply text-amber-600 dark:text-amber-500
}
</style>
