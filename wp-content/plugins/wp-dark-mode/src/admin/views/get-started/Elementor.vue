<script setup>
import { Accordion, AccordionItem, Tutorial, ImageBox } from '@components';
import { useTranslation } from '../../composables/useTranslation';
import UpgradeFooter from '@c/UpgradeFooter.vue';

const { t } = useTranslation();

</script>

<template>
    <Row transparent gap="8">
        <Row gap="2" transparent class="text-center">
            <h2 class="font-semibold text-xl text-gray-800">{{ t('elementor_title') }}</h2>
            <Hints>{{ t('elementor_hints') }}</Hints>
        </Row>

        <Accordion>
            <AccordionItem :name="t('elementor_step1')">
                <Row transparent class="text-xs text-gray-500">
                    {{ t('elementor_step1_desc') }}
                        <ImageBox name="get-started/elementor/widget-1.png" />
                </Row>
            </AccordionItem>
            <AccordionItem :name="t('elementor_step2')">
                <Row transparent class="text-xs text-gray-500">
                    {{ t('elementor_step2_desc') }}
                    <ImageBox name="get-started/elementor/widget-2.png" />
                </Row>
            </AccordionItem>
        </Accordion>

        <div class="my-3"></div>

        <!-- Tutorial Video -->
        <Tutorial :title="t('video_tutorial')" :button="t('watch_video_tutorial')" time="1:30" YouTubeId="eywWD9RDxT4" :content="t('elementor_tutorial_desc')" />

        <UpgradeFooter v-if="isLocked" />
    </Row>
</template>