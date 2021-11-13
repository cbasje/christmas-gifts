<template>
	<Header v-if="project" class="text-center">
		<template #default>
			{{ project.title }}
		</template>

		<template #subtitle>{{ formatDate(project.date) }}</template>
	</Header>

	<div v-if="project">
		<img :src="project.url" :alt="project.title" class="w-full" />
		<MarkdownDisplay
			v-if="project.text"
			class="mt-8"
			:markdown="project.text"
		/>
	</div>

	<Footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { mapActions, mapGetters, mapMutations } from 'vuex';

import moment from 'moment';

import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import MarkdownDisplay from '@/components/MarkdownDisplay.vue';

export default defineComponent({
	components: { Footer, Header, MarkdownDisplay },
	setup() {
		const route = useRoute();
		const { projectId } = route.params;

		return {
			projectId,
		};
	},
	async mounted() {
		await this.selectProject(this.projectId);
		await this.loadSelectedProject();
	},
	methods: {
		formatDate(date: Date) {
			return moment(date).format('MMMM, YYYY')
		},
		...mapMutations('projects', {
			selectProject: 'selectProject',
		}),
		...mapActions('projects', {
			loadSelectedProject: 'loadSelectedProject',
		}),
	},
	computed: {
		headerText() {
			switch (this.$route.params.item) {
				case 'fun':
					return 'Welcome to my Fun Page! This is where I share challenges and other projects';
				default:
					return "Hey, I'm Sebastiaan Benjamins, a designer from The Netherlands";
			}
		},
		...mapGetters('projects', {
			project: 'getSelectedProject',
		}),
	},
});
</script>
