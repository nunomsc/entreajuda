<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})

const value = ref(props.modelValue)

</script>

<template>
    <textarea v-bind="$attrs" 
    v-model="value"
    @input="$emit('update:modelValue', value)"
    class="wp-dark-textarea disabled:opacity-50" rows="6"></textarea>
</template>