<script lang="ts">
	import { cn } from '$lib/utils.js';
	import Icon from '@iconify/svelte';
	import { Menubar as MenubarPrimitive } from 'bits-ui';

	type $$Props = MenubarPrimitive.RadioItemProps;
	type $$Events = MenubarPrimitive.RadioItemEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export { className as class };
</script>

<MenubarPrimitive.RadioItem
	{value}
	class={cn(
		'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
		className
	)}
	{...$$restProps}
	on:click
	on:keydown
	on:focusin
	on:focusout
	on:pointerleave
	on:pointermove
	on:pointerdown
>
	<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
		<MenubarPrimitive.RadioIndicator>
			<Icon icon="lucide:circle" class="fill-current square-2" />
		</MenubarPrimitive.RadioIndicator>
	</span>
	<slot />
</MenubarPrimitive.RadioItem>
