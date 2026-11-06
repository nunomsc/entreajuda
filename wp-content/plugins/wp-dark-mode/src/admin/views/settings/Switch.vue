<script setup>
import { Tabs, Tab } from '@components'
import FloatingSwitch from './FloatingSwitch.vue'
import MenuSwitch from './MenuSwitch.vue'
import ContentSwitch from './ContentSwitch.vue'
import CustomTrigger from './CustomTrigger.vue'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
</script>

<template>
    <Card borderless transparent class="gap-5">

        <Tabs>
            <Tab id="floating"> 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M15.0423 21.6718L13.6835 16.6007M13.6835 16.6007L11.1741 18.826L11.7425 9.35623L16.9697 17.2731L13.6835 16.6007ZM6.16637 16.3336C2.94454 13.1118 2.94454 7.88819 6.16637 4.66637C9.38819 1.44454 14.6118 1.44454 17.8336 4.66637C19.4445 6.27724 20.25 8.38854 20.25 10.4999M8.28769 14.2123C6.23744 12.1621 6.23744 8.83794 8.28769 6.78769C10.3379 4.73744 13.6621 4.73744 15.7123 6.78769C16.7374 7.8128 17.25 9.15637 17.25 10.4999"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg> {{ t('floating_switch_tab') }}</Tab>
            <Tab id="menu"> 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.75 6.75H20.25M3.75 12H20.25M3.75 17.25H12" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round" />
            </svg> {{ t('menu_switch_tab') }}</Tab>
            <Tab id="content"> 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12 7.5H13.5M12 10.5H13.5M6 13.5H13.5M6 16.5H13.5M16.5 7.5H19.875C20.4963 7.5 21 8.00368 21 8.625V18C21 19.2426 19.9926 20.25 18.75 20.25M16.5 7.5V18C16.5 19.2426 17.5074 20.25 18.75 20.25M16.5 7.5V4.875C16.5 4.25368 15.9963 3.75 15.375 3.75H4.125C3.50368 3.75 3 4.25368 3 4.875V18C3 19.2426 4.00736 20.25 5.25 20.25H18.75M6 7.5H9V10.5H6V7.5Z"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg> {{ t('content_switch_tab') }}</Tab>

            <!-- ADD THIS NEW TAB -->
            <Tab id="custom"> 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.75 3.75H5.25C4.42157 3.75 3.75 4.42157 3.75 5.25V9.75C3.75 10.5784 4.42157 11.25 5.25 11.25H9.75C10.5784 11.25 11.25 10.5784 11.25 9.75V5.25C11.25 4.42157 10.5784 3.75 9.75 3.75Z" 
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18.75 3.75H14.25C13.4216 3.75 12.75 4.42157 12.75 5.25V9.75C12.75 10.5784 13.4216 11.25 14.25 11.25H18.75C19.5784 11.25 20.25 10.5784 20.25 9.75V5.25C20.25 4.42157 19.5784 3.75 18.75 3.75Z" 
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9.75 12.75H5.25C4.42157 12.75 3.75 13.4216 3.75 14.25V18.75C3.75 19.5784 4.42157 20.25 5.25 20.25H9.75C10.5784 20.25 11.25 19.5784 11.25 18.75V14.25C11.25 13.4216 10.5784 12.75 9.75 12.75Z" 
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 20.25L17.25 18L15 15.75" 
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20.25 18H17.25" 
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg> 
                {{ t('custom_trigger_tab') }}
            </Tab>

            <template #floating>
                <FloatingSwitch />
            </template>

            <template #menu>
                <MenuSwitch />
            </template>

            <template #content>
                <ContentSwitch />
            </template>

            <!-- ADD THIS TEMPLATE -->
            <template #custom>
                <CustomTrigger />
            </template>
        </Tabs>

    </Card>
</template>