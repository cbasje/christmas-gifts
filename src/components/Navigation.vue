<template>
	<Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
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
							text-gray-400
							hover:text-white hover:bg-gray-700
							focus:outline-none
							focus:ring-2
							focus:ring-inset
							focus:ring-white
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
									text-gray-300
									hover:bg-gray-700 hover:text-white
									px-3
									py-2
									rounded-md
									text-sm
									font-medium
								"
								exact-active-class="bg-gray-900 text-white"
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
						<!-- <div
							class="
								bg-gray-800
								flex
								text-sm
								rounded-full
							"
						>
							<span class="sr-only">Open user menu</span>
							<img
								class="h-8 w-8 rounded-full"
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
							/>
						</div> -->
						<div
							v-if="currentUser"
							class="
								px-3
								inline-flex
								text-md
								font-semibold
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
					as="a"
					:href="item.href"
					:class="[
						item.current
							? 'bg-gray-900 text-white'
							: 'text-gray-300 hover:bg-gray-700 hover:text-white',
						'block px-3 py-2 rounded-md text-base font-medium',
					]"
					:aria-current="item.current ? 'page' : undefined"
				>
					{{ item.name }}
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
	{ name: 'Own list', href: '/own-list', current: false },
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
