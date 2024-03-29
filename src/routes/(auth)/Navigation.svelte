<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { Groups } from '$lib/db/schema/user';
	import { t } from '$lib/translations';
	import { capitaliseString } from '$lib/utils/capitalise';
	import Icon from '@iconify/svelte';
	import {
		createCollapsible,
		createDropdownMenu,
		createRadioGroup,
		melt,
		type CreateRadioGroupProps
	} from '@melt-ui/svelte';
	import { fly, slide } from 'svelte/transition';
	import type { LayoutServerData } from './$types';
	import Badge from './Badge.svelte';

	// FIXME: const localePath = useLocalePath();
	export let user: LayoutServerData['user'];
	export let currentGroupId: LayoutServerData['currentGroupId'];

	type NavigationItem = { name: string; href: string; icon: string };
	const mainMenuNavigation: NavigationItem[] = [
		{ name: 'common.navigation.overview', href: '/', icon: 'solar:home-2-line-duotone' },
		{
			name: 'common.navigation.wishList',
			href: '/wish-list',
			icon: 'solar:checklist-line-duotone'
		},
		{
			name: 'common.navigation.ideas',
			href: '/ideas',
			icon: 'solar:clipboard-list-line-duotone'
		},
		{
			name: 'common.navigation.sizeChart',
			href: '/size-chart',
			icon: 'solar:ruler-line-duotone'
		}
	];
	const subMenuNavigation: NavigationItem[] = [];

	const handleRadioChange: CreateRadioGroupProps['onValueChange'] = ({ curr, next }) => {
		if (curr !== next) {
			const formData = new FormData();
			formData.set('id', next);

			fetch($page.url.origin + '/group', {
				method: 'PATCH',
				body: formData
			}).then(() => {
				invalidateAll();
			});

			return next;
		}
		return curr;
	};

	const {
		elements: {
			root: collapsibleRoot,
			content: collapsibleContent,
			trigger: triggerCollapsible
		},
		states: { open: isCollapsibleOpen }
	} = createCollapsible();

	const {
		elements: { trigger: triggerMenu, menu, item: menuItem }
	} = createDropdownMenu();

	const {
		elements: { root: radioRoot, item: radioItem },
		helpers: { isChecked }
	} = createRadioGroup({
		defaultValue: currentGroupId,
		onValueChange: handleRadioChange
	});
</script>

<nav use:melt={$collapsibleRoot} class="bg-white dark:bg-gray-800">
	<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
		<div class="relative flex h-16 items-center justify-between">
			<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
				<button
					use:melt={$triggerCollapsible}
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-white"
				>
					<span class="sr-only">Open main menu</span>

					{#if $isCollapsibleOpen}
						<Icon icon="lucide:x" class="block h-6 w-6" />
					{:else}
						<Icon icon="solar:list-line-duotone" class="block h-6 w-6" />
					{/if}
				</button>
			</div>
			<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
				<div class="hidden sm:block">
					<div class="flex flex-row gap-4">
						{#each mainMenuNavigation as item (item.href)}
							{@const isCurrent = $page.url.pathname === item.href}
							<a
								href={item.href}
								class="flex flex-row items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 hover:text-black dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white {isCurrent &&
									'bg-gray-100 text-black dark:bg-gray-900 dark:text-white'}"
								aria-current={isCurrent ? 'page' : undefined}
							>
								<Icon icon={item.icon} class="block h-4 w-4" />
								<span>{$t(item.name)}</span>
							</a>
						{/each}
					</div>
				</div>
			</div>
			<div
				class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
			>
				<ul class="relative ml-3">
					<div>
						<button
							use:melt={$triggerMenu}
							class="text-md flex rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-white dark:focus:ring-offset-gray-800"
						>
							<span class="sr-only">Open user menu</span>
							<Badge title={user.name ?? ''} hue={user.hue} />
						</button>
					</div>
					<ul
						use:melt={$menu}
						transition:fly={{ duration: 150, y: -10 }}
						class="absolute right-0 flex w-64 origin-top-right flex-col gap-1 rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800"
					>
						{#if user.groups && user.groups.length > 1}
							<li
								use:melt={$menuItem}
								class="mb-2 block px-1 text-sm text-gray-700 dark:text-gray-200"
							>
								<ul
									use:melt={$radioRoot}
									class="flex space-x-1 rounded-lg bg-primary-900/[0.1] p-1 dark:bg-primary-50/[0.1]"
								>
									{#each Groups as group (group)}
										<li
											class="{$isChecked(group)
												? 'bg-primary-600 text-white'
												: 'bg-transparent text-primary-700 hover:bg-white/[0.5] hover:text-primary-600 dark:text-primary-600 dark:hover:bg-gray-500/[0.5] dark:hover:text-primary-500'} inline-flex h-full w-full cursor-pointer justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
										>
											<button
												use:melt={$radioItem(group)}
												id={group}
												class="w-full px-2.5 py-1 text-sm font-medium"
											>
												{capitaliseString(group)}
											</button>
										</li>
									{/each}
								</ul>
							</li>
						{/if}
						{#each subMenuNavigation as item (item.href)}
							{@const isCurrent = $page.url.pathname === item.href}
							<li use:melt={$menuItem}>
								<a
									href={item.href}
									class="flex flex-row items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 hover:text-black dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white {isCurrent &&
										'bg-gray-100 text-black dark:bg-gray-900 dark:text-white'}"
									aria-current={isCurrent ? 'page' : undefined}
								>
									{$t(item.name)}
								</a>
							</li>
						{/each}
						<li use:melt={$menuItem}>
							<form method="post" action="/logout" use:enhance>
								<button
									type="submit"
									class="flex w-full cursor-pointer flex-row-reverse items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-danger-800 hover:bg-gray-300 hover:text-danger-900 dark:text-danger-300 dark:hover:bg-gray-700 dark:hover:text-danger-100"
								>
									<Icon
										icon="solar:logout-2-line-duotone"
										class="block h-4 w-4"
									/>
									<span>{$t('common.signOut')}</span>
								</button>
							</form>
						</li>
					</ul>
				</ul>
			</div>
		</div>
	</div>

	{#if $isCollapsibleOpen}
		<div use:melt={$collapsibleContent} transition:slide class="sm:hidden">
			<div class="space-y-1 px-2 pb-3 pt-2">
				{#each mainMenuNavigation as item (item.href)}
					{@const isCurrent = $page.url.pathname === item.href}
					<button use:melt={$triggerCollapsible} class="w-full text-left">
						<a
							href={item.href}
							class="flex flex-row items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 hover:text-black dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white {isCurrent &&
								'bg-gray-100 text-black dark:bg-gray-900 dark:text-white'}"
							aria-current={isCurrent ? 'page' : undefined}
						>
							<Icon icon={item.icon} class="block h-4 w-4" />
							<span>{$t(item.name)}</span>
						</a>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</nav>

<style lang="postcss">
	:global(.iconify + span) {
		translate: 0 0.1rem;
	}
</style>
