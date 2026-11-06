<script setup>
import { Toggle, Hints, Heading, Textarea, SectionHead } from '@components'
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options } = DarkModeStore()
</script>

<template>
    <Row transparent gap="5">
        <SectionHead class="text-lg"> {{ t('html_element_title') }} 
            <template #description>
            {{ t('html_element_desc') }}</template>
        </SectionHead>
        <Row class="flex-col sm:flex-row w-full" space>
            
            <Heading class="whitespace-nowrap w-auto">
                <Row inline center>
                    <Row locked :ProBadge="false"  class="whitespace-nowrap">{{ t('exclude_elements') }}</Row> <ProBadge />
                </Row>
            </Heading>
            <Row style="width: 100%" locked>
                <Textarea class="font-mono text-sm  w-full" v-model="options.excludes_elements"
                    :placeholder="t('enter_element_selectors')" />
                <Hints>{{ t('exclude_elements_hints') }}</Hints>
            </Row>
        </Row>
        <Row class="flex-col sm:flex-row w-full" space>
           
            <Heading class="whitespace-nowrap w-auto">
                <Row inline center>
                    <Row locked :ProBadge="false"  class="whitespace-nowrap">{{ t('include_elements') }}</Row> <ProBadge />
                </Row>
            </Heading>
            <Row style="width: 100%" locked>
                <Textarea class="font-mono text-sm w-full" v-model="options.excludes_elements_includes"
                    :placeholder="t('enter_element_selectors')" />
                <Hints>{{ t('include_elements_hints') }}</Hints>
            </Row>
        </Row>
</Row></template>
