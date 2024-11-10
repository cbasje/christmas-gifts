<script lang="ts">
import { page } from '$app/stores';
import { Groups } from '$lib/db/schema/user';
import { t } from '$lib/translations';
import type { LinkItem } from '$lib/types';
import { capitaliseString } from '$lib/utils/capitalise';
import Icon from '@iconify/svelte';
import { createDialog, melt } from '@melt-ui/svelte';
import toast from 'svelte-french-toast';
import { fade, scale } from 'svelte/transition';
import { superForm } from 'sveltekit-superforms/client';
import type { PageData as IdeasData } from '../../routes/(auth)/ideas/$types';
import type { PageData as WishData } from '../../routes/(auth)/wish-list/$types';
import Input from './Input.svelte';

// const localePath = useLocalePath();
export let formData: IdeasData['formData'] | WishData['formData'];
export let currentUserGroups: IdeasData['currentUserGroups'] | WishData['currentUserGroups'];
export let users: IdeasData['users'] | undefined = undefined;

let linkItems: LinkItem[] = [];

const {
	elements: { trigger, overlay, content, title, description, close, portalled },
	states: { open },
} = createDialog({
	forceVisible: true,
});

const { form, enhance, constraints, errors, tainted } = superForm(formData, {
	resetForm: true,
	onResult: ({ result }) => {
		if ('data' in result && result.data?.form?.valid && 'newItem' in result.data) {
			open.set(false);
			toast.success(
				`Added ${result.data.newItem.name} to your ${
					result.data.newItem?.idea ? 'idea' : 'wish'
				} list successfully!`,
			);
		} else {
			toast.error('Adding item was not successful!');
		}
	},
	onError: ({ result }) => {
		toast.error(`Adding item was not successful! Reason: ${result.error.message}`);
		console.error(result.error.message);
	},
});

const onRecipientChange = async (e: CustomEvent<{ value: string }>) => {
	const url = new URL($page.url);
	url.searchParams.set('recipientId', String(e.detail.value));

	const response = await fetch(url, {
		method: 'GET',
	});

	if (response.ok) {
		const responseJson = await response.json();
		linkItems = [...responseJson];
	}
};
</script>

<div class="fixed bottom-6 right-6">
	<button
		type="button"
		use:melt={$trigger}
		class="group flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white drop-shadow-md hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:bg-primary-700 dark:hover:bg-primary-900"
	>
		<Icon icon="ph:plus" class="block h-8 w-8 text-white group-hover:text-gray-300" />
	</button>
</div>

<div use:melt={$portalled} class="absolute">
	{#if $open}
		<div
			use:melt={$overlay}
			class="fixed inset-0 z-50 bg-black/30 dark:bg-black/50"
			transition:fade={{ duration: 150 }}
		/>
		<div
			class="fixed left-[50%] top-[50%] z-50 my-8 flex max-h-[85vh] w-full max-w-md translate-x-[-50%] translate-y-[-50%] flex-col gap-4 overflow-scroll rounded-xl bg-gray-100 p-6 text-left align-middle shadow-xl dark:bg-gray-900"
			transition:scale={{
				duration: 150
			}}
			use:melt={$content}
		>
			<header>
				<h3
					use:melt={$title}
					class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100"
				>
					{$t('common.editPopup.create.title')}
				</h3>
				<p
					use:melt={$description}
					class="text-base leading-normal text-gray-500 dark:text-gray-400"
				>
					{$t('common.editPopup.create.description')}
				</p>
			</header>

			<form
				class="contents"
				method="POST"
				action="?/newItem"
				enctype="multipart/form-data"
				use:enhance
			>
				<Input type="hidden" name="id" value={crypto.randomUUID()} />
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
					{...$constraints.price}
				/>
				{#if !$form.idea}
					<Input
						type="textarea"
						name="notes"
						label={$t('common.item.notes')}
						bind:value={$form.notes}
						rows="3"
						messages={$errors.notes}
						aria-invalid={$errors.notes ? 'true' : undefined}
						placeholder="Type here more information about the item..."
						{...$constraints.notes}
					/>
				{/if}
				<Input
					type="text"
					name="link"
					label={$t('common.item.link')}
					bind:value={$form.link}
					placeholder="www.example.com..."
					messages={$errors.link}
					aria-invalid={$errors.link ? 'true' : undefined}
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
						options={(users ?? []).map((u) => ({
							label: u.name ?? '~user~',
							value: u.id
						}))}
						{...$constraints.recipientId}
						on:input={onRecipientChange}
					/>
					<Input
						type="select"
						name="giftItemId"
						label={$t('common.item.ideaLink')}
						bind:value={$form.giftItemId}
						messages={$errors.giftItemId}
						aria-invalid={$errors.giftItemId ? 'true' : undefined}
						help="First select a recipient."
						options={(linkItems ?? []).map((i) => ({
							label: `${i.recipientName} - ${i.name}`,
							value: i.id
						}))}
						{...$constraints.giftItemId}
					/>
				{:else}
					<Input type="hidden" name="recipientId" value={$form.recipientId} />
				{/if}
				{#if !$form.idea}
					{#if currentUserGroups && currentUserGroups.length > 1}
						<Input
							type="select-multiple"
							name="groups"
							label={$t('common.item.groups')}
							bind:value={$form.groups}
							required
							messages={$errors.groups?._errors}
							aria-invalid={$errors.groups?._errors ? 'true' : undefined}
							help="Select all that apply by holding command (macOS) or control (PC)."
							options={Groups.map((g) => ({
								label: capitaliseString(g),
								value: g
							}))}
							{...$constraints.groups}
						/>
					{:else}
						<Input type="hidden" name="groups" value={$form.groups} />
					{/if}
				{/if}
				<footer class="self-end">
					<button
						use:melt={$close}
						type="button"
						class="inline-flex justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-100 dark:hover:bg-gray-700"
					>
						{$t('common.editPopup.create.cancel')}
					</button>
					<button
						type="submit"
						class="inline-flex justify-center rounded-md bg-primary-100 px-4 py-2 text-sm font-medium text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 enabled:hover:bg-primary-200 disabled:bg-primary-50 dark:bg-primary-800 dark:text-primary-100 dark:enabled:hover:bg-primary-700 dark:disabled:bg-primary-900"
						disabled={$tainted === undefined}
						title={$tainted === undefined
							? $t('common.editPopup.create.submitTitle')
							: ''}
					>
						{$t('common.editPopup.create.submit')}
					</button>
				</footer>
			</form>
		</div>
	{/if}
</div>
