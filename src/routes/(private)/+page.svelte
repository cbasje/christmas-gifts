<script lang="ts">
import { page } from '$app/state';
import { getHome, setGiftPurchased } from '$lib/db/remotes/gifts.remote';
import { getUser } from '$lib/db/remotes/users.remote';
import { m } from '$lib/paraglide/messages';
import type { PageProps } from './$types';

let { data }: PageProps = $props();

const home = getHome();
const currentUser = getUser(page.data.user);
</script>

<main>
    <h1>{m.greeting({ name: currentUser.current?.name || "" })}</h1>

    {#if home.loading}
        {m.loading()}
    {:else if home.current}
        {#each Object.entries(home.current) as [recipient, gifts]}
            {#await getUser(recipient) then user}
                <details style:--_accent="oklch(68% 0.21 {user?.hue})">
                    <summary style:--color-hue={user?.hue}>{user?.name}</summary
                    >

                    <ul class="gifts">
                        {#each gifts ?? [] as gift}
                            <li class:purchased={gift.isPurchased}>
                                <input
                                    id="gift-{gift.id}"
                                    type="checkbox"
                                    bind:checked={
                                        () => gift.isPurchased,
                                        (val) => {
                                            setGiftPurchased({
                                                gift: gift.id,
                                                isPurchased: val,
                                            });
                                        }
                                    }
                                />
                                <label for="gift-{gift.id}">
                                    <span>{gift.text}</span>
                                    {#if gift.price}
                                        <span style="color: var(--text-2)">
                                            {Intl.NumberFormat(undefined, {
                                                style: "currency",
                                                currency: gift.price.currency,
                                                currencyDisplay: "narrowSymbol",
                                            }).format(gift.price.value)}
                                        </span>
                                    {/if}
                                    {#if gift.link}
                                        <a
                                            href={gift.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {gift.link}
                                        </a>
                                    {/if}
                                </label>
                            </li>
                        {/each}
                    </ul>
                </details>
            {/await}
        {/each}
    {/if}
</main>

<style>
    details {
        background: var(--surface-1);
        border: var(--border-size-2) solid var(--surface-3);

        summary {
            color: white;
            background-color: var(--color-5);
        }
    }

    ul.gifts {
        display: flex;
        flex-direction: column;
        row-gap: var(--size-3);
        list-style: none;
        padding: 0;

        > li {
            display: grid;
            grid-template-columns: auto 1fr;
            column-gap: var(--size-3);
            row-gap: var(--size-1);
            align-items: baseline;
            padding: 0;

            &.purchased {
                text-decoration: line-through;
                opacity: 0.5;
            }

            &:not(:last-child) {
                padding-bottom: var(--size-fluid-1);
                border-bottom: var(--border-size-2) solid var(--surface-3);
            }

            > input[type="checkbox"] {
                grid-column: 1;
                grid-row: 1 / span 3;
            }
            > label {
                display: contents;
            }
        }
    }
</style>
