<script lang="ts">
import { formatYear } from '$lib/date';

let now = new Date();
let year = formatYear(now);
</script>

<p class="p-16 text-center text-gray-300 dark:text-gray-700">
	&copy; Sebastiaan Benjamins, 2021 - {year}
</p>
