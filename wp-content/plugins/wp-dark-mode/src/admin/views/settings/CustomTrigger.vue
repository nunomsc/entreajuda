<script setup>
import { ref, computed } from 'vue'
import { Card, Hints, Heading, Row, ProBadge, Toggle } from '@components'
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options, showModal, isPro, showProModal, isLocked } = DarkModeStore()

// Generate unique ID
const generateId = () => {
    return 'trigger_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Initialize triggers array if not exists
if (!options.custom_triggers_enabled) {
    options.custom_triggers_enabled = false
}

if (!options.custom_triggers_triggers || !Array.isArray(options.custom_triggers_triggers)) {
    options.custom_triggers_triggers = []
}

// Action options
const actionOptions = computed(() => [
    { value: 'toggle', label: t('toggle_dark_mode') },
    { value: 'switch_to_dark', label: t('switch_to_dark') },
    { value: 'switch_to_light', label: t('switch_to_light') }
])

// Add new trigger
const addNewTrigger = () => {
    if (!isPro) {
        showProModal()
        return;
    }
    
    options.custom_triggers_triggers.push({
        id: generateId(),
        element_selector: '',
        action: 'toggle'
    })
}

// Remove trigger
const removeTrigger = (index) => {
    if (!isPro) {
        showProModal()
        return;
    }

    showModal({
        title: t('delete_trigger'),
        message: t('delete_trigger_confirm'),
        confirmText: t('delete'),
        cancelText: t('cancel'),
        confirm: () => {
            options.custom_triggers_triggers.splice(index, 1)
        }
    })
}

</script>

<template>
    <Card borderless transparent class="gap-5">
        
        <!-- Enable Toggle Section -->
        <Card>
            <Toggle v-model="options.custom_triggers_enabled" :locked="!isPro">{{ t('enable_custom_triggers') }}</Toggle>
            <Hints>{{ t('custom_triggers_desc') }}</Hints>
        </Card>

        <!-- Main Content -->
        <Card borderless v-if="options.custom_triggers_enabled">
            <Card>
                <Heading bold>
                    <Row transparent inline class="items-center">
                        <Row transparent locked :ProBadge="false">{{ t('create_toggle_element') }}</Row>
                        <ProBadge />
                    </Row>
                    <Hints locked>{{ t('choose_toggle_element_hints') }}</Hints>
                </Heading>
                <div class="mt-2 border-b border-gray-100"></div>
            </Card>
            
            <Card v-if="options.custom_triggers_triggers.length === 0" class="justify-center text-center" :disabled="isLocked">
                <Heading>{{ t('no_triggers_added') }}<Hints>{{ t('add_triggers_hints') }}</Hints></Heading>
            </Card>
        
        <!-- Triggers List -->
        <Card v-if="options.custom_triggers_triggers && options.custom_triggers_triggers.length" class="gap-6" locked>
            <Row class="flex justify-center items-center text-center" locked :ProBadge="false">
                <Heading Locked :disabled="isLocked">{{ t('custom_triggers') }} 
                    <Hints>{{ t('triggers_hints_desc') }}</Hints>
                </Heading>
            </Row>
            
            <!-- Column Headers -->
            <div class="px-6 py-3 bg-gray-50 rounded">
                <div class="grid grid-cols-[2.5rem_1fr_16rem_1.25rem] items-center gap-4">
                    <div></div>
                    <div>
                        <span class="text-sm font-medium text-slate-700">{{ t('element_selector') }}</span>
                    </div>
                    <div>
                        <span class="text-sm font-medium text-slate-700">{{ t('action') }}</span>
                    </div>
                    <div></div>
                </div>
            </div>
            
            <!-- Trigger Rows -->
            <Card dark v-for="(trigger, index) in options.custom_triggers_triggers" :key="trigger.id" :disabled="isLocked">
                <div class="grid grid-cols-[2.5rem_1fr_16rem_1.25rem] items-center gap-4 group">
                    <Heading class="w-fit shrink-0">{{ index + 1 }}.</Heading>

                    <div>
                        <input
                            type="text"
                            v-model="trigger.element_selector"
                            :placeholder="t('selector_placeholder')"
                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono bg-white transition-all hover:border-slate-400"
                            :disabled="!isPro"
                        />
                    </div>

                    <div>
                        <select 
                            v-model="trigger.action"
                            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-all hover:border-slate-400 cursor-pointer"
                            :disabled="!isPro"
                        >
                            <option 
                                v-for="option in actionOptions" 
                                :key="option.value" 
                                :value="option.value"
                            >
                                {{ option.label }}
                            </option>
                        </select>
                    </div>

                    <button
                        @click.prevent="removeTrigger(index)"
                        :disabled="!isPro"
                        class="text-gray-400 hover:text-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg class="stroke-current w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.2837 7.5L11.9952 15M8.00481 15L7.71635 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.875 4.96358M16.023 4.82547L15.1332 16.3938C15.058 17.3707 14.2434 18.125 13.2637 18.125H6.73631C5.75655 18.125 4.94198 17.3707 4.86683 16.3938L3.97696 4.82547M16.023 4.82547C15.0677 4.6812 14.1013 4.57071 13.125 4.49527M3.125 4.96358C3.40798 4.91456 3.69198 4.86851 3.97696 4.82547M3.97696 4.82547C4.93231 4.6812 5.89874 4.57071 6.875 4.49527M13.125 4.49527V3.73182C13.125 2.74902 12.3661 1.92853 11.3838 1.8971C10.9244 1.8824 10.463 1.875 10 1.875C9.53696 1.875 9.07565 1.8824 8.61618 1.8971C7.63388 1.92853 6.875 2.74902 6.875 3.73182V4.49527M13.125 4.49527C12.0938 4.41558 11.0516 4.375 10 4.375C8.94836 4.375 7.9062 4.41558 6.875 4.49527"
                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
            </Card>
        </Card>
        
        <Card class="justify-center text-center" locked>
            <Card :disabled="isLocked">
                <div @click.prevent="isPro ? addNewTrigger() : showProModal()"
                    class="cursor-pointer text-5xl font-thin text-gray-800 p-3 text-center w-full border border-dashed rounded hover:bg-gray-100 transition duration-75">
                    +
                </div>
            </Card>
        </Card>
        </Card>
    </Card>
</template>

<style scoped>
/* Enhanced focus states */
input:focus,
select:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Smooth hover transitions */
input:hover,
select:hover {
    border-color: #94a3b8;
}

/* Custom scrollbar if needed */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
