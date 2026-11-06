<script setup>
import { defineProps, computed, ref } from 'vue';
import ProBadge from './ProBadge.vue';
const props = defineProps({
    options: {
        type: Object,
        default: () => ({}),
    },
    inline: {
        type: Boolean,
        default: false,
    },
    modelValue: {
        type: String,
        default: '',
    },
    locked: {
        type: Array,
        default: [],
    },
})

const options = computed(() => {
    return props.options
})


const selected = ref(props.modelValue)

const isSelected = (value) => {
    return selected.value === value
}

const emit = defineEmits()

const select = ( value ) => {

    if ( isLocked( value ) ) {
        return;
    }

    selected.value = value
    emit('update:modelValue', selected.value)
}

const isLocked = value => ! wp_dark_mode_admin_json.is_ultimate && props.locked.includes( value );


</script>
<template>
    <div v-for="(label, option) in options" 
    class="flex items-center gap-2 cursor-pointer text-base leading-6 font-medium"
        @click.prevent="select(option)"
        :class="{
            'hover:opacity-75' : !isSelected(option) && !isLocked(option),
        }"
        :data-wp-dark-mode-locked="isLocked(option)"
    >
        <span class="flex w-4 h-4 border  rounded-full"
        :class="{
            'border-4 border-blue-600' : isSelected(option), 
            'border-gray-400' : !isSelected(option),
        }"
        ></span> <span :class="{
            'opacity-50 hover:opacity-50' : isLocked(option)
        }">{{ label }}</span>
        <ProBadge text="" v-if="isLocked(option)" />
    </div>
</template>