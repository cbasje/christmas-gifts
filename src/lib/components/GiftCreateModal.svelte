<script lang="ts">
import { page } from '$app/state';
import { addGift } from '$lib/db/remotes/gifts.remote';
import { getAllFamilies } from '$lib/db/remotes/users.remote';
import { m } from '$lib/paraglide/messages';

const families = getAllFamilies();

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
        addGift(data);

        formRef?.reset();
    }}
>
    <form method="dialog" bind:this={formRef}>
        <header>{m.gift_popup_create_title()}</header>

        <label>
            <span>{m.gift_text()}</span>
            <input type="text" name="text" required />
        </label>

        {#if families.current && families.current.length > 1}
            <label>
                <span>Family</span>
                <select multiple name="families" required>
                    {#each families.current ?? [] as f}
                        <option value={f.id}>
                            {f.name}
                        </option>
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

<button
    onclick={() => {
        dialogRef?.showModal();
    }}
>
    {m.button_create()}
</button>
