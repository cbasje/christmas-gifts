<script lang="ts">
	import { dev } from '$app/environment';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { authSchema } from '$lib/db/schema/user';
	import { t } from '$lib/translations';
	import toast from 'svelte-french-toast';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import Header from '../(auth)/Header.svelte';
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(authSchema),
		resetForm: true,
		onResult: ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				toast.error(`Logging in was not successful!`);
			} else {
				toast.success(`Logged you in successfully!`);
			}
		},
		onError: ({ result }) => {
			toast.error(`Logging in was not successful! Reason: ${result?.error.message}`);
		}
	});
	const { form: formData, enhance } = form;
</script>

<Header padding={false}>
	{$t('login.title')}

	<svelte:fragment slot="subtitle">
		{$t('login.description')}
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
				autocomplete="current-password"
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>
		{$t('common.signIn')}
	</Form.Button>

	{#if dev}
		<Button href="/signup" variant="outline">{$t('common.signUp')}</Button>
	{/if}
</form>
