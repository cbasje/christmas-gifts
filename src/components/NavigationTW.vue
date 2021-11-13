<template>
	<Disclosure
		as="nav"
		class="
			w-screen
			fixed
			z-50
			bg-gradient-to-b
			from-gray-100
			dark:from-gray-900
		"
		v-slot="{ open }"
	>
		<div class="px-2 sm:px-6 lg:px-8">
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
					<router-link class="flex-shrink-0 flex items-center" to="/">
						<BenjamiinLogo
							class="w-8 h-8 text-black dark:text-white"
						/>
					</router-link>
					<div class="hidden sm:block sm:ml-6">
						<div class="flex items-center space-x-4">
							<template
								v-for="item in navigation"
								:key="item.name"
							>
								<router-link
									v-if="!item.subItems"
									:to="item.href"
									class="
										text-black
										dark:text-white
										hover:bg-gray-200
										dark:hover:bg-gray-800
										bg-transparent bg-opacity-75
										hover:bg-opacity-75
										px-3
										py-2
										rounded-md
										text-sm
										uppercase
									"
									active-class="font-bold"
									:aria-current="
										item.current ? 'page' : undefined
									"
								>
									{{ item.name }}
								</router-link>

								<Menu v-else as="div" class="relative">
									<router-link
										:to="item.href"
										class="
											group
										text-black
										dark:text-white
										hover:bg-gray-200
										dark:hover:bg-gray-800
											bg-transparent bg-opacity-75
											hover:bg-opacity-75
											rounded-md
											pl-3
											pr-1
											inline-flex
											items-center
											text-sm
											uppercase
										"
										active-class="font-bold"
									>
										<span class="py-2">
											{{ item.name }}
										</span>
										<MenuButton>
											<ChevronDownIcon
												:class="[
													open
														? 'text-gray-600'
														: 'text-gray-400',
													'm-2 h-5 w-5 group-hover:text-gray-500',
												]"
												aria-hidden="true"
											/>
										</MenuButton>
									</router-link>

									<transition
										enter-active-class="transition ease-out duration-100"
										enter-from-class="transform opacity-0 scale-95"
										enter-to-class="transform opacity-100 scale-100"
										leave-active-class="transition ease-in duration-75"
										leave-from-class="transform opacity-100 scale-100"
										leave-to-class="transform opacity-0 scale-95"
									>
										<MenuItems
											class="
												origin-top-left
												absolute
												mt-2
												w-48
												rounded-md
												shadow-lg
												py-1
												bg-white
												ring-1 ring-black ring-opacity-5
												focus:outline-none
											"
										>
											<MenuItem
												v-slot="{ active }"
												v-for="subItem in item.subItems"
												:key="subItem.name"
											>
												<router-link
													:to="subItem.href"
													:class="[
														active
															? 'bg-gray-100'
															: '',
														'block px-4 py-2 text-sm text-gray-700',
													]"
													exact-active-class="bg-amber-500"
												>
													{{ subItem.name }}
												</router-link>
											</MenuItem>
										</MenuItems>
									</transition>
								</Menu>
							</template>
						</div>
					</div>
				</div>

				<!-- FIXME -->
				<ul
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
					<li v-for="link in socialLinks" :key="link.id" class="flex pl-3">
						<a
							class="
								text-black
								dark:text-white
								inline-block
								w-6
								h-6
							"
							:href="link.link"
							target="_blank"
						>
							<component :is="link.logo" />
						</a>
					</li>
					<!-- <button
						type="button"
						class="
							bg-gray-800
							p-1
							rounded-full
							text-gray-400
							hover:text-white
							focus:outline-none
							focus:ring-2
							focus:ring-offset-2
							focus:ring-offset-gray-800
							focus:ring-white
						"
					>
						<span class="sr-only">View notifications</span>
						<BellIcon class="h-6 w-6" aria-hidden="true" />
					</button> -->
				</ul>
			</div>
		</div>

		<DisclosurePanel class="sm:hidden">
			<div class="px-2 pt-2 pb-3 space-y-1">
				<DisclosureButton
					v-for="item in navigation"
					:key="item.name"
					class="block w-full"
				>
					<router-link
						:to="item.href"
						:class="[
							item.current
								? 'bg-gray-900 text-white'
								: 'text-gray-300 hover:bg-gray-700 hover:text-white',
							'block px-3 py-2 rounded-md text-base font-medium',
						]"
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
import { defineComponent } from 'vue';

import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
} from '@headlessui/vue';
import {
	BellIcon,
	MenuIcon,
	XIcon,
	ChevronDownIcon,
} from '@heroicons/vue/outline';

import Sun from '../components/icons/sun.vue';
import BenjamiinLogo from './logos/Benjamiin.vue';
import LinkedInLogo from './logos/LinkedIn.vue';
import InstagramLogo from './logos/Instagram.vue';
import GithubLogo from './logos/Github.vue';

const navigation = [
	{
		name: 'Work',
		href: '/work',
		current: true,
		subItems: [
			{
				name: 'Graphic Design',
				href: '/work',
				current: true,
			},
		],
	},
	{ name: 'Fun', href: '/fun', current: false },
	{ name: 'Contact', href: '/contact', current: false },
];
const socialLinks = [
	{
		id: 1,
		logo: 'LinkedInLogo',
		link: 'https://www.linkedin.com/in/sebastiaanbenjamins/',
	},
	{
		id: 2,
		logo: 'InstagramLogo',
		link: 'http://instagram.com/cbasje',
	},
	{
		id: 3,
		logo: 'GithubLogo',
		link: 'https://github.com/sebastiaanb',
	},
];

export default defineComponent({
	components: {
		Sun,
		BenjamiinLogo,
		LinkedInLogo,
		InstagramLogo,
		GithubLogo,
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
		ChevronDownIcon,
	},
	setup() {
		return {
			navigation,
			socialLinks,
		};
	},
});
</script>
