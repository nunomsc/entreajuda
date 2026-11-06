<script setup>
import { Card, Heading, Hints, Input, Badge, Preview, Alert, Toggle } from '@components'
import { ref, defineProps, computed } from 'vue'
const props = defineProps({
    index: {
        type: Number,
        default: 1
    }
})

import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation';

const { t } = useTranslation();
const { options, isPro, isLocked, showProModal } = DarkModeStore()

const presetId = computed(() => props.index)
const realIndex = computed(() => presetId.value - 1)

const preset = computed(() => options.color_presets[realIndex.value] )
const isCustom = computed(() => realIndex.value >= wp_dark_mode_admin_json.predefined_presets.length )
const isDuplicate = computed(() => {
    if (isCustom.value) {
        return options.color_presets.some((p, index) => {
            return index !== realIndex.value && preset && p.name && p.name === options.color_presets[realIndex.value].name
        })
    }

    return false
})

const defaults = computed(() => {
    if( isCustom.value ) return {}

    return wp_dark_mode_admin_json.predefined_presets[realIndex.value]
})

// Reset a color to its default value
const resetColor = (property) => {
    if (defaults.value && defaults.value[property]) {
        preset.value[property] = defaults.value[property]
    }
}

// Check if a color has been modified from default
const isColorModified = (property) => {
    if (!defaults.value || !defaults.value[property]) return false
    const current = (preset.value[property] || '').toLowerCase()
    const original = (defaults.value[property] || '').toLowerCase()
    return current && current !== original
}

// Computed property for Preview component
const previewColors = computed(() => {
    if (!preset.value) return null

    return {
        bg: preset.value.bg || defaults.value.bg || '#222',
        text: preset.value.text || defaults.value.text || '#eee',
        link: preset.value.link || defaults.value.link,
        link_hover: preset.value.link_hover || defaults.value.link_hover,
        input_bg: preset.value.input_bg || defaults.value.input_bg,
        input_text: preset.value.input_text || defaults.value.input_text,
        input_placeholder: preset.value.input_placeholder || defaults.value.input_placeholder,
        button_bg: preset.value.button_bg || defaults.value.button_bg,
        button_hover_bg: preset.value.button_hover_bg || defaults.value.button_hover_bg,
        button_text: preset.value.button_text || defaults.value.button_text,
        button_hover_text: preset.value.button_hover_text || defaults.value.button_hover_text,
        button_border: preset.value.button_border || defaults.value.button_border,
        enable_scrollbar: preset.value.enable_scrollbar,
        scrollbar_track: preset.value.scrollbar_track || defaults.value.scrollbar_track,
        scrollbar_thumb: preset.value.scrollbar_thumb || defaults.value.scrollbar_thumb
    }
})
</script>

