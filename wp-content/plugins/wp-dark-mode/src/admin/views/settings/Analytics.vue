<script setup>
import { Row, Toggle, Hints, Heading, Input, Select } from '@components'
import DarkModeStore from '@o/store'
import AnalyticsChart from './AnalyticsChart.vue'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options, isPro, isLocked } = DarkModeStore()

</script>

<template>
    <Row transparent gap="5">
        <!-- graph settings  -->
        <Row space gap="5">
            <Row transparent>
                <Toggle v-model="options.analytics_enabled">{{ t('dark_mode_analytics') }}</Toggle>
                <Hints> {{ t('analytics_hints') }}</Hints>
            </Row>
            <Row :blur="!options.analytics_enabled">
                
                <AnalyticsChart />
            </Row>
            <Row transparent :blur="!options.analytics_enabled">
                <Toggle v-model="options.analytics_enabled_dashboard_widget"> {{ t('display_chart_on_dashboard') }}</Toggle>
                    
                <Hints>{{ t('display_chart_on_dashboard_hints') }}</Hints>
            </Row>
        </Row>
        <!-- Reporting  -->
        <Row space gap="5">
            <Row transparent :blur="!options.analytics_enabled" >
                <Toggle locked v-model="options.analytics_enabled_email_reporting">{{ t('email_reporting') }} </Toggle>
                <Hints>{{ t('email_reporting_hints') }}</Hints>
            </Row>
            <Row transparent :blur="!options.analytics_enabled_email_reporting || !options.analytics_enabled" locked
                :ProBadge="false">
                <Heading>{{ t('reporting_frequency') }} <Hints>{{ t('reporting_frequency_hints') }}</Hints>
                </Heading>
                <div class="w-40">
                    <Select v-model="options.analytics_email_reporting_frequency" :options="$default.analytics.email_reporting_frequency.options"> </Select>
                </div>
            </Row>
            <Row transparent :blur="!options.analytics_enabled_email_reporting || !options.analytics_enabled" locked
                :ProBadge="false">
                <Heading>{{ t('reporting_email') }} <Hints>{{ t('reporting_email_hints') }}</Hints>
                </Heading>
                <Input v-model="options.analytics_email_reporting_address" placeholder="john.doe@mail.com" />
            </Row>
            <Row transparent :blur="!options.analytics_enabled_email_reporting || !options.analytics_enabled" locked
                :ProBadge="false">
                <Heading> {{ t('reporting_email_subject') }}<Hints>{{ t('reporting_email_subject_hints') }}</Hints>
                </Heading>
                <Input v-model="options.analytics_email_reporting_subject"
                    placeholder="Weekly Dark Mode Usage Summary of [domain name]" />
            </Row>
        </Row>
    </Row>
</template>
