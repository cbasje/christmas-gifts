<script lang="ts">
import { getHome, setGiftPurchased } from '$lib/db/remotes/gifts.remote';
import { getUser } from '$lib/db/remotes/users.remote';
import { m } from '$lib/paraglide/messages';
import type { PageProps } from './$types';

let { data }: PageProps = $props();

const query = getHome();
</script>

<main>
    <h1>{m.title()}</h1>

    {#if query.loading}
        {m.loading()}
    {:else if query.current}
        {#each Object.entries(query.current) as [recipient, gifts]}
            <details>
                {#await getUser(recipient) then user}
                    <summary style:--color-hue={user?.hue}>{user?.name}</summary
                    >
                {/await}

                <ul>
                    {#each gifts ?? [] as gift}
                        <li class:purchased={gift.purchased}>
                            <input
                                id="gift-{gift.id}"
                                type="checkbox"
                                bind:checked={
                                    () => gift.purchased,
                                    (val) => {
                                        setGiftPurchased({
                                            gift: gift.id,
                                            purchased: val,
                                        });
                                    }
                                }
                            />
                            <label for="gift-{gift.id}">
                                {gift.text}
                            </label>
                        </li>
                    {/each}
                </ul>
            </details>
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

    li.purchased {
        text-decoration: line-through;
        opacity: 0.5;
    }
</style>
