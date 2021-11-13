<template>
	<Header>
		{{ headerText }}
	</Header>

	<div class="kinesis-container">
		<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
			<template v-for="project in projects" :key="project.id">
				<router-link
					:to="`/${$route.params.categoryId}/${project.id}`"
					class="z-0 hover:z-40"
				>
					<ProjectItem :project="project" />
				</router-link>
			</template>
		</div>
	</div>

	<Footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Footer from '../components/Footer.vue';
import Header from '../components/Header.vue';
import ProjectItem from '@/components/ProjectItem.vue';
import { mapGetters, mapMutations } from 'vuex';

export default defineComponent({
	components: { Footer, Header, ProjectItem },
	mounted() {
		this.selectCategory(this.$route.params.categoryId);

		this.$router.beforeEach((to, from) => {
			if (to.params.categoryId) this.selectCategory(to.params.categoryId);
		});
	},
	methods: {
		...mapMutations('projects', {
			selectCategory: 'selectCategory',
		}),
	},
	computed: {
		headerText() {
			switch (this.$route.params.categoryId) {
				case 'fun':
					return 'Welcome to my Fun Page! This is where I share challenges and other projects';
				default:
					return "Hey, I'm Sebastiaan Benjamins, a designer from The Netherlands";
			}
		},
		...mapGetters('projects', {
			projects: 'getProjectsFromCategory',
		}),
	},
});
</script>

<style>
.kinesis-container {
	@apply relative flex flex-col items-center min-h-screen pb-3;
}

.project {
	@apply w-full aspect-w-3 aspect-h-4;
}
</style>
