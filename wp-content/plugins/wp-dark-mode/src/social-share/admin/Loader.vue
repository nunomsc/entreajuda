<script setup>
// Skeleton loading placeholder. The original PHP template used wp_rand(2, 4) columns
// per row purely for cosmetic variety; replicated client-side since this is now a pure
// Vue-rendered mount point with no per-request PHP involved.
const rows = Array.from( { length: 10 }, () => Math.floor( Math.random() * 3 ) + 2 );
</script>

<template>
	<div id="wp-dark-social-share-loader" class="absolute left-0 top-0 w-full h-full z-50 bg-white text-slate-600 p-4">
		<div class="flex flex-col gap-2">
			<div v-for="( cols, i ) in rows" :key="i" class="flex items-center gap-2">
				<div v-for="j in cols" :key="j" class="h-8 w-full bg-slate-200 rounded-md"></div>
			</div>
		</div>
	</div>
</template>
