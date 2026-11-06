<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Card, Heading, Button, Hints, CustomPreset } from '@components'
import DarkModeStore from '@o/store'
import AIPresetGenerator from './AIPresetGenerator.vue'
import { useTranslation } from '../../composables/useTranslation';

const { t } = useTranslation();

const showAIGenerator = ref(false)
const editingPresetIndex = ref(null)

const { options, createPreset, showModal, isPro, state, showProModal } = DarkModeStore()

// Update URL with AI generator state
const updateUrlParams = () => {
    const url = new URL(window.location.href)
    if (showAIGenerator.value) {
        url.searchParams.set('ai', '1')
        if (editingPresetIndex.value !== null) {
            url.searchParams.set('edit', editingPresetIndex.value)
        } else {
            url.searchParams.delete('edit')
        }
    } else {
        url.searchParams.delete('ai')
        url.searchParams.delete('edit')
    }
    window.history.replaceState({}, '', url)
}

const openAIGenerator = () => {
    // Check if user is not pro and already has 1 custom preset
    if (!isPro && customPresets.value.length >= 1) {
        showProModal()
        return
    }

    showAIGenerator.value = true
    editingPresetIndex.value = null
    state.aiGeneratorOpen = true
    updateUrlParams()
}

const closeAIGenerator = () => {
    showAIGenerator.value = false
    editingPresetIndex.value = null
    state.aiGeneratorOpen = false
    state.aiPaletteSelected = false
    updateUrlParams()
}

const handleGenerate = (preset) => {
    // Preset is now saved directly in AIPresetGenerator
    closeAIGenerator()
}

const editPreset = (index) => {
    editingPresetIndex.value = index
    showAIGenerator.value = true
    state.aiGeneratorOpen = true
    updateUrlParams()
}

// after wp_dark_mode_admin_json.predefined_presets.length, the presets are custom presets
const customPresets = computed(() => options.color_presets.slice(wp_dark_mode_admin_json.predefined_presets.length))

// Check if a custom preset is locked (for non-pro users, only first preset is unlocked)
const isPresetLocked = (presetIndex) => {
    return !isPro && presetIndex > 0
}

// Handle preset selection with lock check
const selectPreset = (presetIndex) => {
    if (isPresetLocked(presetIndex)) {
        showProModal()
        return
    }
    options.color_preset_id = realId(presetIndex)
}

const deletePreset = (index) => {
    // Bail, if it's a predefined preset
    if ((index + 1) <= (wp_dark_mode_admin_json.predefined_presets.length)) return;

    options.color_presets[index].menu = false

    if (options.color_preset_id === (index + 1)) {

        showModal({
            color: 'warning',
            title: t('preset_in_use_title'),
            message: t('preset_in_use_msg'),
            confirmText: t('got_it'),
            titleColor: '#F97316',
            confirmBackground: '#2563EB',
        })

        return;
    }

    showModal({
        color: 'warning',
        title: t('delete_preset_title'),
        message: t('delete_preset_msg'),
        confirmText: t('confirm'),
        cancelText: t('cancel'),
        titleColor: '#F97316',

        confirm: () => {
            options.color_presets.splice(index, 1)

            // If the selected preset is equal or more than deleted preset, change the current color_preset_id.
            if ( options.color_preset_id >= index ) {
                options.color_preset_id -= 1
            }
        }
    })
}


const realIndex = i => (i + wp_dark_mode_admin_json.predefined_presets.length)
const realId = i => (realIndex(i) + 1)
const isCustomPreset = i => i >= wp_dark_mode_admin_json.predefined_presets.length

// Preset menu bar.
const closeAllMenus = () => {
    customPresets.value.forEach(preset => {
        preset.menu = false
    })
}
onMounted(() => {
    // Read URL params on mount
    const urlParams = new URLSearchParams(window.location.search)
    const aiParam = urlParams.get('ai')
    const editParam = urlParams.get('edit')

    if (aiParam === '1') {
        showAIGenerator.value = true
        state.aiGeneratorOpen = true
        if (editParam) {
            editingPresetIndex.value = parseInt(editParam, 10)
        }
    }

    // Close all menus on click outside
    document.addEventListener('click', (e) => {
        if (e.target.closest('.preset-menu')) return;
        closeAllMenus()
    })

    // Close all menus on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllMenus()
        }
    })
})

