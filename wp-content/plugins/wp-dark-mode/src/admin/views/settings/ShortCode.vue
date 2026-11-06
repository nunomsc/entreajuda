<script setup>
import { ref } from 'vue'
import { Card, Toggle, Hints, Suggestions, DarkModeSwitch, Button, ProBadge, Badge } from '@components'
import { getRange, isSwitchLocked } from '@o/helper'
import { useTranslation } from '../../composables/useTranslation';

const { t } = useTranslation();

const state = ref({
    style: 1,
    copied : false
})

const copy = () => {
    try {
        navigator.clipboard.writeText(`[wp_dark_mode style="${state.value.style}"]`)
    } catch (error) {
        // use fallback old school method
        const el = document.createElement('textarea')
        el.value = `[wp_dark_mode style="${state.value.style}"]`
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)

    }
    state.value.copied = true
    setTimeout(() => {
        state.value.copied = false
    }, 2500)
}
</script>

<template>
    <Row space gap="5"> 
            <Heading class="text-center">{{ t('shortcode') }}<Hints>{{ t('shortcode_desc') }}</Hints></Heading>
   
            <Row dark gap="5" style="height: 400px" class="items-center justify-center text-center w-full max-w-2xl border rounded-lg border-gray-200 mx-auto">
                <div class="h-28 flex items-end justify-center wp-dark-mode-ignore">
                    <DarkModeSwitch :id="state.style"/>
                </div>

                <pre class="text-gray-400">[wp_dark_mode style="{{ state.style }}"]</pre>

                <div><Button @click.prevent="copy()" color="primary" outline> 
                    <svg v-if="state.copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                      </svg>

                    <svg v-else width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.125 13.375V16.1875C11.125 16.7053 10.7053 17.125 10.1875 17.125H2.0625C1.54473 17.125 1.125 16.7053 1.125 16.1875V5.5625C1.125 5.04473 1.54473 4.625 2.0625 4.625H3.625C4.05089 4.625 4.46849 4.6605 4.875 4.7287M11.125 13.375H13.9375C14.4553 13.375 14.875 12.9553 14.875 12.4375V8.375C14.875 4.65876 12.1721 1.5738 8.625 0.978698C8.21849 0.910499 7.80089 0.875 7.375 0.875H5.8125C5.29473 0.875 4.875 1.29473 4.875 1.8125V4.7287M11.125 13.375H5.8125C5.29473 13.375 4.875 12.9553 4.875 12.4375V4.7287M14.875 10.25V8.6875C14.875 7.1342 13.6158 5.875 12.0625 5.875H10.8125C10.2947 5.875 9.875 5.45527 9.875 4.9375V3.6875C9.875 2.1342 8.6158 0.875 7.0625 0.875H6.125" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg> 
                    {{ state.copied ? t('copied') : t('copy_shortcode') }}</Button>
                </div>
            </Row>

            <Row>
                <Heading>{{ t('select_switch_style') }}</Heading>

                <div class="flex flex-wrap gap-4 wp-dark-mode-ignore">
                    <div v-for="n in [1, 2, 3, 23, 24, 22, 20, 21, ...getRange(4, 19)]" :key="n"
                        :class="{ '_selected': state.style === n , 'wp-dark-mode-locked bg-[#fdfaf8] ring-1 ring-[#ffedd5]' : isSwitchLocked(n), 'bg-[#F9FAFB]' : !isSwitchLocked(n) }"
                        @click.prevent="isSwitchLocked(n) ? '' : state.style = n"
                        class="relative flex flex-col items-center justify-center transition duration-75 rounded-lg cursor-pointer w-36 h-36">
                        <DarkModeSwitch :id="n" dummy :class="{'opacity-60' : isSwitchLocked(n)}"/>

                        <ProBadge class="absolute  right-2 top-2" text="" v-if="![22].includes(n) && isSwitchLocked(n)" />
                    </div>
                </div>
            </Row>
    </Row>
</template>