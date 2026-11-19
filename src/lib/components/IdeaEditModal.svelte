<script lang="ts">
import { editIdea } from '#db/remotes/ideas.remote.js';
import { getAllUsers } from '#db/remotes/users.remote.js';
import type { ideas } from '#db/schema/gift-item.js';
import { m } from '#lib/paraglide/messages.js';
import { confetti } from '../../routes/+layout.svelte';

type Props = {
	idea: typeof ideas.$inferSelect;
};
let { idea }: Props = $props();

const recipients = getAllUsers(undefined);

let dialogRef = $state<HTMLDialogElement>();
let formRef = $state<HTMLFormElement>();
</script>

<dialog
    bind:this={dialogRef}
    onclose={async (e) => {
        if (e.currentTarget.returnValue !== "default") return;

        try {
            const formData = new FormData(formRef);
            await editIdea({
                idea: formData.get("idea") ?? "",
                recipient: String(formData.get("recipient") ?? ""),
                text: String(formData.get("text") ?? ""),
            });

            confetti.success(m.idea_popup_edit_toast_success());
        } catch (error_) {
            console.error(error_);
        }
    }}
>
    <form method="dialog" bind:this={formRef}>
        <header>{m.idea_popup_edit_title({ item: idea.text })}</header>

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
                {:else}
                    {m.loading()}
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
