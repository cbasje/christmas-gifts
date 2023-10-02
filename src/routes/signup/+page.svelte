<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import { t } from '$lib/translations';
	import { superForm } from 'sveltekit-superforms/client';
	import Header from '../(auth)/Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, enhance, errors, constraints } = superForm(data.form);
</script>

<Header padding={false}>
	{$t('signup.title')}

	<svelte:fragment slot="subtitle">
		{$t('signup.description')}
	</svelte:fragment>
</Header>

<form class="mt-8 space-y-6" method="POST" use:enhance>
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
		input-class="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
		message-class="mt-1 block w-full text-sm text-danger-400"
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
		input-class="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
		message-class="mt-1 block w-full text-sm text-danger-400"
		{...$constraints.password}
	/>
	<Input
		type="submit"
		label={$t('common.signUp')}
		icon="lucide:lock"
		icon-class="h-4 w-4 text-primary-400 group-hover:text-primary-300 [&>svg]:w-full [&>svg]:h-full"
		input-class="group relative w-full flex justify-center item-center gap-3 py-2 px-4 border border-primary-700 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
	/>
</form>
