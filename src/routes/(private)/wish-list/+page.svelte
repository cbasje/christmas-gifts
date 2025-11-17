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
        {m.loading()}.
    {:else if list.current}
        <ul>
            {#each list.current as gift}
                <li>
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
                        Remove
                    </button>
                </li>
            {/each}
        </ul>
    {/if}

    <GiftCreateModal />
</main>
