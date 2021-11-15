<template>
	<div
		class="
			container
			mx-auto
			shadow
			border-b border-gray-200
			divide-gray-200
			rounded-lg
			bg-white
			overflow-scroll
		"
		aria-label="Table Section"
	>
		<div class="bg-gray-50 rounded-lg min-w-full">
			<slot name="heading" />
		</div>
		<div class="divide-y min-w-full">
			<slot name="body" />
		</div>
	</div>
</template>
