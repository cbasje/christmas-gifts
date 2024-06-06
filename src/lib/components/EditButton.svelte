<script lang="ts">
	import { page } from '$app/stores';
	import { groups } from '$lib/db/schema/user';
	import { t } from '$lib/translations';
	import type { LinkItem } from '$lib/types';
	import { capitaliseString } from '$lib/utils/capitalise';
	import Icon from '@iconify/svelte';
	import toast from 'svelte-french-toast';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData as IdeasData } from '../../routes/(auth)/ideas/$types';
	import type { PageData as WishData } from '../../routes/(auth)/wish-list/$types';
	import * as Form from './ui/form';
	import { Input } from './ui/input';
	import * as Select from './ui/select';
	import * as Sheet from './ui/sheet';
	import { Textarea } from './ui/textarea';

	// const localePath = useLocalePath();
	export let data: IdeasData['data'] | WishData['data'];
	export let currentUserGroups: IdeasData['currentUserGroups'] | WishData['currentUserGroups'];
	export let users: IdeasData['users'] | undefined = undefined;

	type Idea = IdeasData['ideaList'][string][number];
	type GiftItem = WishData['wishList'][number];
	export let item: Idea | GiftItem | undefined = undefined;

	let open = false;
	let linkItems: LinkItem[] = [];

	const form = superForm(data, {
		// TODO validators: zodClient(formSchema),
		id: item?.id,
		resetForm: false,
		dataType: 'json',
		onResult: ({ result }) => {
			if ('data' in result && result.data?.form?.valid) {
				open = false;
				toast.success(`Updated ${result.data.form?.data?.name} successfully!`);
			} else {
				toast.error(`Updating item was not successful!`);
			}
		},
		onError: ({ result }) => {
			toast.error(`Updating item was not successful! Reason: ${result?.error.message}`);
		}
	});
	const { form: formData, enhance, reset, tainted } = form;

	const handleOpenChange = (next: boolean) => {
		if (next === true && item !== undefined) {
			formData.set(
				{
					id: item.id,
					name: item.name,
					price: item.price,
					recipientId: item.recipientId,
					giftedById: item.giftedById,
					link: item.link,
					idea: item.idea,
					...('notes' in item
						? {
								notes: item.notes,
								groups: item.groups ?? []
							}
						: {
								giftItemId: item.giftItemId
							})
				},
				{ taint: false }
			);
		} else if (next === false) {
			reset();
		}
		return next;
	};

	$: selectedRecipientId = $formData.recipientId
		? {
				label: $formData.recipientId,
				value: $formData.recipientId
			}
		: undefined;

	$: selectedGiftItemId = $formData.giftItemId
		? {
				label: $formData.giftItemId,
				value: $formData.giftItemId
			}
		: undefined;

	$: selectedGroups = $formData.groups.map((g) => ({ label: capitaliseString(g), value: g }));

	const onRecipientChange = async (v: { label?: string; value: string } | undefined) => {
		if (!v) return;

		$formData.recipientId = v.value;

		const url = new URL($page.url);
		url.searchParams.set('recipientId', v.value);

		const response = await fetch(url, {
			method: 'GET'
		});

		if (response.ok) {
			const responseJson = await response.json();
			linkItems = [...responseJson];
		}
	};
</script>

