<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Card, Heading, Button, Preview, Toggle, SectionHead, Input, Preset, Hints } from '@components'
import DarkModeStore from '@o/store'
import Toast from '@stores/toast'

import { useTranslation } from '../../composables/useTranslation';
const { t } = useTranslation();

const { options, showModal, saveChanges, state, isPro, showProModal } = DarkModeStore()

const props = defineProps({
    editingPresetIndex: {
        type: Number,
        default: null
    }
})

const emit = defineEmits(['close', 'generate'])

const prompt = ref('Generate a modern dark theme with balanced contrast and smooth UI colors for my website')
const MAX_PROMPT_LENGTH = 200
const MIN_PROMPT_LENGTH = 10
const isLoading = ref(false)
const showResults = ref(false)
const loadingProgress = ref(0)

// Mock color palettes - these will come from AI later
const colorPalettes = ref([
    {
        id: 1,
        colors: ['#5B5FFF', '#7B7FFF', '#9B9FFF', '#BBBFFF'],
        bg: '#E8E8FF',
        customization: {
            bodyColors: {
                background: '#3B3BF6'
            },
            textLinkColors: {
                text: '#3B3BF6',
                link: '#3B3BF6',
                linkHover: '#3B3BF6'
            },
            inputFieldColors: {
                background: '#3B3BF6',
                inputText: '#3B3BF6',
                placeholder: '#3B3BF6'
            },
            buttonColors: {
                background: '#C3C3F6',
                hoverBackground: '#3B3BF6',
                text: '#3B3BF6',
                hoverText: '#3B3BF6',
                buttonBorder: '#3B3BF6'
            },
            scrollbarCustomization: {
                trackBackground: '#3B3BF6',
                thumbBackground: '#3B3BF6'
            }
        }
    },
    {
        id: 2,
        colors: ['#7B2FFF', '#9B4FFF', '#BB6FFF', '#DB8FFF'],
        bg: '#F0E8FF',
        customization: {
            bodyColors: {
                background: '#3B3BF6'
            },
            textLinkColors: {
                text: '#3B3BF6',
                link: '#3B3BF6',
                linkHover: '#3B3BF6'
            },
            inputFieldColors: {
                background: '#3B3BF6',
                inputText: '#3B3BF6',
                placeholder: '#3B3BF6'
            },
            buttonColors: {
                background: '#C3C3F6',
                hoverBackground: '#3B3BF6',
                text: '#3B3BF6',
                hoverText: '#3B3BF6',
                buttonBorder: '#3B3BF6'
            },
            scrollbarCustomization: {
                trackBackground: '#3B3BF6',
                thumbBackground: '#3B3BF6'
            }
        }
    },
    {
        id: 3,
        colors: ['#5EB9B1', '#7EC9C1', '#9ED9D1', '#BEE9E1'],
        bg: '#D5F5F2',
        customization: {
            bodyColors: {
                background: '#3B3BF6'
            },
            textLinkColors: {
                text: '#3B3BF6',
                link: '#3B3BF6',
                linkHover: '#3B3BF6'
            },
            inputFieldColors: {
                background: '#3B3BF6',
                inputText: '#3B3BF6',
                placeholder: '#3B3BF6'
            },
            buttonColors: {
                background: '#C3C3F6',
                hoverBackground: '#3B3BF6',
                text: '#3B3BF6',
                hoverText: '#3B3BF6',
                buttonBorder: '#3B3BF6'
            },
            scrollbarCustomization: {
                trackBackground: '#3B3BF6',
                thumbBackground: '#3B3BF6'
            }
        }
    }
])

const selectedPalette = ref(null)
const scrollbarEnabled = ref(false)
const analyzeWebsite = ref(false) // Upcoming feature - disabled by default
const presetName = ref('')
const originalPrompt = ref('') // Store the original prompt used for generation
const allGeneratedPalettes = ref([]) // Store all 3 generated palettes
const workingPresetIndex = ref(null) // Track which preset we're currently working on

