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
	export let accept: string | undefined = undefined;
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

	const outerClass = ' ' + ($$props['outer-class'] ?? '');
	const innerClass = ' ' + ($$props['inner-class'] ?? '');
	const wrapperClass = ' ' + ($$props['wrapper-class'] ?? '');
	const labelClass =
		'block text-sm font-medium text-gray-600 dark:text-gray-300 ' +
		($$props['label-class'] ?? '');
	const inputClass =
		'mt-1 focus:ring-primary-500 dark:text-gray-100 text-gray-900 bg-gray-100 dark:bg-gray-900 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 rounded-md ' +
		($$props['input-class'] ?? '');
	const iconClass = 'block square-4 ' + ($$props['icon-class'] ?? '');
	const messageClass =
		'mt-1 block w-full text-sm text-danger-400 dark:text-danger-500 ' +
		($$props['message-class'] ?? '');
	const helpClass =
		'mt-1 block w-full text-sm text-gray-400 dark:text-gray-500 ' +
		($$props['help-class'] ?? '');
</script>

{#if type === 'hidden'}
	<input type="hidden" {id} {name} bind:value />
{:else}
	<fieldset class={outerClass}>
		<div class={wrapperClass}>
			{#if label !== undefined && !(type === 'submit' || type === 'button' || type === 'reset')}
				<label class={labelClass} for={id}>
					{label}
				</label>
			{/if}
			<div class={innerClass}>
				{#if type === 'textarea'}
					<textarea
						{id}
						class={inputClass}
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
						class={inputClass}
						{name}
						{disabled}
						aria-describedby={helpId ?? messageId}
					>
						{#if icon}
							<Icon {icon} class={iconClass} />
						{/if}
						{label}
					</button>
				{:else if type === 'select'}
					<select
						{id}
						class={inputClass}
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
						class={inputClass}
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
						class={inputClass}
						{name}
						bind:value
						{placeholder}
						{required}
						{disabled}
						{accept}
						{autocomplete}
						aria-describedby={helpId ?? messageId}
						on:input={(e) => dispatch('input', { value: e.currentTarget.value })}
					/>
				{/if}
			</div>
		</div>
		{#if help !== undefined && messages === undefined}
			<div id={helpId} class={helpClass}>{help}</div>
		{:else if messages !== undefined && messages !== null}
			{#each messages as m, i}
				<ul id="{messageId}-{i}">
					<li class={messageClass}>
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
