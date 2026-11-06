<script setup>
import { reactive, computed } from 'vue';
import { Alert, Card, Badge, Toggle, Hints, Heading, Checkbox, SectionHead, Suggestions, Buttons, Button, Radio, Color, Icon, Uploader, Input, Range, Preview, DarkModeSwitch } from '@components'
import CallToAction from './CallToAction.vue'
import { useTranslation } from '../../composables/useTranslation';
import DarkModeStore from '@o/store'
import { getRange, isSwitchLocked } from '@o/helper'

const state = reactive({
    isActive: false,
})

const { t } = useTranslation();
const { options } = DarkModeStore()

// setFromRange.
const setFromRange = (value, key) => {
    options[key] = value;
}

const selectSwitchStyle = n => {
    if ( isSwitchLocked( n ) ) {
        window.WPDarkModePromo.show();
        return;
    }

    setFromRange( n, 'floating_switch_style' );
}

const previewConfig = computed(() => {
    return {
        textLight: options.floating_switch_enabled_custom_texts ? options.floating_switch_text_light : t('light'),
        textDark: options.floating_switch_enabled_custom_texts ? options.floating_switch_text_dark : t('dark'),
        iconLight: options.floating_switch_enabled_custom_icons ? options.floating_switch_icon_light : '',
        iconDark: options.floating_switch_enabled_custom_icons ? options.floating_switch_icon_dark : '',
        size: switchSize.value,
    }
})

const switchPosition = computed(() => {

    if (options.floating_switch_position === 'custom') {
        return `bottom: ${options.floating_switch_position_bottom_value}px; ${options.floating_switch_position_side} : ${options.floating_switch_position_side_value}px;`;
    }

    if (options.floating_switch_position === 'left') {
        return 'left: 10px; bottom: 10px;';
    }

    return 'right: 10px; bottom: 10px;';
})

const switchSize = computed(() => {

    if (options.floating_switch_size === 'custom') {
        return options.floating_switch_size_custom / 100;
    }

    return options.floating_switch_size;
})

