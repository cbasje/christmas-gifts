<template>
	<div
		class="
			min-h-full
			flex
			items-center
			justify-center
			py-12
			px-4
			sm:px-6
			lg:px-8
		"
	>
		<div class="max-w-md w-full space-y-8">
			<div>
				<h2
					class="
						mt-6
						text-center text-3xl
						font-extrabold
						text-gray-900
						dark:text-gray-100
					"
				>
					Please enter your password
				</h2>
			</div>
			<form class="mt-8 space-y-6" @submit.prevent="submitForm">
				<div class="rounded-md shadow-sm -space-y-px">
					<div>
						<label for="password" class="sr-only">Password</label>
						<input
							id="password"
							name="password"
							v-model="password"
							type="password"
							autocomplete="current-password"
							required
							class="
								appearance-none
								rounded-md
								relative
								block
								w-full
								px-3
								py-2
								border border-gray-300
								placeholder-gray-500
								text-gray-900
								focus:outline-none
								focus:ring-cyan-500
								focus:border-cyan-500
								focus:z-10
								sm:text-sm
							"
							placeholder="Password"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						class="
							group
							relative
							w-full
							flex
							justify-center
							py-2
							px-4
							border border-transparent
							text-sm
							font-medium
							rounded-md
							text-white
							bg-cyan-600
							hover:bg-cyan-700
							focus:outline-none
							focus:ring-2
							focus:ring-offset-2
							focus:ring-cyan-500
						"
					>
						<span
							class="
								absolute
								left-0
								inset-y-0
								flex
								items-center
								pl-3
							"
						>
							<LockClosedIcon
								class="
									h-5
									w-5
									text-cyan-500
									group-hover:text-cyan-400
								"
								aria-hidden="true"
							/>
						</span>
						Sign in
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

import { LockClosedIcon } from '@heroicons/vue/outline';

export default defineComponent({
	components: { LockClosedIcon },
	data() {
		return {
			password: '',
		};
	},
	methods: {
		submitForm() {
			this.signIn(this.password)
				.then((id: string) => {
					localStorage.setItem('user', id);
                    this.$router.push('/overview')
				})
				.catch(() => {
					alert('Signing in was not succesful!');
				});
		},
		...mapActions('users', {
			signIn: 'signIn',
		}),
	},
});
</script>
