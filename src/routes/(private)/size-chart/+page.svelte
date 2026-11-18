<script lang="ts">
import { getUser } from '#db/remotes/users.remote.js';
import { m } from '#lib/paraglide/messages.js';
import { page } from '$app/state';

const user = getUser(page.data.user);
</script>

<main>
    <h1>{m.size_chart_title()}</h1>
    <p>{m.size_chart_description()}</p>

    {#if user.loading}
        {m.loading()}
    {:else if user.current}
        <pre>{JSON.stringify(user.current.sizes)}</pre>
    {/if}
</main>
