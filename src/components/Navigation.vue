<template>
	<nav
		class="
			w-screen
			fixed
			z-50
			p-5
			bg-gradient-to-b
			from-gray-100
			dark:from-gray-900
		"
	>
		<div class="flex items-center">
			<ul class="flex-1 flex justify-start">
				<li v-for="tab in tabs" :key="tab.id" class="pr-3">
					<router-link
						class="
							text-black
							dark:text-white
							active:font-bold
							uppercase
							font-display
						"
						:to="tab.link"
						active-class="font-bold"
					>
						{{ tab.title }}
					</router-link>
				</li>
			</ul>

			<router-link
				class="text-black dark:text-white font-display flex-none"
				to="/"
			>
				<!-- <p>benjamiin.</p> -->
				<BenjamiinLogo class="w-8 h-8" />
			</router-link>

			<ul class="flex-1 flex justify-end">
				<li v-for="link in socialLinks" :key="link.id" class="pr-3">
					<a
						class="text-black dark:text-white inline-block w-6 h-6"
						:href="link.link"
						target="_blank"
					>
						<component :is="link.logo" />
					</a>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Sun from '../components/icons/sun.vue';
import BenjamiinLogo from './logos/Benjamiin.vue';
import LinkedInLogo from './logos/LinkedIn.vue';
import InstagramLogo from './logos/Instagram.vue';
import GithubLogo from './logos/Github.vue';

export default defineComponent({
	components: { Sun, BenjamiinLogo, LinkedInLogo, InstagramLogo, GithubLogo },
	data() {
		return {
			tabs: [
				{ id: 1, title: 'Work', link: '/work' },
				{ id: 2, title: 'Fun', link: '/fun' },
				{ id: 3, title: 'Contact', link: '/contact' },
			],
			socialLinks: [
				{
					id: 1,
					logo: 'LinkedInLogo',
					link: 'https://www.linkedin.com/in/sebastiaanbenjamins/',
				},
				{
					id: 2,
					logo: 'InstagramLogo',
					link: 'http://instagram.com/cbasje',
				},
				{
					id: 3,
					logo: 'GithubLogo',
					link: 'https://github.com/sebastiaanb',
				},
			],
		};
	},
});
</script>
