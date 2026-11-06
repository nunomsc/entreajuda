<script setup>
import { defineProps, computed } from 'vue';
import { colors } from '@o/helper'
const props = defineProps({
    color: {
        type: String,
        default: 'emerald',
    },
    outline: {
        type: Boolean,
        default: false,
    },
    border: {
        type: Boolean,
        default: false,
    },
})

const classes = computed(() => {

    const color = colors[props.color] || colors.emerald

    let classes = ''
    if (props.light) {
        classes += color.light
    }

    if (props.border) {
        classes += ' border ' + color.border
    }

    if (!props.light && !props.border) {
        classes += color.solid
    }

    return classes
})
</script>

<template>
    <div v-bind="$attrs" 
    class="inline-flex items-center justify-center py-px px-3 font-medium rounded-full"
    style="font-size: 12px !important;"
    :class="classes"
    >
        <slot />
    </div>
</template>

<style scoped></style>