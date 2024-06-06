<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/ui/button/button.svelte';
	import FormButton from '$lib/components/ui/form/form-button.svelte';
	import * as Menubar from '$lib/components/ui/menubar';
	import { groups } from '$lib/db/schema/user';
	import { t } from '$lib/translations';
	import { capitaliseString } from '$lib/utils/capitalise';
	import Icon from '@iconify/svelte';
	import type { LayoutServerData } from './$types';

	// FIXME: const localePath = useLocalePath();
	export let user: LayoutServerData['user'];
	export let currentGroupId: LayoutServerData['currentGroupId'];

	type NavigationItem = { name: string; href: string; icon: string };
	const mainMenuNavigation: NavigationItem[] = [
		{ name: 'common.navigation.overview', href: '/', icon: 'ph:house-duotone' },
		{
			name: 'common.navigation.wishList',
			href: '/wish-list',
			icon: 'ph:list-checks-duotone'
		},
		{
			name: 'common.navigation.ideas',
			href: '/ideas',
			icon: 'ph:lightbulb-filament-duotone'
		},
		{
			name: 'common.navigation.sizeChart',
			href: '/size-chart',
			icon: 'ph:ruler-duotone'
		}
	];
	const subMenuNavigation: NavigationItem[] = [];

	const handleRadioChange = (next: string | undefined) => {
		if (!next) return;

		const formData = new FormData();
		formData.set('id', next);

		fetch($page.url.origin + '/group', {
			method: 'PATCH',
			body: formData
		}).then(() => {
			invalidateAll();
		});
	};
</script>

<Menubar.Root>
	{#each mainMenuNavigation as item (item.href)}
		{@const isCurrent = $page.url.pathname === item.href}
		<Button href={item.href} aria-current={isCurrent ? 'page' : undefined} variant="link">
			<Icon icon={item.icon} class="block square-4" />
			<span>{$t(item.name)}</span>
		</Button>
	{/each}

	<Menubar.Menu>
		<Menubar.Trigger>
			<span class="sr-only">Open user menu</span>
			<Badge hue={user.hue}>{user.name ?? ''}</Badge>
		</Menubar.Trigger>
		<Menubar.Content>
			{#if user.groups && user.groups.length > 1}
				<Menubar.RadioGroup value={currentGroupId} onValueChange={handleRadioChange}>
					{#each groups as group (group)}
						<Menubar.RadioItem value={group}
							>{capitaliseString(group)}</Menubar.RadioItem
						>
					{/each}
				</Menubar.RadioGroup>
			{/if}
			{#if subMenuNavigation.length > 0}
				<Menubar.Separator />
				{#each subMenuNavigation as item (item.href)}
					{@const isCurrent = $page.url.pathname === item.href}
					<Menubar.Item inset aria-current={isCurrent ? 'page' : undefined}>
						{$t(item.name)}
					</Menubar.Item>
				{/each}
			{/if}
			<Menubar.Separator />
			<Menubar.Item inset>
				<form method="post" action="/logout" use:enhance>
					<FormButton>
						<Icon icon="ph:arrow-square-out-duotone" class="block h-4 w-4" />
						<span>{$t('common.signOut')}</span>
					</FormButton>
				</form>
			</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>
