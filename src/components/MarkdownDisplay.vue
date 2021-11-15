<template>
	<p class="prose prose-sm" v-html="compiledMarkdown" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import sanitizeHtml from 'sanitize-html';
import marked from 'marked';

export default defineComponent({
	props: {
		markdown: {
			type: String,
			required: true,
		},
	},
	computed: {
		compiledMarkdown() {
			const defaultOptions = {
				allowedTags: ['a'],
				allowedAttributes: {
					a: ['href'],
				},
			};

			const html = marked(this.markdown);
			return sanitizeHtml(html, defaultOptions);
			// return html;
		},
	},
});
</script>

<style>
.prose a {
	@apply cursor-pointer font-normal text-cyan-500 hover:text-cyan-600;
}
</style>
