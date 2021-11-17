<template>
	<div
		class="
			container
			mx-auto
			mt-5
			shadow
			border-b border-gray-200
			divide-gray-200
			rounded-lg
			bg-white
			overflow-scroll
		"
		aria-label="Table Section"
	>
		<slot name="heading" />

		<div class="divide-y min-w-full">
			<slot name="body" />
		</div>
	</div>
</template>
