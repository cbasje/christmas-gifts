<script lang="ts">
import { editGift } from '#db/remotes/gifts.remote.js';
import type { gifts } from '#db/schema/gift-item.js';
import { m } from '#lib/paraglide/messages.js';
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
    data-foley-change="latch"
    onclose={async (e) => {
        if (e.currentTarget.returnValue !== "default") return;

        try {
            const formData = new FormData(formRef);
            await editGift({
                gift: Number(formData.get("gift")),
                text: String(formData.get("text") ?? ""),
                price: formData.get("price")
                    ? String(formData.get("price"))
                    : null,
                notes: formData.get("notes")
                    ? String(formData.get("notes"))
                    : null,
                link: formData.get("link")
                    ? String(formData.get("link"))
                    : null,
            });

            confetti.success(m.gift_popup_edit_toast_success());
        } catch (error_) {
            console.error(error_);
        }
    }}
>
    <form method="dialog" bind:this={formRef}>
        <header>{m.gift_popup_edit_title({ item: gift.text })}</header>

        <input type="hidden" name="gift" value={gift.id} />

        <label>
            <span>{m.gift_text()}</span>
            <input type="text" name="text" value={gift.text} required data-foley-type />
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
                data-foley-type
            />
        </label>

        <label>
            <span>{m.gift_notes()}</span>
            <textarea name="notes" value={gift.notes} data-foley-type></textarea>
        </label>

        <label>
            <span>{m.gift_link()}</span>
            <input type="link" name="link" bind:value={link} data-foley-type />
        </label>

        <LinkPreview link={link ?? undefined} />

        <footer>
            <button type="submit" value="default" data-foley-press data-foley-release>{m.button_save()}</button>
            <button value="cancel" data-foley-press data-foley-release>{m.button_cancel()}</button>
        </footer>
    </form>
</dialog>

<button
    onclick={() => {
        dialogRef?.showModal();
    }}
    data-foley-press
    data-foley-release
>
    {m.button_edit()}
</button>
