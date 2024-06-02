<script lang="ts">
	import { cn } from '$lib/utils.js';
	import Icon from '@iconify/svelte';
	import { Menubar as MenubarPrimitive } from 'bits-ui';

	type $$Props = MenubarPrimitive.SubTriggerProps & {
		inset?: boolean;
	};
	type $$Events = MenubarPrimitive.SubTriggerEvents;

	let className: $$Props['class'] = undefined;
	export let inset: $$Props['inset'] = undefined;
	export { className as class };
</script>

<MenubarPrimitive.SubTrigger
	class={cn(
		'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[state=open]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:text-accent-foreground data-[disabled]:opacity-50',
		inset && 'pl-8',
		className
	)}
	on:click
	{...$$restProps}
	on:keydown
	on:focusin
	on:focusout
	on:pointerleave
	on:pointermove
>
	<slot />
	<Icon icon="lucide:chevron-right" class="ml-auto square-4" />
</MenubarPrimitive.SubTrigger>
