<script setup>
import {ref, computed} from 'vue'
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    default: {
        type: [String, Boolean],
        default: false
    }
})
const color = ref(props.modelValue || props.default)

const isColorSame = computed(() => {
    return props.modelValue === props.default
})

</script>
<template>
    <div class="flex items-center gap-3">
        <div class="flex items-center gap-3 w-full max-w-xs">
            <label class="wp-dark-mode-ignore flex w-12 h-12 rounded-full p-0 cursor-pointer shadow hover:opacity-90" :style="`background: ${props.modelValue || props.default} !important;`">
                <input type="color" class="sr-only" @change="$emit('update:modelValue', color)" v-model="color" />
            </label>
            <slot />
        </div>
        <div v-if="props.default && ! isColorSame" @click.prevent="color = props.default, $emit('update:modelValue', color)" class="w-10 h-10 border hover:bg-red-500 hover:text-white cursor-pointer text-red-500 transition duration-100 border-red-200 flex items-center justify-center rounded"><svg class="stroke-current w-4" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5918 6.63265H17.0494V6.63106M0.950134 15.8255V11.3678M0.950134 11.3678L5.40785 11.3678M0.950134 11.3678L3.79022 14.2097C4.67461 15.0957 5.79699 15.768 7.09319 16.1153C11.0227 17.1682 15.0618 14.8362 16.1147 10.9067M1.88459 7.09374C2.93751 3.16419 6.9766 0.832226 10.9062 1.88515C12.2024 2.23247 13.3248 2.90471 14.2091 3.79077L17.0494 6.63106M17.0494 2.17497V6.63106" stroke="stroke-current" stroke-width="1.33929" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
</template>