<template>
    <Card borderless transparent class="gap-5">
        <!-- Preset Name for Custom Presets -->
        <Card v-if="isCustom" class="gap-3">
            <Heading bold>
                {{ t('custom_color_preset_name') }}
            </Heading>
            <Input :class="{'focus:ring-red-500' : isDuplicate}" v-model="preset.name" :placeholder="t('preset_name_placeholder')"/>
            <Alert v-if="isDuplicate" color="warning"> {{ t('preset_exists_msg') }} {{ preset.name }}</Alert>
        </Card>

        <!-- Color Customization -->
        <div class="flex flex-wrap justify-start md:flex-nowrap gap-6 items-start">
            <!-- Main Area (Left) -->
            <Card class="w-full gap-6 flex-1">
                <!-- Body Colors -->
                <Card borderless transparent>
                    <Heading>{{ t('body_colors') }}</Heading>
                    <div class="flex gap-4 flex-wrap">
                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                :style="{ backgroundColor: preset.bg || defaults.bg }"
                                @click="isPro ? $refs.bgInput?.click() : showProModal()"
                            >
                                <!-- Hover Overlay Background -->
                                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <!-- Icon centered -->
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <input
                                ref="bgInput"
                                type="color"
                                v-model="preset.bg"
                                class="sr-only"
                            />
                            <div class="text-center">
                                <div class="text-xs font-medium text-gray-700">{{ t('background') }}</div>
                                <div class="flex items-center justify-center gap-1">
                                    <div class="text-xs text-gray-500 font-mono">{{ preset.bg || defaults.bg }}</div>
                                    <button v-if="defaults.bg" @click.stop="resetColor('bg')" class="transition-opacity" :class="isColorModified('bg') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <!-- Text & Link Colors -->
                <Card borderless transparent>
                    <Heading>{{ t('text_link_colors') }}</Heading>
                    <div class="flex gap-4 flex-wrap">
                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                :style="{ backgroundColor: preset.text || defaults.text }"
                                @click="isPro ? $refs.textInput?.click() : showProModal()"
                            >
                                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <input ref="textInput" type="color" v-model="preset.text" class="sr-only" />
                            <div class="text-center">
                                <div class="text-xs font-medium text-gray-700">{{ t('text') }}</div>
                                <div class="flex items-center justify-center gap-1">
                                    <div class="text-xs text-gray-500 font-mono">{{ preset.text || defaults.text }}</div>
                                    <button v-if="defaults.text" @click.stop="resetColor('text')" class="transition-opacity" :class="isColorModified('text') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                :style="{ backgroundColor: preset.link || defaults.link }"
                                @click="isPro ? $refs.linkInput?.click() : showProModal()"
                            >
                                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <input ref="linkInput" type="color" v-model="preset.link" class="sr-only" />
                            <div class="text-center">
                                <div class="text-xs font-medium text-gray-700">{{ t('link') }}</div>
                                <div class="flex items-center justify-center gap-1">
                                    <div class="text-xs text-gray-500 font-mono">{{ preset.link || defaults.link }}</div>
                                    <button v-if="defaults.link" @click.stop="resetColor('link')" class="transition-opacity" :class="isColorModified('link') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                :style="{ backgroundColor: preset.link_hover || defaults.link_hover }"
                                @click="isPro ? $refs.linkHoverInput?.click() : showProModal()"
                            >
                                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <input ref="linkHoverInput" type="color" v-model="preset.link_hover" class="sr-only" />
                            <div class="text-center">
                                <div class="text-xs font-medium text-gray-700">{{ t('link_hover') }}</div>
                                <div class="flex items-center justify-center gap-1">
                                    <div class="text-xs text-gray-500 font-mono">{{ preset.link_hover || defaults.link_hover }}</div>
                                    <button v-if="defaults.link_hover" @click.stop="resetColor('link_hover')" class="transition-opacity" :class="isColorModified('link_hover') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <!-- Input Field Colors -->
                <Card borderless transparent>
                    <Heading>{{ t('input_field_colors') }}</Heading>
                    <div class="flex gap-4 flex-wrap">
                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                :style="{ backgroundColor: preset.input_bg || defaults.input_bg }"
                                @click="isPro ? $refs.inputBgInput?.click() : showProModal()"
                            >
                                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <input ref="inputBgInput" type="color" v-model="preset.input_bg" class="sr-only" />
                            <div class="text-center">
                                <div class="text-xs font-medium text-gray-700">{{ t('background') }}</div>
                                <div class="flex items-center justify-center gap-1">
                                    <div class="text-xs text-gray-500 font-mono">{{ preset.input_bg || defaults.input_bg }}</div>
                                    <button v-if="defaults.input_bg" @click.stop="resetColor('input_bg')" class="transition-opacity" :class="isColorModified('input_bg') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                :style="{ backgroundColor: preset.input_text || defaults.input_text }"
                                @click="isPro ? $refs.inputTextInput?.click() : showProModal()"
                            >
                                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <input ref="inputTextInput" type="color" v-model="preset.input_text" class="sr-only" />
                            <div class="text-center">
                                <div class="text-xs font-medium text-gray-700">{{ t('input_text') }}</div>
                                <div class="flex items-center justify-center gap-1">
                                    <div class="text-xs text-gray-500 font-mono">{{ preset.input_text || defaults.input_text }}</div>
                                    <button v-if="defaults.input_text" @click.stop="resetColor('input_text')" class="transition-opacity" :class="isColorModified('input_text') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                :style="{ backgroundColor: preset.input_placeholder || defaults.input_placeholder }"
                                @click="isPro ? $refs.placeholderInput?.click() : showProModal()"
                            >
                                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <input ref="placeholderInput" type="color" v-model="preset.input_placeholder" class="sr-only" />
                            <div class="text-center">
                                <div class="text-xs font-medium text-gray-700">{{ t('placeholder') }}</div>
                                <div class="flex items-center justify-center gap-1">
                                    <div class="text-xs text-gray-500 font-mono">{{ preset.input_placeholder || defaults.input_placeholder }}</div>
                                    <button v-if="defaults.input_placeholder" @click.stop="resetColor('input_placeholder')" class="transition-opacity" :class="isColorModified('input_placeholder') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <!-- Button Colors -->
                <Card borderless transparent>
                    <Heading>{{ t('button_colors') }}</Heading>
                    <div class="flex gap-4 flex-wrap">
                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                :style="{ backgroundColor: preset.button_bg || defaults.button_bg }"
                                @click="isPro ? $refs.btnBgInput?.click() : showProModal()"
                            >
                                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <input ref="btnBgInput" type="color" v-model="preset.button_bg" class="sr-only" />
                            <div class="text-center">
                                <div class="text-xs font-medium text-gray-700">{{ t('background') }}</div>
                                <div class="flex items-center justify-center gap-1">
                                    <div class="text-xs text-gray-500 font-mono">{{ preset.button_bg || defaults.button_bg }}</div>
                                    <button v-if="defaults.button_bg" @click.stop="resetColor('button_bg')" class="transition-opacity" :class="isColorModified('button_bg') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                :style="{ backgroundColor: preset.button_hover_bg || defaults.button_hover_bg }"
                                @click="isPro ? $refs.btnHoverBgInput?.click() : showProModal()"
                            >
                                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <input ref="btnHoverBgInput" type="color" v-model="preset.button_hover_bg" class="sr-only" />
                            <div class="text-center">
                                <div class="text-xs font-medium text-gray-700">{{ t('hover_bg') }}</div>
                                <div class="flex items-center justify-center gap-1">
                                    <div class="text-xs text-gray-500 font-mono">{{ preset.button_hover_bg || defaults.button_hover_bg }}</div>
                                    <button v-if="defaults.button_hover_bg" @click.stop="resetColor('button_hover_bg')" class="transition-opacity" :class="isColorModified('button_hover_bg') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                :style="{ backgroundColor: preset.button_text || defaults.button_text }"
                                @click="isPro ? $refs.btnTextInput?.click() : showProModal()"
                            >
                                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <input ref="btnTextInput" type="color" v-model="preset.button_text" class="sr-only" />
                            <div class="text-center">
                                <div class="text-xs font-medium text-gray-700">{{ t('text') }}</div>
                                <div class="flex items-center justify-center gap-1">
                                    <div class="text-xs text-gray-500 font-mono">{{ preset.button_text || defaults.button_text }}</div>
                                    <button v-if="defaults.button_text" @click.stop="resetColor('button_text')" class="transition-opacity" :class="isColorModified('button_text') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                :style="{ backgroundColor: preset.button_hover_text || defaults.button_hover_text }"
                                @click="isPro ? $refs.btnHoverTextInput?.click() : showProModal()"
                            >
                                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <input ref="btnHoverTextInput" type="color" v-model="preset.button_hover_text" class="sr-only" />
                            <div class="text-center">
                                <div class="text-xs font-medium text-gray-700">{{ t('hover_text') }}</div>
                                <div class="flex items-center justify-center gap-1">
                                    <div class="text-xs text-gray-500 font-mono">{{ preset.button_hover_text || defaults.button_hover_text }}</div>
                                    <button v-if="defaults.button_hover_text" @click.stop="resetColor('button_hover_text')" class="transition-opacity" :class="isColorModified('button_hover_text') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col items-center gap-2">
                            <div
                                class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                :style="{ backgroundColor: preset.button_border || defaults.button_border }"
                                @click="isPro ? $refs.btnBorderInput?.click() : showProModal()"
                            >
                                <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <input ref="btnBorderInput" type="color" v-model="preset.button_border" class="sr-only" />
                            <div class="text-center">
                                <div class="text-xs font-medium text-gray-700">{{ t('border') }}</div>
                                <div class="flex items-center justify-center gap-1">
                                    <div class="text-xs text-gray-500 font-mono">{{ preset.button_border || defaults.button_border }}</div>
                                    <button v-if="defaults.button_border" @click.stop="resetColor('button_border')" class="transition-opacity" :class="isColorModified('button_border') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </Card>

            <!-- Preview Area (Right - sticky) -->
            <div class="sticky top-6 h-fit">
                <Card borderless class="p-6 w-fit">
                    <Preview dark :color="previewColors" />
                </Card>
            </div>
        </div>

        <!-- Scrollbar Customization -->
        <Card class="gap-5">
            <Heading bold>{{ t('scrollbar_customization') }}</Heading>

            <Card borderless transparent>
                <div class="flex items-center gap-3">
                    <Toggle v-model="preset.enable_scrollbar">
                        <Heading>{{ t('enable_scrollbar_dark_mode') }}</Heading>
                    </Toggle>
                    <div class="tooltip-wrapper relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="text-gray-400 hover:text-blue-600 cursor-help" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                        </svg>
                        <div class="tooltip-content absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible transition-all duration-200 z-50 pointer-events-none">
                            {{ t('scrollbar_customization_hints') }}
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                    </div>
                </div>
            </Card>

            <div v-if="preset.enable_scrollbar" class="flex gap-4 flex-wrap">
                <div class="flex flex-col items-center gap-2">
                    <div
                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                        :style="{ backgroundColor: preset.scrollbar_track || defaults.scrollbar_track }"
                        @click="isPro ? $refs.scrollTrackInput?.click() : showProModal()"
                    >
                        <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <input ref="scrollTrackInput" type="color" v-model="preset.scrollbar_track" class="sr-only" />
                    <div class="text-center">
                        <div class="text-xs font-medium text-gray-700">{{ t('track_bg') }}</div>
                        <div class="flex items-center justify-center gap-1">
                            <div class="text-xs text-gray-500 font-mono">{{ preset.scrollbar_track || defaults.scrollbar_track }}</div>
                            <button v-if="defaults.scrollbar_track" @click.stop="resetColor('scrollbar_track')" class="transition-opacity" :class="isColorModified('scrollbar_track') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-center gap-2">
                    <div
                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                        :style="{ backgroundColor: preset.scrollbar_thumb || defaults.scrollbar_thumb }"
                        @click="isPro ? $refs.scrollThumbInput?.click() : showProModal()"
                    >
                        <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg v-if="isPro" class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            <svg v-else class="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <input ref="scrollThumbInput" type="color" v-model="preset.scrollbar_thumb" class="sr-only" />
                    <div class="text-center">
                        <div class="text-xs font-medium text-gray-700">{{ t('thumb_bg') }}</div>
                        <div class="flex items-center justify-center gap-1">
                            <div class="text-xs text-gray-500 font-mono">{{ preset.scrollbar_thumb || defaults.scrollbar_thumb }}</div>
                            <button v-if="defaults.scrollbar_thumb" @click.stop="resetColor('scrollbar_thumb')" class="transition-opacity" :class="isColorModified('scrollbar_thumb') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_default')">
                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    </Card>
</template>

<style scoped>
.tooltip-wrapper:hover .tooltip-content {
    opacity: 1 !important;
    visibility: visible !important;
}
</style>
