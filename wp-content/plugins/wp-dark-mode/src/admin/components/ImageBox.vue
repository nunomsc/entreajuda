<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    zoom: {
        type: Boolean,
        default: false
    },
});
</script>

<template>
<div class="relative w-full max-w-2xl group" v-bind="$attrs">
    <img :src="DARK_MODE_IMAGE('/' + props.name)" class="w-full rounded-md">
    <a class="opacity-0 outline-none focus:outline-none group-hover:opacity-100 transition absolute right-2 bottom-2 bg-white text-gray-500 h-8 w-8 flex items-center justify-center rounded cursor-pointer" :href="DARK_MODE_IMAGE('/' + props.name)" target="_blank">
        <svg class="fill-current w-5" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m15.97 17.031c-1.479 1.238-3.384 1.985-5.461 1.985-4.697 0-8.509-3.812-8.509-8.508s3.812-8.508 8.509-8.508c4.695 0 8.508 3.812 8.508 8.508 0 2.078-.747 3.984-1.985 5.461l4.749 4.75c.146.146.219.338.219.531 0 .587-.537.75-.75.75-.192 0-.384-.073-.531-.22zm-5.461-13.53c-3.868 0-7.007 3.14-7.007 7.007s3.139 7.007 7.007 7.007c3.866 0 7.007-3.14 7.007-7.007s-3.141-7.007-7.007-7.007zm-.744 6.26h-2.5c-.414 0-.75.336-.75.75s.336.75.75.75h2.5v2.5c0 .414.336.75.75.75s.75-.336.75-.75v-2.5h2.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-2.5v-2.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z" fill-rule="nonzero"/></svg>
    </a>
</div>
</template>