const parseCSVToColorPalettes = (csvString) => {

    // Remove the CSV code block markers
    const cleanedCSV = csvString.replace(/```csv\n/g, '').replace(/```/g, '').trim()

    const lines = cleanedCSV.split('\n').filter(line => line.trim() !== '')

    const palettes = []

    // Process each data row (skip header)
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())

        if (values.length < 13) {

            continue
        }

        palettes.push({
            id: i,
            colors: [values[0], values[2], values[3], values[9]], // bg, link, link_hover, btn_bg as display colors
            bg: `${values[0]}33`, // bg color with transparency for palette background
            customization: {
                bodyColors: {
                    background: values[0] // bg
                },
                textLinkColors: {
                    text: values[1], // text
                    link: values[2], // link
                    linkHover: values[3] // link_hover
                },
                inputFieldColors: {
                    background: values[4], // input_bg
                    inputText: values[5], // input_text
                    placeholder: values[6] // input_placeholder
                },
                buttonColors: {
                    background: values[9], // btn_bg
                    hoverBackground: values[10], // btn_hover_bg
                    text: values[7], // btn_text
                    hoverText: values[8], // btn_hover_text
                    buttonBorder: values[9] // btn_bg as border
                },
                scrollbarCustomization: {
                    trackBackground: values[11] || values[4], // scroll_track, fallback to input_bg
                    thumbBackground: values[12] || values[5] // scroll_thumb, fallback to input_text
                }
            }
        })
    }

    return palettes
}

const handleGenerate = async () => {
    isLoading.value = true
    showResults.value = false
    loadingProgress.value = 0
    selectedPalette.value = null

    // Validate and truncate prompt to 100 characters
    const validatedPrompt = prompt.value.substring(0, MAX_PROMPT_LENGTH).trim()

    // Store the original prompt for later use
    originalPrompt.value = validatedPrompt

    // Progress simulation
    const progressInterval = setInterval(() => {
        if (loadingProgress.value < 90) {
            loadingProgress.value += 10
        }
    }, 250)

    // Per-request correlation identifiers. These are not credentials: the endpoint
    // uses them to de-duplicate and trace individual generation requests.
    const requestId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    try {
        const response = await fetch('https://aiware.wppool.dev/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${requestId}`
            },
            body: JSON.stringify({
                service: 'generate-colors',
                text: validatedPrompt,
                access_token: requestId,
                request_token: sessionId,
            })
        })

        const result = await response.json()

        if (result.success && result.data) {
            // Parse CSV and update color palettes
            colorPalettes.value = parseCSVToColorPalettes(result.data)

            // Store all generated palettes for saving later
            allGeneratedPalettes.value = JSON.parse(JSON.stringify(colorPalettes.value))

            loadingProgress.value = 100

            setTimeout(() => {
                isLoading.value = false
                showResults.value = true
                // Auto-select first palette
                if (colorPalettes.value.length > 0) {
                    selectPalette(colorPalettes.value[0].id)
                }
            }, 300)
        } else {
            throw new Error('Failed to generate colors')
        }
    } catch (error) {
        console.error('Error generating colors:', error)
        // On error, show mock data
        loadingProgress.value = 100
        setTimeout(() => {
            isLoading.value = false
            showResults.value = true
        }, 300)
    } finally {
        clearInterval(progressInterval)
    }
}

const handleRegenerate = () => {
    // Show confirmation modal if palette is selected
    if (selectedPalette.value) {
        showModal({
            title: t('clear_palettes_title'),
            message: t('clear_palettes_msg'),
            confirmText: t('continue_to_edit'),
            confirmBackground: '#2563EB',
            cancelText: t('cancel'),
            confirm: () => {
                showResults.value = false
                selectedPalette.value = null
                colorPalettes.value = []
                state.aiPaletteSelected = false

                // Remove the working preset if regenerating
                if (workingPresetIndex.value !== null && props.editingPresetIndex === null) {
                    options.color_presets.splice(workingPresetIndex.value, 1)
                    workingPresetIndex.value = null
                }
            }
        })
    } else {
        showResults.value = false
        selectedPalette.value = null
        colorPalettes.value = []
        state.aiPaletteSelected = false
    }
}

const presetNameInput = ref(null)

const selectPalette = (id) => {
    // Select or switch between palettes freely
    selectedPalette.value = id
    state.aiPaletteSelected = true
    updatePresetData()

    // Scroll to preset name field and focus
    setTimeout(() => {
        if (presetNameInput.value) {
            presetNameInput.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
            const input = presetNameInput.value.querySelector('input')
            if (input) input.focus()
        }
    }, 100)
}

