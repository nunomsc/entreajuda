<script setup>
import { computed, defineProps } from 'vue';

import Icons from '@icons/index';

const props = defineProps({
    name: {
        type: String,
        default: 'Arrow'
    },
    width: {
        type: String,
        default: 'w-5'
    },
    height: {
        type: String,
        default: 'h-5'
    },
    to: {
        type: String,
        default: 'top'
    }
});

const Icon = computed(() => {
    if (props.name in Icons) {
        return Icons[props.name];
    }

    return Icons['arrow'];
});

const orientation = computed(() => {
    if (props.to === 'top') {
        return 'rotate-0';
    }

    if (props.to === 'right') {
        return 'rotate-90';
    }

    if (props.to === 'bottom') {
        return 'rotate-180';
    }

    if (props.to === 'left') {
        return 'rotate-270';
    }
});

</script>

<template>
    <div class="inline-flex items-center justify-center" :class="{
        [width]: width,
        [height]: height,
        [orientation]: orientation
    }">
    
        <component :is="Icon" />
    </div>
</template>