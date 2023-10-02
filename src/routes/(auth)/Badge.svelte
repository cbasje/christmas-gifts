<script lang="ts">
	import type { Color } from '$lib/types';

	export let title: string;
	export let color: Color;
</script>

<span
	class="text-md inline-flex rounded-full px-3 font-medium bg-{color}-300 dark:bg-{color}-600 text-${color}-900 dark:text-white"
>
	{title}
</span>
