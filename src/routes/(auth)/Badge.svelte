<script lang="ts">
	export let title: string;
	export let hue: number;
</script>

<span class="badge text-md inline-flex rounded-full px-3 font-medium" style="--color-hue: {hue}">
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
