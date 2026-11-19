<script lang="ts">
import {
	finishSeason,
	generateList,
	getAssignment,
	getDrawMembers,
} from '#db/remotes/secret-santa.remote.js';
import { m } from '#lib/paraglide/messages.js';
import { confetti } from '../../+layout.svelte';

const secretSanta = getAssignment();
const drawMembers = getDrawMembers();
</script>

<main>
    <h1>{m.secret_santa_title()}</h1>

    {#if secretSanta.loading}
        {m.loading()}
    {:else}
        <p>{m.secret_santa_season({ season: secretSanta.current?.season ?? 0 })}</p>

        {#if secretSanta.current?.drawn}
            {#if secretSanta.current?.assignment}
                <p>
                    {m.secret_santa_description({
                        name: secretSanta.current?.assignment.name ?? "",
                    })}
                </p>

                <nav class="payoff">
                    <a href="/#recipient-{secretSanta.current?.assignment.id}" data-foley-hover data-foley-click>
                        {m.secret_santa_wishlist()}
                    </a>
                    <a href="/size-chart/{secretSanta.current?.assignment.id}" data-foley-hover data-foley-click>
                        {m.secret_santa_sizes()}
                    </a>
                </nav>
            {:else}
                <p>{m.secret_santa_drawn({ season: secretSanta.current?.season ?? 0 })}</p>
                <p>{m.secret_santa_no_assignment()}</p>
            {/if}

            {#if secretSanta.current?.isAdmin}
                <form
                    {...finishSeason.enhance(async (form) => {
                        if (!confirm(m.secret_santa_confirm_finish())) return;
                        try {
                            if (await form.submit()) {
                                confetti.success(m.secret_santa_finished());
                            }
                        } catch {
                            confetti.error(m.secret_santa_failed());
                        }
                    })}
                >
                    <button class="destructive" data-foley-press data-foley-release>{m.secret_santa_finish()}</button>
                </form>
            {/if}
        {:else if secretSanta.current?.isAdmin}
            <form
                {...generateList.enhance(async (form) => {
                    try {
                        if (await form.submit()) {
                            confetti.success(m.secret_santa_generated());
                        }
                    } catch {
                        confetti.error(m.secret_santa_failed());
                    }
                })}
            >
                {#if drawMembers.loading}
                    {m.loading()}
                {:else if drawMembers.current}
                    <h2>{m.secret_santa_exclude_title()}</h2>
                    <p class="hint">{m.secret_santa_exclude_hint()}</p>

                    <ul class="participants">
                        {#each drawMembers.current.members as member}
                            <li>
                                <label>
                                    <input
                                        {...generateList.fields.participants.as(
                                            "checkbox",
                                            member.id,
                                            true,
                                        )}
                                    />
                                    <span>{member.name}</span>
                                </label>
                            </li>
                        {/each}
                    </ul>
                {/if}

                <div class="page-cta">
                    <button data-foley-press data-foley-release>{m.secret_santa_generate()}</button>
                </div>

                {#each generateList.fields.allIssues() ?? [] as issue}
                    <p class="issue">{issue.message}</p>
                {/each}
            </form>
        {:else}
            <p>{m.secret_santa_not_drawn()}</p>
        {/if}
    {/if}
</main>

<style>
    .payoff {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-relative-2);
        margin-block: var(--size-relative-2);
    }

    ul.participants {
        display: flex;
        flex-direction: column;
        gap: var(--size-1);
        list-style: none;
        padding: 0;
        margin-block: var(--size-relative-2);

        label {
            display: flex;
            align-items: center;
            gap: var(--size-2);
            cursor: pointer;
        }
    }

    .hint {
        color: var(--text-2);
        font-size: var(--font-size-fluid-0);
    }

    .issue {
        font-size: var(--font-size-fluid-0);
        color: var(--red-6);
    }
</style>