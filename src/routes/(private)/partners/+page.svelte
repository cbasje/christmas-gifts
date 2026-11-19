<script lang="ts">
import { addPartner, getPartners, removePartner } from '#db/remotes/secret-santa.remote.js';
import { m } from '#lib/paraglide/messages.js';
import { confetti } from '../../+layout.svelte';

const partnersQuery = getPartners();
</script>

<main>
    <h1>{m.secret_santa_partners_title()}</h1>
    <p>{m.secret_santa_partners_hint()}</p>

    {#if partnersQuery.loading}
        {m.loading()}
    {:else if partnersQuery.current}
        <form
            class="add-pair"
            {...addPartner.enhance(async (form) => {
                try {
                    if (await form.submit()) {
                        confetti.success(m.secret_santa_partner_added());
                    }
                } catch {
                    confetti.error(m.secret_santa_failed());
                }
            })}
        >
            <label>
                <span>{m.secret_santa_partner_select_a()}</span>
                <select
                    {...addPartner.fields.userA.as(
                        "select",
                        partnersQuery.current.members[0]?.id,
                    )}
                >
                    {#each partnersQuery.current.members as member}
                        <option value={member.id}>{member.name}</option>
                    {/each}
                </select>
            </label>

            <label>
                <span>{m.secret_santa_partner_select_b()}</span>
                <select
                    {...addPartner.fields.userB.as(
                        "select",
                        partnersQuery.current.members[1]?.id ??
                            partnersQuery.current.members[0]?.id,
                    )}
                >
                    {#each partnersQuery.current.members as member}
                        <option value={member.id}>{member.name}</option>
                    {/each}
                </select>
            </label>

            <button>{m.secret_santa_partner_add()}</button>

            {#each addPartner.fields.allIssues() ?? [] as issue}
                <p class="issue">{issue.message}</p>
            {/each}
        </form>

        {#if partnersQuery.current.pairs.length === 0}
            <p class="hint">{m.secret_santa_partners_empty()}</p>
        {:else}
            <ul class="pairs">
                {#each partnersQuery.current.pairs as pair}
                    <li>
                        <span>{pair.nameA} & {pair.nameB}</span>
                        <button
                            class="destructive"
                            onclick={async () => {
                                try {
                                    await removePartner({
                                        userA: pair.userA,
                                        userB: pair.userB,
                                    });
                                    confetti.success(m.secret_santa_partner_removed());
                                } catch {
                                    confetti.error(m.secret_santa_failed());
                                }
                            }}
                        >
                            {m.button_remove()}
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    {/if}
</main>

<style>
    form.add-pair {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-relative-2);
        align-items: end;

        label {
            display: flex;
            flex-direction: column;
            gap: var(--size-1);

            span {
                color: var(--text-2);
                font-size: var(--font-size-fluid-0);
            }
        }

        .issue {
            flex-basis: 100%;
        }
    }

    ul.pairs {
        list-style: none;
        padding: 0;
        margin-block: var(--size-relative-2);
        display: flex;
        flex-direction: column;
        gap: var(--size-1);

        li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--size-relative-2);
            padding: var(--size-1) var(--size-relative-2);
            background: var(--surface-2);
            border-radius: var(--radius-2);
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