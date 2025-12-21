<script lang="ts">
import { page } from '$app/state';
import type { Component } from 'svelte';
import { getAllFamilies, updateFamily } from '$lib/db/remotes/users.remote';
import { logout } from '$lib/db/remotes/auth.remote';
import { m } from '$lib/paraglide/messages.js';
import { confetti } from '../../routes/+layout.svelte';

import HomeIcon from '~icons/chunk/home';
import ListIcon from '~icons/chunk/list';
import ClipboardIcon from '~icons/chunk/clipboard';
import RulerIcon from '~icons/chunk/ruler';
import GiftIcon from '~icons/chunk/gift';
import LogoutIcon from '~icons/chunk/logout';

const families = getAllFamilies();
let enableSecretSanta = $state<boolean>(false);
let submitButtonRef = $state<HTMLButtonElement>();

type Link = {
	label: string;
	path: `/${string}`;
	icon: Component;
	disabled?: boolean;
};
let links = $derived<Link[]>([
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
]);

$effect.pre(() => {
	if (submitButtonRef) submitButtonRef.style.display = 'none';
});
$effect.pre(() => {
	updateFamily.fields.family.set(page.data.family.toString());
});
$effect.pre(() => {
	enableSecretSanta =
		families.current?.find((f) => f.id === page.data.family)?.enableSecretSanta ?? false;
});
</script>

<nav>
    <ul class="links">
        {#each links as l}
            {#if l.disabled !== false}
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

            <button {...updateFamily.buttonProps} bind:this={submitButtonRef}>
                {m.button_switch()}
            </button>
        </form>
    {/if}

    <form
        {...logout.enhance(async ({ form, data, submit }) => {
            try {
                await submit();
                form.reset();

                confetti.success("Successfully logged out!");
            } catch (error) {
                confetti.error("Oh no! Something went wrong");
            }
        })}
        class="logout"
    >
        <button {...logout.buttonProps} class="destructive">
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
