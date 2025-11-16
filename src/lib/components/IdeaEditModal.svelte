<script lang="ts">
import { page } from '$app/state';
import { editIdea } from '$lib/db/remotes/ideas.remote';
import { getAllUsers } from '$lib/db/remotes/users.remote';
import type { ideas } from '$lib/db/schema/gift-item';
import { m } from '$lib/paraglide/messages';

type Props = {
	idea: typeof ideas.$inferSelect;
};
let { idea }: Props = $props();

const recipients = getAllUsers(page.data.family);

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
            await editIdea(data);
        } catch (error_) {
            console.error(error_.message);
        }
    }}
>
    <form method="dialog" bind:this={formRef}>
        <header>{m.gift_popup_edit_title({ item: idea.text })}</header>

        <input type="hidden" name="idea" value={idea.id} />

        <label>
            <span>{m.gift_text()}</span>
            <input type="text" name="text" value={idea.text} required />
        </label>

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
>
    {m.button_edit()}
</button>
