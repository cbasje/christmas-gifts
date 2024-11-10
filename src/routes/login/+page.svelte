<script lang="ts">
import { dev } from '$app/environment';
import Input from '$lib/components/Input.svelte';
import { t } from '$lib/translations';
import Icon from '@iconify/svelte';
import toast from 'svelte-french-toast';
import { superForm } from 'sveltekit-superforms/client';
import Header from '../(auth)/Header.svelte';
import type { PageData } from './$types';

export let data: PageData;

const { form, enhance, errors, constraints } = superForm(data.form, {
	resetForm: true,
	onResult: ({ result }) => {
		if (result.type === 'failure' || result.type === 'error') {
			toast.error('Logging in was not successful!');
		} else {
			toast.success('Logged you in successfully!');
		}
	},
	onError: ({ result }) => {
		toast.error(`Logging in was not successful! Reason: ${result.error.message}`);
		console.error(result.error.message);
	},
});
</script>

<Header padding={false}>
	{$t('login.title')}

	<svelte:fragment slot="subtitle">
		{$t('login.description')}
	</svelte:fragment>
</Header>

<form class="mt-8 flex flex-col gap-2" method="POST" use:enhance>
	<Input
		name="username"
		type="text"
		label={$t('common.user.username')}
		bind:value={$form.username}
		placeholder={$t('common.user.username')}
		autocomplete="username"
		messages={$errors.username}
		aria-invalid={$errors.username ? 'true' : undefined}
		label-class="sr-only"
		{...$constraints.username}
	/>
	<Input
		name="password"
		type="password"
		label={$t('common.user.password')}
		bind:value={$form.password}
		placeholder={$t('common.user.password')}
		autocomplete="current-password"
		messages={$errors.password}
		aria-invalid={$errors.password ? 'true' : undefined}
		label-class="sr-only"
		{...$constraints.password}
	/>
	<button
		type="submit"
		class="mt-4 flex w-full items-center justify-center gap-3 rounded-md border border-primary-700 bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
	>
		<Icon icon="ph:lock-key" class="square-4" />
		<span>{$t('common.signIn')}</span>
	</button>
	{#if dev}
		<a href="/signup">Signup</a>
	{/if}
</form>
