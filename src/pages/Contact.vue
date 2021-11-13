<template>
	<Header class="text-center">Contact me!</Header>

	<div class="w-full max-w-screen-md mx-auto">
		<p class="font-display text-black dark:text-white">
			If you have any question or just would like to talk to me about
			anything, you can contact me using the form below.
		</p>
		<div class="mt-5">
			<form @submit.prevent="submitForm">
				<div class="overflow-hidden sm:rounded-md">
					<div class="py-5">
						<div class="grid grid-cols-6 gap-6">
							<div class="col-span-6 sm:col-span-3">
								<label
									for="first-name"
									class="
										block
										text-sm
										font-medium font-display
										text-gray-800
										dark:text-gray-200
									"
								>
									First name *
								</label>
								<input
									type="text"
									name="first-name"
									id="first-name"
									autocomplete="given-name"
									v-model="firstName"
									required
									class="
										mt-1
										focus:ring-amber-500
										focus:border-amber-500
										block
										w-full
										sm:text-sm
										border-gray-300
										dark:border-gray-700
										rounded-md
									"
								/>
							</div>

							<div class="col-span-6 sm:col-span-3">
								<label
									for="last-name"
									class="
										block
										text-sm
										font-medium font-display
										text-gray-800
										dark:text-gray-200
									"
								>
									Last name
								</label>
								<input
									type="text"
									name="last-name"
									id="last-name"
									autocomplete="family-name"
									v-model="lastName"
									class="
										mt-1
										focus:ring-amber-500
										focus:border-amber-500
										block
										w-full
										sm:text-sm
										border-gray-300
										dark:border-gray-700
										rounded-md
									"
								/>
							</div>

							<div class="col-span-6">
								<label
									for="email-address"
									class="
										block
										text-sm
										font-medium font-display
										text-gray-800
										dark:text-gray-200
									"
								>
									Email address *
								</label>
								<input
									type="text"
									name="email-address"
									id="email-address"
									autocomplete="email"
									v-model="email"
									required
									class="
										mt-1
										focus:ring-amber-500
										focus:border-amber-500
										block
										w-full
										sm:text-sm
										border-gray-300
										dark:border-gray-700
										rounded-md
									"
								/>
							</div>

							<div class="col-span-6">
								<label
									for="message"
									class="
										block
										text-sm
										font-medium font-display
										text-gray-800
										dark:text-gray-200
									"
								>
									Message *
								</label>
								<div class="mt-1">
									<textarea
										id="message"
										name="message"
										rows="5"
										v-model="message"
										required
										class="
											focus:ring-amber-500
											focus:border-amber-500
											mt-1
											block
											w-full
											sm:text-sm
											border border-gray-300
											dark:border-gray-700
											rounded-md
										"
										placeholder="Type your message here..."
									/>
								</div>
							</div>
						</div>
					</div>
					<div class="py-3 text-left">
						<button
							type="submit"
							class="
								inline-flex
								justify-center
								py-2
								px-4
								border border-transparent
								text-md
								font-medium font-display
								rounded-full
								text-white
								dark:text-black
								bg-black
								dark:bg-white
								hover:bg-gray-800
								dark:hover:bg-gray-200
								focus:outline-none
								focus:ring-2
								focus:ring-offset-2
								focus:ring-amber-500
							"
						>
							Submit
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>

	<Footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import mailService from '@/services/mail.service';

import Footer from '../components/Footer.vue';
import Header from '../components/Header.vue';

export default defineComponent({
	components: { Footer, Header },
	data() {
		return {
			firstName: '',
			lastName: '',
			email: '',
			message: '',
		};
	},
	methods: {
		submitForm() {
			mailService
				.addToAirtable({
					firstName: this.firstName,
					lastName: this.lastName,
					email: this.email,
					message: this.message,
				})
				.then(() => {
					// console.log('Email sent');
					this.firstName = '';
					this.lastName = '';
					this.email = '';
					this.message = '';
				})
				.catch((error) => {
					console.error(error);
					alert('Something went wrong!');
				});
		},
	},
});
</script>
