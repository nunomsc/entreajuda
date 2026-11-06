<script setup>
import { defineProps, computed } from 'vue'
const props = defineProps({

    dark: {
        type: Boolean,
        default: false,
    },

    transparent: {
        type: Boolean,
        default: false,
    },

    space: {
        type: Boolean,
        default: false,
    },

    gap: {
        type: Number,
        default: 3,
    },

    inline: {
        type: Boolean,
        default: false,
    },
    center: {
        type: Boolean,
        default: false,
    },
    rounded: {
        type: Boolean,
        default: true,
    },

    locked: {
        type: Boolean,
        default: false,
    },

    blur: {
        type: Boolean,
        default: false,
    },

    ProBadge: {
        type: Boolean,
        default: true,
    },
    class: {
        type: String,
        default: '',
    },
})

const gap = computed(() => (props.gap * 5) + 'px')

const isLocked = computed(() => props.locked === true && !wp_dark_mode_admin_json.is_ultimate)

const handleLockedClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.WPDarkModePromo?.show();
}

</script>
<template>
    <div class="relative w-full dark:bg-[#2c3338] dark:text-white" :class="{
        'wp-dark-mode-locked': isLocked,
    }">
        <div class="flex text-base  w-full" :style="{ gap: gap }" :class="{
            'rounded': props.rounded,
            'flex-col': !props.inline,
            'flex-row': props.inline,
            'items-center' : props.center && props.inline,
            'justify-center' : props.center && !props.inline,
            'py-5 px-6': props.space,
            'bg-white': !props.dark && !props.transparent,
            'bg-gray-50': props.dark && !props.transparent,
            'bg-transparent': props.transparent,
            'opacity-50 pointer-events-none': props.blur,
            [props.class] : props.class,
        }" v-bind="$attrs" @click.capture="isLocked && handleLockedClick($event)">
            <slot />
        </div>
        <ProBadge text="" class="absolute right-2 top-2" v-if="isLocked && props.ProBadge" />
    </div>
</template>