<script lang="ts">
import type { Component } from 'svelte';
import { logout } from '#db/remotes/auth.remote.js';
import { getAllFamilies, getCurrentUser, updateFamily } from '#db/remotes/users.remote.js';
import { m } from '#lib/paraglide/messages.js';
import { page } from '$app/state';
import ClipboardIcon from '~icons/chunk/clipboard';
import GiftIcon from '~icons/chunk/gift';
import HeartIcon from '~icons/chunk/heart';
import HomeIcon from '~icons/chunk/home';
import ListIcon from '~icons/chunk/list';
import LogoutIcon from '~icons/chunk/logout';
import RulerIcon from '~icons/chunk/ruler';
import { confetti } from '../../routes/+layout.svelte';

const families = getAllFamilies();
const me = getCurrentUser();
const enableSecretSanta = $derived(
	families.current?.find((f) => f.id === page.data.family)?.enableSecretSanta ?? false
);
let submitButtonRef = $state<HTMLButtonElement>();

$inspect(enableSecretSanta);

type Link = {
	label: string;
	path: `/${string}`;
	icon: Component;
	disabled?: boolean;
};
const links = $derived.by<Link[]>(() => [
	{ label: m.overview_title(), path: '/', icon: HomeIcon },
	{ label: m.wish_list_title(), path: '/wish-list', icon: ListIcon },
	{ label: m.ideas_title(), path: '/ideas', icon: ClipboardIcon },
	{ label: m.size_chart_title(), path: '/size-chart', icon: RulerIcon },
	{
		label: m.secret_santa_title(),
		path: '/secret-santa',
		icon: GiftIcon,
		disabled: !enableSecretSanta,
	},
	{
		label: m.partners_title(),
		path: '/partners',
		icon: HeartIcon,
		disabled: !me.current?.isAdmin,
	},
]);

$effect.pre(() => {
	if (submitButtonRef) submitButtonRef.style.display = 'none';
});
$effect.pre(() => {
	updateFamily.fields.family.set(page.data.family.toString());
});
</script>

<nav>
    <ul class="links">
        {#each links as l}
            {#if l.disabled !== true}
                <li>
                    <a
                        href={l.path}
                        aria-current={page.url.pathname === l.path
                            ? "page"
                            : undefined}
                        class="btn"
                    >
                        <l.icon />
                        <span>{l.label}</span>
                    </a>
                </li>
            {/if}
        {/each}
    </ul>

    {#if families.current && families.current.length > 1}
        <form {...updateFamily} class="family-selector">
            {#each families.current as f}
                <label class="btn">
                    <span>{f.name}</span>
                    <input
                        {...updateFamily.fields.family.as(
                            "radio",
                            f.id.toString(),
                        )}
                        onchange={() => {
                            submitButtonRef?.click();
                        }}
                    />
                </label>
            {/each}

            <button type="submit" bind:this={submitButtonRef}>
                {m.button_switch()}
            </button>
        </form>
    {/if}

    <form
        {...logout.enhance(async ({ element, submit }) => {
            try {
                await submit();
                element.reset();

                confetti.success("Successfully logged out!");
            } catch (error) {
                confetti.error("Oh no! Something went wrong");
            }
        })}
        class="logout"
    >
        <button type="submit" class="destructive">
            <span>{m.sign_out()}</span>
            <LogoutIcon />
        </button>
    </form>
</nav>

<style>
    nav {
        view-transition-name: menu;

        display: flex;
        flex-direction: column;
        padding: var(--size-relative-3);
        gap: var(--size-relative-2);

        position: sticky;
        top: 0;
        inset-inline: 0;
        z-index: 9998;

        background-color: var(--surface-1);

        ul,
        form {
            padding: 0;
            list-style: none;

            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: inherit;

            li {
                display: contents;
            }
        }

        @media (min-width: 768px) {
            display: grid;
            grid-template-columns: auto 1fr auto auto;

            ul,
            form {
                &.links {
                    grid-column: 1;
                }
                &.family-selector {
                    grid-column: 3;
                }
                &.logout {
                    grid-column: 4;
                }
            }
        }
    }
</style>
