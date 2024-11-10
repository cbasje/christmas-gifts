<script lang="ts">
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
			toast.error('Signing up was not successful!');
		} else {
			toast.success('Signed you up successfully!');
		}
	},
	onError: ({ message }) => {
		toast.error(`Signing up was not successful! Reason: ${message}`);
		console.error(message);
	},
});
</script>

<Header padding={false}>
	{$t('signup.title')}

	<svelte:fragment slot="subtitle">
		{$t('signup.description')}
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
		autocomplete="new-password"
		messages={$errors.password}
		aria-invalid={$errors.password ? 'true' : undefined}
		label-class="sr-only"
		{...$constraints.password}
	/>
	<button
		type="submit"
		class="mt-4 flex w-full items-center justify-center gap-3 rounded-md border border-primary-700 bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
	>
		<Icon icon="solar:shield-keyhole-minimalistic-line-duotone" class="square-4" />
		<span>{$t('common.signUp')}</span>
	</button>
</form>
