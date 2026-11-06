<script setup>
import { computed, reactive, ref } from 'vue';
import { Card, Hints, Heading, Input, Button, Row, ProBadge } from '@components'
import DarkModeStore from '@o/store'
const { options, showModal, isPro, showProModal, isLocked } = DarkModeStore()

import { useTranslation } from '../../composables/useTranslation';
const { t } = useTranslation();

// state
const state = ref({
    preview: false,
})

const currentRow = ref({
    index: false,
    light: '',
    dark: '',
})

const preview = ref(null)

const editRow = (index = false) => {

    if (!isPro) {
        showProModal()
        return;
    }

    currentRow.value = {
        index,
        light: index !== false ? images.value[index].light : '',
        dark: index !== false ? images.value[index].dark : '',
    }

    state.value.preview = true

    setTimeout(() => {
        preview.value.focus()
    }, 50);

}

const isUrl = url => {
    const regex = /(http(s?):)([/|.|\w|\s|-])*/g
    return regex.test(url)
}

const saveRow = () => {

    if (!isPro) {
        showProModal()
        return;
    }

    if (!isUrl(currentRow.value.light) || !isUrl(currentRow.value.dark)) {
        // showModal({
        //     title: 'Invalid URL!',
        //     message: 'Please enter a valid image URL',
        //     confirmText: 'Got it',
        // })

        return;
    }

    state.value.preview = false

    if (currentRow.value.index !== false) {
        options.image_replaces[currentRow.value.index].light = currentRow.value.light
        options.image_replaces[currentRow.value.index].dark = currentRow.value.dark
    } else {
        options.image_replaces = options.image_replaces || []
        options.image_replaces.push({
            light: currentRow.value.light,
            dark: currentRow.value.dark,
        })
    }
}

const deleteRow = (index = null) => {

    if (!isPro) {
        showProModal()
        return;
    }

    // if index is null, then delete the current row
    if (index === null) {
        index = currentRow.value.index
    }

    const shouldPreviewOn = state.value.preview

    state.value.preview = false

    showModal({
        title: t('delete_image_group'),
        message: t('delete_image_msg'),
        confirmText: t('delete'),
        cancelText: t('cancel'),
        confirm: () => {
            options.image_replaces.splice(index, 1)
            state.value.preview = false
        },
        cancel: () => {
            state.value.preview = shouldPreviewOn
        }
    })
}

const closePreview = () => {
    state.value.preview = false
    currentRow.value = {
        index: false,
        light: '',
        dark: '',
    }
}


// get images from options
const images = computed(() => {
    return options.image_replaces || []
})

// select wordpress media and set url to input
const selectMedia = (target = '', index = 0, name = '') => {

    if (!isPro) {
        showProModal()
        return;
    }

    // Check if the wp media library is available
    if (typeof wp === 'undefined' || !wp.media || !wp.media.editor) return false;

    const frame = wp.media.editor;

    frame.open();

    frame.send.attachment = function (props, attachment) {
        // 
        if (index) {
            options[target][index][name] = attachment.url
        } else {
            currentRow.value[name] = attachment.url
        }
    }
}

