<script setup>
import Icon from './Icon.vue';
import { useTranslation } from '../composables/useTranslation';
const { t } = useTranslation();
</script>

<template>
    <section class="wp-dark-mode-upgrade-box-1 w-full border border-purple-400 sm:border-gray-100 shadow shadow-gray-100 px-8 sm:px-16 py-6 sm:py-10 flex gap-4 rounded-lg after:content-[''] relative after:absolute after:top-0 after:right-0 after:w-1/2 after:h-full overflow-hidden bg-white after:bg-gradient-to-r after:from-white after:to-purple-800 after:z-0 after:opacity-30">
        <div class="flex flex-col gap-5">
            <div class="text-gray-700 text-lg" v-html="t('upgrade_to_ultimate_html')"></div>
            <ul class="grid sm:grid-cols-2 sm:text-sm gap-x-10 text-gray-600 leading-7">
                <li class="flex items-center gap-2 py-0.5"><span class="inline-flex w-0 h-0 border-[2.5px] border-purple-500 rounded-full"></span> {{ t('feature_switches') }}</li>
                <li class="flex items-center gap-2 py-0.5"><span class="inline-flex w-0 h-0 border-[2.5px] border-purple-500 rounded-full"></span> {{ t('feature_presets') }}</li>
                <li class="flex items-center gap-2 py-0.5"><span class="inline-flex w-0 h-0 border-[2.5px] border-purple-500 rounded-full"></span> {{ t('feature_custom_css') }}</li>
                <li class="flex items-center gap-2 py-0.5"><span class="inline-flex w-0 h-0 border-[2.5px] border-purple-500 rounded-full"></span> {{ t('feature_dedicated_support') }}</li>
                <li class="flex items-center gap-2 py-0.5"><span class="inline-flex w-0 h-0 border-[2.5px] border-purple-500 rounded-full"></span> {{ t('feature_exclude') }}</li>
                <li class="flex items-center gap-2 py-0.5"><span class="inline-flex w-0 h-0 border-[2.5px] border-purple-500 rounded-full"></span> {{ t('feature_no_ads') }}</li>
            </ul>
            <div class="flex items-center gap-4">
                <button 
                    class="wp-dark-mode-locked px-4 whitespace-nowrap py-2 text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition duration-75">{{ t('upgrade_all_features') }} <Icon name="arrow" />
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    background: var( --wp-dark-upgrade-box1-background ) no-repeat bottom right;
    background-size: auto;
}

html[data-wp-dark-mode-active] section {
    background: none;
    background-size: auto;
}
button {
    background: linear-gradient(257deg, #AD8AF9 -4.61%, #462AA8 114.33%, #3D2990 154.67%);
}
</style>