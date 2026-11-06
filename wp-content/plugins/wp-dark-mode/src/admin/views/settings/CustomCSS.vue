<script setup>
import { Textarea } from '../../components';
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation';

const { options, isPro } = DarkModeStore()
const { t } = useTranslation();
</script>

<template>
    <Row space class="gap-5">
        
        <Heading>
            <div class="flex items-center gap-3"><span class="text-lg" >
                {{ t('dark_mode_css') }}</span> </div>
            <Hints v-html="t('custom_css_hints')"></Hints>
        </Heading>

        <Row>
            <Textarea v-model="options.frontend_custom_css" class="font-mono text-sm" :placeholder="t('custom_css_placeholder')" rows="20"></Textarea>
        </Row>
    </Row>
</template>