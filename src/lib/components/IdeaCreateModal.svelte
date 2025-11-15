<script lang="ts">
import { addIdea } from '$lib/db/remotes/ideas.remote';
import { getAllUsers, getAllFamilies } from '$lib/db/remotes/users.remote';

let family = $state<number>();

const families = getAllFamilies();
const recipients = getAllUsers((() => family)());

let dialogRef = $state<HTMLDialogElement>();
let formRef = $state<HTMLFormElement>();
</script>

<dialog
    bind:this={dialogRef}
    onclose={(e) => {
        if (e.currentTarget.returnValue !== "default") return;

        const formData = new FormData(formRef);
        const data = Object.fromEntries(formData.entries());
        addIdea(data);

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
            <select bind:value={family} name="family" required>
                {#each families.current ?? [] as f}
                    <option value={f.id}>
                        {f.name}
                    </option>
                {/each}
            </select>
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
