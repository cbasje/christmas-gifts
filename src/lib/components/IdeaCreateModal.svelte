<script lang="ts">
import { addIdea } from '#db/remotes/ideas.remote.js';
import { getAllFamilies, getAllUsers } from '#db/remotes/users.remote.js';
import { m } from '#lib/paraglide/messages.js';
import { page } from '$app/state';
import PlusIcon from '~icons/chunk/plus';
import { confetti } from '../../routes/+layout.svelte';

let family = $state<number>(page.data.family);

const families = getAllFamilies();
const recipients = $derived(getAllUsers(family));

let dialogRef = $state<HTMLDialogElement>();
let formRef = $state<HTMLFormElement>();
</script>

<dialog
    bind:this={dialogRef}
    data-foley-change="latch"
    onclose={async (e) => {
        if (e.currentTarget.returnValue !== "default") return;

        try {
            const formData = new FormData(formRef);
            await addIdea({
                recipient: String(formData.get("recipient") ?? ""),
                family: String(formData.get("family") ?? ""),
                text: String(formData.get("text") ?? ""),
            });

            confetti.success(m.idea_popup_create_toast_success());

            formRef?.reset();
        } catch (error_) {
            console.error(error_);
        }
    }}
>
    <form method="dialog" bind:this={formRef}>
        <header>{m.idea_popup_create_title()}</header>

        <label>
            <span>{m.gift_text()}</span>
            <input type="text" name="text" required data-foley-type />
        </label>

        {#if families.current && families.current.length > 1}
            <label>
                <span>Family</span>
                <select bind:value={family} name="family" required>
                    {#each families.current ?? [] as f}
                        <option value={f.id}>
                            {f.name}
                        </option>
                    {:else}
                        {m.loading()}
                    {/each}
                </select>
            </label>
        {:else}
            <input type="hidden" name="family" value={page.data.family} />
        {/if}

        <label>
            <span>Recipient</span>
            <select name="recipient" required>
                {#each recipients.current ?? [] as r}
                    <option value={r.id}>
                        {r.name}
                    </option>
                {:else}
                    {m.loading()}
                {/each}
            </select>
        </label>

        <footer>
            <button type="submit" value="default" data-foley-press data-foley-release>{m.button_save()}</button>
            <button value="cancel" data-foley-press data-foley-release>{m.button_cancel()}</button>
        </footer>
    </form>
</dialog>

<div class="page-cta">
    <button
        onclick={() => {
            dialogRef?.showModal();
        }}
        data-foley-press
        data-foley-release
    >
        <PlusIcon />
        <span>{m.button_create()}</span>
    </button>
</div>