// Reset a color to its original generated value
const resetColor = (category, property) => {
    const originalPalette = allGeneratedPalettes.value.find(p => p.id === selectedPalette.value)
    const currentPalette = colorPalettes.value.find(p => p.id === selectedPalette.value)
    if (originalPalette && currentPalette) {
        currentPalette.customization[category][property] = originalPalette.customization[category][property]
        updatePresetData()
    }
}

// Check if a color has been modified from original
const isColorModified = (category, property) => {
    const originalPalette = allGeneratedPalettes.value.find(p => p.id === selectedPalette.value)
    const currentPalette = colorPalettes.value.find(p => p.id === selectedPalette.value)
    if (originalPalette && currentPalette) {
        const current = (currentPalette.customization[category][property] || '').toLowerCase()
        const original = (originalPalette.customization[category][property] || '').toLowerCase()
        return current !== original
    }
    return false
}

const getSelectedPaletteData = () => {
    return colorPalettes.value.find(p => p.id === Number(selectedPalette.value))
}

// Computed property for the selected palette to ensure reactivity
const selectedPaletteData = computed(() => {
    return colorPalettes.value.find(p => p.id === selectedPalette.value)
})

// Computed property for Preview component
const previewColors = computed(() => {
    if (!selectedPalette.value || !selectedPaletteData.value) return null

    const customization = selectedPaletteData.value.customization
    return {
        bg: customization.bodyColors.background,
        text: customization.textLinkColors.text,
        link: customization.textLinkColors.link,
        link_hover: customization.textLinkColors.linkHover,
        input_bg: customization.inputFieldColors.background,
        input_text: customization.inputFieldColors.inputText,
        input_placeholder: customization.inputFieldColors.placeholder,
        button_bg: customization.buttonColors.background,
        button_hover_bg: customization.buttonColors.hoverBackground,
        button_text: customization.buttonColors.text,
        button_hover_text: customization.buttonColors.hoverText,
        button_border: customization.buttonColors.buttonBorder,
        enable_scrollbar: scrollbarEnabled.value,
        scrollbar_track: customization.scrollbarCustomization.trackBackground,
        scrollbar_thumb: customization.scrollbarCustomization.thumbBackground
    }
})

const handleBack = () => {
    state.aiPaletteSelected = false
    emit('close')
}

// Function to update preset data in options when palette is selected
const updatePresetData = () => {

    const selectedData = getSelectedPaletteData()

    if (!selectedData) {

        return
    }

    // Use preset name (no fallback - validation will handle empty names)
    const finalPresetName = presetName.value.trim()

    // Create preset object with all customization data + AI-specific fields
    const presetData = {
        name: finalPresetName,
        bg: selectedData.customization.bodyColors.background,
        text: selectedData.customization.textLinkColors.text,
        link: selectedData.customization.textLinkColors.link,
        link_hover: selectedData.customization.textLinkColors.linkHover,
        input_bg: selectedData.customization.inputFieldColors.background,
        input_text: selectedData.customization.inputFieldColors.inputText,
        input_placeholder: selectedData.customization.inputFieldColors.placeholder,
        button_bg: selectedData.customization.buttonColors.background,
        button_hover_bg: selectedData.customization.buttonColors.hoverBackground,
        button_text: selectedData.customization.buttonColors.text,
        button_hover_text: selectedData.customization.buttonColors.hoverText,
        button_border: selectedData.customization.buttonColors.buttonBorder,
        enable_scrollbar: scrollbarEnabled.value,
        scrollbar_track: selectedData.customization.scrollbarCustomization.trackBackground,
        scrollbar_thumb: selectedData.customization.scrollbarCustomization.thumbBackground,
        // AI-specific fields
        ai_generated: true,
        ai_prompt: originalPrompt.value,
        ai_generated_palettes: allGeneratedPalettes.value,
        ai_selected_palette_id: Number(selectedPalette.value),
        created_at: new Date().toISOString(),
    }

    // Make a copy of the array first to ensure reactivity
    const presetsCopy = [...options.color_presets]

    // Check if editing existing preset
    if (props.editingPresetIndex !== null) {
        // Update existing preset
        presetsCopy[props.editingPresetIndex] = presetData
        options.color_preset_id = props.editingPresetIndex + 1
        workingPresetIndex.value = props.editingPresetIndex
    } else {
        // For new presets, check if we're already working on one
        if (workingPresetIndex.value !== null && presetsCopy[workingPresetIndex.value]) {
            // Update the existing working preset
            presetsCopy[workingPresetIndex.value] = presetData
            options.color_preset_id = workingPresetIndex.value + 1
        } else {
            // Add new preset and track its index
            presetsCopy.push(presetData)
            workingPresetIndex.value = presetsCopy.length - 1
            options.color_preset_id = presetsCopy.length
        }
    }

    // Set color mode to custom for AI presets
    options.color_mode = 'custom'

    // Force reactivity by reassigning the array
    options.color_presets = presetsCopy

    // Manually trigger the change state since deep watching isn't reliable
    state.isChanged = true

}

