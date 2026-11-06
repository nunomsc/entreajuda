<script setup>
import { Row, Toggle, Hints, Heading, Suggestions, Badge } from '@components'
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options, isLocked, showModal } = DarkModeStore()

// On change options.performance_exclude_cache.
const changeExcludeCache = () => {
  
    if (options.performance_exclude_cache) {
        showModal({
            title: t('are_you_sure'),
            message: t('exclude_cache_hints'),
            confirmText: t('enable'),
            cancelText: t('cancel'),
            confirm: () => {
                options.performance_exclude_cache = true
            },
            cancel: () => {
                options.performance_exclude_cache = false
            }
        })

        return;
    } else {
        options.performance_exclude_cache = false
    }
}

</script>
<template>
    <Row transparent>

        <Heading class="mt-5"><div class="flex items-center gap-3">
            <Row inline center transparent>
                <Row transparent locked :ProBadge="false">{{ t('performance_behavior_title') }}</Row>
                <ProBadge /> 
            </Row></div></Heading>

        <Row space gap="5" locked>
            <div v-for="(behavior, key) in $default.performance.execute_as.options" :key="key" class="flex flex-col gap-3">
                <label class="flex sm:items-center gap-3 cursor-pointer group" @click.prevent="options.performance_execute_as = key">
                    <div class="flex items-center justify-center">
                        <span class="flex w-4 rounded-full h-4 shadow group-hover:bg-blue-100"
                        :class="{ 'border-4 border-blue-500': key === options.performance_execute_as, 'border border-gray-300': key !== options.performance_execute_as }"></span>
                    </div>
                    <span class="font-medium leading-6 text-base flex items-center gap-3">{{ behavior.name }} <span class="bg-indigo-50 font-semibold text-indigo-600 border border-indigo-400 text-xs px-3 py-1 rounded-full" v-if="key === 'sync'">{{ t('recommended') }}</span></span>
                </label>
                <Hints> {{ behavior.description }} </Hints>
            </div>
        </Row>
        
        <Heading class="mt-5"><div class="flex items-center gap-3">
            <Row inline center transparent>
                <Row transparent>{{ t('other_performance_settings') }}</Row>
            </Row></div></Heading>

        <Row space gap="5">
    
            <Row transparent>
                <Row inline><Toggle v-model="options.performance_track_dynamic_content">{{ t('track_dynamic_content') }}</Toggle> </Row>
                <Hints>{{ t('track_dynamic_content_hints') }}</Hints>
            </Row>
            <Row transparent :data-wp-dark-mode-locked="isLocked">
                <Row inline>
                    <Toggle v-model="options.performance_load_scripts_in_footer" locked> {{ t('load_scripts_in_footer') }}</Toggle>
                    </Row>
                <Hints locked>{{ t('load_scripts_in_footer_hints') }}</Hints>
            </Row>


            <!-- Exclude caches  -->
            <Row transparent>
                <Row inline @click.prevent="changeExcludeCache">
                    <Toggle v-model="options.performance_exclude_cache">{{ t('exclude_from_caching') }}</Toggle>
                    </Row>
                <Hints>{{ t('exclude_from_caching_hints') }}</Hints>
            </Row>
        </Row>

        

        <Suggestions paths="shortcode, excludes"></Suggestions>
    </Row>
</template>