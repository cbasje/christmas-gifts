<script lang="ts">
import { getFamilyMembers, inviteMember } from '#db/remotes/members.remote.js';
import { getAllFamilies, getCurrentUser } from '#db/remotes/users.remote.js';
import { m } from '#lib/paraglide/messages.js';
import { page } from '$app/state';
import { confetti } from '../../+layout.svelte';

const members = getFamilyMembers();
const families = getAllFamilies();
const me = getCurrentUser();
</script>

<main>
    <h1>{m.members_title()}</h1>
    <p>{m.members_hint()}</p>

    {#if members.loading}
        {m.loading()}
    {:else if members.current}
        <ul class="members">
            {#each members.current as member (member.id)}
                <li>
                    <span class="name">{member.name}</span>
                    <span class="login">
                        {member.username}
                        {#if member.email}
                            · {member.email}
                        {/if}
                    </span>
                </li>
            {/each}
        </ul>

        {#if me.current?.isAdmin}
            <form
                class="invite"
                {...inviteMember.enhance(async (form) => {
                    try {
                        if (await form.submit()) {
                            confetti.success(
                                m.members_invited({
                                    name:
                                        inviteMember.fields.name.value() ?? "",
                                }),
                            );
                        }
                    } catch {
                        confetti.error(m.members_invite_failed());
                    }
                })}
            >
                <label>
                    <span>{m.members_invite_name()}</span>
                    <input
                        {...inviteMember.fields.name.as("text")}
                        required
                        data-foley-type
                    />
                </label>

                <label>
                    <span>{m.members_invite_email()}</span>
                    <input
                        {...inviteMember.fields.email.as("email")}
                        required
                        data-foley-type
                    />
                </label>

                <input type="hidden" name="family" value={page.data.family} />

                <button data-foley-press data-foley-release
                    >{m.members_invite_button()}</button
                >

                {#each inviteMember.fields.allIssues() ?? [] as issue, i (i)}
                    <p class="issue">{issue.message}</p>
                {/each}
            </form>
        {/if}
    {/if}
</main>

<style>
    ul.members {
        list-style: none;
        padding: 0;
        margin-block: var(--size-relative-2);
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(25ch, 1fr));
        gap: var(--size-1);

        li {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            align-items: baseline;
            gap: var(--size-relative-2);
            padding: var(--size-1) var(--size-relative-2);
            background: var(--surface-2);
            border-radius: var(--radius-2);
            font-size: var(--font-size-fluid--1);

            .name {
                font-weight: var(--font-weight-7);
            }

            .login {
                color: var(--text-2);
            }
        }
    }

    form.invite {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-relative-2);
        align-items: end;
        margin-block-start: var(--size-relative-3);
        padding-block-start: var(--size-relative-3);
        border-block-start: 1px solid var(--surface-4);

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

    .issue {
        font-size: var(--font-size-fluid-0);
        color: var(--red-6);
    }
</style>
