<script lang="ts">
	export let title: string;
	export let hue: number | null | undefined = 145;
</script>

<span
	class="badge inline-flex rounded-full px-4 py-0.5 text-lg font-medium"
	style="--color-hue: {hue}"
>
	{title}
</span>

<style lang="postcss">
	.badge {
		color: var(--color-12);
		background-color: var(--color-3);
	}
	@media (prefers-color-scheme: dark) {
		.badge {
			color: var(--color-0);
			background-color: var(--color-9);
		}
	}
</style>
