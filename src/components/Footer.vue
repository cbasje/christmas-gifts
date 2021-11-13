<template>
	<p class="p-16 text-gray-300 dark:text-gray-700 text-center">
		&copy; Sebastiaan Benjamins, {{ year }}
	</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import moment from 'moment';

export default defineComponent({
    data() {
        const year = moment().format('YYYY')
        
        return {
            year
        }
    }
})
</script>
