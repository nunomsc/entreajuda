<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import ProBadge from './ProBadge.vue';

const props = defineProps({
    modelValue: {
        type: [Boolean, String],
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    locked: {
        type: Boolean,
        default: false,
    },
})

const value = ref(props.modelValue === true || props.modelValue === 'true')
const checked = computed(() => props.modelValue === true || props.modelValue === 'true')

const emit = defineEmits()

const toggleSwitch = () => {

    if (isLocked()) {
        // The global click delegate in templates/admin/upgrade-popup.php already
        // opens the promo modal for any click that bubbles through an element
        // carrying the wp-dark-mode-locked class (see this component's template).
        return;
    }

    value.value = !props.modelValue || props.modelValue === 'false'
    emit('update:modelValue', value.value)
}

const isLocked = () => !wp_dark_mode_admin_json.is_ultimate && props.locked

</script>

<template>
    <label class="flex sm:items-center gap-3 cursor-pointer w-fit" @click.prevent="toggleSwitch" :class="{
        'opacity-50 pointer-events-none' : props.disabled
    }">
        <div class="w-auto h-6 flex items-center justify-center">
            <div class="relative w-10 h-full rounded-full transition duration-100"
                :class="{ 'bg-blue-600': checked, 'bg-slate-200': !checked, 'wp-dark-mode-locked' : isLocked() }">
                <span class="w-5 h-5 flex rounded-full mt-0.5 ml-0.5 transition duration-100 wp-dark-mode-ignore" :class="{
                    'translate-x-4 border-none bg-[#fff] wp-dark-mode-ignore': checked,
                    'border-4 border-white bg-slate-200 wp-dark-mode-ignore': !checked,
                }"></span>
            </div>
        </div>
        <div class="text-base w-content leading-6 font-medium flex items-center gap-3 text-black">
            <div :class="{
                'opacity-50 wp-dark-mode-locked': isLocked(),
            }">
                <slot />
            </div>
            <ProBadge v-if="isLocked()" />
        </div>
    </label>
</template>
