<script setup>
import { defineProps, computed } from 'vue'
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
    dark : {
        type: Boolean,
        default: false,
    },
    transparent : {
        type: Boolean,
        default: false,
    },
    borderless : {
        type: Boolean,
        default: false,
    },
    locked : {
        type: Boolean,
        default: false,
    },
})

const isLocked = computed(() => !wp_dark_mode_admin_json.is_ultimate && props.locked)
</script>
<template>
    <div class="rounded text-base flex flex-col gap-3" :class="{ 
        'bg-white' : !props.dark && !props.transparent, 
        'bg-gray-50' : props.dark && !props.transparent,
        'bg-transparent' : props.transparent,
        'py-5 px-6' : !props.borderless, 
        'opacity-50 pointer-events-none': props.disabled,
        'wp-dark-mode-locked' : isLocked,
        }">
        <slot />
    </div>
</template>