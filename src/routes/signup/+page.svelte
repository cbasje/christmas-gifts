<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { authSchema } from '$lib/db/schema/user';
	import { t } from '$lib/translations';
	import toast from 'svelte-french-toast';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Header from '../(auth)/Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(authSchema),
		resetForm: true,
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				toast.error(`Signing up was not successful!`);
			} else {
				toast.success(`Signed you up successfully!`);
			}
		},
		onError: ({ result }) => {
			toast.error(`Signing up was not successful! Reason: ${result?.error.message}`);
		}
	});
	const { form: formData, enhance } = form;
</script>

<Header padding={false}>
	{$t('signup.title')}

	<svelte:fragment slot="subtitle">
		{$t('signup.description')}
	</svelte:fragment>
</Header>

<form class="mt-8 flex flex-col gap-2" method="POST" use:enhance>
	<Form.Field {form} name="username">
		<Form.Control let:attrs>
			<Form.Label>{$t('common.user.username')}</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.username}
				placeholder={$t('common.user.username')}
				autocomplete="username"
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>{$t('common.user.password')}</Form.Label>
			<Input
				{...attrs}
				bind:value={$formData.password}
				type="password"
				placeholder={$t('common.user.password')}
				autocomplete="new-password"
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>
		{$t('common.signUp')}
	</Form.Button>
</form>
