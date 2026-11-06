<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    bold: {
        type: Boolean,
        default: false
    },
    class: {
        type: String,
        default: ''
    }
});
</script>

<template>
    <div class="flex flex-col gap-1.5" v-bind="$attrs">
        <h3 v-if="$slots.default" class="leading-7 text-[#1F2937] font-semibold whitespace-nowrap" :class="props.class">
            <slot  />
        </h3>
        <div v-if="$slots.description" class="font-normal text-[#6B7280] text-xs">
            <slot  name="description" />
        </div>

    </div>
</template>