<script lang="ts">
import { page } from '$app/state';
import { getUser } from '$lib/db/remotes/users.remote';
import { m } from '$lib/paraglide/messages';

const user = getUser(page.data.user);
</script>

<main>
    <h1>{m.size_chart_title()}</h1>
    <p>{m.size_chart_description()}</p>

    <pre>{JSON.stringify(user.current?.sizes)}</pre>
</main>
