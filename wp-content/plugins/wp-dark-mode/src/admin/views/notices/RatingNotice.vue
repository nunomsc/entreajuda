<script setup>
import { ref } from 'vue'
import { Button, Select, Close } from '@components'
import API from '@o/api';
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const showNotice = ref(wp_dark_mode_admin_json.additional.show_rating_notice)
const showModal = ref(false)

const remind = ref('7')
const days = ref({
    '7': t('remind_7_days'),
    '14': t('remind_14_days'),
    'never': t('remind_never'),
})

const hideNotice = async () => {
    showNotice.value = false

    const response = await API.post('/notice', {
        notice: 'rating',
        remind: remind.value
    })

    // update the notice
    wp_dark_mode_admin_json.additional.show_rating_notice = false
    
    
}

const cursorOn = ref(null)
</script>

<template>
    <div v-if="showNotice" class="wp-dark-mode-notice">

        <!-- rating notice  -->
        <div class="wp-dark-mode-notice-wrapper">

        <!-- close  -->
        <Close @click="showModal = true" @keydown.esc.prevent="showModal = false">
        </Close>

            <!-- logo  -->
            <div class="notice-logo">
                <div>
                    <svg class="w-10" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M27.812 19.4341L23.8803 21.5003C22.6985 22.1247 21.1972 22.0057 20.1195 21.2253C19.0195 20.4226 18.4769 19.0848 18.7073 17.7395L19.458 13.3619L16.2769 10.2626C15.2959 9.31121 14.954 7.90649 15.3702 6.60582C15.6378 5.78082 16.1952 5.1342 16.9013 4.70312H3.56755C1.59797 4.70312 0 6.30109 0 8.27068V27.2976C0 29.2672 1.59797 30.8652 3.56755 30.8652H4.75673V36.8111C4.75673 37.2942 5.0466 37.7253 5.49254 37.9111C5.64119 37.9705 5.79727 38.0003 5.94592 38.0003C6.25808 38.0003 6.56281 37.8813 6.78578 37.6509L13.5716 30.8652H29.7296C31.6992 30.8652 33.2971 29.2672 33.2971 27.2976V21.9017C32.7694 21.8868 32.2417 21.7605 31.7438 21.5078L27.812 19.4341Z"
                            fill="#2196F3" />
                        <path
                            d="M37.9942 7.34135C37.853 6.91027 37.4814 6.59811 37.0354 6.53122L31.4017 5.71366L28.8821 0.607598C28.4807 -0.202533 27.1503 -0.202533 26.749 0.607598L24.2294 5.71358L18.5956 6.53115C18.1497 6.59804 17.7781 6.91020 17.6369 7.34128C17.4957 7.77236 17.6146 8.2406 17.9342 8.56019L22.0071 12.5365L21.0483 18.148C20.974 18.5939 21.1524 19.0473 21.524 19.3074C21.7321 19.4561 21.9774 19.5378 22.2227 19.5378C22.4159 19.5378 22.6017 19.4932 22.7727 19.3966L27.8118 16.7507L32.851 19.3966C33.2523 19.6047 33.7354 19.575 34.0996 19.3074C34.4638 19.0399 34.6496 18.5939 34.5753 18.148L33.6091 12.5365L37.682 8.56019C38.0165 8.2406 38.1354 7.77243 37.9942 7.34135Z"
                            fill="#0788FF" />
                    </svg>
                </div>
            </div>
            <!-- content  -->
            <div class="notice-content">
                
                <div class="flex flex-col gap-2">
                    <div class="notice-header">
                        <h3 class="text-xl text-gray-800" v-html="t('value_text')">
                        </h3>
                    </div>
                    <div class="notice-text">
                        <div v-html="t('review_request')"></div>
                    </div>
                </div>
                <div class="flex flex-col gap-0">
                    <span class="font-semibold text-sm">{{ t('rate_us') }}</span>
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between group gap-2">
                        <a @click="remind = 'never', hideNotice()" href="https://wordpress.org/support/plugin/wp-dark-mode/reviews/" target="_blank" class="flex items-center gap-1 text-2xl  hover:opacity-100"  @mouseleave="cursorOn = false">
                            <span v-for="n in 5" @mouseover="cursorOn = n" :class="{
                                'text-[#FBBF24]' : !cursorOn,
                                'text-[#F59E0B]' : cursorOn && n <= cursorOn,
                                'text-[#D1D5DB]' : cursorOn && n > cursorOn
                            }">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.2153 4.03718C14.7658 2.95636 13.2347 2.95636 12.7852 4.03718L10.2221 10.1997L3.56914 10.733C2.40231 10.8266 1.92917 12.2827 2.81818 13.0443L7.88699 17.3862L6.33838 23.8783C6.06678 25.017 7.30547 25.9169 8.30444 25.3068L14.0003 21.8278L19.6961 25.3068C20.695 25.9169 21.9337 25.017 21.6621 23.8783L20.1135 17.3862L25.1823 13.0443C26.0713 12.2827 25.5982 10.8266 24.4314 10.733L17.7785 10.1997L15.2153 4.03718Z" fill="currentColor"/>
                                    </svg>
                                    
                            </span>
                        </a>
                        <a href="javascript:void(0)"  style="border: 1px solid #D1D5DB"
                            @click.prevent="remind = 'never', hideNotice()"
                            class="bg-gray-50 hover:bg-gray-100 transition no-underline text-gray-500 px-4 py-1.5 text-base rounded-lg">{{ t('already_did') }}</a>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- modal  -->
        <div class="wp-dark-mode-fixed wp-dark-mode-flex items-center justify-center top-0 left-0 w-full h-full z-50" v-if="showModal">
            <div class="absolute w-full h-full bg-gray-500 opacity-40" @click="showModal = false"></div>
            <div class="z-20 w-full max-w-sm bg-white rounded p-5 flex flex-col gap-4 bounce-in relative">
                <Close @click="showModal = false"/>
                <!-- heading  -->
                <div class="flex items-center justify-between gap-3">
                    <Heading>{{ t('remind_future') }}</Heading>
                </div>
                <!-- content  -->
                <Row gap="2">
                    <Hints>{{ t('remind_after') }}</Hints>
                    <Select :options="days" v-model="remind" style="border: 1px solid"></Select>
                    <div class="text-right">
                        <Button class="px-8" @click.prevent="hideNotice()">{{ t('ok') }}</Button>
                    </div>
                </Row>
            </div>
        </div>
    </div>
</template>
