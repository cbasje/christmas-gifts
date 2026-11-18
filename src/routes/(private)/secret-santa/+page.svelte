<script lang="ts">
import { generateList, getAssignment } from '#db/remotes/secret-santa.remote.js';
import { m } from '#lib/paraglide/messages.js';

const secretSanta = getAssignment();
</script>

<main>
    <h1>{m.secret_santa_title()}</h1>

    {#if secretSanta.loading}
        {m.loading()}
    {:else if secretSanta.current}
        <p>
            {m.secret_santa_description({
                name: secretSanta.current?.name,
            })}
        </p>
    {:else}
        <form {...generateList}>
            <div class="page-cta">
                <button {...generateList.buttonProps}>Generate!</button>
            </div>
        </form>
    {/if}
</main>
