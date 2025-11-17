<script lang="ts">
import { page } from '$app/state';
import { addIdea } from '$lib/db/remotes/ideas.remote';
import { getAllUsers, getAllFamilies } from '$lib/db/remotes/users.remote';
import { m } from '$lib/paraglide/messages';
import toast from 'svelte-french-toast';

import PlusIcon from '~icons/chunk/plus';

let family = $state<number>(page.data.family);

const families = getAllFamilies();
const recipients = $derived(getAllUsers(family));

let dialogRef = $state<HTMLDialogElement>();
let formRef = $state<HTMLFormElement>();
</script>

<dialog
    bind:this={dialogRef}
    onclose={async (e) => {
        if (e.currentTarget.returnValue !== "default") return;

        try {
            const formData = new FormData(formRef);
            const data = Object.fromEntries(formData.entries());
            await addIdea(data);

            toast.success(m.idea_popup_create_toast_success());

            formRef?.reset();
        } catch (error_) {
            console.error(error_.message);
        }
    }}
>
    <form method="dialog" bind:this={formRef}>
        <header>{m.idea_popup_create_title()}</header>

        <label>
            <span>{m.gift_text()}</span>
            <input type="text" name="text" required />
        </label>

        {#if families.current && families.current.length > 1}
            <label>
                <span>Family</span>
                <select bind:value={family} name="family" required>
                    {#each families.current ?? [] as f}
                        <option value={f.id}>
                            {f.name}
                        </option>
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
                {/each}
            </select>
        </label>

        <footer>
            <button type="submit" value="default">{m.button_save()}</button>
            <button value="cancel">{m.button_cancel()}</button>
        </footer>
    </form>
</dialog>

<button
    onclick={() => {
        dialogRef?.showModal();
    }}
    style="width: 100%;"
>
    <PlusIcon />
    <span>{m.button_create()}</span>
</button>
