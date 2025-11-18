<script lang="ts">
import { editGift } from '$lib/db/remotes/gifts.remote';
import type { gifts } from '$lib/db/schema/gift-item';
import { m } from '$lib/paraglide/messages';
import { confetti } from '../../routes/+layout.svelte';
import LinkPreview from './LinkPreview.svelte';

type Props = {
	gift: typeof gifts.$inferSelect;
};
let { gift }: Props = $props();

let dialogRef = $state<HTMLDialogElement>();
let formRef = $state<HTMLFormElement>();

let link = $state<string | null>(gift.link);
</script>

<dialog
    bind:this={dialogRef}
    onclose={async (e) => {
        if (e.currentTarget.returnValue !== "default") return;

        try {
            const formData = new FormData(formRef);
            const data = Object.fromEntries(formData.entries());
            await editGift(data);

            confetti.success(m.gift_popup_edit_toast_success());
        } catch (error_) {
            console.error(error_.message);
        }
    }}
>
    <form method="dialog" bind:this={formRef}>
        <header>{m.gift_popup_edit_title({ item: gift.text })}</header>

        <input type="hidden" name="gift" value={gift.id} />

        <label>
            <span>{m.gift_text()}</span>
            <input type="text" name="text" value={gift.text} required />
        </label>

        <label>
            <span>{m.gift_price()}</span>
            <input
                type="price"
                name="price"
                value={gift.price
                    ? Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: gift.price.currency,
                          currencyDisplay: "narrowSymbol",
                      }).format(gift.price.value)
                    : ""}
            />
        </label>

        <label>
            <span>{m.gift_notes()}</span>
            <textarea name="notes" value={gift.notes}></textarea>
        </label>

        <label>
            <span>{m.gift_link()}</span>
            <input type="link" name="link" bind:value={link} />
        </label>

        <LinkPreview {link} />

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
