<script setup>
import { computed, onMounted } from 'vue'
import { Card, Toggle, Hints, Heading, Buttons, Alert, Button, Preview, Range, Icon } from '@components'
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options, showModal, isLocked } = DarkModeStore()

const changeTypography = () => {

    // 

    if ( isLocked ) {
        window.WPDarkModePromo?.show();
        return;
    }

    if ( options.typography_enabled ) {
        showModal({
            title: t('typography_disable_title'),
            message: t('typography_disable_desc'),
            confirmText: t('disable'),
            cancelText: t('cancel'),
            confirm: () => {
                options.typography_enabled = false
            },
            cancel: () => {
                options.typography_enabled = true
                initPreviewFont()
            }
        })

        return;
    } else {
        options.typography_enabled = true
        initPreviewFont()
    }
}


const calculateFontSize = (size, multiply = 1) => {
    // Size can be in px, em, rem, pt, pc, cm, mm, in, ex, ch, vw, vh, vmin, vmax, %
    // We will multiply the size with the given value with the unit

    const unit = size.replace(/[0-9]/g, '');
    const value = parseFloat(size.replace(/[a-z]/g, ''));
    const newValue = value * multiply;
    return `${newValue}${unit}`;
}


const toggleFontSize = () => {
    setTimeout( () => {
        const elements = document.querySelectorAll('.wp-dark-mode-accessibility-preview *');

        // Bail if no elements found
        if (!elements) return;

        elements.forEach(element => {
            const fontSize = element.style.getPropertyValue('--wp-dark-font-size');
            if (fontSize) {
                const newFontSize = calculateFontSize(fontSize, previewFontSize.value);
                element.style.cssText += `font-size: ${newFontSize} !important;`;
            }
        });
    }, 50)
}

const initPreviewFont = () => {
    setTimeout(() => {
        const elements = document.querySelectorAll('.wp-dark-mode-accessibility-preview *');

        // Bail if no elements found
        if (!elements) return;

        elements.forEach(element => {
            const fontSize = getComputedStyle(element).fontSize;
            if (fontSize) {
                element.style.setProperty('--wp-dark-font-size', fontSize);
            }
        });
    }, 50);
}

onMounted(initPreviewFont)
onMounted(toggleFontSize)


const fontSizes = [
    {
        name: t('small'),
        value: '.8',
    },
    {
        name: t('medium'),
        value: '1.2',
    },
    {
        name: t('large'),
        value: '1.4',
    },
    {
        name: t('custom'),
        value: 'custom',
    }
]

const previewFontSize = computed(() => {
    if (options.typography_font_size === 'custom') {
        return (options.typography_font_size_custom || 100) / 100;
    }
    return options.typography_font_size
})

const home_url = computed(() => {
    return wp_dark_mode_admin_json.url.home
})

const scrollToAccessibility = () => {
    setTimeout(() => {
        const el = document.getElementById('accessibility-switches');
        // 
        if (el) {
            el.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'center', });

            // Add a class to highlight the element
            el.classList.add('wp-dark-mode-highlight')

            // Remove the class after 1 second
            setTimeout(() => {
                el.classList.remove('wp-dark-mode-highlight')
            }, 2000)
        }
    }, 100)
}

</script>
<template>
    <Card transparent borderless class="gap-5">
        <Heading>{{ t('typography_settings') }}</Heading>
        <Alert class="text-xs flex items-center justify-between gap-2"> {{ t('typography_alert_msg') }}
            <strong>{{ t('accessibility_switches') }}</strong>
            <template #button>
                <RouterLink to="/switch">
                    <Button class="text-xs whitespace-nowrap" color="warning" @click="scrollToAccessibility"> {{ t('explore_accessibility_switches') }}
                        <Icon name="chevronRight" />
                    </Button>
                </RouterLink>
            </template>
        </Alert>
        <Card locked>
            <div class="flex flex-col sm:flex-row gap-6 sm:justify-between">
                <Card borderless transparent class="gap-5">
                    <Card transparent borderless>
                        <div @click.prevent="changeTypography">
                        <Toggle class="pointer-events-none cursor-pointer" locked v-model="options.typography_enabled">{{ t('adjust_typography') }}</Toggle> </div>
                        <Hints locked>{{ t('adjust_typography_hints') }}
                        </Hints>
                    </Card>
                    <Row transparent borderless v-if="options.typography_enabled" locked :ProBadge="false">
                        <Heading>{{ t('font_size') }} <Hints>{{ t('floating_switch_size_desc') }}</Hints>
                        </Heading>
                        <Buttons @change="toggleFontSize" :options="fontSizes" v-model="options.typography_font_size">
                        </Buttons>
                        <Card dark v-if="options.typography_font_size === 'custom'" class="flex flex-col gap-2">
                            <Hints>{{ t('percentage_hints') }}</Hints>
                            <Range default="100" :min="50" :max="300" step="1" :placeholder="t('custom_size_placeholder')"
                                @change="toggleFontSize" v-model="options.typography_font_size_custom">
                            </Range>
                        </Card>
                    </Row>
                </Card>
                <Card v-if="options.typography_enabled" borderless class="wp-dark-mode-accessibility-preview">
                    <Preview dark>
                    </Preview>
                </Card>
            </div>
        </Card>
        <div class="my-1"></div>
        <Heading>{{ t('other_accessibility_settings') }}</Heading>
        <Card class="gap-5">
            <Card transparent borderless>
                <Toggle v-model="options.accessibility_enabled_keyboard_shortcut">{{ t('keyboard_shortcut') }}</Toggle>
                <Hints>{{ t('keyboard_shortcut_hints') }} <span class="bg-gray-100 p-1">Ctrl + Alt + D</span>
                </Hints>
            </Card>
            <Card transparent borderless>
                <Toggle v-model="options.accessibility_enabled_url_param">{{ t('url_parameter') }}</Toggle>
                <Hints>{{ t('url_parameter_hints') }}</Hints>
                <Hints>{{ t('url_parameter_usage_hints') }} <span class="bg-gray-100">{{ home_url }}?darkmode</span> {{ t('to_enable_dark_mode') }} <span
                        class="bg-gray-100">{{ home_url }}?lightmode</span> {{ t('to_enable_light_mode') }}</Hints>
            </Card>
        </Card>
    </Card>
</template>

<style scoped>
.wp-dark-mode-accessibility-preview * {
    font-size: var(--wp-dark-font-size, 'initial') !important;
    line-height: initial !important;
    transition: all 0.2s !important;
}

.wp-dark-mode-accessibility-preview .text-3xl {
    line-height: initial !important;
}
</style>