<script lang="ts">
	import { cn } from '$lib/utils';
	import { badgeVariants, type Variant } from '.';

	let className: string | undefined | null = undefined;
	export let href: string | undefined = undefined;
	export let variant: Variant = 'default';
	export let hue: number | null | undefined = 145;
	export { className as class };
</script>

<svelte:element
	this={href ? 'a' : 'span'}
	{href}
	class={cn(badgeVariants({ variant, className }))}
	style="--accent-hue: {hue}"
	{...$$restProps}
>
	<slot />
</svelte:element>
