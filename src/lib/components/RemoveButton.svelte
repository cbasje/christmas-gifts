<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import type { GiftItem } from '@prisma/client';
	import toast from 'svelte-french-toast';

	export let id: GiftItem['id'];
	export let name: GiftItem['name'];

	const removeItem = async () => {
		const value: boolean = confirm('Are you sure?');

		if (value) {
			const formData = new FormData();
			formData.set('id', id);

			await toast
				.promise(
					fetch($page.url, {
						method: 'DELETE',
						body: formData
					}),
					{
						loading: 'Removing...',
						success: `Removed '${name}' successfully!`,
						error: `Removing item was not successful!`
					}
				)
				.then(() => {
					invalidate($page.url);
				});
		}
	};
</script>

<button
	class="cursor-pointer font-normal text-danger-500 hover:text-danger-700 dark:text-danger-600 dark:hover:text-danger-800"
	on:click={removeItem}
>
	<Icon icon="lucide:trash-2" class="block h-6 w-6" />
</button>
