<script lang="ts">
import IdeaCreateModal from '#components/IdeaCreateModal.svelte';
import IdeaEditModal from '#components/IdeaEditModal.svelte';
import { getAllIdeas, removeIdea } from '#db/remotes/ideas.remote.js';
import { getUser } from '#db/remotes/users.remote.js';
import { m } from '#lib/paraglide/messages.js';
import type { PageProps } from './$types';

let { data }: PageProps = $props();

const ideas = getAllIdeas();
</script>

<main>
    <h1>{m.ideas_title()}</h1>

    {#if ideas.loading}
        {m.loading()}
    {:else if ideas.current}
        {#each Object.entries(ideas.current) as [recipient, items]}
            {#await getUser(recipient) then user}
                <details style:--_accent="oklch(68% 0.21 {user?.hue})">
                    <summary style:--color-hue={user?.hue}>
                        <span>{user?.name}</span>
                    </summary>

                    <ul>
                        {#each items as idea}
                            <li>
                                <span>{idea.text}</span>
                                <IdeaEditModal {idea} />
                                <button
                                    type="button"
                                    onclick={(e) => {
                                        removeIdea(idea.id);
                                    }}
                                    class="destructive"
                                >
                                    Remove
                                </button>
                            </li>
                        {/each}
                    </ul>
                </details>
            {/await}
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
