<script lang="ts" setup>
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
// import rehypeFormat from "rehype-format";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const slots = useSlots();
const html = ref("");

onMounted(async () => {
    const markdownToHtml = await remark()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(slots.default()[0].children.toString());

    html.value = markdownToHtml.value.toString();
});
</script>

<template>
    <p class="prose prose-sm" v-html="html" />
</template>

<style>
.prose a {
    @apply cursor-pointer font-normal text-primary-500 hover:text-primary-600;
}
</style>
