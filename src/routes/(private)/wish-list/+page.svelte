<script lang="ts">
import GiftCreateModal from '$components/GiftCreateModal.svelte';
import GiftEditModal from '$components/GiftEditModal.svelte';
import { getWishList, removeGift } from '$lib/db/remotes/gifts.remote';
import { m } from '$lib/paraglide/messages';
import type { PageProps } from './$types';

let { data }: PageProps = $props();

const list = getWishList();
</script>

<main>
    <h1>{m.wish_list_title()}</h1>

    {#if list.loading}
        {m.loading()}
    {:else if list.current}
        <ul class="wishes">
            {#each list.current as gift}
                <li>
                    <span class="dot" aria-hidden="true">·</span>
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
                    <GiftEditModal {gift} />
                    <button
                        type="button"
                        onclick={(e) => {
                            removeGift(gift.id);
                        }}
                        class="destructive"
                    >
                        {m.button_remove()}
                    </button>
                </li>
            {/each}
        </ul>
    {/if}

    <GiftCreateModal />
</main>

<style>
    ul.wishes {
        display: flex;
        flex-direction: column;
        row-gap: var(--size-3);
        list-style: none;
        padding: 0;

        > li {
            display: grid;
            grid-template-columns: auto 1fr 1fr;
            column-gap: var(--size-3);
            row-gap: var(--size-1);
            align-items: baseline;
            padding: 0;

            &:not(:last-child) {
                padding-bottom: var(--size-fluid-1);
                border-bottom: var(--border-size-2) solid var(--surface-3);
            }

            > .dot {
                grid-column: 1;
                grid-row: 1 / span 3;
            }
            > :not(.dot, button) {
                grid-column: span 2;
            }
        }
    }
</style>