// Watch for changes to update preset data
watch([selectedPalette, presetName, scrollbarEnabled], () => {
    if (selectedPalette.value !== null) {

        updatePresetData()
    }
})

// Separate deep watcher for color palette changes
watch(colorPalettes, () => {
    if (selectedPalette.value !== null) {

        updatePresetData()
    }
}, { deep: true })

// Watch selected palette data changes
watch(selectedPaletteData, () => {
    if (selectedPalette.value !== null) {

        updatePresetData()
    }
}, { deep: true })

// Validate preset name before save
const validateBeforeSave = () => {
    if (selectedPalette.value !== null && !presetName.value.trim()) {
        state.aiPresetNameError = true
        return false
    }
    state.aiPresetNameError = false
    return true
}

// Watch for save completion to close AI generator and show success message
watch(() => state.isChanged, (newVal, oldVal) => {
    // If changed state goes from true to false, save was successful
    if (oldVal && !newVal && selectedPalette.value !== null) {
        if (!presetName.value.trim()) {
            // Validation failed - show error
            state.aiPresetNameError = true
            return
        }

        // Show success message
        setTimeout(() => {
            Toast.open(t('ai_preset_saved'), 'success')
        }, 100)

        // Keep the generator open after save - user can continue editing
    }
})

// Expose validation to parent if needed
defineExpose({
    validateBeforeSave
})

// Load existing preset data when editing
onMounted(() => {
    if (props.editingPresetIndex !== null && options.color_presets[props.editingPresetIndex]) {
        const existingPreset = options.color_presets[props.editingPresetIndex]

        // Set preset name
        presetName.value = existingPreset.name || ''

        // Load AI-specific fields if they exist
        if (existingPreset.ai_generated) {
            originalPrompt.value = existingPreset.ai_prompt || ''
            prompt.value = existingPreset.ai_prompt || ''

            // Load all generated palettes if available
            if (existingPreset.ai_generated_palettes && existingPreset.ai_generated_palettes.length > 0) {
                colorPalettes.value = JSON.parse(JSON.stringify(existingPreset.ai_generated_palettes))
                allGeneratedPalettes.value = JSON.parse(JSON.stringify(existingPreset.ai_generated_palettes))
            }
        }

        // Skip AI generation, show results directly
        showResults.value = true

        // Auto-select the palette (use saved selection or default to first)
        selectedPalette.value = Number(existingPreset.ai_selected_palette_id) || 1

        // Set state for save buttons to appear
        state.aiPaletteSelected = true

        // If no AI palettes were stored (older presets), create one from preset data
        if (colorPalettes.value.length === 0) {
            colorPalettes.value = [{
                id: 1,
                colors: [
                    existingPreset.bg || '#000000',
                    existingPreset.link || '#3B82F6',
                    existingPreset.link_hover || '#2563EB',
                    existingPreset.button_bg || '#3B82F6'
                ],
                bg: `${existingPreset.bg || '#000000'}33`,
                customization: {
                    bodyColors: {
                        background: existingPreset.bg || '#000000'
                    },
                    textLinkColors: {
                        text: existingPreset.text || '#FFFFFF',
                        link: existingPreset.link || '#3B82F6',
                        linkHover: existingPreset.link_hover || '#2563EB'
                    },
                    inputFieldColors: {
                        background: existingPreset.input_bg || '#1F2937',
                        inputText: existingPreset.input_text || '#FFFFFF',
                        placeholder: existingPreset.input_placeholder || '#9CA3AF'
                    },
                    buttonColors: {
                        background: existingPreset.button_bg || '#3B82F6',
                        hoverBackground: existingPreset.button_hover_bg || '#2563EB',
                        text: existingPreset.button_text || '#FFFFFF',
                        hoverText: existingPreset.button_hover_text || '#FFFFFF',
                        buttonBorder: existingPreset.button_border || '#3B82F6'
                    },
                    scrollbarCustomization: {
                        trackBackground: existingPreset.scrollbar_track || '#1F2937',
                        thumbBackground: existingPreset.scrollbar_thumb || '#4B5563'
                    }
                }
            }]
        } else {
            // Update the selected palette with current values (in case they were modified)
            const selectedPaletteData = colorPalettes.value.find(p => p.id === selectedPalette.value)
            if (selectedPaletteData) {
                selectedPaletteData.customization.bodyColors.background = existingPreset.bg
                selectedPaletteData.customization.textLinkColors = {
                    text: existingPreset.text,
                    link: existingPreset.link,
                    linkHover: existingPreset.link_hover
                }
                selectedPaletteData.customization.inputFieldColors = {
                    background: existingPreset.input_bg,
                    inputText: existingPreset.input_text,
                    placeholder: existingPreset.input_placeholder
                }
                selectedPaletteData.customization.buttonColors = {
                    background: existingPreset.button_bg,
                    hoverBackground: existingPreset.button_hover_bg,
                    text: existingPreset.button_text,
                    hoverText: existingPreset.button_hover_text,
                    buttonBorder: existingPreset.button_border
                }
                selectedPaletteData.customization.scrollbarCustomization = {
                    trackBackground: existingPreset.scrollbar_track,
                    thumbBackground: existingPreset.scrollbar_thumb
                }
            }
        }

        // Enable scrollbar from saved value
        scrollbarEnabled.value = !!(existingPreset.enable_scrollbar)
    }
})
</script>

