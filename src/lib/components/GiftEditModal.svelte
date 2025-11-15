<script lang="ts">
import { editGift } from '$lib/db/remotes/gifts.remote';
import type { gifts } from '$lib/db/schema/gift-item';

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
        data.families = formData.getAll("families");
        editGift(data);
    }}
>
    <form method="dialog" bind:this={formRef}>
        <input type="hidden" name="gift" value={gift.id} />

        <label>
            <span>Text</span>
            <input type="text" name="text" value={gift.text} />
        </label>

        <div>
            <button type="submit" value="default">Confirm</button>
            <button value="cancel">Cancel</button>
        </div>
    </form>
</dialog>

<button
    onclick={() => {
        dialogRef?.showModal();
    }}
>
    Edit
</button>
