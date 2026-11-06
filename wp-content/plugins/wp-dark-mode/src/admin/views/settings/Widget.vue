<script setup>
import { Hints, Accordion, AccordionItem, Tutorial, ImageBox } from '@components'
import { useTranslation } from '../../composables/useTranslation';

const { t } = useTranslation();
</script>

<template>
    <Row space gap="5">
        <Heading class="text-center">{{ t('switch_widget') }}<Hints>{{ t('follow_steps') }}
            </Hints>
        </Heading>

        <Accordion>
            <AccordionItem :name="t('add_widget_to_menu')">
                <Row class="max-w-xl">
                    <Hints> {{ t('widget_instruction_1') }} </Hints>
                        <ImageBox name="settings/switch-widget-1.png" />
                </Row>
            </AccordionItem>

            <AccordionItem :name="t('select_switch_style_menu')">
                <Row class="max-w-xl">
                    <Hints> {{ t('switch_widget_instruction_2') }}</Hints>
                    <ImageBox name="settings/switch-widget-2.png" />
                </Row>
            </AccordionItem>

            <AccordionItem :name="t('update_done_title')">
                <Row class="max-w-xl">
                    <Hints>{{ t('update_done_instruction') }}</Hints>
                    <ImageBox name="settings/switch-widget-3.png" />
                </Row>
            </AccordionItem>
        </Accordion>

        <Tutorial 
            YouTubeId="bvq_UfucI-I"
        />
</Row></template>

<style scoped>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-enter-active {
    transition: all 0.3s ease-out;
  }
  
  .slide-leave-active {
    transition: 0s;
    opacity: 0;
  }
  
  .slide-enter-from,
  .slide-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }
</style>