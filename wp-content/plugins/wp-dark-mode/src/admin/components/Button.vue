<script setup>
import { defineProps, computed } from 'vue';
import { colors } from '@o/helper'
const props = defineProps({
    color: {
        type: String,
        default: 'blue',
    },
    outline: {
        type: Boolean,
        default: false,
    },
})


const classes = computed(() => {
    const color = colors[props.color] || colors.blue

    let classes = ''
    if (props.outline) {
        classes += color.light
    } else {
        classes += color.solid
    }

    classes += ' border ' + color.border
    return classes
})

</script>

<template>
    <button 
    class="disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md cursor-pointer outline-none focus:outline-none hover:opacity-90 transition duration-75"
    :class="classes"
    v-bind="$attrs" 
    ><slot /></button>
</template>
