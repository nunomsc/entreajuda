<script setup>
import { ref, defineProps, computed } from 'vue';
import { Icon, Row } from '@components';
import { useTranslation } from '../composables/useTranslation';

const { t } = useTranslation();

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    freeze: {
        type: Boolean,
        default: false
    },
    open: {
        type: Boolean,
        default: false
    }
});

const displayTitle = computed(() => props.title || t('what_is_wp_dark_mode'));

const isOpen = ref( props.open );

const change = (event) => {

    // Event propagation
    event.stopPropagation();

    // Bail if not collapsable
    if (props.freeze) return;

    isOpen.value = !isOpen.value;
}
</script>

<template>
    <Row dark space>
        <Row gap="2" inline transparent class="justify-between cursor-pointer" @click.prevent="change($event)">
            <h3 class="text-base transition" :class="{
                'font-semibold text-gray-800': isOpen,
                'font-normal text-gray-700 hover:text-gray-800': !isOpen
            }">{{ displayTitle }}</h3>
            <Icon name="chevron" class="transition text-gray-500" :class="{
                'rotate-180': isOpen,
            }" />
        </Row>
        <transition name="slide">
            <Row gap="2" class="text-gray-500 text-sm" transparent v-if="isOpen">
                <div><slot /></div>
            </Row>
        </transition>
    </Row>
</template>


<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.2s cubic-bezier(0.5, 1, 0.89, 1), opacity 0.2s cubic-bezier(0.5, 1, 0.89, 1);
  will-change: opacity, transform;
}
.slide-enter-from, .slide-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
