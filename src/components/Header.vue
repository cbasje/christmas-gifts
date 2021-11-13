<template>
	<div
		class="px-0 py-16 md:py-32 md:px-24 lg:px-32 text-black dark:text-white"
	>
		<h1 class="uppercase font-display text-5xl font-bold">
			<slot />
		</h1>

		<p v-if="hasSubtitle" class="uppercase font-display text-xl font-medium mt-3">
			<slot name="subtitle" />
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	computed: {
		hasSubtitle() {
			return this.$slots.subtitle
		}
	}
})
</script>
