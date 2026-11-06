<script setup>
import { defineProps, computed, useSlots } from 'vue';
import { colors } from '@o/helper'

const props = defineProps({
    color: {
        type: String,
        default: 'blue',
    },
    icon: {
        type: Boolean,
        default: true,
    },
})

const slots = useSlots()

const color = computed(() => {
    const color = colors[props.color] || colors.blue
    return color
})

</script>

<template>
    <div class="flex items-start sm:items-center flex-col sm:flex-row sm:justify-between gap-3 px-4 py-[18px] rounded-lg" :class="color.light">
        <!-- Icon  -->
        <div v-if="props.icon" class="hidden sm:inline-flex items-center justify-center w-fit">
            <svg :class="{ [color.bg] : color.bg }" class="w-4" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 8.00058V11.7506M10 1.71484C7.8495 3.75147 4.94563 5.00059 1.75 5.00059C1.69922 5.00059 1.64852 5.00028 1.59789 4.99965C1.2099 6.17976 1 7.44069 1 8.75064C1 14.3422 4.82432 19.0405 10 20.3726C15.1757 19.0405 19 14.3422 19 8.75064C19 7.44069 18.7901 6.17976 18.4021 4.99965C18.3515 5.00028 18.3008 5.00059 18.25 5.00059C15.0544 5.00059 12.1505 3.75147 10 1.71484ZM10 14.7506H10.0075V14.7581H10V14.7506Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>

        <!-- Content  -->
       <div class="w-full text-gray-800 text-xs leading-5 font-normal">
        <slot/>
       </div>

        <!-- Button  -->
        <div v-if="$slots.button" class="inline-flex items-center justify-center w-fit">
            <slot name="button" />
        </div>
    </div>
</template>
