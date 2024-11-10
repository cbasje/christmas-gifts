<script lang="ts">
export let padding = true;
</script>

<header
	class="mx-auto flex w-full max-w-3xl flex-col sm:flex-row md:max-w-7xl {padding
		? 'px-2 py-5 sm:px-6 lg:px-8'
		: ''}"
	{...$$restProps}
>
	<div class="grow">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
			<slot />
		</h1>

		{#if $$slots.subtitle}
			<p class="font-regular mb-3 text-lg text-gray-700 dark:text-gray-300">
				<slot name="subtitle" />
			</p>
		{/if}
	</div>

	<div class="flex h-full flex-row items-start justify-start gap-3">
		<slot name="buttons" />
	</div>
</header>
