<script setup>
import { ref, computed } from 'vue'
import { Card, Toggle, Hints, Heading, Range, Input, Alert, Badge } from '@components'
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options, isPro, showProModal, isLocked } = DarkModeStore()

const addNew = (key = 'image_low_brightness_excludes') => {
    
    options[key] = options[key] || []
    options[key].push('')
}

const getImages = (key = 'image_low_brightness_excludes') => {
    return options[key] || []
}

const deleteItem = (index, key = 'image_low_brightness_excludes') => {
    options[key].splice(index, 1)
}

const preview = ref({
    image: null,
    filter: null,
})
const previewbox = ref(null)

const setPreview = (image = '', filter = 'brightness') => {
    preview.value = {
        image: image,
        filter: filter
    }
    setTimeout(() => {
        previewbox.value.focus()
    }, 50);
}

</script>
<template>
    <Card borderless transparent class="gap-5">
        <Heading>
            {{ t('image_behavior_title') }} <Hints>{{ t('image_behavior_desc') }}</Hints>
        </Heading>

        <Card>
            <Card borderless>
                <Toggle v-model="options.image_enabled_low_brightness">{{ t('low_brightness_image') }}</Toggle>
                <Hints>{{ t('image_brightness_hints') }}</Hints>
            </Card>
 
            <Card borderless class="mt-3 gap-4 w-full" v-if="options.image_enabled_low_brightness" locked>
                <Row inline center>
                    <Row locked :ProBadge="false">{{ t('brightness_level') }}</Row>
                    <ProBadge text="" />
                </Row>
                    
                <Range locked v-model="options.image_brightness" label="" default="80" width="sm" :disabled="!isPro"></Range>
                
                
                <Row inline center>
                    <Row locked :ProBadge="false">{{ t('exclude_low_brightness_image') }}</Row>
                    <ProBadge text="" />
                </Row>

                <!-- excluded images  -->
                <div v-if="getImages('image_low_brightness_excludes')" class="flex flex-col gap-3 w-full" v-for="(image, index) in getImages('image_low_brightness_excludes')">
                    <Hints>{{ t('enter_image_url') }}</Hints>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-3 w-full max-w-lg">
                            <Input type="url" :placeholder="t('enter_image_url')" class="w-full h-10 max-w-lg" v-model="options.image_low_brightness_excludes[index]"></Input>
                            <div @click="setPreview(options.image_low_brightness_excludes[index])" class="cursor-pointer transition hover:brightness-125 relative w-12 h-10 rounded-sm flex items-center justify-center">
                                <img v-if="options.image_low_brightness_excludes[index]" :src="options.image_low_brightness_excludes[index]" class="h-full w-full">
                                <span v-else class="flex w-full h-full bg-gray-800 rounded"></span>
                                <svg v-if="options.image_low_brightness_excludes[index]" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.27216 5.7015C1.22898 5.57196 1.22894 5.43171 1.27204 5.30214C2.13977 2.69358 4.60043 0.8125 7.50045 0.8125C10.3991 0.8125 12.8588 2.69183 13.7276 5.2985C13.7708 5.42804 13.7709 5.56829 13.7278 5.69786C12.86 8.30642 10.3994 10.1875 7.49935 10.1875C4.60069 10.1875 2.14096 8.30817 1.27216 5.7015Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9.37494 5.5C9.37494 6.53553 8.53547 7.375 7.49994 7.375C6.46441 7.375 5.62494 6.53553 5.62494 5.5C5.62494 4.46447 6.46441 3.625 7.49994 3.625C8.53547 3.625 9.37494 4.46447 9.37494 5.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <button @click.prevent="deleteItem(index, 'image_low_brightness_excludes')" class="text-gray-400 cursor-pointer hover:text-red-500 transition duration-100">
                            <svg class="w-5 " viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.2837 7.5L11.9952 15M8.00481 15L7.71635 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.875 4.96358M16.023 4.82547L15.1332 16.3938C15.058 17.3707 14.2434 18.125 13.2637 18.125H6.73631C5.75655 18.125 4.94198 17.3707 4.86683 16.3938L3.97696 4.82547M16.023 4.82547C15.0677 4.6812 14.1013 4.57071 13.125 4.49527M3.125 4.96358C3.40798 4.91456 3.69198 4.86851 3.97696 4.82547M3.97696 4.82547C4.93231 4.6812 5.89874 4.57071 6.875 4.49527M13.125 4.49527V3.73182C13.125 2.74902 12.3661 1.92853 11.3838 1.8971C10.9244 1.8824 10.463 1.875 10 1.875C9.53696 1.875 9.07565 1.8824 8.61618 1.8971C7.63388 1.92853 6.875 2.74902 6.875 3.73182V4.49527M13.125 4.49527C12.0938 4.41558 11.0516 4.375 10 4.375C8.94836 4.375 7.9062 4.41558 6.875 4.49527" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>  
                        </button>
                    </div>           
                </div>
                <Alert v-else color="dark">{{ t('no_image') }}</Alert>

                <!-- add new  -->
                <Row class="flex items-center justify-center gap-2 w-full max-w-lg" locked :ProBadge="0">
                    <button @click.prevent="!isPro ? showProModal() : addNew('image_low_brightness_excludes')" class="text-gray-700 font-thin h-12 rounded hover:bg-gray-100 transition w-full flex items-center justify-center border border-dashed border-gray-300 group">
                        <svg class="w-3 group-active:scale-75 transition duration-300" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14 0.25C14.6904 0.25 15.25 0.809644 15.25 1.5V12.75H26.5C27.1904 12.75 27.75 13.3096 27.75 14C27.75 14.6904 27.1904 15.25 26.5 15.25H15.25V26.5C15.25 27.1904 14.6904 27.75 14 27.75C13.3096 27.75 12.75 27.1904 12.75 26.5V15.25H1.5C0.809644 15.25 0.25 14.6904 0.25 14C0.25 13.3096 0.809644 12.75 1.5 12.75H12.75V1.5C12.75 0.809644 13.3096 0.25 14 0.25Z" fill="currentColor"/>
                        </svg>
                    </button>
                </Row>
            </Card>
        </Card>

        <Card>
            <Card borderless>
                <Toggle v-model="options.image_enabled_low_grayscale">{{ t('grayscale_image') }}</Toggle>
                <Hints>{{ t('image_grayscale_hints') }}</Hints>
            </Card>

            <Card borderless class="mt-3  w-full" v-if="options.image_enabled_low_grayscale" locked>
                
                <Row inline center>
                    <Row locked :ProBadge="false">{{ t('grayscale_level') }}</Row>
                    <ProBadge text="" />
                </Row>
                <Range locked v-model="options.image_grayscale" label="" min="10" max="100" step="1" default="80" width="md" :disabled="!isPro"></Range>

                <Row inline center>
                    <Row locked :ProBadge="false">{{ t('exclude_low_grayscale_image') }}</Row>
                    <ProBadge text="" />
                </Row>

                <!-- excluded images  -->
                <div v-if="getImages('image_low_grayscale_excludes')" class="flex flex-col gap-3 w-full" v-for="(image, index) in getImages('image_low_grayscale_excludes')">
                    <Hints>{{ t('enter_image_url') }}</Hints>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-3 w-full max-w-lg">
                            <Input type="url" :placeholder="t('enter_image_url')" class="w-full h-10 max-w-lg" v-model="options.image_low_grayscale_excludes[index]"></Input>
                            <div @click="setPreview(options.image_low_grayscale_excludes[index], 'grayscale')" class="cursor-pointer transition hover:brightness-125 relative w-12 h-10 rounded-sm flex items-center justify-center">
                                <img v-if="options.image_low_grayscale_excludes[index]" :src="options.image_low_grayscale_excludes[index]" class="h-full w-full">
                                <span v-else class="flex w-full h-full bg-gray-800 rounded"></span>
                                <svg v-if="options.image_low_grayscale_excludes[index]" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.27216 5.7015C1.22898 5.57196 1.22894 5.43171 1.27204 5.30214C2.13977 2.69358 4.60043 0.8125 7.50045 0.8125C10.3991 0.8125 12.8588 2.69183 13.7276 5.2985C13.7708 5.42804 13.7709 5.56829 13.7278 5.69786C12.86 8.30642 10.3994 10.1875 7.49935 10.1875C4.60069 10.1875 2.14096 8.30817 1.27216 5.7015Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9.37494 5.5C9.37494 6.53553 8.53547 7.375 7.49994 7.375C6.46441 7.375 5.62494 6.53553 5.62494 5.5C5.62494 4.46447 6.46441 3.625 7.49994 3.625C8.53547 3.625 9.37494 4.46447 9.37494 5.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <button @click.prevent="deleteItem(index, 'image_low_grayscale_excludes')" class="text-gray-400 cursor-pointer hover:text-red-500 transition duration-100">
                            <svg class="w-5 " viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.2837 7.5L11.9952 15M8.00481 15L7.71635 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.875 4.96358M16.023 4.82547L15.1332 16.3938C15.058 17.3707 14.2434 18.125 13.2637 18.125H6.73631C5.75655 18.125 4.94198 17.3707 4.86683 16.3938L3.97696 4.82547M16.023 4.82547C15.0677 4.6812 14.1013 4.57071 13.125 4.49527M3.125 4.96358C3.40798 4.91456 3.69198 4.86851 3.97696 4.82547M3.97696 4.82547C4.93231 4.6812 5.89874 4.57071 6.875 4.49527M13.125 4.49527V3.73182C13.125 2.74902 12.3661 1.92853 11.3838 1.8971C10.9244 1.8824 10.463 1.875 10 1.875C9.53696 1.875 9.07565 1.8824 8.61618 1.8971C7.63388 1.92853 6.875 2.74902 6.875 3.73182V4.49527M13.125 4.49527C12.0938 4.41558 11.0516 4.375 10 4.375C8.94836 4.375 7.9062 4.41558 6.875 4.49527" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>  
                        </button>
                    </div>           
                </div>
                <Alert v-else color="dark">{{ t('no_image') }}</Alert>

                <!-- add new  -->
                <Row class="flex items-center justify-center gap-2 w-full max-w-lg" locked :ProBadge="0">
                    <button @click.prevent="!isPro ? showProModal() : addNew('image_low_grayscale_excludes')" class="text-gray-700 font-thin h-12 rounded hover:bg-gray-100 transition w-full flex items-center justify-center border border-dashed border-gray-300 group">
                        <svg class="w-3 group-active:scale-75 transition duration-300" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14 0.25C14.6904 0.25 15.25 0.809644 15.25 1.5V12.75H26.5C27.1904 12.75 27.75 13.3096 27.75 14C27.75 14.6904 27.1904 15.25 26.5 15.25H15.25V26.5C15.25 27.1904 14.6904 27.75 14 27.75C13.3096 27.75 12.75 27.1904 12.75 26.5V15.25H1.5C0.809644 15.25 0.25 14.6904 0.25 14C0.25 13.3096 0.809644 12.75 1.5 12.75H12.75V1.5C12.75 0.809644 13.3096 0.25 14 0.25Z" fill="currentColor"/>
                        </svg>
                    </button>
                </Row>
            </Card>
        </Card>

        <div class="" ref="previewbox" tabindex="1" @keydown.escape.prevent="preview.image = null">
            <div v-if="preview.image" @click="preview.image = ''"  class="absolute top-0 left-0 w-full h-full bg-gray-800 opacity-30"></div>
            <Card v-if="preview.image" borderless class="p-0 absolute bg-gray-800 w-fit h-fit max-w-2xl ring ring-white shadow-xl rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div @click="preview.image = ''" class="z-40 absolute right-3 top-3 h-10 w-10 cursor-pointer opacity-50 hover:opacity-100 bg-gray-400 flex items-center justify-center rounded-md">
                    <svg class="fill-current w-4" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L6 4.58579L10.2929 0.292893C10.6834 -0.0976311 11.3166 -0.0976311 11.7071 0.292893C12.0976 0.683417 12.0976 1.31658 11.7071 1.70711L7.41421 6L11.7071 10.2929C12.0976 10.6834 12.0976 11.3166 11.7071 11.7071C11.3166 12.0976 10.6834 12.0976 10.2929 11.7071L6 7.41421L1.70711 11.7071C1.31658 12.0976 0.683417 12.0976 0.292893 11.7071C-0.0976311 11.3166 -0.0976311 10.6834 0.292893 10.2929L4.58579 6L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z" fill="#374151"/>
                    </svg>
                </div>

                <img :src="preview.image" class="h-auto w-full rounded-md">
            </Card>
        </div>
    </Card>
</template>