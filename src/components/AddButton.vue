<template>
	<div class="fixed bottom-6 right-6">
		<button
			type="button"
			@click="openModal"
			class="
				flex
				justify-center
				items-center
				w-16
				h-16
				drop-shadow-md
				text-sm
				font-medium
				text-white
				bg-cyan-600
				rounded-full
				hover:bg-cyan-700
				focus:outline-none
				focus-visible:ring-2
				focus-visible:ring-white
				focus-visible:ring-opacity-75
			"
		>
			<PlusIcon
				class="h-6 w-6 text-white group-hover:text-cyan-400"
				aria-hidden="true"
			/>
		</button>
	</div>

	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="closeModal">
			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="min-h-screen px-4 text-center">
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0"
						enter-to="opacity-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100"
						leave-to="opacity-0"
					>
						<DialogOverlay
							class="fixed inset-0 bg-black opacity-30"
						/>
					</TransitionChild>

					<span
						class="inline-block h-screen align-middle"
						aria-hidden="true"
					>
						&#8203;
					</span>

					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<div
							class="
								inline-block
								w-full
								max-w-md
								p-6
								my-8
								overflow-hidden
								text-left
								align-middle
								transition-all
								transform
								bg-white
								shadow-xl
								rounded-xl
							"
						>
							<DialogTitle
								as="h3"
								class="
									text-lg
									font-medium
									leading-6
									text-gray-900
								"
							>
								Add a wish list item
							</DialogTitle>
							<form @submit.prevent="submitForm" class="mt-2">
								<div class="space-y-6 py-6">
									<div aria-label="Name">
										<label
											for="name"
											class="
												block
												text-sm
												font-medium
												text-gray-700
											"
										>
											Name
										</label>
										<input
											type="text"
											name="name"
											id="name"
											v-model="name"
											autocomplete="name"
											required
											class="
												mt-1
												focus:ring-cyan-500
												focus:border-cyan-500
												block
												w-full
												shadow-sm
												sm:text-sm
												border-gray-300
												rounded-md
											"
										/>
									</div>

									<div aria-label="Price">
										<label
											for="price"
											class="
												block
												text-sm
												font-medium
												text-gray-700
											"
										>
											Price
										</label>
										<input
											type="text"
											inputmode="numeric"
											autocomplete="transaction-amount"
											name="price"
											id="price"
											v-model="price"
											class="
												mt-1
												focus:ring-cyan-500
												focus:border-cyan-500
												block
												w-full
												shadow-sm
												sm:text-sm
												border-gray-300
												rounded-md
											"
										/>
									</div>

									<div aria-label="Notes">
										<label
											for="notes"
											class="
												block
												text-sm
												font-medium
												text-gray-700
											"
										>
											Notes
										</label>
										<div class="mt-1">
											<textarea
												id="notes"
												name="notes"
												rows="3"
												v-model="notes"
												class="
													shadow-sm
													focus:ring-cyan-500
													focus:border-cyan-500
													mt-1
													block
													w-full
													sm:text-sm
													border border-gray-300
													rounded-md
												"
												placeholder="Type here more information about the item..."
											/>
										</div>
									</div>

									<div aria-label="Link">
										<label
											for="link"
											class="
												block
												text-sm
												font-medium
												text-gray-700
											"
										>
											Link
										</label>
										<div
											class="
												mt-1
												flex
												rounded-md
												shadow-sm
											"
										>
											<span
												class="
													inline-flex
													items-center
													px-3
													rounded-l-md
													border
													border-r-0
													border-gray-300
													bg-gray-50
													text-gray-500 text-sm
												"
											>
												https://
											</span>
											<input
												type="url"
												inputmode="url"
												autocomplete="url"
												name="link"
												id="link"
												v-model="link"
												class="
													focus:ring-cyan-500
													focus:border-cyan-500
													flex-1
													block
													w-full
													rounded-none rounded-r-md
													sm:text-sm
													border-gray-300
												"
												placeholder="www.example.com"
											/>
										</div>
									</div>

									<div aria-label="Picture">
										<label
											class="
												block
												text-sm
												font-medium
												text-gray-700
											"
										>
											Picture
										</label>
										<div
											class="
												mt-1
												flex
												justify-center
												px-6
												pt-5
												pb-6
												border-2
												border-gray-300
												border-dashed
												rounded-md
											"
										>
											<div class="space-y-1 text-center">
												<svg
													class="
														mx-auto
														h-12
														w-12
														text-gray-400
													"
													stroke="currentColor"
													fill="none"
													viewBox="0 0 48 48"
													aria-hidden="true"
												>
													<path
														d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													/>
												</svg>
												<div
													class="
														flex
														text-sm text-gray-600
													"
												>
													<label
														for="file-upload"
														class="
															relative
															cursor-pointer
															bg-white
															rounded-md
															font-medium
															text-cyan-600
															hover:text-cyan-500
															focus-within:outline-none
															focus-within:ring-2
															focus-within:ring-offset-2
															focus-within:ring-cyan-500
														"
													>
														<span>
															Upload a file
														</span>
														<input
															id="file-upload"
															name="file-upload"
															@change="
																(evt) =>
																	uploadFile(
																		evt
																	)
															"
															type="file"
															class="sr-only"
														/>
													</label>
													<p class="pl-1">
														or drag and drop
													</p>
												</div>
												<p
													class="
														text-xs text-gray-500
													"
												>
													PNG, JPG, GIF up to 10MB
												</p>
											</div>
										</div>
									</div>
								</div>

								<div class="text-right">
									<button
										type="submit"
										class="
											inline-flex
											justify-center
											px-4
											py-2
											text-sm
											font-medium
											text-cyan-900
											bg-cyan-100
											rounded-md
											hover:bg-cyan-200
											focus:outline-none
											focus:ring-2
											focus:ring-offset-2
											focus:ring-cyan-500
										"
									>
										Save
									</button>
								</div>
							</form>
						</div>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';

import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogOverlay,
	DialogTitle,
} from '@headlessui/vue';
import { PlusIcon } from '@heroicons/vue/outline';

import { NewGiftItem } from '@/types/gift-item';

export default defineComponent({
	components: {
		TransitionRoot,
		TransitionChild,
		Dialog,
		DialogOverlay,
		DialogTitle,
		PlusIcon,
	},
	data() {
		return {
			isOpen: false,
			name: '',
			pic: '',
			price: '',
			notes: '',
			recipients: [] as string[],
			link: '',
			purchased: false,
		};
	},
	mounted() {
		this.recipients.push(this.currentUserId);
	},
	methods: {
		closeModal() {
			this.isOpen = false;
		},
		openModal() {
			this.isOpen = true;
		},
		uploadFile(evt: Event) {
			console.log('Upload File', evt);
		},
		submitForm() {
			const newItem: NewGiftItem = {
				name: this.name,
				price: this.price,
				notes: this.notes,
				recipients: this.recipients,
				pic: this.pic,
				link: this.link,
				purchased: this.purchased,
			};

			this.addItem(newItem)
				.then(() => {
					this.name = '';
					this.price = '';
					this.notes = '';
					this.recipients = [] as string[];
					this.pic = '';
					this.link = '';
				})
				.finally(() => {
					this.closeModal();
				});
		},
		...mapActions('giftItem', {
			addItem: 'addItem',
		}),
	},
	computed: {
		...mapGetters('users', {
			currentUserId: 'getCurrentUserId',
		}),
	},
});
</script>
