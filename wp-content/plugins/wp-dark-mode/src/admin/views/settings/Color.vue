<script setup>
import { onMounted, watch } from 'vue'
import AutomaticColor from './AutomaticColor.vue'
import ColorPresets from './ColorPresets.vue'
import CustomPreset from './CustomPreset.vue'
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options } = DarkModeStore()

const tabs = {
    'automatic': {
        name: t('automatic_color'),
        component: AutomaticColor,
        icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.21731 0.656119C7.21731 0.293755 6.92356 0 6.56119 0C6.19883 0 5.90507 0.293755 5.90507 0.656119V2.62448C5.90507 2.98684 6.19883 3.2806 6.56119 3.2806C6.92356 3.2806 7.21731 2.98684 7.21731 2.62448V0.656119ZM2.84976 1.92187C2.59353 1.66564 2.1781 1.66564 1.92187 1.92187C1.66564 2.1781 1.66564 2.59353 1.92187 2.84976L3.31366 4.24155C3.56989 4.49778 3.98532 4.49778 4.24155 4.24155C4.49778 3.98532 4.49778 3.56989 4.24155 3.31366L2.84976 1.92187ZM11.2005 2.84976C11.4567 2.59353 11.4567 2.1781 11.2005 1.92187C10.9443 1.66564 10.5289 1.66564 10.2726 1.92187L8.88083 3.31366C8.6246 3.56989 8.6246 3.98532 8.88083 4.24155C9.13706 4.49778 9.55249 4.49778 9.80872 4.24155L11.2005 2.84976ZM0.656119 5.90507C0.293754 5.90507 0 6.19883 0 6.56119C0 6.92356 0.293754 7.21731 0.656119 7.21731H2.62448C2.98684 7.21731 3.2806 6.92356 3.2806 6.56119C3.2806 6.19883 2.98684 5.90507 2.62448 5.90507H0.656119ZM4.24155 9.80872C4.49778 9.55249 4.49778 9.13706 4.24155 8.88083C3.98532 8.6246 3.56989 8.6246 3.31366 8.88083L1.92187 10.2726C1.66564 10.5289 1.66564 10.9443 1.92187 11.2005C2.1781 11.4567 2.59353 11.4567 2.84976 11.2005L4.24155 9.80872ZM15.6015 16.5014L8.3103 9.21015L9.21006 8.31039L16.5013 15.6016C16.7499 15.8502 16.7498 16.2531 16.5014 16.5015C16.2531 16.7499 15.8502 16.75 15.6015 16.5014ZM5.53506 8.2907C4.77413 7.52977 4.77392 6.296 5.53492 5.53501C6.29591 4.77402 7.52968 4.77422 8.29061 5.53515L17.4292 14.6737C18.1901 15.4347 18.1903 16.6684 17.4293 17.4294C16.6683 18.1904 15.4346 18.1902 14.6736 17.4293L5.53506 8.2907Z" fill="currentColor"/>
</svg>
`
    },
    'presets': {
        name: t('color_presets'),
        component: ColorPresets,
        icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.79414 0.589296C6.92603 0.158136 8.13334 -0.040024 9.34367 0.00669536C11.6078 0.0999352 13.7541 1.04116 15.3565 2.64352C16.9588 4.24587 17.9001 6.39218 17.9933 8.65633C18.04 9.86666 17.8419 11.074 17.4107 12.2059C16.9795 13.3378 16.3243 14.3709 15.4841 15.2435C14.644 16.116 13.6364 16.8099 12.5216 17.2835C11.4068 17.7572 10.2079 18.0009 8.99665 18C8.48536 18 7.995 17.7969 7.63345 17.4353C7.27191 17.0738 7.0688 16.5834 7.0688 16.0721V13.6559C7.06938 13.3591 7.00143 13.0662 6.87025 12.8C6.73906 12.5337 6.54818 12.3014 6.31247 12.1211C6.07677 11.9407 5.80261 11.8172 5.51135 11.7602C5.22009 11.7032 4.91959 11.7142 4.63328 11.7923L3.91355 11.9915C3.45399 12.117 2.97168 12.1349 2.50411 12.0436C2.03655 11.9524 1.59633 11.7545 1.21769 11.4654C0.839061 11.1763 0.532215 10.8037 0.321019 10.3767C0.109824 9.94971 -2.93925e-05 9.47973 2.49134e-06 9.00335C-0.000898866 7.79211 0.24279 6.59317 0.716458 5.47839C1.19013 4.36362 1.88402 3.35597 2.75654 2.51585C3.62906 1.67574 4.66224 1.02046 5.79414 0.589296ZM12.0195 16.1C12.975 15.6923 13.8378 15.0947 14.5553 14.3435V14.3499C15.2795 13.6043 15.8439 12.7188 16.214 11.7476C16.5842 10.7763 16.7523 9.73977 16.7081 8.70132C16.6074 6.76884 15.7945 4.94216 14.4262 3.57384C13.0578 2.20552 11.2312 1.39258 9.29868 1.29193C8.26088 1.25125 7.22555 1.42063 6.25482 1.78991C5.28408 2.1592 4.39795 2.72076 3.64958 3.44093C2.90121 4.16109 2.30602 5.02501 1.89974 5.98085C1.49346 6.93669 1.28444 7.96475 1.28524 9.00335C1.28463 9.28165 1.34814 9.55636 1.47083 9.80616C1.59351 10.056 1.77209 10.2742 1.99271 10.4438C2.21332 10.6135 2.47005 10.73 2.74298 10.7845C3.01591 10.8389 3.29771 10.8297 3.56653 10.7577L4.28626 10.5585C4.56477 10.4822 4.85218 10.4433 5.14095 10.4428C5.99311 10.4428 6.81037 10.7813 7.41294 11.3839C8.01551 11.9865 8.35404 12.8037 8.35404 13.6559V16.0721C8.35404 16.2426 8.42174 16.406 8.54225 16.5265C8.66277 16.6471 8.82622 16.7148 8.99665 16.7148C10.0355 16.7168 11.0639 16.5076 12.0195 16.1ZM10.2819 4.50502C10.2819 5.21484 9.70646 5.79026 8.99665 5.79026C8.28683 5.79026 7.71141 5.21484 7.71141 4.50502C7.71141 3.79521 8.28683 3.21979 8.99665 3.21979C9.70646 3.21979 10.2819 3.79521 10.2819 4.50502ZM6.42618 6.43288C6.42618 7.14269 5.85076 7.71811 5.14094 7.71811C4.43112 7.71811 3.8557 7.14269 3.8557 6.43288C3.8557 5.72306 4.43112 5.14764 5.14094 5.14764C5.85076 5.14764 6.42618 5.72306 6.42618 6.43288ZM12.8524 7.71811C13.5622 7.71811 14.1376 7.14269 14.1376 6.43288C14.1376 5.72306 13.5622 5.14764 12.8524 5.14764C12.1425 5.14764 11.5671 5.72306 11.5671 6.43288C11.5671 7.14269 12.1425 7.71811 12.8524 7.71811ZM14.7802 10.2886C14.7802 10.9984 14.2048 11.5738 13.495 11.5738C12.7852 11.5738 12.2097 10.9984 12.2097 10.2886C12.2097 9.57877 12.7852 9.00335 13.495 9.00335C14.2048 9.00335 14.7802 9.57877 14.7802 10.2886ZM10.9245 14.7869C11.6343 14.7869 12.2097 14.2115 12.2097 13.5017C12.2097 12.7919 11.6343 12.2164 10.9245 12.2164C10.2147 12.2164 9.63927 12.7919 9.63927 13.5017C9.63927 14.2115 10.2147 14.7869 10.9245 14.7869Z" fill="currentColor"/>
</svg>
`
    },
    'custom': {
        name: t('ai_custom_preset'),
        component: CustomPreset,
        icon: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<polygon points="2 0 3 2 2 4 4 3 6 4 5 2 6 0 4 1 2 0" fill="currentColor"></polygon>
<polygon points="12 0 13 2 12 4 14 3 16 4 15 2 16 0 14 1 12 0" fill="currentColor"></polygon>
<polygon points="12 10 13 12 12 14 14 13 16 14 15 12 16 10 14 11 12 10" fill="currentColor"></polygon>
<rect x="6.805" y="5.823" width="3.743" height="3" transform="translate(-2.637 8.28) rotate(-45)" fill="currentColor"></rect>
<rect x="-0.096" y="10.647" width="7.9" height="3" transform="translate(-7.46 6.282) rotate(-45)" fill="currentColor"></rect>
</svg>
`
    }
}

// Update URL with color mode and preset
const updateUrlParams = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('mode', options.color_mode)
    if (options.color_mode === 'presets') {
        url.searchParams.set('preset', options.color_preset_id)
    } else {
        url.searchParams.delete('preset')
    }
    window.history.replaceState({}, '', url)
}

// Watch for color mode and preset changes
watch(() => options.color_mode, () => {
    updateUrlParams()
})

watch(() => options.color_preset_id, () => {
    if (options.color_mode === 'presets') {
        updateUrlParams()
    }
})

// Read color mode and preset from URL on mount
onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const modeParam = urlParams.get('mode')
    const presetParam = urlParams.get('preset')

    if (modeParam && tabs[modeParam]) {
        options.color_mode = modeParam

        // Set preset ID based on mode
        if (modeParam === 'presets' && presetParam) {
            const presetId = parseInt(presetParam, 10)
            if (!isNaN(presetId) && presetId > 0) {
                options.color_preset_id = presetId
            }
        }
    }

    // Set initial URL params
    updateUrlParams()
})

const setTab = (tab) => {
    options.color_mode = tab
    switch (tab) {
        default:
        case 'automatic':
            options.color_preset_id = 0
            break
        case 'presets':
            options.color_preset_id = 1
            break
        case 'custom':
            options.color_preset_id = wp_dark_mode_admin_json.predefined_presets.length + 1
            break
    }
}
</script>

<template>
    <Card borderless transparent class="gap-5">
        <div class="flex flex-col items-center gap-2">
            <Heading>{{ t('choose_color_mode') }}</Heading>
            <div
                class="flex items-center justify-center gap-4 p-2 mx-auto mb-2 text-sm border border-gray-200 menu w-fit rounded-xl">
                <div v-for="(tab, key) in tabs" :class="{ '': options.color_mode === key }">
                    <a href="javascript:;" @click.prevent="setTab(key)"
                        class="flex items-center gap-2 px-4 py-3 rounded-md whitespace-nowrap transition-colors"
                        :class="{ 'bg-blue-600 text-white hover:bg-blue-700': options.color_mode === key, 'bg-white text-gray-800 hover:bg-gray-100': options.color_mode !== key }">
                        <div v-if="tab.icon" v-html="tab.icon" class="flex-shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]"></div> {{ tab.name }} <span class="flex w-4 h-4 border rounded-full"
                            :class="{ 'border-4': options.color_mode === key }"></span>
                    </a>
                </div>
            </div>
        </div>
        <component :is="tabs[options.color_mode].component"></component>
    </Card>
</template>

<style scoped>
.menu {
    background: rgba(0, 0, 0, 0.03)
}
</style>