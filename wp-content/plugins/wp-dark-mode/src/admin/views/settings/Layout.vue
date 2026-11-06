<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './Sidebar.vue'
import MailTo from './../MailTo.vue';
import { settingsPaths } from '@o/settings-routes'
import { Button, Close } from '@components'
import DarkModeStore from '@o/store'
import Toast from '@stores/toast.js'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { state, saveChanges, discardChanges, isPro, options } = DarkModeStore()

const isChanged = computed(() => {
    return state.isChanged
})

// Check if custom presets exist
const customPresets = computed(() => {
    return options.color_presets.slice(wp_dark_mode_admin_json.predefined_presets.length)
})

// Hide save buttons if custom preset mode is selected but no custom presets exist
const shouldShowSaveButtons = computed(() => {

//     color_mode: options.color_mode,
//     customPresets_length: customPresets.value.length,
//     isChanged: isChanged.value,
//     aiGeneratorOpen: state.aiGeneratorOpen,
//     aiPaletteSelected: state.aiPaletteSelected
// })

    if (options.color_mode === 'custom' && customPresets.value.length === 0) {

        return false
    }

    const result = isChanged.value && (!state.aiGeneratorOpen || state.aiPaletteSelected)

    return result
})

const page = computed(() => {
    const route = useRoute()
    return settingsPaths.find(i => i.path === route.path)
})

onMounted(() => {
    if (page.value === undefined) {
        window.location.hash = '#/frontend'
    }

})

