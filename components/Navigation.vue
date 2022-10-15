<script lang="ts" setup>
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    RadioGroup,
    RadioGroupLabel,
    RadioGroupOption,
} from "@headlessui/vue";
import { PhList, PhX } from "phosphor-vue";
import { useGiftItemStore } from "~~/stores/gift-item";
import { useUserStore } from "~~/stores/user";

const giftItemStore = useGiftItemStore();
const userStore = useUserStore();

const navigation = [
    { name: "Overview", href: "/", current: true },
    { name: "Wish list", href: "/wish-list", current: false },
];

const updateGroup = (id: string) => {
    userStore.saveCurrentGroupId(id);
};
// 		...mapMutations('users', {
// 			signOut: 'signOut',
// 			saveGroupUser: 'saveCurrentGroupId',
// 		}),
// 		...mapMutations('giftItem', {
// 			saveGroupItem: 'saveCurrentGroupId',
// 		}),
// 	},
// 	computed: {
// 		...mapGetters('users', {
// 			currentUser: 'getCurrentUser',
// 			currentGroup: 'getCurrentGroup',
// 			groups: 'getGroupEntities',
// 		}),
// 	},
// });
</script>

<template>
    <Disclosure as="nav" class="bg-white dark:bg-gray-800" v-slot="{ open }">
        <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div class="relative flex items-center justify-between h-16">
                <div
                    class="absolute inset-y-0 left-0 flex items-center sm:hidden"
                >
                    <!-- Mobile menu button-->
                    <DisclosureButton
                        class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-black hover:bg-gray-300 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white"
                    >
                        <span class="sr-only">Open main menu</span>
                        <ph-list
                            v-if="!open"
                            weight="bold"
                            class="block h-6 w-6"
                        />
                        <ph-x v-else weight="bold" class="block h-6 w-6" />
                    </DisclosureButton>
                </div>
                <div
                    class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
                >
                    <div class="hidden sm:block">
                        <div
                            class="flex space-x-4"
                            v-if="userStore.currentUser"
                        >
                            <NuxtLink
                                v-for="item in navigation"
                                :key="item.name"
                                :to="item.href"
                                class="text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white px-3 py-2 rounded-md text-sm font-semibold"
                                exact-active-class="bg-gray-100 dark:bg-gray-900 dark:text-black dark:text-white"
                                :aria-current="
                                    item.current ? 'page' : undefined
                                "
                            >
                                {{ item.name }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div
                    class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
                >
                    <!-- Profile dropdown -->
                    <Menu
                        as="div"
                        class="ml-3 relative"
                        v-if="userStore.currentUser"
                    >
                        <div>
                            <MenuButton
                                class="flex text-md font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-black dark:focus:ring-offset-gray-800 dark:focus:ring-white"
                            >
                                <span class="sr-only">Open user menu</span>
                                <div
                                    :class="[
                                        'px-3 inline-flex rounded-full',
                                        `bg-${userStore.currentUser.name.toLowerCase()}-200`,
                                        `text-${userStore.currentUser.name.toLowerCase()}-900`,
                                    ]"
                                >
                                    {{ userStore.currentUser.name }}
                                </div>
                            </MenuButton>
                        </div>
                        <transition
                            enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95"
                        >
                            <MenuItems
                                as="ul"
                                class="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                                <MenuItem
                                    as="li"
                                    v-slot="{ active }"
                                    v-if="
                                        userStore.currentUser.groups.length > 1
                                    "
                                >
                                    <div
                                        class="block px-3 py-1.5 text-sm text-gray-700"
                                    >
                                        <RadioGroup
                                            :model-value="
                                                userStore.currentGroup.id
                                            "
                                            @update:modelValue="
                                                (id) => updateGroup(id)
                                            "
                                        >
                                            <RadioGroupLabel class="sr-only">
                                                Selected family
                                            </RadioGroupLabel>
                                            <ul
                                                class="flex p-1 space-x-1 bg-cyan-900/[0.1] rounded-lg"
                                            >
                                                <RadioGroupOption
                                                    v-slot="{ checked }"
                                                    v-for="group in userStore
                                                        .currentUser.groups"
                                                    :key="group.id"
                                                    :value="group.id"
                                                    class="flex-grow"
                                                >
                                                    <li
                                                        :class="[
                                                            checked
                                                                ? 'text-white bg-cyan-600'
                                                                : 'text-cyan-700 bg-transparent hover:bg-white/[0.5] hover:text-cyan-600',
                                                            'w-full h-full cursor-pointer inline-flex justify-center py-1 px-2.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500',
                                                        ]"
                                                    >
                                                        {{ group.name }}
                                                    </li>
                                                </RadioGroupOption>
                                            </ul>
                                        </RadioGroup>
                                    </div>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <NuxtLink
                                        to="/login"
                                        :class="[
                                            active ? 'bg-gray-100' : '',
                                            'block px-4 py-2 text-sm text-gray-700',
                                        ]"
                                        @click="userStore.signOut"
                                    >
                                        Sign out
                                    </NuxtLink>
                                </MenuItem>
                            </MenuItems>
                        </transition>
                    </Menu>
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
                    <NuxtLink
                        :to="item.href"
                        class="block text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white px-3 py-2 rounded-md text-sm font-semibold"
                        exact-active-class="bg-gray-100 dark:bg-gray-900 dark:text-black dark:text-white"
                        :aria-current="item.current ? 'page' : undefined"
                    >
                        {{ item.name }}
                    </NuxtLink>
                </DisclosureButton>
            </div>
        </DisclosurePanel>
    </Disclosure>
</template>
