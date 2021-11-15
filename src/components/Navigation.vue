<template>
	<Disclosure as="nav" class="bg-white dark:bg-gray-800" v-slot="{ open }">
		<div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
			<div class="relative flex items-center justify-between h-16">
				<div
					class="
						absolute
						inset-y-0
						left-0
						flex
						items-center
						sm:hidden
					"
				>
					<!-- Mobile menu button-->
					<DisclosureButton
						class="
							inline-flex
							items-center
							justify-center
							p-2
							rounded-md
							text-gray-600
							dark:text-gray-400
							hover:text-black hover:bg-gray-300
							dark:hover:text-white dark:hover:bg-gray-700
							focus:outline-none
							focus:ring-2
							focus:ring-inset
							focus:ring-black
							dark:focus:ring-white
						"
					>
						<span class="sr-only">Open main menu</span>
						<MenuIcon
							v-if="!open"
							class="block h-6 w-6"
							aria-hidden="true"
						/>
						<XIcon
							v-else
							class="block h-6 w-6"
							aria-hidden="true"
						/>
					</DisclosureButton>
				</div>
				<div
					class="
						flex-1 flex
						items-center
						justify-center
						sm:items-stretch sm:justify-start
					"
				>
					<div class="hidden sm:block">
						<div class="flex space-x-4">
							<router-link
								v-for="item in navigation"
								:key="item.name"
								:to="item.href"
								class="
									text-gray-700
									dark:text-gray-300
									hover:bg-gray-300 hover:text-black
									dark:hover:bg-gray-700 dark:hover:text-white
									px-3
									py-2
									rounded-md
									text-sm
									font-semibold
								"
								exact-active-class="bg-gray-100 dark:bg-gray-900 dark:text-black dark:text-white"
								:aria-current="
									item.current ? 'page' : undefined
								"
							>
								{{ item.name }}
							</router-link>
						</div>
					</div>
				</div>
				<div
					class="
						absolute
						inset-y-0
						right-0
						flex
						items-center
						pr-2
						sm:static sm:inset-auto sm:ml-6 sm:pr-0
					"
				>
					<!-- Profile dropdown -->
					<div class="ml-3 relative">
						<div
							v-if="currentUser"
							class="
								px-3
								inline-flex
								text-md
								font-medium
								rounded-full
							"
							:style="`background-color: ${currentUser.color}; color: ${currentUser.colorDark};`"
						>
							{{ currentUser.name }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<DisclosurePanel class="sm:hidden">
			<div class="px-2 pt-2 pb-3 space-y-1">
				<DisclosureButton
					v-for="item in navigation"
					:key="item.name"
					class="w-full text-left"
				>
					<router-link
						:to="item.href"
						class="
							block
							text-gray-700
							dark:text-gray-300
							hover:bg-gray-300 hover:text-black
							dark:hover:bg-gray-700 dark:hover:text-white
							px-3
							py-2
							rounded-md
							text-sm
							font-semibold
						"
						exact-active-class="bg-gray-100 dark:bg-gray-900 dark:text-black dark:text-white"
						:aria-current="item.current ? 'page' : undefined"
					>
						{{ item.name }}
					</router-link>
				</DisclosureButton>
			</div>
		</DisclosurePanel>
	</Disclosure>
</template>

<script lang="ts">
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
} from '@headlessui/vue';
import { BellIcon, MenuIcon, XIcon } from '@heroicons/vue/outline';
import { mapGetters } from 'vuex';

const navigation = [
	{ name: 'Overview', href: '/overview', current: true },
	{ name: 'Wish list', href: '/wish-list', current: false },
];

export default {
	components: {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		Menu,
		MenuButton,
		MenuItem,
		MenuItems,
		BellIcon,
		MenuIcon,
		XIcon,
	},
	setup() {
		return {
			navigation,
		};
	},
	computed: {
		...mapGetters('users', {
			currentUser: 'getCurrentUser',
		}),
	},
};
</script>
