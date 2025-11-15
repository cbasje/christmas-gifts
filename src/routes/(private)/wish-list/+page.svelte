<script lang="ts">
import GiftCreateModal from '$components/GiftCreateModal.svelte';
import GiftEditModal from '$components/GiftEditModal.svelte';
import { getWishList, removeGift } from '$lib/db/remotes/gifts.remote';
import { m } from '$lib/paraglide/messages';
import type { PageProps } from './$types';

let { data }: PageProps = $props();

const query = getWishList();
</script>

<main>
    <h1>{m.wish_list_title()}</h1>

    {#if query.loading}
        {m.loading()}.
    {:else if query.current}
        <ul>
            {#each query.current as gift}
                <li>
                    <span>{gift.text}</span>
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
