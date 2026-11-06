<script setup>
import { ref, defineProps, computed } from 'vue'
import { useTranslation } from '../composables/useTranslation';

const { t } = useTranslation();

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});


const isOpen = ref(false)
const value = ref(props.modelValue)

const times = () => {
    // add 30 min intervals with am and pm
    let times = []

    for (let i = 0; i < 24; i++) {
        let hour = i
        let ampm = t('am')

        if (i >= 12) {
            ampm = t('pm')
        }

        if (i > 12) {
            hour = i - 12
        }

        if (i === 0) {
            hour = 12
        }

        

        times.push(`${hour}:00 ${ampm}`)
        times.push(`${hour}:30 ${ampm}`)
    }

    return times
}

</script>

<template>
    <div class="w-fit text-sm relative outline-none focus:outline-none" tabindex="1" @keydown.esc="isOpen = false" @blur="isOpen = false">
        <div @click.prevent="isOpen = !isOpen" class="cursor-pointer flex items-center justify-between px-4 w-44 py-3 rounded-xl bg-white border border-gray-300">
            <div class="flex items-center gap-2 whitespace-nowrap">
                <svg class="w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10.75 5C10.75 4.58579 10.4142 4.25 10 4.25C9.58579 4.25 9.25 4.58579 9.25 5V10C9.25 10.4142 9.58579 10.75 10 10.75H14C14.4142 10.75 14.75 10.4142 14.75 10C14.75 9.58579 14.4142 9.25 14 9.25H10.75V5Z" fill="#9CA3AF"/>
                </svg>
               <span>{{ value || t('select_time') }}</span>
            </div>
            <svg class="w-5 transition" :class="{'rotate-180' : isOpen}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.23017 7.20938C5.52875 6.92228 6.00353 6.93159 6.29063 7.23017L10 11.1679L13.7094 7.23017C13.9965 6.93159 14.4713 6.92228 14.7698 7.20938C15.0684 7.49647 15.0777 7.97125 14.7906 8.26983L10.5406 12.7698C10.3992 12.9169 10.204 13 10 13C9.79599 13 9.60078 12.9169 9.45938 12.7698L5.20938 8.26983C4.92228 7.97125 4.93159 7.49647 5.23017 7.20938Z" fill="#6B7280"/>
            </svg>
        </div>

        <div @click.blur="isOpen = false" v-if="isOpen" class="absolute bg-white shadow-lg w-48 border border-gray-100 rounded max-h-48 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-500 scrollbar-corner-blue-600 z-40">
            <div v-for="time in times()" @click.prevent="value = time; isOpen = false; $emit('update:modelValue', value)" class="px-4 py-2 text-sm hover:bg-blue-50 transition duration-100 cursor-pointer">{{ time }}</div>
        </div>
    </div>
</template>

<style scoped></style>