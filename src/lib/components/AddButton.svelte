<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/translations';
	import { Groups } from '$lib/types';
	import { capitaliseString } from '$lib/utils/capitalise';
	import Icon from '@iconify/svelte';
	import { createDialog, melt } from '@melt-ui/svelte';
	import toast from 'svelte-french-toast';
	import { scale } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { PageData as IdeasData } from '../../routes/(auth)/ideas/$types';
	import type { PageData as WishData } from '../../routes/(auth)/wish-list/$types';
	import Input from './Input.svelte';

	// const localePath = useLocalePath();
	export let formData: IdeasData['formData'] | WishData['formData'];
	export let currentUserGroups: IdeasData['currentUserGroups'] | WishData['currentUserGroups'];
	export let users: IdeasData['users'] | undefined = undefined;

	type LinkItem = {
		id: string;
		name: string;
		recipient: {
			name: string | null;
		};
	};
	let linkItems: LinkItem[] = [];

	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open }
	} = createDialog({
		forceVisible: true
	});

	const { form, enhance, constraints, errors } = superForm(formData, {
		resetForm: true,
		onResult: ({ result }) => {
			if ('data' in result && result.data?.form?.valid && 'newItem' in result.data) {
				open.set(false);
				toast.success(
					`Added ${result.data.newItem.name} to your ${
						result.data.newItem?.idea ? 'idea' : 'wish'
					} list successfully!`
				);
			} else {
				toast.error(`Adding item was not successful!`);
			}
		},
		onError: ({ message }) => {
			toast.error(`Adding item was not successful! Reason: ${message}`);
		}
	});

	const onRecipientChange = async (e: CustomEvent<{ value: string }>) => {
		const url = new URL($page.url);
		url.searchParams.set('recipientId', String(e.detail.value));

		const response = await fetch(url, {
			method: 'GET'
		});

		if (response.ok) {
			const responseJson = await response.json();
			linkItems = [...responseJson];
		}
	};

	$: showDebug = $page.url.searchParams.get('d') === 'true';
</script>

<div class="fixed bottom-6 right-6">
	<button
		type="button"
		use:melt={$trigger}
		class="group flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white drop-shadow-md hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:bg-primary-700 dark:hover:bg-primary-900"
	>
		<Icon
			icon="lucide:plus"
			class=" text-white group-hover:text-gray-300"
			width={32}
			height={32}
		/>
	</button>
</div>

