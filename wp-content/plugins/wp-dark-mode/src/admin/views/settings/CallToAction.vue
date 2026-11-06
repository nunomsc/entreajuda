<script setup>
import { computed } from 'vue';
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options } = DarkModeStore()
const ctaText = computed(() => options.floating_switch_cta_text || t('switch_to_dark_mode'))
const bgColor = computed(() => options.floating_switch_cta_background || '#f87171')
const textColor = computed(() => options.floating_switch_cta_color || '#ffffff')
</script>

<template>
    <div v-if="ctaText" :style="`background: ${bgColor}; color: ${textColor}`" class="wp-dark-mode-switch-cta">
    {{ ctaText }}
    </div>
</template>