</script>
<template>
    <Card borderless transparent class="gap-5">
        <!-- AI Preset Generator Form -->
        <AIPresetGenerator
            v-if="showAIGenerator"
            :editingPresetIndex="editingPresetIndex"
            @close="closeAIGenerator"
            @generate="handleGenerate"
        />

        <!-- Empty State -->
        <Card v-if="customPresets.length === 0 && !showAIGenerator" borderless transparent class="items-center justify-center gap-5 py-12 px-8">
            <!-- Icon Circle -->
            <div class="flex items-center justify-center w-40 h-40 rounded-full" style="background-color: rgba(94, 185, 177, 0.15);">
                <svg width="56" height="56" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: #5EB9B1;">
                    <polygon points="2 0 3 2 2 4 4 3 6 4 5 2 6 0 4 1 2 0" fill="currentColor"></polygon>
                    <polygon points="12 0 13 2 12 4 14 3 16 4 15 2 16 0 14 1 12 0" fill="currentColor"></polygon>
                    <polygon points="12 10 13 12 12 14 14 13 16 14 15 12 16 10 14 11 12 10" fill="currentColor"></polygon>
                    <rect x="6.805" y="5.823" width="3.743" height="3" transform="translate(-2.637 8.28) rotate(-45)" fill="currentColor"></rect>
                    <rect x="-0.096" y="10.647" width="7.9" height="3" transform="translate(-7.46 6.282) rotate(-45)" fill="currentColor"></rect>
                </svg>
            </div>

            <!-- Title with Badge -->
            <div class="flex items-center justify-center gap-2 flex-wrap">
                <span class="text-2xl">âœ¨</span>
                <span class="text-xl font-bold text-gray-800">{{ t('ai_gen_title') }}</span>
                <span class="px-2.5 py-0.5 text-xs font-semibold text-white rounded" style="background-color: #10B981;">{{ t('new') }}</span>
            </div>

            <!-- Description -->
            <p class="text-center text-gray-600 text-sm max-w-lg leading-relaxed">
                {{ t('ai_gen_desc') }}
            </p>

            <!-- Generate Button -->
            <Button class="font-semibold text-white px-5 py-2.5 rounded-md flex items-center gap-2" style="background-color: #6366F1;" @click.prevent="openAIGenerator">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="2 0 3 2 2 4 4 3 6 4 5 2 6 0 4 1 2 0" fill="currentColor"></polygon>
                    <polygon points="12 0 13 2 12 4 14 3 16 4 15 2 16 0 14 1 12 0" fill="currentColor"></polygon>
                    <polygon points="12 10 13 12 12 14 14 13 16 14 15 12 16 10 14 11 12 10" fill="currentColor"></polygon>
                    <rect x="6.805" y="5.823" width="3.743" height="3" transform="translate(-2.637 8.28) rotate(-45)" fill="currentColor"></rect>
                    <rect x="-0.096" y="10.647" width="7.9" height="3" transform="translate(-7.46 6.282) rotate(-45)" fill="currentColor"></rect>
                </svg>
                <span>{{ t('gen_my_theme') }}</span>
            </Button>
        </Card>

        <!-- Custom Presets List -->
        <Card v-if="customPresets.length > 0 && !showAIGenerator">
            <div class="flex items-start justify-start mb-3">
                <div>
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-palette-fill text-blue-600" viewBox="0 0 16 16">
                            <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07M8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                        </svg>
                        <Heading bold>{{ t('custom_presets_title') }}</Heading>
                    </div>
                    <Hints>{{ t('custom_presets_hints') }}</Hints>
                </div>
            </div>
            <div class="h-0.5 w-full bg-gray-100 my-3"></div>
            <div class="flex flex-wrap justify-start gap-4">
                <div v-for="(preset, presetIndex) in customPresets" :key="realIndex(presetIndex)"
                    class="group relative flex flex-col items-center gap-3 text-orange-500 transition duration-75 rounded-lg w-fit h-fit"
                    :class="isPresetLocked(presetIndex) ? 'cursor-pointer opacity-50' : 'cursor-pointer'">
                    <!-- <img class="text-red-600" src="/images/preset.svg" alt=""> -->
                    <div class="relative w-32 h-32 transition duration-75 bg-gray-100 rounded"
                        :class="{ 'ring ring-blue-400': options.color_preset_id === realId(presetIndex) }">
                        <div v-if="!isPresetLocked(presetIndex)" class="absolute z-50 group-hover:flex flex-col items-start text-right right-1 top-1 hidden preset-menu"
                            @click.prevent="closeAllMenus(), preset.menu = !preset.menu" :class="{ 'flex': preset.menu }">
                            <div class="px-0.5 bg-gray-600 rounded cursor-pointer">
                                <svg class="w-5" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M4.6875 12.5C4.6875 11.6371 5.38706 10.9375 6.25 10.9375C7.11294 10.9375 7.8125 11.6371 7.8125 12.5C7.8125 13.3629 7.11294 14.0625 6.25 14.0625C5.38706 14.0625 4.6875 13.3629 4.6875 12.5ZM10.9375 12.5C10.9375 11.6371 11.6371 10.9375 12.5 10.9375C13.3629 10.9375 14.0625 11.6371 14.0625 12.5C14.0625 13.3629 13.3629 14.0625 12.5 14.0625C11.6371 14.0625 10.9375 13.3629 10.9375 12.5ZM17.1875 12.5C17.1875 11.6371 17.8871 10.9375 18.75 10.9375C19.6129 10.9375 20.3125 11.6371 20.3125 12.5C20.3125 13.3629 19.6129 14.0625 18.75 14.0625C17.8871 14.0625 17.1875 13.3629 17.1875 12.5Z"
                                        fill="white" />
                                </svg>
                            </div>
                        </div>
                        <div v-if="preset.menu && !isPresetLocked(presetIndex)"
                            class="absolute z-50 w-20 py-1 -ml-1 text-xs text-gray-600 bg-white rounded shadow-lg top-6 -right-14">
                            <span class="block px-4 py-2 cursor-pointer hover:text-blue-500"
                                @click="editPreset(realIndex(presetIndex))">{{ t('edit') }}</span>
                            <span class="block px-4 py-2 cursor-pointer hover:text-red-500"
                                @click="deletePreset(realIndex(presetIndex))">{{ t('delete') }}</span>
                        </div>
                        <CustomPreset @click.prevent="selectPreset(presetIndex)" />

                        <div v-if="options.color_preset_id === realId(presetIndex)"
                            class="absolute flex items-center justify-center w-8 h-8 p-0 text-blue-600 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow top-1/2 left-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 fill-current" viewBox="0 0 16 16">
                                <path
                                    d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                            </svg>
                        </div>
                    </div>
                    <div class="flex items-center justify-center gap-1.5">
                        <Hints
                            :class="{ 'font-semibold text-gray-700': options.color_preset_id === realId(presetIndex) }"
                            class="text-gray-600 pb-1.5"
                        >
                            <span class="outline-none">{{ preset.name || t('untitled') }}</span>
                        </Hints>
                        <button
                            v-if="!isPresetLocked(presetIndex)"
                            @click="editPreset(realIndex(presetIndex))"
                            class="text-blue-600 hover:text-blue-700 transition-colors pb-1.5 flex-shrink-0"
                            :title="t('edit_preset')"
                        >
                            <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <!-- add custom preset  -->
                <div
                    class="relative flex flex-col items-center gap-3 transition duration-75 rounded-lg cursor-pointer w-fit h-fit">
                    <!-- <img class="text-red-600" src="/images/preset.svg" alt=""> -->
                    <div class="relative inline-flex items-center justify-center w-32 h-32 overflow-hidden transition duration-75 border-2 border-gray-200 border-dashed rounded bg-gray-50 hover:bg-gray-200"
                        @click.prevent="openAIGenerator">
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
    </Card>
</template>