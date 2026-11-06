<script setup>
import { computed, onMounted } from 'vue';
import NavGroup from './NavGroup.vue';
import { settingsRoutes } from '@o/settings-routes';
import DarkModeStore from '@o/store';
import { useTranslation } from '../../composables/useTranslation';

const { state, toggleSidebar } = DarkModeStore()
const { t } = useTranslation();

onMounted(() => {
    // if current screen size is mobile, close sidebar
    if (window.innerWidth < 1024) {
        state.isMobile = true
    }

    // listen screen resize event
    window.addEventListener('resize', () => {
        if (window.innerWidth < 1024) {
            state.isMobile = true
        } else {
            state.isMobile = false
        }
    })
})

const collapsed = computed(() => { 
    return state.sidebarCollapsed  && !state.isMobile
})


</script>

<template>
    <!-- sidebar  -->
    <div class="wp-dark-mode-admin-sidebar bg-white" :class="{'max-w-fit' : collapsed, 'max-w-sidebar' : !collapsed}">
        <!-- sidebar header  -->
        <div class="wp-dark-mode-admin-sidebar-header justify-between">
            <div v-if="!collapsed" class="wp-dark-mode-admin-sidebar-header-logo wp-dark-mode-ignore">
                <img :src="DARK_MODE_IMAGE('settings/logo.svg')" />
                <h2 class="wp-dark-mode-admin-sidebar-header-title flex flex-col gap-1">
                    {{ t('wp_dark_mode') }}
                </h2>
            </div>

            <button @click.prevent="toggleSidebar()" v-if="!state.isMobile" class="wp-dark-mode-admin-sidebar-header-button" :class="{'collapsed' : state.sidebarCollapsed}">
                <svg class="wp-dark-mode-admin-sidebar-header-button-logo" :class="{'collapsed' : collapsed}" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M8.13789 1.41389C8.13789 0.964445 8.50224 0.600098 8.95169 0.600098H17.0896C17.5391 0.600098 17.9034 0.964446 17.9034 1.41389C17.9034 1.86334 17.5391 2.22768 17.0896 2.22768L8.95169 2.22768C8.50224 2.22768 8.13789 1.86334 8.13789 1.41389ZM8.13789 11.5863C8.13789 11.1368 8.50224 10.7725 8.95169 10.7725L17.0896 10.7725C17.5391 10.7725 17.9034 11.1368 17.9034 11.5863C17.9034 12.0357 17.5391 12.4001 17.0896 12.4001H8.95169C8.50224 12.4001 8.13789 12.0357 8.13789 11.5863ZM0.220101 5.94343C-0.0733669 6.25647 -0.0733669 6.74357 0.220101 7.05661L4.03476 11.1256C4.34215 11.4535 4.85715 11.4701 5.18504 11.1627C5.51292 10.8553 5.52954 10.3403 5.22214 10.0124L2.69222 7.31381L17.0897 7.31381C17.5391 7.31381 17.9034 6.94947 17.9034 6.50002C17.9034 6.05058 17.5391 5.68623 17.0897 5.68623L2.69222 5.68623L5.22214 2.98764C5.52953 2.65975 5.51292 2.14476 5.18503 1.83736C4.85715 1.52997 4.34215 1.54658 4.03476 1.87447L0.220101 5.94343Z" />
                </svg>
            </button>

            <!-- mobile toggle  -->
            <button class="cursor-pointer p-2 rounded sm:hidden" @click.prevent="state.showNavbar = !state.showNavbar"
            :class="{
                'bg-blue-600 text-white' : state.showNavbar,
                'bg-gray-50 text-gray-600' : !state.showNavbar,
            }">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 fill-current" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                  </svg>
            </button>
        </div>
        
        

        <transition name="slide-from-left">
            <!-- sidebar nav items  -->
            <div class="wp-dark-mode-admin-sidebar-nav" v-if="!state.isMobile || state.showNavbar">
                <!-- single nav  -->
                <NavGroup v-for="(route, key) in settingsRoutes" :key="key" :group="route" />
            </div>
        </transition>
    </div>
</template>

<style scoped>
.slide-from-left-enter-active,
.slide-from-left-leave-active {
    transition: all 0.1s ease-in-out;
}

.slide-from-left-enter,
.slide-from-left-leave-to {
    transform: translateX(-100%);
}


</style>