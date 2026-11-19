<script lang="ts">
import { addGift } from '#db/remotes/gifts.remote.js';
import { getAllFamilies } from '#db/remotes/users.remote.js';
import { m } from '#lib/paraglide/messages.js';
import { forceToValidURL } from '#lib/utils/link.js';
import { page } from '$app/state';
import PlusIcon from '~icons/chunk/plus';
import { confetti } from '../../routes/+layout.svelte';
import LinkPreview from './LinkPreview.svelte';

const families = getAllFamilies();

let dialogRef = $state<HTMLDialogElement>();
let formRef = $state<HTMLFormElement>();

let link = $state<string>();
</script>

<dialog
    bind:this={dialogRef}
    onclose={async (e) => {
        if (e.currentTarget.returnValue !== "default") return;

        try {
            const formData = new FormData(formRef);
            await addGift({
                families: formData.getAll("families").map(String),
                text: String(formData.get("text") ?? ""),
                price: formData.get("price") ? String(formData.get("price")) : null,
                notes: formData.get("notes") ? String(formData.get("notes")) : null,
                link: formData.get("link") ? String(formData.get("link")) : null,
            });

            confetti.success(m.gift_popup_create_toast_success());

            formRef?.reset();
        } catch (error_) {
            console.error(error_);
        }
    }}
>
    <form method="dialog" bind:this={formRef}>
        <header>{m.gift_popup_create_title()}</header>

        <label>
            <span>{m.gift_text()}</span>
            <input type="text" name="text" required />
        </label>

        <label>
            <span>{m.gift_price()}</span>
            <input type="price" name="price" />
        </label>

        <label>
            <span>{m.gift_notes()}</span>
            <textarea name="notes"></textarea>
        </label>

        <label>
            <span>{m.gift_link()}</span>
            <input
                type="link"
                name="link"
                bind:value={
                    () => link,
                    (val) => {
                        link = forceToValidURL(val);
                    }
                }
            />
        </label>

        <LinkPreview {link} />

        {#if families.current && families.current.length > 1}
            <label>
                <span>Family</span>
                <select multiple name="families" required>
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
            <input type="hidden" name="families" value={page.data.family} />
        {/if}

        <footer>
            <button type="submit" value="default">{m.button_save()}</button>
            <button value="cancel">{m.button_cancel()}</button>
        </footer>
    </form>
</dialog>

<div class="page-cta">
    <button
        onclick={() => {
            dialogRef?.showModal();
        }}
    >
        <PlusIcon />
        <span>{m.button_create()}</span>
    </button>
</div>
