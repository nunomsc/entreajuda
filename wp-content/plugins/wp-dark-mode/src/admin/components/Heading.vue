<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    bold: {
        type: Boolean,
        default: false
    },
});
</script>

<template>
    <div class="flex flex-col gap-1 text-base leading-6 text-black" v-bind="$attrs"
    :class="{'font-medium' : !props.bold, 'font-semibold' : props.bold}">
        <slot />
    </div>
</template>