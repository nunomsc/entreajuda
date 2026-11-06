<script setup>
import { computed } from 'vue';
import { Card, Toggle, Hints, Badge, Suggestions, TimePicker, Alert, SectionHead } from '@components'
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options, isPro, isLocked, showProModal } = DarkModeStore()

const modes = computed(() => {
    return Object.keys(wp_dark_mode_admin_json.default.frontend.mode.options).map((key) => {
        const mode = wp_dark_mode_admin_json.default.frontend.mode.options[key]
        mode.locked = ['time', 'sunset'].includes(key) && isLocked
        mode.key = key
        return mode
    })
})

</script>
<template>
    <section>
        <Card borderless transparent class="gap-5" style="min-height: calc(100vh - 365px) !important">
            <Card>
                <Toggle v-model="options.frontend_enabled">{{ t('enable_frontend_dark_mode') }}</Toggle>
                <Hints>{{ t('enable_frontend_dark_mode_hints') }}</Hints>
            </Card>
            <Card transparent borderless>
                <SectionHead class="font-normal">{{ t('frontend_mode_title') }}</SectionHead>
            </Card>
            <Card class="gap-6" :disabled="!options.frontend_enabled"> 
                <div v-for="mode in modes" :key="mode.key" class="flex flex-col gap-2 w-fit" :data-wp-dark-mode-locked="mode.locked">
                    <!-- mode selection  -->
                    <label class="flex items-center gap-2 cursor-pointer group"
                        @click.prevent="mode.locked ? showProModal() : options.frontend_mode = mode.key">
                        <span class="flex w-4 rounded-full h-4 shadow"
                            :class="{ 'group-hover:bg-blue-100': !mode.locked, 'border-4 border-blue-600': mode.key === options.frontend_mode, 'border border-gray-300': mode.key !== options.frontend_mode }"></span>
                        <span class="font-medium leading-6 text-base"
                            :class="{ 'opacity-50 cursor-no-drop pointer-events-none': mode.locked }"> {{ mode.name }}
                        </span>
                        <ProBadge v-if="mode.locked" />
                    </label>
                    <!-- hints for each mode  -->
                    <Hints :data-wp-dark-mode-locked="mode.locked" :class="{ 'opacity-50 cursor-no-drop pointer-events-none wp-dark-mode-locked': mode.locked }"> {{ mode.description }} </Hints>
                    <!-- time slot  -->
                    <div v-if="'time' === mode.key && mode.key === options.frontend_mode"
                        class="bg-gray-50 py-6 px-4 my-2 flex items-center gap-5 w-fit rounded-xl">
                        <div class="flex flex-col gap-1">
                            <label class="block text-xs font-normal text-gray-700">{{ t('start_time') }}</label>
                            <TimePicker v-model="options.frontend_time_starts"></TimePicker>
                        </div>
                        <span class="mt-5 text-gray-500 text-xs inline-flex items-center justify-center gap-2">
                            <span class="inline-flex h-[1px] bg-gray-400 w-4 rounded"></span> {{ t('to') }} <span
                                class="inline-flex h-[1px] bg-gray-400 w-4 rounded"></span>
                        </span>
                        <div class="flex flex-col gap-1">
                            <label class="block text-xs font-normal text-gray-700">{{ t('end_time') }}</label>
                            <TimePicker v-model="options.frontend_time_ends"></TimePicker>
                        </div>
                    </div>
                    <!-- time slot error  -->
                    <div
                        v-if="mode.key === 'time' && mode.key === options.frontend_mode && options.frontend_time_starts === options.frontend_time_ends">
                        <Alert color="orange">{{ t('time_overlap_error') }}</Alert>
                    </div>
                </div>
            </Card>
        </Card>
        <Suggestions paths="shortcode, excludes"></Suggestions>
    </section>
</template>