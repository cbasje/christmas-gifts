<template>
	<div class="bg-gray-100 dark:bg-gray-900 min-h-screen">
		<Navigation />

		<div class="container mx-auto pt-16 px-3">
			<router-view />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

import Navigation from './components/NavigationTW.vue';

export default defineComponent({
	components: { Navigation },
	async mounted() {
		await this.loadProjects();
	},
	methods: {
		...mapActions('projects', {
			loadProjects: 'loadProjects',
		}),
	},
});
</script>
