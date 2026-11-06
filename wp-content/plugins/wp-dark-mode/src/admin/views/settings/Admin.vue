<script setup>
import { Card, Toggle, Hints, Suggestions } from '@components'
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options } = DarkModeStore()


</script>
<template>
    <section>
        <Card borderless transparent class="gap-5" style="min-height: calc(100vh - 360px) !important">
            <Card>
                <Toggle v-model="options.admin_enabled">{{ t('enable_admin_dashboard_dark_mode') }}</Toggle>
                <Hints>{{ t('enable_admin_dashboard_dark_mode_hints') }}</Hints>
            </Card>
            
            <Card>
                <Toggle v-model="options.admin_enabled_block_editor">{{ t('block_editor_dark_mode') }}</Toggle>
                <Hints>{{ t('block_editor_dark_mode_hints') }}</Hints>
            </Card>


            <Card>
                <Toggle v-model="options.admin_enabled_classic_editor">{{ t('classic_editor_dark_mode') }}</Toggle>
                <Hints>{{ t('classic_editor_dark_mode_hints') }}</Hints>
            </Card>
        </Card>
        <Suggestions paths="shortcode, excludes"></Suggestions>
    </section>
</template> 