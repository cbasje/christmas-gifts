<script lang="ts">
import { page } from '$app/state';
import type { Component } from 'svelte';
import { getAllFamilies, updateFamily } from '$lib/db/remotes/users.remote';
import { logout } from '$lib/db/remotes/auth.remote';

import HomeIcon from '~icons/crush/home';
import ListIcon from '~icons/crush/list';
import ClipboardIcon from '~icons/crush/clipboard';
import LogoutIcon from '~icons/crush/logout';

type Link = {
	label: string;
	path: `/${string}`;
	icon: Component;
};
const links: Link[] = [
	{ label: 'Home', path: '/', icon: HomeIcon },
	{ label: 'Wish list', path: '/wish-list', icon: ListIcon },
	{ label: 'Ideas', path: '/ideas', icon: ClipboardIcon },
];

const query = getAllFamilies();

let submitButtonRef = $state<HTMLButtonElement>();

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
        {/each}
    </ul>

    {#if query.current && query.current.length > 1}
        <form {...updateFamily} class="family-selector">
            {#each query.current as f}
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
                Switch
            </button>
        </form>
    {/if}

    <form {...logout} class="logout">
        <button {...logout.buttonProps} class="destructive">
            <span>Sign out</span>
            <LogoutIcon />
        </button>
    </form>
</nav>

<style>
    nav {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        padding: var(--size-relative-3);
        gap: var(--size-relative-2);

        position: sticky;
        top: 0;
        inset-inline: 0;
        z-index: 9999;

        background-color: var(--surface-1);

        ul,
        form {
            padding: 0;
            list-style: none;

            display: flex;
            flex-direction: row;
            gap: inherit;

            li {
                display: contents;
            }

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
</style>
