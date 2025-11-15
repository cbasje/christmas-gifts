<script lang="ts">
import { editGift } from '$lib/db/remotes/gifts.remote';
import type { gifts } from '$lib/db/schema/gift-item';
import { m } from '$lib/paraglide/messages';

type Props = {
	gift: typeof gifts.$inferSelect;
};
let { gift }: Props = $props();

let dialogRef = $state<HTMLDialogElement>();
let formRef = $state<HTMLFormElement>();
</script>

<dialog
    bind:this={dialogRef}
    onclose={(e) => {
        if (e.currentTarget.returnValue !== "default") return;

        const formData = new FormData(formRef);
        const data = Object.fromEntries(formData.entries());
        editGift(data);
    }}
>
    <form method="dialog" bind:this={formRef}>
        <header>{m.gift_popup_edit_title({ item: gift.text })}</header>

        <input type="hidden" name="gift" value={gift.id} />

        <label>
            <span>{m.gift_text()}</span>
            <input type="text" name="text" value={gift.text} />
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
