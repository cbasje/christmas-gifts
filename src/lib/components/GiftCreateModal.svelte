<script lang="ts">
import { page } from '$app/state';
import { addGift } from '$lib/db/remotes/gifts.remote';
import { getAllFamilies } from '$lib/db/remotes/users.remote';

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
        <label>
            <span>Text</span>
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
    Create
</button>
