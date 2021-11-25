<template>
	<div class="bg-gray-50 dark:bg-gray-900 h-screen overflow-scroll">
		<header>
			<Navigation />
		</header>

		<div class="p-3">
			<router-view />
		</div>

		<Footer />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

import Navigation from './components/Navigation.vue';
import Footer from './components/Footer.vue';

export default defineComponent({
	components: { Navigation, Footer },
	mounted() {
		this.loadUsers();
		this.loadGroups();
	},
	methods: {
		...mapActions('users', {
			loadUsers: 'loadUsers',
			loadGroups: 'loadGroups'
		}),
	},
});
</script>
