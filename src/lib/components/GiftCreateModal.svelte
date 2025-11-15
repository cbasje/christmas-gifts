<script lang="ts">
import { addGift } from '$lib/db/remotes/gifts.remote';
import { getAllFamilies } from '$lib/db/remotes/users.remote';

const query = getAllFamilies();

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

        <label>
            <span>Family</span>
            <select multiple name="families" required>
                {#each query.current ?? [] as f}
                    <option value={f.id}>
                        {f.name}
                    </option>
                {/each}
            </select>
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
    Create
</button>
