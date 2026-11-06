<script setup>
import ColorFilters from './ColorFilters.vue'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
</script>
<template>
   <Card>
    <Heading bold>
      <Row inline class="items-center">{{ t('automatic_color_filter_title') }}</Row>
      <Hints>{{ t('automatic_color_filter_hints') }}</Hints>
   </Heading>
    <div class="h-0.5 w-full bg-gray-100 my-3"></div>
    <ColorFilters /> 
   </Card>
</template>