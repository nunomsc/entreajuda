<script setup>
import { Accordion, AccordionItem, Tutorial, ImageBox } from '@components';
import { useTranslation } from '../../composables/useTranslation';


import UpgradeFooter from '@c/UpgradeFooter.vue';

const { t } = useTranslation();

</script>

<template>
    <Row transparent gap="8">
        <Row gap="2" transparent class="text-center">
            <h2 class="font-semibold text-xl text-gray-800">{{ t('gutenberg_title') }}</h2>
            <Hints>{{ t('gutenberg_hints') }}</Hints>
        </Row>
        <Accordion>
            <AccordionItem :name="t('gutenberg_step1')">
                <Row transparent class="text-xs text-gray-500">
                    {{ t('gutenberg_step1_desc') }}
                    <ImageBox name="get-started/gutenberg/block-1.png" />
                </Row>
            </AccordionItem>
            <AccordionItem :name="t('gutenberg_step2')">
                <Row transparent class="text-xs text-gray-500">
                    {{ t('gutenberg_step2_desc') }}
                    <ImageBox name="get-started/gutenberg/block-2.png" />

                </Row>
            </AccordionItem>

            <AccordionItem active :name="t('gutenberg_step3')">
                <Row transparent class="text-xs text-gray-500">
                    {{ t('gutenberg_step3_desc') }}
                    <ImageBox name="get-started/gutenberg/block-3.png" />

                </Row>
            </AccordionItem>
        </Accordion>


        <div class="my-3"></div>
        <!-- Tutorial Video -->
        <Tutorial :title="t('video_tutorial')" :button="t('watch_video_tutorial')" time="1:30" YouTubeId="eSKPcQfPC5w"
        :content="t('gutenberg_tutorial_desc')" />


        <UpgradeFooter v-if="isLocked" />
    </Row>
</template>
