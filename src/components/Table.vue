<template>
	<div
		class="w-min sm:w-full mt-5 shadow bg-white rounded-lg overflow-hidden"
		aria-label="Table Section"
	>
		<slot name="heading" />

		<slot name="body" />
	</div>
</template>