<template>
    <Card class="w-full">
        <!-- Back Button -->
        <div class="mb-6">
            <button @click="handleBack" class="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition duration-75">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ t('back') }}
            </button>
        </div>

        <!-- Header -->
        <div>
            <SectionHead>
                {{ t('ai_preset_generator_title') }}
                <template #description>
                    {{ t('ai_preset_generator_desc') }}
                </template>
            </SectionHead>

            <hr class="my-4">
        </div>

        <!-- Main Layout: Main Area + Preview -->
        <div class="flex flex-wrap justify-start md:flex-nowrap gap-6 items-start">
            <!-- Main Area (Left) -->
            <Card class="w-full gap-6 flex-1 !py-0 !px-0">
                    <!-- Prompt Input -->
                    <Card transparent borderless class="p-0 relative group" style="gap: 1px !important;">
                        <div class="flex items-center justify-between mb-2">
                            <Heading class="text-sm font-medium">
                                {{ t('enter_your_prompt') }}
                            </Heading>
                            <!-- Edit Button (appears on hover when locked) -->
                            <button
                                v-if="showResults && !isLoading"
                                @click="handleRegenerate"
                                class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                                :title="t('edit_prompt')"
                            >
                                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                {{ t('edit') }}
                            </button>
                        </div>

                        <!-- Textarea -->
                        <div class="relative">
                            <textarea
                                v-model="prompt"
                                rows="5"
                                :maxlength="MAX_PROMPT_LENGTH"
                                :disabled="isLoading || showResults"
                                class="w-full px-4 py-2 text-gray-800 transition border-0 rounded outline-none ring-1 focus:ring focus:ring-blue-500 ring-gray-200 placeholder:text-gray-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                :placeholder="t('prompt_placeholder')"
                            ></textarea>

                            <div class="absolute bottom-2 right-3 bg-white rounded-md px-2 py-1 text-xs pointer-events-none" :class="prompt.length < MIN_PROMPT_LENGTH ? 'text-red-500' : 'text-gray-500'">
                                <span v-if="prompt.length < MIN_PROMPT_LENGTH">{{ prompt.length }} / {{ MIN_PROMPT_LENGTH }} {{ t('min') }}</span>
                                <span v-else>{{ prompt.length }} / {{ MAX_PROMPT_LENGTH }}</span>
                            </div>
                        </div>

                        <!-- Analyze Website Toggle -->
                        <div class="mt-6">
                            <div class="flex items-center gap-3">
                                <Toggle v-model="analyzeWebsite" :disabled="true" class="opacity-50 pointer-events-none">
                                    <Heading class="text-sm font-medium">
                                        {{ t('analyze_my_website') }}
                                    </Heading>
                                </Toggle>
                                <span class="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded">
                                    {{ t('upcoming') }}
                                </span>
                            </div>
                        </div>

                        <!-- Generate Button -->
                        <div class="mt-4">
                            <Button
                                @click="handleGenerate"
                                :disabled="isLoading || showResults || prompt.trim().length < 10"
                                color="blue"
                                class="w-full justify-center"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polygon points="2 0 3 2 2 4 4 3 6 4 5 2 6 0 4 1 2 0" fill="currentColor"></polygon>
                                    <polygon points="12 0 13 2 12 4 14 3 16 4 15 2 16 0 14 1 12 0" fill="currentColor"></polygon>
                                    <polygon points="12 10 13 12 12 14 14 13 16 14 15 12 16 10 14 11 12 10" fill="currentColor"></polygon>
                                    <rect x="6.805" y="5.823" width="3.743" height="3" transform="translate(-2.637 8.28) rotate(-45)" fill="currentColor"></rect>
                                    <rect x="-0.096" y="10.647" width="7.9" height="3" transform="translate(-7.46 6.282) rotate(-45)" fill="currentColor"></rect>
                                </svg>
                                <span>{{ t('generate_colors') }}</span>
                            </Button>
                        </div>
                    </Card>

                    <!-- Loading State -->
                    <Card transparent borderless v-if="isLoading">
                        <div class="flex items-center gap-2 text-blue-600 mb-3">
                            <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span class="text-sm font-medium">{{ t('generating_colors') }}</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-4">
                            <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: loadingProgress + '%' }"></div>
                        </div>

                        <!-- Loading Palette Boxes -->
                        <div class="grid grid-cols-3 gap-5">
                            <div v-for="i in 3" :key="i" class="flex items-center justify-center rounded-lg" style="height: 160px; background-color: #f0f0f0;">
                                <svg class="animate-spin w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        </div>
                    </Card>

                    <!-- Color Palette Selection (appears below prompt when results available) -->
                    <Card transparent borderless v-if="showResults" class="mt-5">
                        <Heading class="mb-5">
                            {{ t('choose_palettes') }}
                        </Heading>
                    <div class="flex flex-wrap justify-start gap-4">
                        <div
                            v-for="palette in colorPalettes"
                            :key="palette.id"
                            @click="selectPalette(palette.id)"
                            class="group relative flex flex-col items-center gap-3 transition duration-75 rounded-lg cursor-pointer w-fit h-fit"
                        >
                            <div class="relative w-32 h-auto overflow-hidden transition duration-75 bg-gray-100 rounded"
                                :class="{ 'ring ring-blue-400': selectedPalette === palette.id }">
                                <Preset
                                    :color="palette.customization?.textLinkColors?.text || palette.colors[0] || 'white'"
                                    :linkColor="palette.customization?.textLinkColors?.link || palette.colors[1] || 'blue'"
                                    :background="palette.customization?.bodyColors?.background || palette.bg"
                                />
                                <div v-if="selectedPalette === palette.id"
                                    class="absolute flex items-center justify-center w-8 h-8 p-0 text-blue-600 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow top-1/2 left-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 fill-current" viewBox="0 0 16 16">
                                        <path
                                            d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                                    </svg>
                                </div>
                            </div>
                            <Hints :class="{ 'font-semibold text-gray-700': selectedPalette === palette.id }"
                                class="text-gray-600 pb-1.5">{{ palette.name || t('palette_label').replace('%s', palette.id) }}</Hints>
                        </div>
                    </div>
                    </Card>

                    <!-- Preset Name and Customization -->
                    <Card transparent borderless v-if="selectedPalette" class="!p-0">
                        <!-- Preset Name Field -->
                        <div ref="presetNameInput">
                            <Input
                                v-model="presetName"
                                :label="t('preset_name_label')"
                                :placeholder="t('preset_name_placeholder')"
                                :required="true"
                                :error="state.aiPresetNameError"
                                @input="state.aiPresetNameError = false"
                            />
                            <div v-if="state.aiPresetNameError" class="flex items-center gap-2 mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                                <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                                <span>{{ t('preset_name_error') }}</span>
                            </div>
                        </div>
                    </Card>

                    <!-- Customization Fields -->
                    <Card dark v-if="selectedPalette" class="flex flex-col gap-6">
                        <!-- Body Colors -->
                        <Card transparent borderless>
                            <Heading>{{ t('body_colors') }}</Heading>
                            <div class="flex gap-4 flex-wrap">
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.bodyColors.background }"
                                        @click="isPro ? $refs.bodyBgInput?.click() : showProModal()"
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
                                        ref="bodyBgInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.bodyColors.background"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('background') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.bodyColors.background }}</div>
                                            <button @click.stop="resetColor('bodyColors', 'background')" class="transition-opacity" :class="isColorModified('bodyColors', 'background') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <!-- Text & Link Colors -->
                        <Card transparent borderless>
                            <Heading>{{ t('text_link_colors') }}</Heading>
                            <div class="flex gap-4 flex-wrap">
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.textLinkColors.text }"
                                        @click="isPro ? $refs.textInput?.click() : showProModal()"
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
                                        ref="textInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.textLinkColors.text"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('text') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.textLinkColors.text }}</div>
                                            <button @click.stop="resetColor('textLinkColors', 'text')" class="transition-opacity" :class="isColorModified('textLinkColors', 'text') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.textLinkColors.link }"
                                        @click="isPro ? $refs.linkInput?.click() : showProModal()"
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
                                        ref="linkInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.textLinkColors.link"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('link') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.textLinkColors.link }}</div>
                                            <button @click.stop="resetColor('textLinkColors', 'link')" class="transition-opacity" :class="isColorModified('textLinkColors', 'link') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.textLinkColors.linkHover }"
                                        @click="isPro ? $refs.linkHoverInput?.click() : showProModal()"
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
                                        ref="linkHoverInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.textLinkColors.linkHover"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('link_hover') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.textLinkColors.linkHover }}</div>
                                            <button @click.stop="resetColor('textLinkColors', 'linkHover')" class="transition-opacity" :class="isColorModified('textLinkColors', 'linkHover') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <!-- Input Field Colors -->
                        <Card transparent borderless>
                            <Heading>{{ t('input_field_colors') }}</Heading>
                            <div class="flex gap-4 flex-wrap">
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.inputFieldColors.background }"
                                        @click="isPro ? $refs.inputBgInput?.click() : showProModal()"
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
                                        ref="inputBgInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.inputFieldColors.background"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('background') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.inputFieldColors.background }}</div>
                                            <button @click.stop="resetColor('inputFieldColors', 'background')" class="transition-opacity" :class="isColorModified('inputFieldColors', 'background') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.inputFieldColors.inputText }"
                                        @click="isPro ? $refs.inputTextInput?.click() : showProModal()"
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
                                        ref="inputTextInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.inputFieldColors.inputText"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('input_text') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.inputFieldColors.inputText }}</div>
                                            <button @click.stop="resetColor('inputFieldColors', 'inputText')" class="transition-opacity" :class="isColorModified('inputFieldColors', 'inputText') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.inputFieldColors.placeholder }"
                                        @click="isPro ? $refs.placeholderInput?.click() : showProModal()"
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
                                        ref="placeholderInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.inputFieldColors.placeholder"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('placeholder') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.inputFieldColors.placeholder }}</div>
                                            <button @click.stop="resetColor('inputFieldColors', 'placeholder')" class="transition-opacity" :class="isColorModified('inputFieldColors', 'placeholder') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <!-- Button Colors -->
                        <Card transparent borderless>
                            <Heading>{{ t('button_colors') }}</Heading>
                            <div class="flex gap-4 flex-wrap">
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.background }"
                                        @click="isPro ? $refs.btnBgInput?.click() : showProModal()"
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
                                        ref="btnBgInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.background"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('background') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.background }}</div>
                                            <button @click.stop="resetColor('buttonColors', 'background')" class="transition-opacity" :class="isColorModified('buttonColors', 'background') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.hoverBackground }"
                                        @click="isPro ? $refs.btnHoverBgInput?.click() : showProModal()"
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
                                        ref="btnHoverBgInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.hoverBackground"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('hover_background') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.hoverBackground }}</div>
                                            <button @click.stop="resetColor('buttonColors', 'hoverBackground')" class="transition-opacity" :class="isColorModified('buttonColors', 'hoverBackground') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.text }"
                                        @click="isPro ? $refs.btnTextInput?.click() : showProModal()"
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
                                        ref="btnTextInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.text"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('text') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.text }}</div>
                                            <button @click.stop="resetColor('buttonColors', 'text')" class="transition-opacity" :class="isColorModified('buttonColors', 'text') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.hoverText }"
                                        @click="isPro ? $refs.btnHoverTextInput?.click() : showProModal()"
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
                                        ref="btnHoverTextInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.hoverText"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('hover_text') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.hoverText }}</div>
                                            <button @click.stop="resetColor('buttonColors', 'hoverText')" class="transition-opacity" :class="isColorModified('buttonColors', 'hoverText') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.buttonBorder }"
                                        @click="isPro ? $refs.btnBorderInput?.click() : showProModal()"
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
                                        ref="btnBorderInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.buttonBorder"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('button_border') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.buttonColors.buttonBorder }}</div>
                                            <button @click.stop="resetColor('buttonColors', 'buttonBorder')" class="transition-opacity" :class="isColorModified('buttonColors', 'buttonBorder') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <!-- Scrollbar Customization -->
                        <Card transparent borderless class="mt-8 mb-6">
                            <div class="flex items-center gap-3">
                                <Toggle v-model="scrollbarEnabled">
                                    <Heading>{{ t('enable_scrollbar_i18n') }}</Heading>
                                </Toggle>
                                <div class="tooltip-wrapper relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="text-gray-400 hover:text-blue-600 cursor-help" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                                    </svg>
                                    <div class="tooltip-content absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible transition-all duration-200 z-50">
                                        {{ t('scrollbar_hints_i18n') }}
                                        <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="scrollbarEnabled" class="flex gap-4 flex-wrap mt-4">
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.scrollbarCustomization.trackBackground }"
                                        @click="isPro ? $refs.scrollTrackInput?.click() : showProModal()"
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
                                        ref="scrollTrackInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.scrollbarCustomization.trackBackground"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('track_background') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.scrollbarCustomization.trackBackground }}</div>
                                            <button @click.stop="resetColor('scrollbarCustomization', 'trackBackground')" class="transition-opacity" :class="isColorModified('scrollbarCustomization', 'trackBackground') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="relative w-16 h-16 rounded-full cursor-pointer hover:scale-105 transition-all duration-200 border-2 border-gray-300 group"
                                        :style="{ backgroundColor: colorPalettes.find(p => p.id === selectedPalette).customization.scrollbarCustomization.thumbBackground }"
                                        @click="isPro ? $refs.scrollThumbInput?.click() : showProModal()"
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
                                        ref="scrollThumbInput"
                                        type="color"
                                        v-model="colorPalettes.find(p => p.id === selectedPalette).customization.scrollbarCustomization.thumbBackground"
                                        class="sr-only"
                                    />
                                    <div class="text-center">
                                        <div class="text-xs font-medium text-gray-700">{{ t('thumb_background') }}</div>
                                        <div class="flex items-center justify-center gap-1">
                                            <div class="text-xs text-gray-500 font-mono">{{ colorPalettes.find(p => p.id === selectedPalette).customization.scrollbarCustomization.thumbBackground }}</div>
                                            <button @click.stop="resetColor('scrollbarCustomization', 'thumbBackground')" class="transition-opacity" :class="isColorModified('scrollbarCustomization', 'thumbBackground') ? 'text-blue-500 hover:text-blue-700' : 'text-gray-300 pointer-events-none'" :title="t('reset_to_original')">
                                                <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                    </Card>
            </Card>

            <!-- Preview Area (Right - sticky) -->
            <div class="sticky top-6 h-fit">
                <Card borderless class="p-6 w-fit">
                    <Preview dark :color="previewColors" />
                </Card>
            </div>
        </div>
    </Card>
</template>

<style scoped>
textarea::placeholder {
    color: #D1D5DB;
}

.tooltip-wrapper:hover .tooltip-content {
    opacity: 1 !important;
    visibility: visible !important;
}

.tooltip-content {
    pointer-events: none;
}
</style>
