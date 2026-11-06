<script setup>
import { Card, Toggle, Hints, Heading, Suggestions, DarkModeSwitch, Alert, Button, Icon, Badge } from '@components'
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation';

const { t } = useTranslation();
const { options } = DarkModeStore()
import { getRange } from '@o/helper'

// setFromRange.
const setFromRange = (n, key) => {
    options[key] = n
}
</script>

<template>
    <Card borderless transparent class="gap-5">

        <Alert color="yellow" v-if="!options.frontend_enabled"> {{ t('content_switch_unavailable_msg') }}
            <template #button>
                <RouterLink to="/frontend"><Button color="yellow" class="text-xs whitespace-nowrap bg-[#F59E0B] border-[#F59E0B]">
                    {{ t('enable_frontend_dark_mode') }} <Icon name="chevronRight" /></Button></RouterLink>
            </template>
        </Alert>


        <Card class="gap-6" :blur="!options.frontend_enabled" locked>
            <div class="flex flex-col gap-3 w-fit">
                <Toggle v-model="options.content_switch_enabled_top_of_posts" locked :disabled="!options.frontend_enabled">
                     {{ t('display_switch_top_posts') }}</Toggle>
                <Hints locked>{{ t('display_switch_menus_hints') }}</Hints>
            </div>
            <div class="flex flex-col gap-3  w-fit">
                <Toggle v-model="options.content_switch_enabled_top_of_pages" locked :disabled="!options.frontend_enabled">
                    {{ t('display_switch_top_pages') }}</Toggle>
                <Hints locked>{{ t('display_switch_menus_hints') }}</Hints>
            </div>
        </Card>

        <Card :blur="!options.frontend_enabled" v-if="options.content_switch_enabled_top_of_posts || options.content_switch_enabled_top_of_pages">
            <div class="flex flex-col gap-2">
                <Heading class="mb-1">{{ t('select_switches') }}</Heading>
                <div class="flex flex-wrap gap-3 ">
                    <div v-for="n in [1,2, 3, 23, 24, 22, 20, 21, ...getRange(4, 13)]" :key="n"
                        :class="{ 'ring ring-blue-400': options.content_switch_style === n, }"
                        @click.prevent="setFromRange(n, 'content_switch_style');"
                        class="flex flex-col relative items-center justify-center transition duration-75 bg-gray-50 rounded-lg cursor-pointer w-36 h-36">
                     <DarkModeSwitch dummy :id="n"/>
                    </div>
                </div>
            </div>
        </Card>
        
        <Suggestions paths="shortcode, excludes, accessibility"></Suggestions>
    </Card>
</template>