<div use:melt={$portalled} class="absolute">
	{#if $open}
		<div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/30" />
		<div
			class="fixed left-[50%] top-[50%] z-50 my-8 max-h-[85vh] w-full max-w-md translate-x-[-50%] translate-y-[-50%] overflow-scroll rounded-xl bg-white p-6 text-left align-middle shadow-xl"
			transition:scale={{
				duration: 150
			}}
			use:melt={$content}
		>
			<h3 use:melt={$title} class="mb-2 text-lg font-medium leading-6 text-gray-900">
				{$t('common.editModal.create.title')}
			</h3>
			<p use:melt={$description} class="text-zinc-600 mb-5 mt-2 leading-normal">
				{$t('common.editModal.create.description')}
			</p>

			<form class="space-y-6" method="POST" action="?/newItem" use:enhance>
				<Input type="hidden" name="idea" value={$form.idea} />
				<Input type="hidden" name="giftedById" value={$form.giftedById} />
				<Input
					type="text"
					name="name"
					label={$t('common.item.name')}
					bind:value={$form.name}
					autocomplete="name"
					required
					messages={$errors.name}
					aria-invalid={$errors.name ? 'true' : undefined}
					label-class="block text-sm font-medium text-gray-700"
					input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
					message-class="mt-1 block w-full text-sm text-danger-400"
					{...$constraints.name}
				/>
				<Input
					type="text"
					name="price"
					label={$t('common.item.price')}
					bind:value={$form.price}
					autocomplete="transaction-amount"
					messages={$errors.price}
					aria-invalid={$errors.price ? 'true' : undefined}
					label-class="block text-sm font-medium text-gray-700"
					input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
					message-class="mt-1 block w-full text-sm text-danger-400"
					{...$constraints.price}
				/>
				<Input
					type="textarea"
					name="notes"
					label={$t('common.item.notes')}
					bind:value={$form.notes}
					rows="3"
					messages={$errors.notes}
					aria-invalid={$errors.notes ? 'true' : undefined}
					placeholder="Type here more information about the item..."
					label-class="block text-sm font-medium text-gray-700"
					input-class="shadow-sm focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
					message-class="mt-1 block w-full text-sm text-danger-400"
					{...$constraints.notes}
				/>
				<Input
					type="text"
					name="link"
					label={$t('common.item.link')}
					bind:value={$form.link}
					placeholder="www.example.com..."
					messages={$errors.link}
					aria-invalid={$errors.link ? 'true' : undefined}
					label-class="block text-sm font-medium text-gray-700"
					input-class="mt-1 focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
					message-class="mt-1 block w-full text-sm text-danger-400"
					{...$constraints.link}
				/>
				{#if $form.idea}
					<Input
						type="select"
						name="recipientId"
						label={$t('common.item.recipient')}
						bind:value={$form.recipientId}
						required
						messages={$errors.recipientId}
						aria-invalid={$errors.recipientId ? 'true' : undefined}
						label-class="block text-sm font-medium text-gray-700"
						input-class="shadow-sm focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
						help-class="mt-1 block w-full text-sm text-gray-500"
						message-class="mt-1 block w-full text-sm text-danger-400"
						options={(users ?? []).map((u) => ({
							label: u.name ?? '~user~',
							value: u.id
						}))}
						{...$constraints.recipientId}
						on:input={onRecipientChange}
					/>
					<Input
						type="select"
						name="ideaLinkId"
						label={$t('common.item.ideaLink')}
						bind:value={$form.ideaLinkId}
						messages={$errors.ideaLinkId}
						aria-invalid={$errors.ideaLinkId ? 'true' : undefined}
						help="First select a recipient."
						label-class="block text-sm font-medium text-gray-700"
						input-class="shadow-sm focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
						help-class="mt-1 block w-full text-sm text-gray-500"
						options={(linkItems ?? []).map((i) => ({
							label: `${i.recipient?.name} - ${i.name}`,
							value: i.id
						}))}
						{...$constraints.ideaLinkId}
					/>
				{:else}
					<Input type="hidden" name="recipientId" value={$form.recipientId} />
				{/if}
				{#if currentUserGroups.length > 1}
					<Input
						type="select-multiple"
						name="groups"
						label={$t('common.item.groups')}
						bind:value={$form.groups}
						required
						messages={$errors.groups?._errors}
						aria-invalid={$errors.groups?._errors ? 'true' : undefined}
						help="Select all that apply by holding command (macOS) or control (PC)."
						label-class="block text-sm font-medium text-gray-700"
						input-class="shadow-sm focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
						help-class="mt-1 block w-full text-sm text-gray-500"
						message-class="mt-1 block w-full text-sm text-danger-400"
						options={Groups.map((g) => ({
							label: capitaliseString(g),
							value: g
						}))}
						{...$constraints.groups}
					/>
				{:else}
					<Input type="hidden" name="groups" value={$form.groups} />
				{/if}
				<div class="text-right">
					<button
						use:melt={$close}
						type="button"
						class="inline-flex justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
					>
						{$t('common.editModal.create.cancel')}
					</button>
					<button
						type="submit"
						class="inline-flex justify-center rounded-md bg-primary-100 px-4 py-2 text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
					>
						{$t('common.editModal.create.submit')}
					</button>
				</div>
			</form>

			<SuperDebug display={showDebug} data={form} />
		</div>
	{/if}
</div>
