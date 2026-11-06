<script setup>
import { computed } from 'vue';
import DarkModeStore from '@o/store'
const { options, isLocked } = DarkModeStore()
import { Hints, Preset } from '@components'
import PresetCustomization from './PresetCustomization.vue'
import { useTranslation } from '../../composables/useTranslation';

const { t } = useTranslation();

const presets = computed( () => options.color_presets?.slice( 0, wp_dark_mode_admin_json.predefined_presets.length ) )

/**
 * Locked Presets
 * Free: Sweet Dark (0), Gold (1), Sapphire (2)
 * Locked: Fuchsia (3), Rose (4), Violet (5), Pink (6), Kelly (7), Magenta (8), 
 *         Green (9), Orange (10), Yellow (11), Facebook (12), Twitter (13), 
 *         Tailwind (14), Midnight Bloom (15)
 */
const LockedPresets = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// Is locked
const isPresetLocked = index => isLocked && LockedPresets.includes( index );

const selectPreset = index => {
    if ( isPresetLocked( index ) ) {
        window.WPDarkModePromo.show();
        return;
    }

    options.color_preset_id = index + 1;
}

// Get translated preset name
const getPresetName = ( name, index ) => {
    const predefined = wp_dark_mode_admin_json.predefined_presets[index];

    if ( predefined && predefined.slug ) {
        return t( predefined.slug );
    }

    if ( ! name ) return t( 'untitled_preset' );
    const key = name.toLowerCase().replace( /\s+/g, '_' );
    return t( key ) !== key ? t( key ) : name;
}

</script>

<template>
    <Card transparent borderless class="gap-5">
        <Card v-if="presets">
            <Heading bold>{{ t('dark_mode_color_presets') }}<Hints>{{ t('color_presets_desc') }}</Hints>
            </Heading>
            <div class="h-0.5 w-full bg-gray-100 my-3"></div>
            <div class="flex flex-wrap justify-start gap-4">
                <div v-for="(preset, presetIndex) in presets" :key="presetIndex"
                    class="wp-dark-mode-ignore relative flex flex-col items-center gap-3 text-orange-500 transition duration-75 rounded-lg cursor-pointer w-fit h-fit"
                   
                    >
                   <div class="relative w-32 h-auto overflow-hidden transition duration-75 bg-gray-100 rounded"
                        :class="{ 'ring ring-blue-400': options.color_preset_id === presetIndex + 1, 'wp-dark-mode-locked' : isPresetLocked( presetIndex ) }"
                        @click.prevent="selectPreset( presetIndex )">
                        <Preset :color="preset.text || 'white'" :linkColor="preset.link" :background="preset.bg"  :class="{
                            'opacity-60': isPresetLocked( presetIndex ),
                        }" />
                        <div v-if="options.color_preset_id === presetIndex + 1"
                            class="absolute flex items-center justify-center w-8 h-8 p-0 text-blue-600 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow top-1/2 left-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 fill-current" viewBox="0 0 16 16">
                                <path
                                    d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                            </svg>
                        </div>

                        <ProBadge v-if="isPresetLocked(presetIndex)" class="absolute right-2 top-2 bg-orange-200" text="" />
                    </div>
                    <Hints :class="{ 'font-semibold text-gray-700': options.color_preset_id === presetIndex + 1 }"
                        class="text-gray-600 pb-1.5">{{ getPresetName(preset.name, presetIndex) }}</Hints>
                </div>
            </div>
        </Card>
        <PresetCustomization :index="options.color_preset_id" />
    </Card>
</template>