const devices = {
    desktop: `<svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-4" viewBox="0 0 16 16">
  <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/>
</svg>`,
    mobile: `<svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-4" viewBox="0 0 16 16">
  <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
</svg>`,
    tablet: `<svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-4" viewBox="0 0 16 16">
<path d="M1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm-1 8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2z"/>
  <path d="M14 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0"/>
</svg>`
}
</script>
<template>
    <Card borderless transparent class="gap-5">
        <Alert color="yellow" v-if="!options.frontend_enabled">
            <span v-html="t('unavailable_msg')"></span>
            <template #button>
                <RouterLink to="/frontend"><Button color="yellow"
                        class="text-xs whitespace-nowrap bg-[#F59E0B] border-[#F59E0B]">{{ t('enable_frontend') }}
                        <Icon name="chevronRight" />
                    </Button></RouterLink>
            </template>
        </Alert>
        <Card :disabled="!options.frontend_enabled" class="space-y-3">
            <Card transparent borderless>
                <Toggle v-model="options.floating_switch_enabled">{{ t('display_floating_switch') }}</Toggle>
                <Hints>{{ t('display_floating_switch_hints') }}</Hints>
            </Card>
            <Card borderless transparent v-if="options.floating_switch_enabled">
                <Heading>
                    <div class="flex items-center gap-3 text-sm">{{ t('display_on') }}</div>
                </Heading>
                <div class="flex items-center gap-3">
                    <label
                        class="flex items-center gap-2 rounded-lg bg-blue-50 capitalize cursor-pointer px-4 py-2.5 hover:bg-blue-100 transition text-sm text-slate-800"
                        v-for="(icon, device) in devices" :key="device"
                        @click.prevent="options.floating_switch_display[device] = !options.floating_switch_display[device]">
                        <Checkbox class="pointer-events-none" v-model="options.floating_switch_display[device]" /> {{
                            t(device) }} <span class="text-slate-700" v-html="icon"></span>
                    </label>
                </div>
            </Card>
        </Card>
        <!-- Add this inside your Cards container, where it makes the most sense in your layout -->
        <!-- Delay settings -->
        <Card :disabled="!options.frontend_enabled" class="gap-6">

            <Card borderless transparent>
                <Card transparent borderless>
                    <Toggle v-model="options.floating_switch_has_delay">
                        <div class="flex items-center gap-3">
                            <span>{{ t('show_after_delay') }}</span>
                            <Badge>{{ t('new') }}</Badge>
                        </div>
                    </Toggle>
                    <Hints>{{ t('delay_hints') }}</Hints>
                </Card>
                <Card dark class="max-w-xs" v-if="options.floating_switch_has_delay">
                    <div class="flex items-center gap-2">
                        <Heading class="w-36">{{ t('delay_time') }}</Heading>
                        <Input type="number" class="w-32" inline placeholder="3"
                            v-model="options.floating_switch_delay">
                        <template #after><span class="text-gray-500 text-sm">{{ t('seconds') }}</span></template>
                        </Input>
                    </div>
                    <Hints>{{ t('delay_time_hints') }}</Hints>
                </Card>
            </Card>
            <!-- Auto-hide on idle settings -->
            <Card borderless transparent>
                <Card transparent borderless>
                    <Toggle v-model="options.floating_switch_hide_on_idle">
                        <div class="flex items-center gap-3">
                            <span>{{ t('auto_hide_idle') }}</span>
                            <Badge>{{ t('new') }}</Badge>
                        </div>
                    </Toggle>
                    <Hints>{{ t('auto_hide_idle_hints') }}</Hints>
                </Card>
                <Card dark class="max-w-xs" v-if="options.floating_switch_hide_on_idle">
                    <div class="flex items-center gap-2">
                        <Heading class="w-36">{{ t('idle_timeout') }}</Heading>
                        <Input type="number" class="w-32" inline placeholder="5"
                            v-model="options.floating_switch_idle_timeout">
                        <template #after><span class="text-gray-500 text-sm">{{ t('seconds') }}</span></template>
                        </Input>
                    </div>
                    <Hints>{{ t('idle_timeout_hints') }}</Hints>
                </Card>
            </Card>

            <!-- Display switch on Login/Register pages -->
            <Card borderless transparent>
                <Card transparent borderless>
                    <Toggle v-model="options.floating_switch_enabled_login_pages">
                        <div class="flex items-center gap-3">
                            <span>{{ t('display_login_pages') }}</span>
                            <Badge>{{ t('new') }}</Badge>
                        </div>
                    </Toggle>
                    <Hints>{{ t('display_login_pages_hints') }}</Hints>
                </Card>
            </Card>
        </Card>

        <!-- if floating switch is enabled  -->
        <Card borderless transparent class="gap-5" v-if="options.floating_switch_enabled"
            :disabled="!options.frontend_enabled">
            <SectionHead>{{ t('floating_switch_styles') }} <template #description>{{ t('floating_switch_styles_desc') }}</template>
            </SectionHead>
            <!-- switch styles -->
            <Card class="gap-6">
                <Card transparent borderless>
                    <Heading>{{ t('normal_switches') }}</Heading>
                    <div class="flex flex-wrap gap-3 wp-dark-mode-ignore">
                        <div v-for="n in [1, 2, 3, 23, 24, 22, 20, 21, ...getRange(4, 13)]" :key="n" tabindex="1"
                            :class="{ '_selected': options.floating_switch_style === n, 'wp-dark-mode-locked bg-gray-50 ring-1 ring-[#ffedd5]': isSwitchLocked(n), 'bg-[#F9FAFB]': !isSwitchLocked(n) }"
                            @click.prevent="selectSwitchStyle(n)"
                            class="flex flex-col items-center justify-center transition duration-75  rounded-lg relative cursor-pointer w-36 h-36">
                            <DarkModeSwitch :id="n" :class="{ 'opacity-60 pointer-events-none': isSwitchLocked(n) }"
                                dummy="true"/>
                            <ProBadge class="absolute right-2 top-2" text=""
                                v-if="![22].includes(n) && isSwitchLocked(n)" />
                        </div>
                    </div>
                </Card>
                <div class="flex flex-col gap-2">
                    <div class="flex sm:items-center sm:justify-between flex-col sm:flex-row">
                        <Heading id="accessibility-switches">{{ t('accessibility_switches') }}</Heading>
                        <router-link to="/accessibility" class="flex items-center gap-2 text-sm"><svg
                                class="w-4 fill-current" viewBox="0 0 16 16" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M7.99992 2.66665C5.0544 2.66665 2.66659 5.05446 2.66659 7.99998C2.66659 10.9455 5.0544 13.3333 7.99992 13.3333C10.9454 13.3333 13.3333 10.9455 13.3333 7.99998C13.3333 5.05446 10.9454 2.66665 7.99992 2.66665ZM1.33325 7.99998C1.33325 4.31808 4.31802 1.33331 7.99992 1.33331C11.6818 1.33331 14.6666 4.31808 14.6666 7.99998C14.6666 11.6819 11.6818 14.6666 7.99992 14.6666C4.31802 14.6666 1.33325 11.6819 1.33325 7.99998ZM7.99992 5.33331C8.36811 5.33331 8.66659 5.63179 8.66659 5.99998V7.33331H9.99992C10.3681 7.33331 10.6666 7.63179 10.6666 7.99998C10.6666 8.36817 10.3681 8.66665 9.99992 8.66665H8.66659V9.99998C8.66659 10.3682 8.36811 10.6666 7.99992 10.6666C7.63173 10.6666 7.33325 10.3682 7.33325 9.99998V8.66665H5.99992C5.63173 8.66665 5.33325 8.36817 5.33325 7.99998C5.33325 7.63179 5.63173 7.33331 5.99992 7.33331H7.33325V5.99998C7.33325 5.63179 7.63173 5.33331 7.99992 5.33331Z"
                                    fill="fill-current" />
                            </svg> {{ t('more_accessibility') }}</router-link>
                    </div>
                    <div class="flex flex-wrap justify-start gap-3">
                        <div v-for="n in getRange(14, 19)" :key="n" tabindex="0"
                            :class="{ '_selected': options.floating_switch_style === n, 'wp-dark-mode-locked bg-[#fdfaf8] ring-1 ring-[#ffedd5]': isSwitchLocked(n), 'bg-[#F9FAFB]': !isSwitchLocked(n) }"
                            @click.prevent="selectSwitchStyle(n)"
                            class="flex flex-col items-center justify-center transition duration-75  rounded-lg relative cursor-pointer w-36 h-36">
                            <DarkModeSwitch :id="n" :class="{ 'opacity-60 pointer-events-none': isSwitchLocked(n) }"
                                dummy="true" />
                            <ProBadge class="absolute right-2 top-2" text="" v-if="isSwitchLocked(n)" />
                        </div>
                    </div>
                </div>
                <Alert color="yellow" class="text-xs"
                    v-if="!getRange(13, 19).includes(options.floating_switch_style) && !options.typography_enabled">
                    {{ t('typography_disabled_msg') }} <template
                        #button>
                        <RouterLink to="/accessibility"><Button color="yellow"
                                class="text-xs whitespace-nowrap bg-[#F59E0B] border-[#F59E0B]">{{ t('go_to_accessibility') }}
                                <Icon name="chevronRight" />
                            </Button></RouterLink>
                    </template>
                </Alert>
            </Card>
            <!-- switch customization  -->
            <Card transparent borderless>
                <Heading>{{ t('switch_customization') }}</Heading>
            </Card>
            <Card class="gap-8">
                <!-- Preview group  -->
                <div class="flex gap-6 justify-between flex-wrap">
                    <!-- left section of preview  -->
                    <div class="flex flex-col w-fit gap-6">
                        <!-- size  -->
                        <Card borderless>
                            <Heading>{{ t('floating_switch_size') }} <Hints>{{ t('floating_switch_size_hints') }}</Hints>
                            </Heading>
                            <Buttons :options="$default.floating_switch.size.options"
                                v-model="options.floating_switch_size">
                            </Buttons>
                            <Card dark v-if="options.floating_switch_size === 'custom'" class="flex flex-col gap-2">
                                <Hints>{{ t('percentage_hints') }}</Hints>
                                <Range default="100" :min="50" :max="300" step="1" :placeholder="t('custom_size_placeholder')"
                                    v-model="options.floating_switch_size_custom">
                                </Range>
                            </Card>
                        </Card>
                        <!-- position  -->
                        <Card borderless>
                            <Heading>{{ t('switch_position') }} <Hints>{{ t('switch_position_hints') }}</Hints>
                            </Heading>
                            <Buttons v-model="options.floating_switch_position"
                                :options="$default.floating_switch.position.options" locked="['custom']"></Buttons>
                            <Card dark v-if="options.floating_switch_position === 'custom'"
                                class="flex flex-col gap-2 w-fit">
                                <Heading>{{ t('side_selection') }}</Heading>
                                <div class="flex items-center gap-2">
                                    <button v-for="side in ['left', 'right']" :key="side" :class="{
                                        'text-blue-700 bg-blue-100': options.floating_switch_position_side === side,
                                        'text-gray-500 bg-gray-100': options.floating_switch_position_side !== side,
                                    }" @click.prevent="options.floating_switch_position_side = side"
                                        class="px-6 py-2 text-sm font-normal capitalize rounded-full shadow-sm">{{ t(side)
                                        }}</button>
                                </div>
                                <div class="grid grid-cols-1 gap-3">
                                    <div class="flex items-center gap-2">
                                        <Heading class="w-36">{{ t('spacing_bottom') }}</Heading>
                                        <Input type="number" class="w-24" inline placeholder="10"
                                            v-model="options.floating_switch_position_bottom_value">
                                        <template #after><span class="text-gray-500 text-sm">{{ t('px') }}</span></template>
                                        </Input>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <Heading class="w-36">{{ t('spacing_from').replace('%s', t(options.floating_switch_position_side)) }}
                                        </Heading>
                                        <Input type="number" class="w-24" inline placeholder="10"
                                            v-model="options.floating_switch_position_side_value">
                                        <template #after><span class="text-gray-500 text-sm">{{ t('px') }}</span></template>
                                        </Input>
                                    </div>
                                </div>
                            </Card>
                        </Card>
                        <!-- attention effect  -->
                        <Card borderless id="switch-animation">
                            <Card borderless transparent>
                                <Toggle v-model="options.floating_switch_enabled_attention_effect">{{ t('attention_effect_title') }}</Toggle>
                                <Hints>{{ t('attention_effect_hints') }}</Hints>
                            </Card>
                            <Card dark v-if="options.floating_switch_enabled_attention_effect" class="max-w-xs">
                                <Radio v-model="options.floating_switch_attention_effect"
                                    :options="$default.floating_switch.attention_effect.options"
                                    :locked="Object.keys($default.floating_switch.attention_effect.options).slice(2)">
                                </Radio>
                            </Card>
                        </Card>
                        <!-- call to action  -->
                        <Card borderless>
                            <Card borderless transparent>
                                <Toggle v-model="options.floating_switch_enabled_cta">{{ t('cta_text_title') }}
                                </Toggle>
                                <Hints>{{ t('cta_text_hints') }}</Hints>
                            </Card>
                            <!-- call to action text, color and background -->
                            <Card dark class="gap-6 max-w-fit" v-if="options.floating_switch_enabled_cta">
                                <!-- call to action text  -->
                                <Input :placeholder="t('cta_text_title')" v-model="options.floating_switch_cta_text"
                                    :label="t('cta_text_title')"
                                    :hints="t('cta_text_hints_msg')" />
                                <!-- call to action color  -->
                                <Color v-model="options.floating_switch_cta_color" default="#F87171">
                                    <Heading class="mb-2">{{ t('cta_color_title') }} <Hints>{{ t('cta_color_hints') }}</Hints>
                                    </Heading>
                                </Color>
                                <!-- call to action color  -->
                                <Color v-model="options.floating_switch_cta_background" default="#FFFFFF">
                                    <Heading class="mb-2">{{ t('cta_bg_title') }} <Hints>{{ t('cta_bg_hints') }}
                                        </Hints>
                                    </Heading>
                                </Color>
                            </Card>
                        </Card>
                        <!-- divider  -->
                        <div class="w-full max-w-xs h-0.5 rounded-full bg-gray-100" />
                        <!-- attention effect  -->
                        <Card borderless transparent>
                            <Card transparent borderless>
                                <Toggle v-model="options.floating_switch_enabled_custom_icons">{{ t('custom_switch_icon') }}
                                </Toggle>
                                <Hints>{{ t('custom_switch_icon_hints') }}</Hints>
                            </Card>
                            <Card dark class="w-72" v-if="options.floating_switch_enabled_custom_icons">
                                <Heading>{{ t('light_mode_icon') }}</Heading>
                                <Uploader v-model="options.floating_switch_icon_light" type="image/*"></Uploader>
                                <Heading>{{ t('dark_mode_icon') }}</Heading>
                                <Uploader v-model="options.floating_switch_icon_dark" type="image/*"></Uploader>
                            </Card>
                        </Card>
                        <!-- custom switch texts  -->
                        <Card borderless transparent>
                            <Card transparent borderless>
                                <Toggle v-model="options.floating_switch_enabled_custom_texts">{{ t('custom_switch_text') }}
                                </Toggle>
                                <Hints>{{ t('custom_switch_text_hints') }}</Hints>
                            </Card>
                            <Card dark class="w-72" v-if="options.floating_switch_enabled_custom_texts">
                                <Input v-model="options.floating_switch_text_light" :placeholder="t('light_mode_text')"
                                    :label="t('light_mode_text')" :hints="t('light_mode_text_hints')" />
                                <Input v-model="options.floating_switch_text_dark" :placeholder="t('dark_mode_text')"
                                    :label="t('dark_mode_text')" :hints="t('dark_mode_text_hints')" />
                            </Card>
                        </Card>
                    </div>
                    <div>
                        <!-- preview section  -->
                        <Preview class="w-fit hidden sm:flex sm:sticky sm:top-20" :dark="state.previewActive">
                            <div class="relative h-56">
                                <div class="absolute flex items-center gap-2"
                                    :class="{ 'flex-row-reverse': options.floating_switch_position === 'left' }"
                                    :style="`${switchPosition} --wp-dark-switch-scale: ${switchSize}`">
                                    <CallToAction v-if="options.floating_switch_enabled_cta" />
                                    <!-- {{ previewConfig }} -->
                                    <DarkModeSwitch
                                        :class="options.floating_switch_enabled_attention_effect ? 'wp-dark-mode-switch-effect-' + options.floating_switch_attention_effect.toLowerCase() : ''"
                                        :config="previewConfig" @click="state.previewActive = !state.previewActive;"
                                        :active="state.previewActive" :id="options.floating_switch_style" />
                                    <!-- <CallToAction
                                    v-if="options.floating_switch_enabled_cta && options.floating_switch_position !== 'right'" /> -->
                                </div>
                            </div>
                        </Preview>
                    </div>
                </div>
            </Card>
        </Card>
        <Suggestions paths="shortcode, excludes, accessibility"></Suggestions>
    </Card>
</template>