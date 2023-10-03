<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import EditButton from '$lib/components/EditButton.svelte';
	import RemoveButton from '$lib/components/RemoveButton.svelte';
	import { formatLink } from '$lib/utils/link';
	import { formatPrice } from '$lib/utils/price';
	import { createSwitch, melt, type CreateSwitchProps } from '@melt-ui/svelte';
	import toast from 'svelte-french-toast';
	import type { PageData as OverviewData } from '../../routes/(auth)/$types';
	import type { PageData as IdeasData } from '../../routes/(auth)/ideas/$types';
	import type { PageData as WishData } from '../../routes/(auth)/wish-list/$types';
	import MarkdownDisplay from '$lib/components/MarkdownDisplay.svelte';

	type EditGiftItem = (IdeasData['ideaList'][string] | WishData['wishList'])[number];
	type GiftItem = EditGiftItem | OverviewData['overviewList'][string][number];

	export let formData: IdeasData['formData'] | WishData['formData'] | undefined = undefined;
	export let currentUserGroups:
		| IdeasData['currentUserGroups']
		| WishData['currentUserGroups']
		| undefined = undefined;
	export let users: IdeasData['users'] | undefined = undefined;

	export let item: GiftItem;
	export let allowPurchased = false;
	export let allowEdit = false;

	const switchPurchased: CreateSwitchProps['onCheckedChange'] = ({ next }) => {
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

	const {
		elements: { root, input },
		states: { checked: isPurchased }
	} = createSwitch({
		defaultChecked: 'purchased' in item && item.purchased,
		onCheckedChange: switchPurchased
	});
</script>

<tr
	class="group border-b border-gray-200 last:border-none dark:border-gray-700 {'purchased' in
		item && $isPurchased
		? 'decoration-current line-through decoration-2 opacity-30'
		: ''}"
>
	<td class=" min-h-4rem px-6 py-4">
		<h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
			{item.name}
		</h3>
		<!-- FIXME: <MarkdownDisplay v-if="item.notes" class="min-w-full text-gray-500 dark:text-gray-400">
			{item.notes}
		</MarkdownDisplay> -->
		{#if item.notes}
			<MarkdownDisplay class="min-w-full text-gray-500 dark:text-gray-400">
				<p>{item.notes}</p>
			</MarkdownDisplay>
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
				class="inline-block w-full cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-sm font-normal text-primary-500 underline hover:text-primary-700"
			>
				{formatLink(item.link)}
			</a>
		{/if}
	</td>
	<!-- TODO: -->
	<!-- <td class="flex items-center px-6 py-3">
                <div class="flex-shrink-0 h-10 w-10">
                    <img
                        v-if="item.pic"
                        class="h-10 w-10 rounded-md"
                        :src="item.pic[0].url"
                        alt=""
                    />
                </div>
            </td> -->
	{#if 'purchased' in item && allowPurchased}
		<td class=" px-6 py-3">
			<button
				use:melt={$root}
				class="relative inline-flex h-6 w-11 items-center rounded-full {$isPurchased
					? 'bg-success-500'
					: 'bg-gray-200 dark:bg-gray-400'}"
			>
				<span class="sr-only">Item purchased</span>
				<span
					class="inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-100 {$isPurchased
						? 'translate-x-6'
						: 'translate-x-1'}"
				/>
			</button>
			<input use:melt={$input} />
		</td>
	{/if}
	{#if allowEdit}
		<td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
			<div class="flex items-center justify-center gap-5">
				{#if formData !== undefined && currentUserGroups !== undefined}
					<EditButton
						item={'groups' in item ? item : undefined}
						{formData}
						{currentUserGroups}
						{users}
					/>
				{/if}

				<RemoveButton id={item.id} name={item.name} />
			</div>
		</td>
	{/if}
</tr>
