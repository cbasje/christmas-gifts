<script lang="ts">
import Icon, { type IconifyIcon } from '@iconify/svelte';

const id = `form-dropzone-${crypto.randomUUID()}`;

export let name: string;
export let files: FileList;
export let label: string;
export const icon: IconifyIcon | string | null | undefined = undefined;
export const message: string | null | undefined = undefined;
export const help: string | null | undefined = undefined;

function prunedRestProps() {
	delete $$restProps['class'];
	delete $$restProps['outer-class'];
	delete $$restProps['wrapper-class'];
	delete $$restProps['inner-class'];
	delete $$restProps['label-class'];
	delete $$restProps['message-class'];
	delete $$restProps['help-class'];
	return $$restProps;
}

const outerClass = '' + ($$props['outer-class'] ?? '');
const innerClass = 'flex flex-col justify-center items-center' + ($$props['inner-class'] ?? '');
const wrapperClass =
	'textarea relative flex justify-center items-center text-gray-700 dark:text-gray-200 border border-dashed border-gray-300 dark:border-gray-600 focus-within:border-primary-500 dark:focus-within:border-primary-400 focus-within:bg-gray-100 dark:focus-within:bg-gray-800 p-4 py-10 rounded-md' +
	($$props['wrapper-class'] ?? '');
const labelClass =
	'block text-sm font-medium text-gray-700 dark:text-gray-200' + ($$props['label-class'] ?? '');
const iconClass = 'block mb-4 square-6' + ($$props['icon-class'] ?? '');
const messageClass = '' + ($$props['message-class'] ?? '');
const helpClass = 'opacity-75' + ($$props['help-class'] ?? '');
</script>

<fieldset class={outerClass} class:opacity-50={$$restProps.disabled}>
	<label for={id} class={labelClass}>
		{label}
	</label>

	<div class={wrapperClass}>
		<input
			{id}
			bind:files
			type="file"
			{name}
			class="absolute bottom-0 left-0 right-0 top-0 z-[1] w-full cursor-pointer opacity-0 disabled:!opacity-0"
			{...prunedRestProps()}
			on:change
			on:dragenter
			on:dragover
			on:dragleave
			on:drop
			on:click
			on:keydown
			on:keyup
			on:keypress
			on:focus
			on:focusin
			on:focusout
		/>

		<div class={innerClass}>
			{#if icon}
				<Icon {icon} class={iconClass} />
			{/if}
			<label for={id} class={messageClass}>
				{message ?? 'Upload a file or drag and drop'}
			</label>
			{#if help}
				<small class={helpClass}>
					{help}
				</small>
			{/if}
		</div>
	</div>
</fieldset>
