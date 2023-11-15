<script lang="ts">
	import { t } from '$lib/translations';
	import { createEventDispatcher } from 'svelte';
	import toast from 'svelte-french-toast';
	import Dropzone from './Dropzone.svelte';

	export let name: string;
	export let supabaseFile: string | null | undefined = undefined;

	const dispatch = createEventDispatcher<{
		upload: undefined;
	}>();

	type File = {
		name: string;
		preview?: string;
		contentType?: string;
		url?: string;
	};
	let files: File[] = [];
	if (supabaseFile) {
		files = [{ name: '-', url: supabaseFile }];
	}

	let droppedFiles: FileList;
	let uploading: boolean = false;
	const authorizedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

	const onChangeHandler = (e: Event) => {
		// read preview data as url into array per file
		for (let i = 0; i < droppedFiles.length; i++) {
			const file = droppedFiles[i];
			if (
				file.name &&
				file.type.startsWith('image/') &&
				!files.map((f) => f.name).includes(file.name)
			) {
				dispatch('upload');

				const reader = new FileReader();
				reader.onload = (e) => {
					console.log(`Reader result for ${file.name}`, e);

					files = [
						// TODO: ...files,
						{
							preview: e.target?.result as string,
							name: file.name,
							contentType: file.type
						}
					];
				};
				reader.readAsDataURL(file);
			} else {
				toast.error(file.name + ' could not be added');
			}
		}
	};
</script>

<!-- TODO: Update interaction -->
<Dropzone
	disabled={uploading}
	{name}
	label={$t('common.item.pic')}
	accept={authorizedExtensions.join(',')}
	on:change={onChangeHandler}
	bind:files={droppedFiles}
	icon="lucide:upload"
	help="PNG, JPG and GIF are allowed"
	label-class="block text-sm font-medium text-gray-700"
	wrapper-class="textarea relative flex justify-center items-center border border-dashed border-gray-300 focus-within:border-primary-500 focus-within:bg-gray-100 p-4 py-10 rounded-md"
	inner-class="flex flex-col justify-center items-center"
	help-class="opacity-75"
/>
<ol class="dropzone-files">
	{#each files as item}
		<img
			src={item.preview ?? item.url}
			alt="A picture uploaded via the Dropzone"
			class="shrink-0 rounded-md square-24"
		/>
		<li>{item.name}</li>
	{/each}
</ol>
