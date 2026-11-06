<script setup>
import { TABS, useSocialShareStore } from './store';

const store = useSocialShareStore();
</script>

<template>
	<div class="flex items-center sidebar-width bg-slate-100 border-b border-slate-100">
		<a
			v-for="tab in TABS"
			:key="tab.id"
			v-show="store.options.enable || [ 'channels' ].includes( tab.id )"
			href="#"
			class="group flex items-center gap-3 cursor-pointer px-3 py-3 hover:text-blue-500 transition duration-100 focus:ring-0 border-r border-slate-200 last:border-0"
			:class="{ 'bg-white text-blue-500 focus:text-blue-500': store.isTab( tab.id ) }"
			@click.prevent="store.setTab( tab.id )"
		>
			<span
				class="text-base transition duration-150 group-hover:text-blue-500"
				:class="{ 'text-blue-600': store.isTab( tab.id ), 'text-slate-500': ! store.isTab( tab.id ) }"
				v-html="tab.icon"
			></span>

			<span class="font-semibold">{{ tab.title }}</span>
		</a>
	</div>
</template>
