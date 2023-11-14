<script lang="ts">
	import Icon, { type IconifyIcon } from '@iconify/svelte';

	const id = 'form-dropzone-' + crypto.randomUUID();

	export let name: string;
	export let files: FileList;
	export let label: string;
	export let icon: IconifyIcon | string | null | undefined = undefined;
	export let message: string | null | undefined = undefined;
	export let help: string | null | undefined = undefined;

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
</script>

<fieldset class={$$props['outer-class']} class:opacity-50={$$restProps.disabled}>
	<label for={id} class={$$props['label-class']}>
		{label}
	</label>

	<div class={$$props['wrapper-class']}>
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

		<div class={$$props['inner-class']}>
			{#if icon}
				<Icon {icon} class="mb-4 square-6" />
			{/if}
			<label for={id} class={$$props['message-class']}>
				{message ?? 'Upload a file or drag and drop'}
			</label>
			{#if help}
				<small class={$$props['help-class']}>
					{help}
				</small>
			{/if}
		</div>
	</div>
</fieldset>
