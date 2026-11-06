<script setup>
import { ref, computed, defineProps, onMounted } from 'vue';
const props = defineProps({
    id: {
        type: [String, Number],
        default: 1
    },
    config: {
        type: Object,
        default: {
        }
    },
    active: {
        type: Boolean,
        default: false
    },
    activeLargeFont: {
        type: Boolean,
        default: false
    },
    dummy: {
        type: Boolean,
        default: false
    },
    size: {
        type: Number,
        default: 1
    }
});

import * as switches from './../../switches';

const id = computed(() => {
    const mod = "Switch_" + props.id;
    if (typeof switches[mod] === 'function') {
        return props.id;
    }

    return 1;
})
const config = computed(() => props.config || {});
const isActive = computed(() => props.active || false);
const isActiveLargeFont = computed(() => props.activeLargeFont || false);

// Reject icon URLs that could break out of the src="" attribute or
// carry a script-executing scheme when concatenated into markup.
const sanitizeIconUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (/["'<>`]/.test(url)) return null;
    if (/^\s*(javascript|data|vbscript):/i.test(url)) return null;
    return url;
};

const html = computed(() => {
    const mod = "Switch_" + id.value;

    // iconLight and iconDark should be wrapped in img tag if not empty
    if (config.value.iconLight) {
        const safeUrl = sanitizeIconUrl(config.value.iconLight);
        config.value.iconLight = config.value.iconLight.startsWith('http') ? (safeUrl ? `<img src="${safeUrl}" />` : null) : config.value.iconLight;
    }

    if (config.value.iconDark) {
        const safeUrl = sanitizeIconUrl(config.value.iconDark);
        config.value.iconDark = config.value.iconDark.startsWith('http') ? (safeUrl ? `<img src="${safeUrl}" />` : null) : config.value.iconDark;
    }


    return switches[mod](config.value);
});

const switchEl = ref(null)

</script>
<template>
    <div ref="switchEl" class="wp-dark-mode-ignore wp-dark-mode-switch ignore dummy" :class="`${props.dummy && id == 24 ? 'scale-75' : ''} wp-dark-mode-switch-${id} ${isActive ? 'active' : ''} ${isActiveLargeFont ? 'active-large-font' : ''} ${props.dummy ? 'dummy' : ''}`" v-html="html"></div>
</template>
