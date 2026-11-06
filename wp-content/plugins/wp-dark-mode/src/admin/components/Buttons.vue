<script setup>
import { defineProps, computed, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: 'S',
    },
    options: {
        type: Object,
        default: () => ({}),
    },
    locked: {
        type: Array,
        default: [],
    }
});

const emit = defineEmits(['update:modelValue', 'change']);

const selected = ref(props.modelValue);

const options = computed(() => {
    return props.options.map((option) => {
        return {
            name: option.name || option,
            value: option.value || option,
            icon: option.icon || false,
            locked: props.locked.includes(option.value),
        };
    });
});

const isLocked = value => ! wp_dark_mode_admin_json.is_ultimate && props.locked.includes( value );

const selectOption = value => {
    if ( isLocked( value ) ) {
        window.WPDarkModePromo.show();
        return;
    }

    selected.value = value;
    emit('update:modelValue', selected.value);
    emit('change', selected.value);
}

</script>

<template>
    <div class="flex items-center gap-2 bg-gray-50 w-fit p-2 rounded-lg flex-wrap">
        <div v-for="option in options" :key="option.value"
            class="cursor-pointer flex items-center gap-2 py-2 transition duration-75 px-3.5 text-base font-normal leading-6 rounded-lg"
            :class="{
                'bg-blue-600 text-white shadow-md' : selected == option.value,
                'bg-gray-100 hover:bg-gray-200' : selected != option.value && ! isLocked(option.value),
                'wp-dark-mode-locked' : isLocked(option.value),
                }"
            @click.prevent="selectOption(option.value)"
            >
            <div v-if="option.icon" v-html="option.icon" :class="{ 'opacity-50' : isLocked(option.value) }"></div>
            <span :class="{'opacity-50' : isLocked(option.value)}">{{ option.name }}</span>
            <ProBadge text="" v-if="isLocked(option.value)" />
        </div>
    </div>
</template>