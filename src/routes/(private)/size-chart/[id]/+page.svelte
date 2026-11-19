<script lang="ts">
import { getUser } from '#db/remotes/users.remote.js';
import SizeChart from '#components/SizeChart.svelte';
import { m } from '#lib/paraglide/messages.js';
import type { PageProps } from './$types';

let { params }: PageProps = $props();

const user = $derived(getUser(params.id));
</script>

<main>
    <h1>{m.secret_santa_sizes_for({ name: user.current?.name ?? "" })}</h1>
    <p>{m.size_chart_description()}</p>

    {#if user.loading}
        {m.loading()}
    {:else if user.current}
        <SizeChart sizes={user.current.sizes} />
    {/if}
</main>