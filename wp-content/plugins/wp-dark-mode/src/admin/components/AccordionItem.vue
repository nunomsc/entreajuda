<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    name: {
        type: String,
        default: ''
    },
})
</script>

<template>
    <div>
        <slot />
    </div>
</template>