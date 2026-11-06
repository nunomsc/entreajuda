<script setup>
import { Card, Heading, Button, Input } from '@components'
import { defineProps, useSlots, computed } from 'vue';
import { useTranslation } from '../composables/useTranslation';

const { t } = useTranslation();

const props = defineProps({
    dark: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: 'md',
    },
    label: {
        type: String,
        default: '',
    },
    color: {
        type: [Object, Boolean],
        default: false,
    },
})

const displayLabel = computed(() => props.label || t('preview'));


const slots = useSlots()
const isDefaultSlot = slots.default && slots.default().length > 0

const color = computed(() => {
    if ( props.color && typeof props.color === 'object' ) {
        return props.color
    }

    return {
        text: props.dark ? '#F0F0F0' : '#111827',
        bg: props.dark ? '#333' : '#F0F0F0',
        link: props.dark ? '#F59E0B' : '#EF4444',
        input_text: props.dark ? '#F0F0F0' : '#111827',
        input_bg: props.dark ? '#222' : '#F0F0F0',
        input_border: props.dark ? '#F0F0F0' : '#111827',
        button_bg: props.dark ? '#F59E0B' : '#EF4444',
    }
})

const wrapperClasses = computed( () => {
    let classes = []

    // Size
    const sizes = {
        'md' : 'w-80',
        'lg' : 'w-96',
        'sm' : 'w-64',
    }

    classes.push( sizes[props.size || 'sm'] )

    return classes.join(' ')
})

</script>

<template>
    <!-- preview section  -->
    <Card transparent borderless class="w-fit">
        <Heading v-if="displayLabel" class="text-center">{{ displayLabel }}</Heading>
        <div dark class="relative transition duration-75 border rounded-xl" :class="{
            'w-80' : props.size === 'md',
            'w-96' : props.size === 'lg',
            'w-64' : props.size === 'sm',
        }" :style="{background: color.bg, color: color.text}">
            <div class="flex items-center w-full h-10 px-4 transition duration-75 rounded-t-xl" :style="{background: color.bg}">
                <svg class="w-7" viewBox="0 0 30 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="4" cy="4" r="4" fill="#EF4444" />
                    <circle cx="15" cy="4" r="4" fill="#F59E0B" />
                    <circle cx="26" cy="4" r="4" fill="#10B981" />
                </svg>
            </div>
            
            <slot v-if="isDefaultSlot" /> 

            <div v-else class="flex flex-col gap-5 p-5 font-sans default-slot break-words"> 
                <div class="flex items-center justify-between rounded-lg wp-dark-mode-link flex-wrap" :style="`--wp-dark-link: ${color.link}; --wp-dark-link-hover: ${color.link_hover};`">
                    <a class="py-3 text-base leading-none" :style="{color: color.link}" href="javascript:;" v-for="key in ['home', 'features', 'pricing', 'contact']" :key="key">{{ t(key) }}</a>
                </div>
                <div class="text-3xl font-medium leading-none" :style="{color: color.text}">{{ t('doing_it_all') }}
                    <br />{{ t('in_all_new_ways') }}</div>
                <div class="text-sm leading-none  break-words">{{ t('lorem_ipsum_text') }}</div>
                <div class="max-w-full">
                    <input class="leading-none w-fit max-w-full wp-dark-mode-input px-4 py-2 rounded break-words" :placeholder="t('enter_your_email')" :style="`--wp-dark-input-bg: ${color.input_bg}; --wp-dark-input-text: ${color.input_text}; --wp-dark-input-border: ${color.input_border}; --wp-dark-input-placeholder: ${color.input_placeholder};`" />
                </div>
                <div>
                    <button class="leading-none hover:opacity-90 transition duration-100 px-6 py-2 rounded wp-dark-mode-button" size="xl" :style="`--wp-dark-button-bg: ${color.button_bg}; --wp-dark-button-text: ${color.button_text}; --wp-dark-button-border: ${color.button_border}; --wp-dark-button-hover-bg: ${color.button_hover_bg}; --wp-dark-button-hover-text: ${color.button_hover_text};`">{{ t('explore_now') }}</button>
                </div>
            </div>
         
        </div>
    </Card>
</template>

<style>

.wp-dark-mode-link a {
    color: var(--wp-dark-link) !important;
}

.wp-dark-mode-link a:hover {
    color: var(--wp-dark-link-hover) !important;
}

.wp-dark-mode-input {
    background: var(--wp-dark-input-bg) !important;
    color: var(--wp-dark-input-text) !important;
    border: 2px solid var(--wp-dark-input-border) !important;
}

.wp-dark-mode-input::placeholder {
    color: var(--wp-dark-input-placeholder) !important;
}

.wp-dark-mode-button {
    background: var(--wp-dark-button-bg) !important;
    color: var(--wp-dark-button-text) !important;
    border: 2px solid var(--wp-dark-button-border) !important;
}

.wp-dark-mode-button:hover {
    background: var(--wp-dark-button-hover-bg) !important;
    color: var(--wp-dark-button-hover-text) !important;
}

</style>