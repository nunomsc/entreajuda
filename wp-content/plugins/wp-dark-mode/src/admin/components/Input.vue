<script setup>
import { defineProps, ref } from 'vue'
const props = defineProps({
    modelValue: {
        type: Array,
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    hints: {
        type: String,
        default: '',
    },
    inline: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: 'md',
    },
    props: {
        type: Object,
        default: null
    },
    id: {
        type: String,
        default: null
    },
    min: {
        type: Number,
        default: null
    },
    max: {
        type: Number,
        default: null
    },
    step: {
        type: Number,
        default: null
    },
    type: {
        type: String,
        default: 'text'
    },
    required: {
        type: Boolean,
        default: false
    },
    error: {
        type: Boolean,
        default: false
    },
})

const createUniqueId = () => {
    return Math.random().toString(36).substr(2, 9)
}
const id = ref(props.id || createUniqueId())

</script>

<template>
    <div class="flex gap-2" :class="{'flex-col' : !inline, 'items-center' : inline}">
        <label :for="id" v-if="props.label" class="text-sm font-medium leading-6 text-gray-800 cursor-pointer whitespace-nowrap">{{ props.label }}<span v-if="props.required" class="text-red-500 ml-0.5">*</span></label>
        <input v-bind="$attrs" :type="props.type" :id="id" v-model="props.modelValue"
            class="w-full px-4 py-2 text-gray-800 transition border-0 rounded outline-none ring-1 focus:ring focus:ring-blue-500 placeholder:text-gray-300"
            :class="{
                'text-xs px-2 py-1' : props.size === 'xs',
                'text-sm px-3 py-2' : props.size === 'sm',
                'text-base px-4 py-2' : props.size === 'md',
                'text-lg px-5 py-3' : props.size === 'lg',
                'ring-gray-200' : !props.error,
                'ring-2 ring-red-500' : props.error,
            }"/>
        <slot name="after" class="text-gray-500"></slot>
        <Hints class="w-full" v-if="props.hints">{{ props.hints }}</Hints>
    </div>
</template>

<style scoped></style>