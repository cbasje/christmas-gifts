<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import EditButton from '$lib/components/EditButton.svelte';
	import MarkdownDisplay from '$lib/components/MarkdownDisplay.svelte';
	import RemoveButton from '$lib/components/RemoveButton.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { formatLink } from '$lib/utils/link';
	import { formatPrice } from '$lib/utils/price';
	import toast from 'svelte-french-toast';
	import type { PageData as OverviewData } from '../../routes/(auth)/$types';
	import type { PageData as IdeasData } from '../../routes/(auth)/ideas/$types';
	import type { PageData as WishData } from '../../routes/(auth)/wish-list/$types';

	type EditGiftItem = (IdeasData['ideaList'][string] | WishData['wishList'])[number];
	type GiftItem = EditGiftItem | OverviewData['overviewList'][string][number];

	export let formData: IdeasData['data'] | WishData['data'] | undefined = undefined;
	export let currentUserGroups:
		| IdeasData['currentUserGroups']
		| WishData['currentUserGroups']
		| undefined = undefined;
	export let users: IdeasData['users'] | undefined = undefined;

	export let item: GiftItem;
	export let allowPurchased = false;
	export let allowEdit = false;

	let isPurchased = 'purchased' in item && (item.purchased ?? undefined);

	const switchPurchased = (next: boolean) => {
		const formData = new FormData();
		formData.set('id', item.id);
		formData.set('purchased', String(next));

		toast
			.promise(
				fetch($page.url, {
					method: 'PATCH',
					body: formData
				}),
				{
					loading: 'Saving...',
					success: `Changed purchase status of '${item.name}' successfully!`,
					error: `Saving purchase status was not successful!`
				}
			)
			.then(() => {
				invalidate($page.url);
			});
		return next;
	};
</script>

<tr
	class="group border-b border-gray-200 last:border-none dark:border-gray-700 {'purchased' in
		item && isPurchased
		? 'line-through decoration-current decoration-2 opacity-30'
		: ''}"
>
	<td class="flex items-center px-6 py-3">
		{#if 'pic' in item && item.pic}
			<img class="shrink-0 rounded-md object-cover square-24" src={item.pic} alt="" />
		{/if}
	</td>
	<td class=" min-h-4rem px-6 py-4">
		<h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
			{item.name}
		</h3>
		{#if 'notes' in item && item.notes}
			<MarkdownDisplay source={item.notes} class="min-w-full text-gray-500 dark:text-gray-400"
			></MarkdownDisplay>
		{/if}
	</td>
	<td>
		<span class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
			{formatPrice(item.price)}
		</span>
	</td>
	<td>
		{#if item.link}
			<a
				href={item.link}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-block w-full cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-sm font-normal text-primary-foreground underline"
			>
				{formatLink(item.link)}
			</a>
		{/if}
	</td>
	{#if 'purchased' in item && allowPurchased}
		<td class=" px-6 py-3">
			<Switch bind:checked={isPurchased} onCheckedChange={switchPurchased} />
		</td>
	{/if}
	{#if allowEdit}
		<td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
			<div class="flex items-center justify-center gap-5">
				{#if formData !== undefined && currentUserGroups !== undefined}
					<EditButton {item} {formData} {currentUserGroups} {users} />
				{/if}

				<RemoveButton id={item.id} name={item.name} />
			</div>
		</td>
	{/if}
</tr>
