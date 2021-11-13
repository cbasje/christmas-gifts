<template>
	<div
		class="
			w-full
			h-full
			transition
			duration-500
			ease-in-out
			transform
			group-hover:scale-105
			motion-reduce:transform-none
			bg-gray-100
			dark:bg-gray-900
		"
	>
		<img
			:alt="project.title"
			:src="project.url"
			class="
				w-full
				h-full
				object-cover
				transition
				duration-500
				ease-in-out
				group-hover:opacity-20
			"
		/>
	</div>
	<div
		class="
			flex flex-col
			justify-center
			items-center
			w-full
			h-full
			absolute
			top-0
			p-3
			opacity-0
			group-hover:opacity-100
			transition
			duration-500
			ease-in-out
		"
	>
		<h1
			class="
				font-display font-semibold
				uppercase
				text-xl text-black
				dark:text-white
			"
		>
			{{ project.title }}
		</h1>
		<p
			class="
				font-display
				text-black
				dark:text-white
			"
		>
			{{ formatDate(project.date) }}
		</p>
		<p class="font-display text-gray-700 dark:text-gray-300">
			{{ project.keywords }}
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import moment from 'moment';

import { Project } from '@/types/project';

export default defineComponent({
	props: {
		project: {
			type: Object as PropType<Project>,
			default: {},
		},
	},
	methods: {
		formatDate(date: Date) {
			return moment(date).format('MMM, YYYY')
		}
	}
});
</script>
