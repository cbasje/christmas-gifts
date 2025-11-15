<script lang="ts">
import type { PageProps } from './$types';
import IdeaCreateModal from '$components/IdeaCreateModal.svelte';
import { getAllIdeas } from '$lib/db/remotes/ideas.remote';
import { getUser } from '$lib/db/remotes/users.remote';

let { data }: PageProps = $props();

const query = getAllIdeas();
</script>

<main>
    <h1>Ideas</h1>

    {#if query.loading}
        Loading...
    {:else if query.error}
        failed to load: {query.error.toString()}
    {:else if query.current}
        {#each Object.entries(query.current) as [recipient, gifts]}
            <details>
                {#await getUser(recipient) then user}
                    <summary style:--color-hue={user?.hue}>{user?.name}</summary
                    >
                {/await}

                <ul>
                    {#each gifts ?? [] as gift}
                        <li>
                            <span>{gift.text}</span>
                        </li>
                    {/each}
                </ul>
            </details>
        {/each}
    {/if}

    <IdeaCreateModal />
</main>

<style>
    details {
        background: var(--surface-1);
        border: var(--border-size-2) solid var(--surface-3);

        summary {
            color: var(--color-12);
            background-color: var(--color-1);
        }
    }
</style>