<Sheet.Root bind:open onOpenChange={handleOpenChange}>
	<Sheet.Trigger>
		<Icon icon="ph:pen-duotone" class="block h-6 w-6" />
	</Sheet.Trigger>

	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>
				{$t('common.editPopup.edit.title', { item: item?.name ?? '' })}
			</Sheet.Title>
			<Sheet.Description>
				{$t('common.editPopup.edit.description')}
			</Sheet.Description>
		</Sheet.Header>>

		<form
			class="contents"
			method="POST"
			action="?/editItem"
			enctype="multipart/form-data"
			use:enhance
		>
			<input type="hidden" name="id" value={$formData.id} />
			<input type="hidden" name="idea" value={$formData.idea} />
			<input type="hidden" name="giftedById" value={$formData.giftedById} />

			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>{$t('common.item.name')}</Form.Label>
					<Input {...attrs} bind:value={$formData.name} autocomplete="name" required />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="price">
				<Form.Control let:attrs>
					<Form.Label>{$t('common.item.price')}</Form.Label>
					<Input
						{...attrs}
						bind:value={$formData.price}
						autocomplete="transaction-amount"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			{#if !$formData.idea}
				<Form.Field {form} name="notes">
					<Form.Control let:attrs>
						<Form.Label>{$t('common.item.notes')}</Form.Label>
						<Textarea
							{...attrs}
							bind:value={$formData.notes}
							rows={3}
							placeholder="Type here more information about the item..."
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/if}

			<Form.Field {form} name="link">
				<Form.Control let:attrs>
					<Form.Label>{$t('common.item.link')}</Form.Label>
					<Input
						{...attrs}
						type="url"
						bind:value={$formData.link}
						placeholder="www.example.com..."
						autocomplete="url"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			{#if !$formData.idea}
				<!-- TODO: <DropzoneArea
						name="pic"
						supabaseFile={item?.pic}
						on:upload={() => {
							form.update(($form) => {
								$form.pic = 'updated';
								return $form;
							});
						}}
					/> -->
			{/if}

			{#if $formData.idea}
				<Form.Field {form} name="recipientId">
					<Form.Control let:attrs>
						<Form.Label>{$t('common.item.recipient')}</Form.Label>
						<Select.Root
							required
							selected={selectedRecipientId}
							onSelectedChange={onRecipientChange}
						>
							<Select.Trigger>
								<Select.Value placeholder="Select a recipient..." />
							</Select.Trigger>
							<Select.Content>
								{#each users ?? [] as u}
									<Select.Item value={u.id} label={u.name ?? '~user~'} />
								{/each}
							</Select.Content>
						</Select.Root>
						<input type="hidden" bind:value={$formData.recipientId} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="giftItemId">
					<Form.Control let:attrs>
						<Form.Label>{$t('common.item.ideaLink')}</Form.Label>
						<Select.Root
							required
							selected={selectedGiftItemId}
							onSelectedChange={(v) => {
								v && ($formData.giftItemId = v.value);
							}}
						>
							<Select.Trigger>
								<Select.Value placeholder="Select an idea to link..." />
							</Select.Trigger>
							<Select.Content>
								{#each linkItems ?? [] as i}
									<Select.Item
										value={i.id}
										label={`${i.recipientName} - ${i.name}`}
									/>
								{/each}
							</Select.Content>
						</Select.Root>
						<input type="hidden" bind:value={$formData.giftItemId} name={attrs.name} />
					</Form.Control>
					<Form.Description>First select a recipient.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			{:else}
				<input type="hidden" name="recipientId" value={$formData.recipientId} />
			{/if}

			{#if !$formData.idea}
				{#if currentUserGroups && currentUserGroups.length > 1}
					<Form.Field {form} name="groups">
						<Form.Control let:attrs>
							<Form.Label>{$t('common.item.groups')}</Form.Label>
							<Select.Root
								multiple
								required
								selected={selectedGroups}
								onSelectedChange={(s) => {
									if (s) {
										$formData.groups = s.map((c) => c.value);
									} else {
										$formData.groups = [];
									}
								}}
							>
								{#each $formData.groups as g}
									<input name={attrs.name} hidden value={g} />
								{/each}
								<Select.Trigger>
									<Select.Value placeholder="Select a group..." />
								</Select.Trigger>
								<Select.Content>
									{#each groups as g}
										<Select.Item value={g} label={capitaliseString(g)} />
									{/each}
								</Select.Content>
							</Select.Root>
						</Form.Control>
						<Form.Description>
							Select all that apply by holding command (macOS) or control (PC).
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				{:else}
					<input type="hidden" name="groups" value={$formData.groups} />
				{/if}
			{/if}

			<Sheet.Footer>
				<Sheet.Close>
					{$t('common.editPopup.edit.cancel')}
				</Sheet.Close>
				<Form.Button
					disabled={$tainted === undefined}
					title={$tainted === undefined ? $t('common.editPopup.edit.submitTitle') : ''}
				>
					{$t('common.editPopup.edit.submit')}
				</Form.Button>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
