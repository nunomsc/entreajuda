<script setup>
import { computed, onMounted } from 'vue';
import { Card, Heading, Button, Hints, CustomPreset } from '@components'
import DarkModeStore from '@o/store'
import PresetCustomization from './PresetCustomization.vue'
import { useTranslation } from '../composables/useTranslation'

const { t } = useTranslation()
const { options, createPreset, data-wp-dark-mode-locked, isPro } = DarkModeStore()

// after wp_dark_mode_admin_json.predefined_presets.length, the presets are custom presets
const customPresets = computed( () => options.color_presets.slice(wp_dark_mode_admin_json.predefined_presets.length))

const deletePreset = (index) => {
    // Bail, if it's a predefined preset
    if ( (index + 1) <= (wp_dark_mode_admin_json.predefined_presets.length) ) return;

    options.color_presets[index].menu = false

    if (options.color_preset_id === (index + 1)) {
        
        data-wp-dark-mode-locked({
            color: 'warning',
            title: t('preset_in_use'),
            message: t('preset_in_use_msg'),
            confirmText: t('got_it'),
        })

        return;
    }

    data-wp-dark-mode-locked({
        color: 'warning',
        title: t('delete_preset_title'),
        message: t('delete_preset_msg'),
        confirmText: t('confirm'),
        confirmColor: 'red',
        cancelText: t('cancel'),
        confirm: () => {
            options.color_presets.splice(index, 1)
        }
    })
}

onMounted(() => {
    // Log(customPresets.value);
    if (customPresets.value.length === 0) {
        data-wp-dark-mode-locked({
            title: t('create_preset_first'),
            message: t('create_preset_first_msg'),
            confirmText: t('got_it'),
            onConfirm: () => {
                createPreset()
            }
        })
    }
})

const image = url => {
    return `${wp_dark_mode_admin_json.url.images}/${url}`
}

const realIndex = i => (i + wp_dark_mode_admin_json.predefined_presets.length)
const realId = i => ( realIndex(i) + 1 )
const isCustomPreset = i => i >= wp_dark_mode_admin_json.predefined_presets.length

</script>
<template>
    <Card borderless transparent class="gap-5">
        <Card v-if="customPresets.length === 0" borderless transparent class="items-center gap-6">
            <img :src="DARK_MODE_IMAGE('settings/no-preset.png')" class="w-24 rounded-2xl">
            <Heading class="items-center" bold>{{ t('no_custom_preset') }}<Hints>{{ t('click_to_create_preset') }}</Hints>
            </Heading>
            <Button outline class="font-semibold" @click.prevent="isPro ? createPreset() : ''" :class="{
                'opacity-60 wp-dark-mode-locked' : !isPro
            }">{{ t('add_custom_preset') }}</Button>
        </Card>
        <Card v-if="customPresets.length > 0">
            <Heading bold>{{ t('custom_color_presets') }}<Hints>{{ t('custom_preset_hint') }}</Hints>
            </Heading>
            <div class="h-0.5 w-full bg-gray-100 my-3"></div>
            <div class="flex flex-wrap justify-start gap-4">
                <div v-for="(preset, presetIndex) in customPresets" :key="realIndex(presetIndex)"
                    class="group relative flex flex-col items-center gap-3 text-orange-500 transition duration-75 rounded-lg cursor-pointer w-fit h-fit">
                    <!-- <img class="text-red-600" src="/images/preset.svg" alt=""> -->
                   
                    <div class="relative w-32 h-32 transition duration-75 bg-gray-100 rounded"
                        :class="{ 'ring ring-blue-400': options.color_preset_id === realId(presetIndex) }">
                        <div class="absolute z-50 group-hover:flex flex-col items-start text-right right-1 top-1 hidden">
                            <div class="px-0.5 bg-gray-600 rounded cursor-pointer"
                                @click.prevent="preset.menu = !preset.menu">
                                <svg class="w-5" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M4.6875 12.5C4.6875 11.6371 5.38706 10.9375 6.25 10.9375C7.11294 10.9375 7.8125 11.6371 7.8125 12.5C7.8125 13.3629 7.11294 14.0625 6.25 14.0625C5.38706 14.0625 4.6875 13.3629 4.6875 12.5ZM10.9375 12.5C10.9375 11.6371 11.6371 10.9375 12.5 10.9375C13.3629 10.9375 14.0625 11.6371 14.0625 12.5C14.0625 13.3629 13.3629 14.0625 12.5 14.0625C11.6371 14.0625 10.9375 13.3629 10.9375 12.5ZM17.1875 12.5C17.1875 11.6371 17.8871 10.9375 18.75 10.9375C19.6129 10.9375 20.3125 11.6371 20.3125 12.5C20.3125 13.3629 19.6129 14.0625 18.75 14.0625C17.8871 14.0625 17.1875 13.3629 17.1875 12.5Z"
                                        fill="white" />
                                </svg>
                            </div>
                        </div>
                        <div v-if="preset.menu"
                            class="absolute z-50 w-20 py-1 -ml-1 text-xs text-gray-600 bg-white rounded shadow-lg top-6 -right-14">
                            <span class="px-4 py-2 cursor-pointer hover:text-red-500"
                                @click="deletePreset(realIndex(presetIndex))">{{ t('delete') }}</span>
                        </div>
                        <CustomPreset @click.prevent="options.color_preset_id = realId(presetIndex)" />
                        <div v-if="options.color_preset_id === realId(presetIndex)"
                            class="absolute flex items-center justify-center w-8 h-8 p-0 text-blue-600 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow top-1/2 left-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 fill-current" viewBox="0 0 16 16">
                                <path
                                    d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                            </svg>
                        </div>
                    </div>
                    <Hints :class="{ 'font-semibold text-gray-700': options.color_preset_id === realId(presetIndex) }"
                        class="text-gray-600 pb-1.5"><span class="outline-none" :contenteditable="isCustomPreset(realIndex(presetIndex))" 
                        @keydown="options.color_presets[realIndex(presetIndex)].name = $event.target.innerText.trim()">{{ preset.name || t('untitled') }}</span></Hints>
                </div>
                <!-- add custom preset  -->
                <div
                    class="relative flex flex-col items-center gap-3 transition duration-75 rounded-lg cursor-pointer w-fit h-fit">
                    <!-- <img class="text-red-600" src="/images/preset.svg" alt=""> -->
                    <div class="relative inline-flex items-center justify-center w-32 h-32 overflow-hidden transition duration-75 border-2 border-gray-200 border-dashed rounded bg-gray-50 hover:bg-gray-200"
                        @click.prevent="createPreset">
                        <svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M20.5 6.25C21.1904 6.25 21.75 6.80964 21.75 7.5V18.75H33C33.6904 18.75 34.25 19.3096 34.25 20C34.25 20.6904 33.6904 21.25 33 21.25H21.75V32.5C21.75 33.1904 21.1904 33.75 20.5 33.75C19.8096 33.75 19.25 33.1904 19.25 32.5V21.25H8C7.30964 21.25 6.75 20.6904 6.75 20C6.75 19.3096 7.30964 18.75 8 18.75H19.25V7.5C19.25 6.80964 19.8096 6.25 20.5 6.25Z"
                                fill="#2563EB" />
                        </svg>
                    </div>
                    <Hints class="text-gray-600 pb-1.5">{{ t('create_new_preset') }}</Hints>
                </div>
            </div>
        </Card>
        <PresetCustomization v-if="customPresets.length > 0" :index="options.color_preset_id" />
    </Card>
</template>