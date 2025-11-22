<script lang="ts">
import type { PageProps } from './$types';
import IdeaCreateModal from '$components/IdeaCreateModal.svelte';
import { getAllIdeas, removeIdea } from '$lib/db/remotes/ideas.remote';
import { getUser } from '$lib/db/remotes/users.remote';
import { m } from '$lib/paraglide/messages';
import IdeaEditModal from '$components/IdeaEditModal.svelte';

let { data }: PageProps = $props();

const ideas = getAllIdeas();
</script>

<main>
    <h1>{m.ideas_title()}</h1>

    {#if ideas.loading}
        {m.loading()}
    {:else if ideas.current}
        {#each Object.entries(ideas.current) as [recipient, ideas]}
            {#await getUser(recipient) then user}
                <details style:--_accent="oklch(68% 0.21 {user?.hue})">
                    <summary style:--color-hue={user?.hue}>{user?.name}</summary
                    >

                    <ul>
                        {#each ideas ?? [] as idea}
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
