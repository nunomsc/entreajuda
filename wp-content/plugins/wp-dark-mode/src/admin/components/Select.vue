<script setup>
import { ref, defineEmits, computed } from 'vue'
import { useTranslation } from '../composables/useTranslation';

const { t } = useTranslation();

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
    options: {
        type: Array,
        default: () => [],
    },
    modelValue: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: '',
    },
    absolute: {
        type: Boolean,
        default: true,
    },
})

const displayPlaceholder = computed(() => props.placeholder || t('select'));
const isOpen = ref(false)
const value = ref( props.modelValue )


const emits = defineEmits(['update:modelValue', 'change', 'select'])
const set = ( val ) => {
    emits('update:modelValue', val)

    emits('select')
    if (val !== props.modelValue) {
        emits('change')
    }

    // value.value = val
    isOpen.value = false
}
</script>

<template>
    <div class="inline-flex flex-col gap-2 relative w-full rounded ring-1 outline-none ring-gray-200 focus:ring focus:ring-blue-300 transition"
        tabindex="1" @blur="isOpen = false" @keydown.esc.prevent="isOpen = false" v-bind="$attrs">
        <div class="flex items-center gap-2 justify-between px-4 py-2.5 cursor-pointer " @click.prevent="isOpen = !isOpen">
            <slot name="before" />
            <span class="text-sm">{{ props.options[props.modelValue] || displayPlaceholder }}</span>
            <svg class="w-5 transition" :class="{ 'rotate-180': isOpen }" viewBox="0 0 20 20" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M5.23017 7.20938C5.52875 6.92228 6.00353 6.93159 6.29063 7.23017L10 11.1679L13.7094 7.23017C13.9965 6.93159 14.4713 6.92228 14.7698 7.20938C15.0684 7.49647 15.0777 7.97125 14.7906 8.26983L10.5406 12.7698C10.3992 12.9169 10.204 13 10 13C9.79599 13 9.60078 12.9169 9.45938 12.7698L5.20938 8.26983C4.92228 7.97125 4.93159 7.49647 5.23017 7.20938Z"
                    fill="#6B7280"></path>
            </svg>
        </div>
        <div v-if="isOpen" class="bg-white shadow-lg w-full rounded-md  flex flex-col overflow-hidden" :class="{
            'absolute top-12 z-50': props.absolute,
        }">
            <span v-for="(label, opt) in props.options"
                class="py-2 px-4 border-y border-transparent  cursor-pointer transition text-sm font-normal text-gray-700 inline-flex items-center justify-between gap-2 "
                :class="{ 'bg-blue-50 border-blue-50': opt === props.modelValue, 'border-transparent hover:border-gray-50 hover:bg-gray-50': opt !== props.modelValue }"
                @click.prevent="set( opt )"> {{ label }}</span>
        </div>
</div></template>