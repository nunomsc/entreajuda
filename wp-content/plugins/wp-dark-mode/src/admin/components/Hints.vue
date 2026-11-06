<script setup>
import { defineProps, computed } from 'vue';
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
    locked: {
        type: Boolean,
        default: false,
    },
})

const locked = computed(() => props.locked && !window.wp_dark_mode_admin_json.is_ultimate);
</script>

<template>
    <div class="text-xs text-gray-500 leading-4 font-normal w-it" :class="{
        'opacity-50 wp-dark-mode-locked' : props.disabled || locked,
    }" v-bind="$attrs"><slot /></div>
</template>