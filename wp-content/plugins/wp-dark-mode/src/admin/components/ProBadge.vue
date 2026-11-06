<script setup>
import { computed, defineProps } from 'vue';
import { useTranslation } from '../composables/useTranslation';

const { t } = useTranslation();

const props = defineProps({
    text: {
        type: [String, Boolean],
        default: '',
    },
    light: {
        type: Boolean,
        default: false,
    },
    space: {
        type: Boolean,
        default: false,
    },
})

const displayText = computed(() => props.text || t('ultimate'));

const isLocked = computed(() => {
    return ! (window.wp_dark_mode_admin_json || {})?.is_ultimate 
})

</script>

<template>
    <div v-if="isLocked" class="inline-flex items-center wp-dark-mode-locked" 
    :class="{
        'bg-orange-50 text-gray-800 px-3 py-1 text-sm leading-5 font-normal gap-1 rounded-xl' : displayText,
        'justify-center shadow-sm w-8 h-8 rounded-full' : !displayText,
        'bg-white' : !displayText && props.light,
        'bg-orange-100' : !displayText && !props.light,
    }"
    >
        <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.45 5.05H3.25V3.75C3.25 3.23 3.445 2.775 3.835 2.385C4.615 1.605 5.85 1.605 6.565 2.385C6.825 2.645 6.955 2.97 7.085 3.295C7.15 3.62 7.54 3.815 7.865 3.75C8.19 3.685 8.45 3.295 8.32 2.97C8.19 2.385 7.865 1.865 7.475 1.475C6.89 0.825 6.045 0.5 5.2 0.5C3.38 0.5 1.95 1.93 1.95 3.75V5.05C0.845 5.05 0 5.895 0 7V11.55C0 12.655 0.845 13.5 1.95 13.5H8.45C9.555 13.5 10.4 12.655 10.4 11.55V7C10.4 5.895 9.555 5.05 8.45 5.05ZM5.85 10.25C5.85 10.64 5.59 10.9 5.2 10.9C4.81 10.9 4.55 10.64 4.55 10.25V8.3C4.55 7.91 4.81 7.65 5.2 7.65C5.59 7.65 5.85 7.91 5.85 8.3V10.25Z" fill="#FB923C"/>
        </svg>
        {{ displayText }}
    </div>
</template>