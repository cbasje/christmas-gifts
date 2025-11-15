<script lang="ts">
import type { LayoutProps } from './$types';
import { Toaster } from 'svelte-french-toast';

import '../lib/styles/global.css';

let { children }: LayoutProps = $props();
</script>

<Toaster />

{@render children()}