const initHeadWay = () => {
    window.HW_config = {
        selector: "#wp-dark-mode-changelog",
        account: "yppW9y",
        trigger: "#wp-dark-mode-changelog-trigger",
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.headwayapp.co/widget.js';
    script.async = true;

    document.body.appendChild(script);
}

onMounted(initHeadWay)

// Get Started URL
const get_started_url = wp_dark_mode_admin_json.url.admin + 'admin.php?page=wp-dark-mode-get-started'

</script>

<template>
    <div class="relative">
        <!-- main content -->
        <div class="app-wrapper">
            <!-- left sidebar, navigation  -->
            <Sidebar />
            <!-- content -->
            <div class="main-content">

                <!-- Topbar  -->
                 <!-- <div class="text-center p-4 bg-[#FFF7ED] border-b border-[#faeddc] text-xs font-normal text-[#1E1E1E]"> âš¡ Weâ€™ve supercharged the performance of WP Dark Mode! Facing issues? <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdtw-3Sf_o8yrE2X5oap49MJ3MHhBSGMs2kYU8rDuSA1AfX1g/viewform" target="_blank">Share feedback here</a></div> -->

                <!-- content header  -->
                <div class="main-content-header">
                    <div class="main-content-header-title" v-if="page">
                        <h3 class="font-semibold text-xl wp-dark-mode-white" v-if="page.name">{{ t(page.name) }}</h3>
                        <p class="text-xs text-gray-500" v-if="page.description"> {{ t(page.description) }} </p>
                    </div>
                    <div class="main-content-header-items">
                        <div class="flex items-center gap-0">
                            <a id="wp-dark-mode-changelog-trigger" class="item" href="javascript:;">
                                <svg class="fill-current w-4" viewBox="0 0 16 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M6.80714 4.37588H3.94199C3.76365 4.13891 3.65411 3.85736 3.62542 3.56217C3.59914 3.2696 3.67114 3.06617 3.78428 2.9416C3.88828 2.82617 4.14542 2.64788 4.76828 2.64788C5.33628 2.64788 5.92028 3.03645 6.41628 3.72217C6.57285 3.93931 6.70199 4.16331 6.80714 4.37588ZM1.91685 3.71302C1.93742 3.93702 1.98199 4.16102 2.04828 4.37588H1.36942C1.06631 4.37588 0.775625 4.49628 0.561297 4.71061C0.34697 4.92494 0.226562 5.21563 0.226562 5.51874V6.52788C0.226562 6.83098 0.34697 7.12168 0.561297 7.336C0.775625 7.55033 1.06631 7.67074 1.36942 7.67074H14.6311C14.9342 7.67074 15.225 7.55033 15.4393 7.336C15.6535 7.12168 15.774 6.83098 15.774 6.52788V5.5176C15.774 5.21449 15.6535 4.9238 15.4393 4.70947C15.225 4.49514 14.9342 4.37474 14.6311 4.37474H13.9523C14.0186 4.15988 14.0631 3.93588 14.0837 3.71188C14.1386 3.08102 14.0014 2.36102 13.4894 1.79188C12.9694 1.21817 12.1866 0.934737 11.2323 0.934737C9.86085 0.934737 8.82885 1.83988 8.19342 2.72217C8.12633 2.81554 8.06192 2.91082 8.00028 3.00788C7.93826 2.91081 7.87347 2.81553 7.80599 2.72217C7.17285 1.83874 6.13971 0.933594 4.76942 0.933594C3.81399 0.933594 3.03228 1.21702 2.51228 1.79417C1.99914 2.36217 1.86314 3.08217 1.91799 3.71417L1.91685 3.71302ZM9.19342 4.37588H12.0586C12.2375 4.13923 12.3471 3.8575 12.3751 3.56217C12.4014 3.2696 12.3294 3.06617 12.2163 2.9416C12.1123 2.82617 11.8551 2.64788 11.2323 2.64788C10.6643 2.64788 10.0803 3.03645 9.58428 3.72217C9.42771 3.93931 9.29856 4.16331 9.19342 4.37588ZM1.36942 9.09931H7.28599V16.3347H2.46199C2.15888 16.3347 1.8682 16.2143 1.65387 16C1.43954 15.7857 1.31914 15.495 1.31914 15.1919V9.09817H1.36942V9.09931ZM13.5386 16.3347H8.71457V9.09931H14.6814V15.1919C14.6814 15.495 14.561 15.7857 14.3467 16C14.1324 16.2143 13.8417 16.3347 13.5386 16.3347Z"
                                        fill="#6366F1" />
                                </svg> {{ t('whats_new') }}</a>
                            <div id="wp-dark-mode-changelog"></div>
                        </div>
                        <a class="item" :href="get_started_url">
                            <svg class="fill-current w-4" viewBox="0 0 16 17" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M15.564 2.79581C16 3.69525 16 4.87267 16 7.22752V8.22338C16 9.64388 16 10.3541 15.8384 10.9335C15.455 12.3076 14.4328 13.3822 13.1255 13.7852C12.5743 13.955 11.8987 13.955 10.5474 13.955H10.1083L10.0562 13.9551C9.24008 13.9606 8.44496 14.2284 7.77779 14.7227L7.73538 14.7544L5.64678 16.3226C4.9308 16.8602 3.98994 16.0838 4.31672 15.2251C4.5482 14.6168 4.12201 13.955 3.49873 13.955H3.01733C1.3509 13.955 0 12.535 0 10.7833V7.22752C0 4.87267 0 3.69525 0.435974 2.79581C0.819464 2.00464 1.43139 1.3614 2.18404 0.958285C3.03969 0.5 4.15979 0.5 6.4 0.5H9.6C11.8402 0.5 12.9603 0.5 13.816 0.958285C14.5686 1.3614 15.1806 2.00464 15.564 2.79581ZM6.4 4.91494C6.06863 4.91494 5.8 5.19732 5.8 5.54564C5.8 5.89397 6.06863 6.17635 6.4 6.17635H9.6C9.93136 6.17635 10.2 5.89397 10.2 5.54564C10.2 5.19732 9.93136 4.91494 9.6 4.91494H6.4ZM4.8 8.2787C4.46863 8.2787 4.2 8.56108 4.2 8.90941C4.2 9.25772 4.46863 9.54011 4.8 9.54011H11.2C11.5314 9.54011 11.8 9.25772 11.8 8.90941C11.8 8.56108 11.5314 8.2787 11.2 8.2787H4.8Z"
                                    fill="#3B82F6" />
                            </svg>{{ t('help') }}</a>
                        <button class="item wp-dark-mode-locked" v-if="!isPro" href="javascript:;">
                            <svg class="fill-current w-3" viewBox="0 0 12 15" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M7.74348 0.563301C7.94431 0.675263 8.04289 0.909751 7.98239 1.13158L6.65464 6.00002H11.5C11.6991 6.00002 11.8792 6.11814 11.9586 6.30074C12.0379 6.48335 12.0014 6.69562 11.8655 6.84118L4.86554 14.3412C4.70866 14.5093 4.45736 14.5487 4.25654 14.4367C4.05571 14.3248 3.95713 14.0903 4.01763 13.8685L5.34539 9.00002H0.500011C0.300912 9.00002 0.120788 8.88189 0.0414373 8.69929C-0.037913 8.51669 -0.00136517 8.30441 0.134483 8.15886L7.13448 0.658858C7.29137 0.490769 7.54266 0.451339 7.74348 0.563301Z"
                                    fill="fill-current" />
                            </svg>{{ t('upgrade') }}</button>
                    </div>
                </div>

                <!-- Toast  -->
                <transition name="slide-twinkle">
                    <div v-if="Toast.isOpen.value" class="main-content-toast fixed right-3 top-14 flex items-center justify-center px-3 py-2.5 gap-2 bg-white z-[999999] rounded-xl shadow-xl">
                        <svg v-if="Toast.type.value === 'success'" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9996 21.3996C16.7434 21.3996 21.3996 16.7434 21.3996 10.9996C21.3996 5.25585 16.7434 0.599609 10.9996 0.599609C5.25585 0.599609 0.599609 5.25585 0.599609 10.9996C0.599609 16.7434 5.25585 21.3996 10.9996 21.3996ZM15.8188 9.31885C16.3265 8.81117 16.3265 7.98805 15.8188 7.48037C15.3112 6.97269 14.4881 6.97269 13.9804 7.48037L9.69961 11.7611L8.01885 10.0804C7.51117 9.57269 6.68805 9.57269 6.18037 10.0804C5.67269 10.5881 5.67269 11.4112 6.18037 11.9188L8.78037 14.5188C9.28805 15.0265 10.1112 15.0265 10.6188 14.5188L15.8188 9.31885Z" fill="#34D399"/>
                        </svg>

                        <span v-if="Toast.message.value" class="text-sm text-[#0F172A]">{{ Toast.message.value }}</span>

                        <Close @click="Toast.close()" class="relative top-auto right-auto" />
                    </div>
                </transition>

                <!-- main content  -->
                <div class="main-content-body">
                    <RouterView />
                    <UpgradeFooter v-if="!isPro" />
                    <MailTo v-model="state.showMailTo" v-if="state.showMailTo" />
                </div>
                <!-- save buttons  -->
                <transition name="fade">
                    <!-- save button  -->
                    <div class="save-buttons z-[10]" style="justify-content: flex-start" v-if="isChanged">
                        <Button color="red" outline @click.prevent="discardChanges">{{ t('discard_changes') }}</Button>
                        <Button @click="saveChanges">{{ t('save_changes') }}</Button>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

</style>