</script>
<template>
    <Card borderless>
        <Card>
            <Heading bold>
                <Row transparent inline class="items-center">
                    <Row transparent locked :ProBadge="false">{{ t('image_replacement') }}</Row>
                    <ProBadge />
                </Row>
                <Hints locked> {{ t('image_replacement_desc') }}</Hints>
            </Heading>
            <div class="mt-2 border-b border-gray-100"></div>
        </Card>
        <Card v-if="images.length === 0" class="justify-center text-center" :disabled="isLocked">
            <Heading> {{ t('no_images_added') }}<Hints>{{ t('add_images_hints') }}</Hints>
            </Heading>
        </Card>
        <!-- Images  -->
        <Card v-if="images && images.length" class="gap-6" locked>
            <Row class="flex justify-center items-center text-center" locked :ProBadge="false">
                <Heading Locked :disabled="isLocked">{{ t('replaced_images') }} 
                    <Hints> {{ t('replaced_images_hints') }}</Hints>
                </Heading>
            </Row>
            <Card dark v-for="(image, index) in images" :disabled="isLocked">
                <!-- Image header  -->
                <div class="flex items-center justify-between group">
                    <Heading class="px-4 w-fit">{{ index + 1 }}.</Heading>
                    <div class="flex items-center gap-6 w-full cursor-pointer" @click="editRow(index)">
                        <!-- light mode image  -->
                        <Heading class="font-normal  text-sm  group-hover:opacity-100 opacity-50 transition">{{ t('light_mode_image_label') }}</Heading>
                        <div @click="editRow(index)"
                            class="cursor-pointer w-28 h-24 rounded-xl overflow-hidden flex items-center justify-center bg-white border-2 border-dashed border-gray-200">
                            <img :src="images[index].light" class="w-auto h-full" v-if="images[index].light">
                            <svg v-else width="18" height="14" viewBox="0 0 18 14" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.875 10.125L5.17418 5.82582C5.90641 5.09359 7.09359 5.09359 7.82583 5.82583L12.125 10.125M10.875 8.875L12.0492 7.70082C12.7814 6.96859 13.9686 6.96859 14.7008 7.70083L17.125 10.125M2.125 13.25H15.875C16.5654 13.25 17.125 12.6904 17.125 12V2C17.125 1.30964 16.5654 0.75 15.875 0.75H2.125C1.43464 0.75 0.875 1.30964 0.875 2V12C0.875 12.6904 1.43464 13.25 2.125 13.25ZM10.875 3.875H10.8813V3.88125H10.875V3.875ZM11.1875 3.875C11.1875 4.04759 11.0476 4.1875 10.875 4.1875C10.7024 4.1875 10.5625 4.04759 10.5625 3.875C10.5625 3.70241 10.7024 3.5625 10.875 3.5625C11.0476 3.5625 11.1875 3.70241 11.1875 3.875Z"
                                    stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.375 6.875L17.5 10M17.5 10L14.375 13.125M17.5 10H2.5" stroke="#374151"
                                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <Heading class="font-normal text-sm  group-hover:opacity-100 opacity-50 transition"> {{ t('dark_mode_image_label') }}
                            :</Heading>
                        <div @click="editRow(index)"
                            class="cursor-pointer w-28 h-24 rounded-xl overflow-hidden flex items-center justify-center bg-white border-2 border-dashed border-gray-200">
                            <img :src="images[index].dark" class="w-auto h-full" v-if="images[index].dark">
                            <svg v-else width="18" height="14" viewBox="0 0 18 14" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.875 10.125L5.17418 5.82582C5.90641 5.09359 7.09359 5.09359 7.82583 5.82583L12.125 10.125M10.875 8.875L12.0492 7.70082C12.7814 6.96859 13.9686 6.96859 14.7008 7.70083L17.125 10.125M2.125 13.25H15.875C16.5654 13.25 17.125 12.6904 17.125 12V2C17.125 1.30964 16.5654 0.75 15.875 0.75H2.125C1.43464 0.75 0.875 1.30964 0.875 2V12C0.875 12.6904 1.43464 13.25 2.125 13.25ZM10.875 3.875H10.8813V3.88125H10.875V3.875ZM11.1875 3.875C11.1875 4.04759 11.0476 4.1875 10.875 4.1875C10.7024 4.1875 10.5625 4.04759 10.5625 3.875C10.5625 3.70241 10.7024 3.5625 10.875 3.5625C11.0476 3.5625 11.1875 3.70241 11.1875 3.875Z"
                                    stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <button class="w-fit text-gray-400 hover:text-red-500" @click.prevent="deleteRow(index)"><svg
                            class="stroke-current w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.2837 7.5L11.9952 15M8.00481 15L7.71635 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.875 4.96358M16.023 4.82547L15.1332 16.3938C15.058 17.3707 14.2434 18.125 13.2637 18.125H6.73631C5.75655 18.125 4.94198 17.3707 4.86683 16.3938L3.97696 4.82547M16.023 4.82547C15.0677 4.6812 14.1013 4.57071 13.125 4.49527M3.125 4.96358C3.40798 4.91456 3.69198 4.86851 3.97696 4.82547M3.97696 4.82547C4.93231 4.6812 5.89874 4.57071 6.875 4.49527M13.125 4.49527V3.73182C13.125 2.74902 12.3661 1.92853 11.3838 1.8971C10.9244 1.8824 10.463 1.875 10 1.875C9.53696 1.875 9.07565 1.8824 8.61618 1.8971C7.63388 1.92853 6.875 2.74902 6.875 3.73182V4.49527M13.125 4.49527C12.0938 4.41558 11.0516 4.375 10 4.375C8.94836 4.375 7.9062 4.41558 6.875 4.49527"
                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
            </Card>
        </Card>
        <Card class="justify-center text-center" locked>
            <Card :disabled="isLocked">
                <div @click.prevent="isPro ? editRow(false) : showProModal()"
                    class="cursor-pointer text-5xl font-thin text-gray-800 p-3 text-center w-full border border-dashed rounded hover:bg-gray-100 transition duration-75">
                    + </div>
            </Card>
        </Card>
        <!-- Image adder, preview  -->
        <div v-if="state.preview" ref="preview" tabindex="1" @keydown.esc.prevent="closePreview"
            class="fixed top-0 left-0 w-full h-full flex items-center justify-center flex-col outline-none scale-in">
            <div class="absolute z-20 top-0 left-0 h-full w-full bg-black  opacity-20" @click.prevent="closePreview">
            </div>
            <form action="#" method="post" @submit.prevent="saveRow"
                class="bg-white w-fit z-50 p-6 rounded-lg shadow-lg flex flex-col gap-6 relative dark:bg-gray-900">
                <div class="flex items-center justify-between">
                    <span>{{ currentRow.index !== false ? currentRow.index + 1 + '.' : t('add_new') }}</span>
                    <button @click.prevent="closePreview" class="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                        <svg class="w-4 fill-current" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L10 8.58579L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L11.4142 10L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L10 11.4142L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L8.58579 10L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289Z" />
                        </svg>
                    </button>
                </div>
                <div class="flex items-center divide-x divide-gray-100 space-x-6">
                    <Card v-for="mode in ['light', 'dark']" borderless transparent class="last:pl-6">
                        <Heading class="capitalize">{{ mode === 'light' ? t('normal') : t(mode) }} {{ t('mode_image') }}</Heading>
                        <div class="flex items-center gap-2 w-full">
                            <Input type="url" required :placeholder="t('image_url')" class="w-auto h-full"
                                v-model="currentRow[mode]"></Input>
                            <Button @click.prevent="selectMedia('image_replaces', currentRow.index, mode)"
                                class="border-gray-200 py-2.5 text-gray-400 hover:text-blue-600 hover:border-blue-500"
                                outline>
                                <svg class="stroke-current w-4" viewBox="0 0 18 14" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0.875 10.125L5.17418 5.82582C5.90641 5.09359 7.09359 5.09359 7.82583 5.82583L12.125 10.125M10.875 8.875L12.0492 7.70082C12.7814 6.96859 13.9686 6.96859 14.7008 7.70083L17.125 10.125M2.125 13.25H15.875C16.5654 13.25 17.125 12.6904 17.125 12V2C17.125 1.30964 16.5654 0.75 15.875 0.75H2.125C1.43464 0.75 0.875 1.30964 0.875 2V12C0.875 12.6904 1.43464 13.25 2.125 13.25ZM10.875 3.875H10.8813V3.88125H10.875V3.875ZM11.1875 3.875C11.1875 4.04759 11.0476 4.1875 10.875 4.1875C10.7024 4.1875 10.5625 4.04759 10.5625 3.875C10.5625 3.70241 10.7024 3.5625 10.875 3.5625C11.0476 3.5625 11.1875 3.70241 11.1875 3.875Z"
                                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg> {{ t('browse') }}</Button>
                        </div>
                        <Card borderless dark class="h-72 w-96 mt-4 items-center justify-center border "
                            :class="{ 'bg-gray-800 text-gray-400 border-gray-600': 'dark' === mode, 'text-gray-600 border-gray-200': 'normal' === mode }">
                            <img v-if="currentRow[mode]" :src="currentRow[mode]" class="w-auto h-full">
                            <svg v-else width="54" height="43" viewBox="0 0 54 43" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2.75 31.125L15.6475 18.2275C17.8442 16.0308 21.4058 16.0308 23.6025 18.2275L36.5 31.125M32.75 27.375L36.2725 23.8525C38.4692 21.6558 42.0308 21.6558 44.2275 23.8525L51.5 31.125M6.5 40.5H47.75C49.8211 40.5 51.5 38.8211 51.5 36.75V6.75C51.5 4.67893 49.8211 3 47.75 3H6.5C4.42893 3 2.75 4.67893 2.75 6.75V36.75C2.75 38.8211 4.42893 40.5 6.5 40.5ZM32.75 12.375H32.7688V12.3938H32.75V12.375ZM33.6875 12.375C33.6875 12.8928 33.2678 13.3125 32.75 13.3125C32.2322 13.3125 31.8125 12.8928 31.8125 12.375C31.8125 11.8572 32.2322 11.4375 32.75 11.4375C33.2678 11.4375 33.6875 11.8572 33.6875 12.375Z"
                                    stroke="currentColor" stroke-width="4.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </Card>
                    </Card>
                </div>
                <div class="flex items-center justify-between gap-2 text-base font-semibold"
                    v-if="currentRow.index || (currentRow.light && currentRow.dark)">
                    <div>
                        <button
                            class="py-2.5 px-4 rounded-lg border border-red-300 text-red-500 hover;border-red-500 hover:bg-red-500 hover:text-white transition"
                            @click.prevent="deleteRow" v-if="currentRow.index !== false">{{ t('delete') }}</button>
                    </div>
                <div class="flex items-center justify-end gap-2">
                    <button class="py-2.5 px-4 rounded-lg bg-gray-200 text-gray-600 transition hover:opacity-90"
                        @click="closePreview">{{ t('cancel') }}</button>
                    <button class="py-2.5 px-4 rounded-lg bg-[#2563EB] text-white transition hover:opacity-90"
                        type="submit" @click="saveRow">{{ t('confirm') }}</button>
                </div>
            </div>
        </form>
    </div>
</Card></template>
