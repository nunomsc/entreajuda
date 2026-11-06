<script setup>
import { computed } from 'vue';
import DarkModeStore from '@o/store'
const { options } = DarkModeStore()
import { Preview, Range, Badge } from '@components'
import { useTranslation } from '../../composables/useTranslation';

const { t } = useTranslation();

const filters = computed(() => {
    return `filter: brightness(${options.color_filter_brightness || 100}%) contrast(${options.color_filter_contrast || 90}%) grayscale(${options.color_filter_grayscale || 0}%) sepia(${options.color_filter_sepia || 10}%) !important`
})

const color = computed(() => {
    return {
        text: '#d1cbc1',
        link: '#60abe6',
        link_hover: '#60abe6',
        bg: '#2a2a2a',
        input_bg: '#252525',
        input_border: '#fff',
        input_text: 'rgb((78, 81, 81)',
        button_bg: 'rgb(7 92 180)',
        button_text: '#button_text',
    }
})

</script>
<template>
    <div class="flex justify-between w-full gap-6 flex-col sm:flex-row">
        <Card borderless transparent class="w-full gap-6">

            <!-- brightness -->
            <Card borderless transparent>
                <Heading>
                    <Row inline class="items-center">{{ t('brightness') }}</Row>
                    <Hints>{{ t('brightness_hints') }}</Hints></Heading>
                <Range v-model="options.color_filter_brightness" :default="$default.color.filter_brightness.default"/>
            </Card>

            <!-- contrast  -->
            <Card borderless transparent>
                <Heading>
                <Row inline class="items-center">{{ t('contrast') }}</Row>
                <Hints>{{ t('contrast_hints') }}</Hints></Heading>
                <Range v-model="options.color_filter_contrast" :default="$default.color.filter_contrast.default"/>
            </Card>

            <!-- grayscale  -->
            <Card borderless transparent>
                <Heading>
                    <Row inline class="items-center">{{ t('grayscale') }}</Row>
                    <Hints>{{ t('grayscale_hints') }}</Hints></Heading>
                <Range v-model="options.color_filter_grayscale" :default="$default.color.filter_grayscale.default"/>
            </Card>

            <!-- sepia  -->
            <Card borderless transparent>
                <Heading>
                    <Row inline class="items-center">{{ t('sepia') }}</Row>
                     <Hints>{{ t('sepia_hints') }}</Hints></Heading>
                <Range v-model="options.color_filter_sepia" :default="$default.color.filter_sepia.default"/>
            </Card>

        </Card>
        <div :style="filters">
            <Preview size="lg" :color="color"></Preview>
        </div>
    </div>
</template>