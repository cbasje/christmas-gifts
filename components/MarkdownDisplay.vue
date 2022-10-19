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
    <p
        class="prose prose-sm h-auto sm:max-h-[1.4rem] sm:group-hover:max-h-[inherit]"
        v-html="html"
    />
</template>

<style>
.prose :first-child {
    @apply whitespace-normal sm:truncate sm:group-hover:whitespace-normal;
}
.prose :not(:first-child) {
    @apply sm:hidden sm:group-hover:block;
}
.prose a {
    @apply cursor-pointer font-normal  text-primary-500 dark:text-primary-600 hover:text-primary-700 dark:hover:text-primary-800;
}
</style>
