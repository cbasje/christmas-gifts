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
import { Group } from "~~/lib/types";
import { useGiftItemStore } from "~~/stores/gift-item";
import { useUserStore } from "~~/stores/user";

const giftItemStore = useGiftItemStore();
const userStore = useUserStore();

const router = useRouter();
const localePath = useLocalePath();
const { t } = useI18n();
const { signOut: authSignOut } = useAuth();

const navigation = [
    { name: t("pages.overview.title"), href: "/", current: true },
    { name: t("pages.wishList.title"), href: "/wish-list", current: false },
    { name: t("pages.ideas.title"), href: "/ideas", current: false },
    { name: t("pages.size-chart.title"), href: "/size-chart", current: false },
];

const updateGroup = (id: Group) => {
    userStore.saveCurrentGroupId(id);

    userStore.loadUsers();
    giftItemStore.loadGiftItems();
    giftItemStore.loadWishList();
};
const capitalizeGroupName = ([first, ...rest]: string): string =>
    `${first.toUpperCase()}${rest.join("").toLowerCase()}`;

const signOut = async () => {
    // :to="localePath('/login')"
    await authSignOut();
    router.push("/login");
};
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

                        <Icon
                            v-if="!open"
                            name="ph:list-bold"
                            class="block h-6 w-6"
                        />
                        <Icon v-else name="ph:x-bold" class="block h-6 w-6" />
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
                                :to="localePath(item.href)"
                                class="text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white px-3 py-2 rounded-md text-sm font-semibold"
                                exact-active-class="bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
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
                                <Badge
                                    :title="userStore.currentUser.name"
                                    color="primary"
                                />
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
                                class="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                                <MenuItem
                                    as="li"
                                    v-slot="{ active }"
                                    v-if="
                                        userStore.currentUser.groups.length >
                                            1 &&
                                        userStore.currentGroupId != null
                                    "
                                >
                                    <div
                                        class="block px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200"
                                    >
                                        <RadioGroup
                                            :model-value="
                                                userStore.currentGroupId
                                            "
                                            @update:modelValue="
                                                (id) => updateGroup(id)
                                            "
                                        >
                                            <RadioGroupLabel class="sr-only">
                                                Selected family
                                            </RadioGroupLabel>
                                            <ul
                                                class="flex p-1 space-x-1 bg-primary-900/[0.1] dark:bg-primary-50/[0.1] rounded-lg"
                                            >
                                                <RadioGroupOption
                                                    v-slot="{ checked }"
                                                    v-for="group in Object.keys(
                                                        Group
                                                    )"
                                                    :key="group"
                                                    :value="group"
                                                    class="flex-grow"
                                                >
                                                    <li
                                                        :class="[
                                                            checked
                                                                ? 'text-white bg-primary-600'
                                                                : 'text-primary-700 dark:text-primary-600 bg-transparent hover:bg-white/[0.5] dark:hover:bg-gray-500/[0.5] hover:text-primary-600 dark:hover:text-primary-500',
                                                            'w-full h-full cursor-pointer inline-flex justify-center py-1 px-2.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                                                        ]"
                                                    >
                                                        {{
                                                            capitalizeGroupName(
                                                                Group[
                                                                    group as Group
                                                                ]
                                                            )
                                                        }}
                                                    </li>
                                                </RadioGroupOption>
                                            </ul>
                                        </RadioGroup>
                                    </div>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <NuxtLink
                                        :class="[
                                            active
                                                ? 'bg-gray-100 dark:bg-gray-700'
                                                : '',
                                            'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
                                        ]"
                                        @click="signOut"
                                    >
                                        {{ $t("signOut") }}
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
                        :to="localePath(item.href)"
                        class="block text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white px-3 py-2 rounded-md text-sm font-semibold"
                        exact-active-class="bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
                        :aria-current="item.current ? 'page' : undefined"
                    >
                        {{ item.name }}
                    </NuxtLink>
                </DisclosureButton>
            </div>
        </DisclosurePanel>
    </Disclosure>
</template>
