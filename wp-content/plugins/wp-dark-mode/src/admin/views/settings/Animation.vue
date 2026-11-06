<script setup>
import { computed } from 'vue'
import { Preview, Radio, Suggestions } from '@components'
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options } = DarkModeStore()

const animations = wp_dark_mode_admin_json.default.animation.name.options

const animationName = computed(() => {
    return options.animation_name.toLowerCase().replace(/\s/g, '-')
})

</script>

<template>
    <Row transparent gap="5">
        <Row gap="1">
            <Row space>
                <Toggle v-model="options.animation_enabled">{{ t('enable_page_transition_animation') }}</Toggle>
                <Hints>{{ t('animation_hints') }}</Hints>
            </Row>
            <div class="flex w-full justify-between gap-6 pr-3 sm:pr-8" v-if="options.animation_enabled">
                <Row borderless space class="w-full">
                    <Heading>{{ t('select_animation') }}</Heading>
                    <Card class="w-full max-w-xs" dark>
                        <Radio :options="animations" v-model="options.animation_name"></Radio>
                    </Card>
                </Row>
                <Preview dark size="lg" data-wp-dark-mode-active :data-wp-dark-mode-animation="animationName">
                </Preview>
            </div>
        </Row>
        <Suggestions :paths="{
        'switch': {
            path: '/switch',
            scroll: '#switch-animation',
            name: t('attention_effect_title'),
        } } " />
    </Row>
</template>