<script setup>
import { computed, reactive, ref } from 'vue';
import { Card, Hints, Heading, Input, Button, PlayVideo, Row, ProBadge } from '@components'
import DarkModeStore from '@o/store'
const { options, showModal, isPro, showProModal, isLocked } = DarkModeStore()

import { useTranslation } from '../../composables/useTranslation';
const { t } = useTranslation();

// state
const state = ref({
    preview: false,
})

const currentRow = ref({
    index: 0,
    light: '',
    dark: '',
})

const preview = ref(null)

const editRow = (index = false) => {

    if ( ! isPro ) {
        showProModal()
        return;
    }

    currentRow.value = {
        index,
        light: index !== false ? videos.value[index].light : '',
        dark: index !== false ? videos.value[index].dark : '',
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

    if ( ! isPro ) {
        showProModal()
        return;
    }

    if (!isUrl(currentRow.value.light) || !isUrl(currentRow.value.dark)) {
        return;
    }

    state.value.preview = false

    if (currentRow.value.index !== false) {
        options.video_replaces[currentRow.value.index].light = currentRow.value.light
        options.video_replaces[currentRow.value.index].dark = currentRow.value.dark
    } else {
        options.video_replaces = options.video_replaces || []
        options.video_replaces.push({
            light: currentRow.value.light,
            dark: currentRow.value.dark,
        })
    }
}

const deleteRow = (index = null) => {

    if ( ! isPro ) {
        showProModal()
        return;
    }

    // if index is null, delete current row
    if (null === index) {
        index = currentRow.value.index
    }

    const shouldPreviewOn = state.value.preview

    state.value.preview = false

    showModal({
        title: t('delete_video_group'),
        message: t('delete_video_msg'),
        confirmText: t('delete'),
        cancelText: t('cancel'),
        confirm: () => {
            options.video_replaces.splice(index, 1)
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

// get videos from options
const videos = computed(() => {
    return options.video_replaces || []
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
        <Card locked>
            <Heading bold>
                <Row inline center>
                    <Row locked :ProBadge="false">{{ t('video_replacement') }}</Row> <ProBadge />
                </Row>
                 <Hints locked>{{ t('video_replacement_desc') }}</Hints>
            </Heading>
            <div class="mt-2 border-b border-gray-100"></div>
        </Card>
        <Card v-if="videos.length === 0" class="justify-center text-center">
            <Heading> {{ t('no_videos_added') }}<Hints>{{ t('add_videos_hints') }}</Hints>
            </Heading>
        </Card>
        <!-- Videos  -->
        <Card v-if="videos && videos.length" class="gap-6" locked>
            <Row class="flex justify-center items-center text-center" locked :ProBadge="0">
                <Heading> {{ t('replaced_videos') }}<Hints>{{ t('replaced_videos_hints') }}</Hints>
                </Heading>
            </Row>
            <Card dark v-for="(video, index) in videos" :disabled="isLocked">
                <!-- Video header  -->
                <div class="flex items-center justify-between group">
                    <Heading class="px-4 w-fit">{{ index + 1 }}.</Heading>
                    <div class="flex items-center gap-6 w-full cursor-pointer" @click="editRow(index)">
                        <!-- light mode video  -->
                        <Heading class="font-normal text-sm group-hover:opacity-100 opacity-50 transition">{{ t('light_mode_video_label') }} 
                        </Heading>
                        <div @click="editRow(index)"
                            class="cursor-pointer w-28 h-24 rounded-xl overflow-hidden flex items-center justify-center bg-white border-2 border-dashed border-gray-200">
                            <div class="w-full h-auto pointer-events-none" v-if="videos[index].dark">
                                <PlayVideo :url="videos[index].light" :controls="false" />
                            </div>
                            <svg v-else class="w-12" viewBox="0 0 52 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M0 7.25C0 3.23446 3.27467 0 7.28846 0H29.4423C33.4561 0 36.7308 3.23446 36.7308 7.25V10.3792L45.3653 1.80462C47.6144 -0.428859 51.5 1.12778 51.5 4.34272V32.1573C51.5 35.3722 47.6144 36.9289 45.3653 34.6954L36.7308 26.1208V29.25C36.7308 33.2655 33.4561 36.5 29.4423 36.5H7.28846C3.27467 36.5 0 33.2655 0 29.25V7.25ZM33.2308 21.9179C33.2308 21.917 33.2308 21.9162 33.2308 21.9154V14.5846C33.2308 14.5838 33.2308 14.583 33.2308 14.5821V7.25C33.2308 5.19041 31.5461 3.5 29.4423 3.5H7.28846C5.18464 3.5 3.5 5.19041 3.5 7.25V29.25C3.5 31.3096 5.18464 33 7.28846 33H29.4423C31.5461 33 33.2308 31.3096 33.2308 29.25V21.9179ZM36.7308 15.3118V21.1882L47.8315 32.2119C47.8506 32.2309 47.8627 32.2375 47.8664 32.2394C47.8705 32.2415 47.8739 32.2426 47.8782 32.2433C47.8887 32.2452 47.9134 32.2455 47.9446 32.2326C47.9759 32.2198 47.9906 32.2033 47.9939 32.1986C47.9946 32.1976 47.995 32.197 47.9953 32.1962C47.9956 32.1957 47.9958 32.1951 47.9961 32.1943C47.9965 32.193 48 32.1822 48 32.1573V4.34272C48 4.31783 47.9965 4.30702 47.9961 4.3057C47.9955 4.30386 47.9951 4.30303 47.9939 4.30144C47.9906 4.29669 47.9759 4.28024 47.9446 4.26737C47.9134 4.25452 47.8887 4.25485 47.8782 4.25666C47.8739 4.25739 47.8705 4.25849 47.8664 4.26062C47.8627 4.2625 47.8506 4.26914 47.8315 4.2881L36.7308 15.3118Z"
                                    fill="#E5E7EB" />
                            </svg>
                        </div>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.375 6.875L17.5 10M17.5 10L14.375 13.125M17.5 10H2.5" stroke="#374151"
                                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <Heading class="font-normal text-sm group-hover:opacity-100 opacity-50 transition">{{ t('dark_mode_video_label') }}
                        </Heading>
                        <div @click="editRow(index)"
                            class="cursor-pointer w-28 h-24 rounded-xl overflow-hidden flex items-center justify-center bg-white border-2 border-dashed border-gray-200">
                            <div class="w-full h-auto  pointer-events-none" v-if="videos[index].dark">
                                <PlayVideo :url="videos[index].dark" :controls="false" />
                            </div>
                            <svg v-else class="w-12" viewBox="0 0 52 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M0 7.25C0 3.23446 3.27467 0 7.28846 0H29.4423C33.4561 0 36.7308 3.23446 36.7308 7.25V10.3792L45.3653 1.80462C47.6144 -0.428859 51.5 1.12778 51.5 4.34272V32.1573C51.5 35.3722 47.6144 36.9289 45.3653 34.6954L36.7308 26.1208V29.25C36.7308 33.2655 33.4561 36.5 29.4423 36.5H7.28846C3.27467 36.5 0 33.2655 0 29.25V7.25ZM33.2308 21.9179C33.2308 21.917 33.2308 21.9162 33.2308 21.9154V14.5846C33.2308 14.5838 33.2308 14.583 33.2308 14.5821V7.25C33.2308 5.19041 31.5461 3.5 29.4423 3.5H7.28846C5.18464 3.5 3.5 5.19041 3.5 7.25V29.25C3.5 31.3096 5.18464 33 7.28846 33H29.4423C31.5461 33 33.2308 31.3096 33.2308 29.25V21.9179ZM36.7308 15.3118V21.1882L47.8315 32.2119C47.8506 32.2309 47.8627 32.2375 47.8664 32.2394C47.8705 32.2415 47.8739 32.2426 47.8782 32.2433C47.8887 32.2452 47.9134 32.2455 47.9446 32.2326C47.9759 32.2198 47.9906 32.2033 47.9939 32.1986C47.9946 32.1976 47.995 32.197 47.9953 32.1962C47.9956 32.1957 47.9958 32.1951 47.9961 32.1943C47.9965 32.193 48 32.1822 48 32.1573V4.34272C48 4.31783 47.9965 4.30702 47.9961 4.3057C47.9955 4.30386 47.9951 4.30303 47.9939 4.30144C47.9906 4.29669 47.9759 4.28024 47.9446 4.26737C47.9134 4.25452 47.8887 4.25485 47.8782 4.25666C47.8739 4.25739 47.8705 4.25849 47.8664 4.26062C47.8627 4.2625 47.8506 4.26914 47.8315 4.2881L36.7308 15.3118Z"
                                    fill="#E5E7EB" />
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
                <div @click.prevent="!isPro ? showProModal() : editRow(false)"
                class="cursor-pointer text-5xl font-thin text-gray-800 p-3 text-center w-full border border-dashed rounded hover:bg-gray-100 transition duration-75">
                +</div>
            </Card>
        </Card>
        <!-- Video adder, preview  -->
        <div v-if="state.preview" ref="preview" tabindex="1" @keydown.esc.prevent="closePreview"
            class="fixed top-0 left-0 w-full h-full flex items-center justify-center flex-col outline-none scale-in">
            <div class="absolute top-0 left-0 h-full w-full bg-black  opacity-20" @click.prevent="closePreview">
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
                        <Heading class="capitalize">{{ mode === 'light' ? t('normal') : t(mode) }} {{ t('mode_video') }}</Heading>
                        <div class="flex items-center gap-2 w-full">
                            <Input type="url" required :placeholder="t('video_url')" class="w-full"
                                v-model="currentRow[mode]"></Input>
                            <Button @click.prevent="selectMedia('video_replaces', currentRow.index, mode)"
                                class="border-gray-200 py-2.5 text-gray-400 hover:text-blue-600 hover:border-blue-500"
                                outline>
                                <svg class="stroke-current w-4" viewBox="0 0 52 37" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M0 7.25C0 3.23446 3.27467 0 7.28846 0H29.4423C33.4561 0 36.7308 3.23446 36.7308 7.25V10.3792L45.3653 1.80462C47.6144 -0.428859 51.5 1.12778 51.5 4.34272V32.1573C51.5 35.3722 47.6144 36.9289 45.3653 34.6954L36.7308 26.1208V29.25C36.7308 33.2655 33.4561 36.5 29.4423 36.5H7.28846C3.27467 36.5 0 33.2655 0 29.25V7.25ZM33.2308 21.9179C33.2308 21.917 33.2308 21.9162 33.2308 21.9154V14.5846C33.2308 14.5838 33.2308 14.583 33.2308 14.5821V7.25C33.2308 5.19041 31.5461 3.5 29.4423 3.5H7.28846C5.18464 3.5 3.5 5.19041 3.5 7.25V29.25C3.5 31.3096 5.18464 33 7.28846 33H29.4423C31.5461 33 33.2308 31.3096 33.2308 29.25V21.9179ZM36.7308 15.3118V21.1882L47.8315 32.2119C47.8506 32.2309 47.8627 32.2375 47.8664 32.2394C47.8705 32.2415 47.8739 32.2426 47.8782 32.2433C47.8887 32.2452 47.9134 32.2455 47.9446 32.2326C47.9759 32.2198 47.9906 32.2033 47.9939 32.1986C47.9946 32.1976 47.995 32.197 47.9953 32.1962C47.9956 32.1957 47.9958 32.1951 47.9961 32.1943C47.9965 32.193 48 32.1822 48 32.1573V4.34272C48 4.31783 47.9965 4.30702 47.9961 4.3057C47.9955 4.30386 47.9951 4.30303 47.9939 4.30144C47.9906 4.29669 47.9759 4.28024 47.9446 4.26737C47.9134 4.25452 47.8887 4.25485 47.8782 4.25666C47.8739 4.25739 47.8705 4.25849 47.8664 4.26062C47.8627 4.2625 47.8506 4.26914 47.8315 4.2881L36.7308 15.3118Z"
                                        fill="currentColor" />
                                </svg> {{ t('browse') }}</Button>
                        </div>
                        <Card borderless dark class="h-72 w-96 mt-4 items-center justify-center border "
                            :class="{ 'bg-gray-800 text-gray-400 border-gray-600': 'dark' === mode, 'text-gray-600 border-gray-200': 'normal' === mode }">
                            <div class="w-full h-auto" v-if="currentRow[mode]">
                                <PlayVideo :url="currentRow[mode]" />
                            </div>
                            <svg v-else class="w-12" viewBox="0 0 52 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M0 7.25C0 3.23446 3.27467 0 7.28846 0H29.4423C33.4561 0 36.7308 3.23446 36.7308 7.25V10.3792L45.3653 1.80462C47.6144 -0.428859 51.5 1.12778 51.5 4.34272V32.1573C51.5 35.3722 47.6144 36.9289 45.3653 34.6954L36.7308 26.1208V29.25C36.7308 33.2655 33.4561 36.5 29.4423 36.5H7.28846C3.27467 36.5 0 33.2655 0 29.25V7.25ZM33.2308 21.9179C33.2308 21.917 33.2308 21.9162 33.2308 21.9154V14.5846C33.2308 14.5838 33.2308 14.583 33.2308 14.5821V7.25C33.2308 5.19041 31.5461 3.5 29.4423 3.5H7.28846C5.18464 3.5 3.5 5.19041 3.5 7.25V29.25C3.5 31.3096 5.18464 33 7.28846 33H29.4423C31.5461 33 33.2308 31.3096 33.2308 29.25V21.9179ZM36.7308 15.3118V21.1882L47.8315 32.2119C47.8506 32.2309 47.8627 32.2375 47.8664 32.2394C47.8705 32.2415 47.8739 32.2426 47.8782 32.2433C47.8887 32.2452 47.9134 32.2455 47.9446 32.2326C47.9759 32.2198 47.9906 32.2033 47.9939 32.1986C47.9946 32.1976 47.995 32.197 47.9953 32.1962C47.9956 32.1957 47.9958 32.1951 47.9961 32.1943C47.9965 32.193 48 32.1822 48 32.1573V4.34272C48 4.31783 47.9965 4.30702 47.9961 4.3057C47.9955 4.30386 47.9951 4.30303 47.9939 4.30144C47.9906 4.29669 47.9759 4.28024 47.9446 4.26737C47.9134 4.25452 47.8887 4.25485 47.8782 4.25666C47.8739 4.25739 47.8705 4.25849 47.8664 4.26062C47.8627 4.2625 47.8506 4.26914 47.8315 4.2881L36.7308 15.3118Z"
                                    fill="currentColor" />
                            </svg>
                        </Card>
                    </Card>
                </div>
                <div class="flex items-center justify-between gap-2"
                    v-if="currentRow.index || (currentRow.light && currentRow.dark)">
                    <div>
                        <button
                            class="py-2.5 px-4 rounded-lg border border-red-300 text-red-500 hover;border-red-500 hover:bg-red-500 hover:text-white transition"
                            @click.prevent="deleteRow" v-if="currentRow.index">{{ t('delete') }}</button>
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