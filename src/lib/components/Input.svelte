<script lang="ts">
	import Icon, { type IconifyIcon } from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type SelectOption = {
		label: string;
		value?: string;
	};

	const dispatch = createEventDispatcher<{
		input: { value: string };
	}>();

	const id = 'form-input-' + crypto.randomUUID();

	export let name: string;
	export let value: string | string[] | boolean | null | undefined;
	export let label: string | null | undefined = undefined;
	export let type: HTMLInputAttributes['type'] | 'textarea' | 'select' | 'select-multiple';
	export let icon: IconifyIcon | string | null | undefined = undefined;
	export let required = false;
	export let disabled = false;
	export let placeholder: string | null | undefined = undefined;
	export let help: string | null | undefined = undefined;
	export let messages: string[] | null | undefined = undefined;
	export let autocomplete: HTMLInputAttributes['autocomplete'] | null | undefined = undefined;
	export let options: SelectOption[] | null | undefined = undefined;

	function setType(node: HTMLInputElement | HTMLButtonElement) {
		if (node && type) node.type = type;
	}

	const helpId = help !== undefined ? 'form-help-' + crypto.randomUUID() : undefined;
	const messageId = messages !== undefined ? 'form-message-' + crypto.randomUUID() : undefined;
</script>

{#if type === 'hidden'}
	<input type="hidden" {id} {name} bind:value />
{:else}
	<fieldset class={$$props['outer-class']}>
		<div class={$$props['wrapper-class']}>
			{#if label !== undefined && !(type === 'submit' || type === 'button' || type === 'reset')}
				<label class={$$props['label-class']} for={id}>
					{label}
				</label>
			{/if}
			<div class={$$props['inner-class']}>
				{#if type === 'textarea'}
					<textarea
						{id}
						class={$$props['input-class']}
						{name}
						bind:value
						{placeholder}
						{required}
						{disabled}
						aria-describedby={helpId ?? messageId}
						on:input={(e) => dispatch('input', { value: e.currentTarget.value })}
					/>
				{:else if type === 'submit' || type === 'button' || type === 'reset'}
					<button
						use:setType
						{id}
						class={$$props['input-class']}
						{name}
						{disabled}
						aria-describedby={helpId ?? messageId}
					>
						{#if icon}
							<Icon {icon} class={$$props['icon-class'] ?? 'block h-4 w-4'} />
						{/if}
						{label}
					</button>
				{:else if type === 'select'}
					<select
						{id}
						class={$$props['input-class']}
						{name}
						bind:value
						{required}
						{disabled}
						aria-describedby={helpId ?? messageId}
						on:input={(e) => dispatch('input', { value: e.currentTarget.value })}
					>
						{#if options !== undefined && options !== null && options?.length}
							{#each options as o}
								<option value={o.value} disabled={o.value === undefined}>
									{o.label}
								</option>
							{/each}
						{/if}
					</select>
				{:else if type === 'select-multiple'}
					<select
						{id}
						class={$$props['input-class']}
						{name}
						bind:value
						multiple
						{required}
						{disabled}
						aria-describedby={helpId ?? messageId}
						on:input={(e) => dispatch('input', { value: e.currentTarget.value })}
					>
						{#if options !== undefined && options !== null && options?.length}
							{#each options as o}
								<option value={o.value} disabled={o.value === undefined}>
									{o.label}
								</option>
							{/each}
						{/if}
					</select>
				{:else}
					<input
						use:setType
						{id}
						class={$$props['input-class']}
						{name}
						bind:value
						{placeholder}
						{required}
						{disabled}
						{autocomplete}
						aria-describedby={helpId ?? messageId}
						on:input={(e) => dispatch('input', { value: e.currentTarget.value })}
					/>
				{/if}
			</div>
		</div>
		{#if help !== undefined && messages === undefined}
			<div id={helpId} class={$$props['help-class']}>{help}</div>
		{:else if messages !== undefined && messages !== null}
			{#each messages as m, i}
				<ul id="{messageId}-{i}">
					<li class={$$props['message-class']}>
						{m}
					</li>
				</ul>
			{/each}
		{/if}
	</fieldset>
{/if}

<style lang="postcss">
	:global(div:has([required])) > label::after {
		content: '*';
		@apply text-danger-500;
	}
</style>
