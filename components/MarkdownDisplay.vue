<script lang="ts" setup>
// import sanitizeHtml from 'sanitize-html';
// import marked from 'marked';

export interface Props {
    markdown: string;
}

const props = withDefaults(defineProps<Props>(), {
    markdown: "",
});

const compiledMarkdown = computed(() => {
    const defaultOptions = {
        allowedTags: ["a"],
        allowedAttributes: {
            a: ["href"],
        },
    };

    // const html = marked(props.markdown);
    // return sanitizeHtml(html, defaultOptions);
    return props.markdown;
});
</script>

<template>
    <p class="prose prose-sm" v-html="compiledMarkdown" />
</template>

<style>
.prose a {
    @apply cursor-pointer font-normal text-cyan-500 hover:text-cyan-600;
}
</style>
