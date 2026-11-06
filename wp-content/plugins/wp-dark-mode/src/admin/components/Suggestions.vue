<script setup>
import { defineProps, computed } from 'vue'
import { SectionHead } from '@c'
import { useTranslation } from '../composables/useTranslation';
const { t } = useTranslation();

const props = defineProps({
    paths: {
        type: String,
        default: '',
    },
    title: {
        type: String,
        default: '',
    },
})

const displayTitle = computed(() => props.title || t('you_might_be_looking_for'));
const paths = computed(() => {
    if( !props.paths ) return false

    if ( typeof props.paths === 'string' ) {
        return props.paths.split(',').map(p => p.trim()).map((path) => {
            return settingsPaths.find(p => p.path.replace('/', '') === path)
        })
    }

    return props.paths
})

const scrollTo = (id) => {

    if( !id ) {
        // scroll to top 

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })

        return
    }

    setTimeout(() => {
        const el = document.querySelector(id)
        if (el) {
            
            // scroll to the element in 50ms
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            }, 500)

            // Add a class to highlight the element
            el.classList.add('wp-dark-mode-highlight')

            // Remove the class after 1 second
            setTimeout(() => {
                el.classList.remove('wp-dark-mode-highlight')
            }, 2000)
        }
    }, 100)
}

import { settingsPaths } from '@o/settings-routes'
</script>
<template>
    <Row v-if="paths" id="wp-dark-mode-quick-links" class="mt-5 sticky top-full" transparent>
        <SectionHead v-if="displayTitle">{{ displayTitle }}</SectionHead>
        <Card class="text-sm text-blue-600">
            <div v-for="path in paths" :key="path" class="flex items-center gap-2">
                <RouterLink :to="path.path" @click="scrollTo(path.scroll || false)">{{ t(path.name) }}</RouterLink> 
                <!-- <svg class="fill-current w-3" viewBox="0 0 13 12"
                    fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path :title="path.description" fill-rule="evenodd" clip-rule="evenodd"
                        d="M12.5 6C12.5 9.31371 9.81371 12 6.5 12C3.18629 12 0.5 9.31371 0.5 6C0.5 2.68629 3.18629 0 6.5 0C9.81371 0 12.5 2.68629 12.5 6ZM5.7045 3.70448C5.48483 3.92416 5.12868 3.92416 4.90901 3.70448C4.68934 3.48482 4.68934 3.12866 4.90901 2.90899C5.78769 2.03031 7.21231 2.03031 8.09099 2.90899C8.96967 3.78767 8.96967 5.21229 8.09099 6.09097C7.79663 6.38533 7.43964 6.58172 7.0625 6.67881V6.93748C7.0625 7.24814 6.81066 7.49998 6.5 7.49998C6.18934 7.49998 5.9375 7.24814 5.9375 6.93748V6.56248C5.9375 6.02226 6.36496 5.68369 6.74851 5.59741C6.94867 5.55239 7.1387 5.45227 7.2955 5.29548C7.73483 4.85614 7.73483 4.14382 7.2955 3.70448C6.85616 3.26515 6.14384 3.26515 5.7045 3.70448ZM6.5 9.75C6.91421 9.75 7.25 9.41421 7.25 9C7.25 8.58579 6.91421 8.25 6.5 8.25C6.08579 8.25 5.75 8.58579 5.75 9C5.75 9.41421 6.08579 9.75 6.5 9.75Z"
                        fill="#D1D5DB" />
                </svg> -->
            </div>
        </Card>
    </Row>
</template>