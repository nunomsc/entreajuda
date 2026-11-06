<script setup>
import { defineProps, onMounted, ref, computed } from 'vue'
import { Button, Input } from '@components'
const props = defineProps({
    modelValue: {
        type: String,
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
    before: {
        type: String,
        default: '',
    },
    after: {
        type: String,
        default: '',
    },
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: 100,
    },
    step: {
        type: Number,
        default: 1,
    },
    default: {
        type: [Boolean, Number, String],
        default: false,
    },
    width: {
        type: String,
        default: 'sm',
    },
    size: {
        type: String,
        default: 'md',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    locked: {
        type: Boolean,
        default: false,
    },

})

const value = ref(props.modelValue || 0)

const range = ref(null)
const showReset = ref(false)

const updateWidth = () => {
    const min = props.min || 0
    const max = props .max || 100
    const percent = ((value.value - min) / (max - min)) * 100

    // update css variable
    if(range.value) range.value.style.setProperty('--range-track-width', `${percent}%`)
}

onMounted(updateWidth)
const change = (_showReset = true) => {
    updateWidth()
    showReset.value = _showReset
    
}
// watchEffect(updateWidth)

const width = computed(() => {
    const widths = {
        'xs' : 'max-w-xs',
        'sm' : 'max-w-sm',
        'md' : 'max-w-md',
        'lg' : 'max-w-lg',
        'xl' : 'max-w-xl',
        '2xl' : 'max-w-2xl',
        '3xl' : 'max-w-3xl',
        '4xl' : 'max-w-4xl',
    }
    return props.width in widths ? widths[props.width] : 'max-w-sm'
})

const isLocked = computed(() => props.locked === true && !wp_dark_mode_admin_json.is_ultimate)

const handleLockedClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.WPDarkModePromo?.show();
}

</script>

<template>
    <div class="flex flex-col w-full gap-3"
        :class="{
            'opacity-50 pointer-events-none' : props.disabled,
        }"
        @click.capture="isLocked && handleLockedClick($event)"
    >
        <Heading v-if="props.label" class="mb-0">{{ props.label }}</Heading>
        <div class="flex items-center gap-2">
            <slot name="before" class="text-gray-600" />
            <div class="flex min-w-56 items-center justify-center w-full h-8 overflow-hidden rounded-full bg-gray-50 px-3" :class="width">
                <input ref="range" :min="props.min" :max="props.max" :step="step" class="range" @input="change(), $emit('update:modelValue', value), $emit('change', value)" v-model="value" type="range">
            </div>
            <Input :min="props.min" :max="props.max" :step="step" :size="2" class="px-2.5 pr-1 appearance-none" type="number" placeholder="0" @input.prevent="change(), $emit('change', value)" v-model="value"/>
            <button 
                v-if="props.default !== false && showReset" @click.prevent="value = props.default, change(false), $emit('update:modelValue', value), $emit('change', value)" 
                class="flex items-center justify-center w-12 h-10 p-4 text-xl text-red-400 duration-100 rounded ring-1 ring-red-200 hover:bg-red-50 group">
                <svg class="w-5 transition group-active:rotate-90" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5918 8.63313H19.0495V8.63155M2.9502 17.826V13.3683M2.9502 13.3683L7.40791 13.3683M2.9502 13.3683L5.79028 16.2102C6.67467 17.0962 7.79705 17.7685 9.09325 18.1158C13.0228 19.1687 17.0619 16.8367 18.1148 12.9072M3.88465 9.09423C4.93758 5.16468 8.97666 2.83271 12.9062 3.88563C14.2024 4.23295 15.3248 4.9052 16.2092 5.79126L19.0495 8.63155M19.0495 4.17545V8.63155" stroke="currentColor" stroke-width="1.33929" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <slot name="after" class="text-gray-600" />
        </div>
        <Hints v-if="props.hints">{{ props.hints }}</Hints>
    </div>
</template>

<style scoped>
.range {
    --range-track-width: 0%;
}
</style>