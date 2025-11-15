<script lang="ts">
import GiftCreateModal from '$components/GiftCreateModal.svelte';
import GiftEditModal from '$components/GiftEditModal.svelte';
import { getWishList, removeGift } from '$lib/db/remotes/gifts.remote';
import type { PageProps } from './$types';

let { data }: PageProps = $props();

const query = getWishList();
</script>

<main>
    <h1>Wish list</h1>

    {#if query.loading}
        Loading...
    {:else if query.error}
        failed to load: {query.error.toString()}
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
                    >
                        X
                    </button>
                </li>
            {/each}
        </ul>
    {/if}

    <GiftCreateModal />
</main>
