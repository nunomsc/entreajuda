<script setup>
import { defineProps, reactive, ref, defineEmits } from 'vue'
import { useTranslation } from '../composables/useTranslation';

const { t } = useTranslation();

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})
const url = ref(props.modelValue || null)
const state = reactive({
    file: null,
    loading: false,
    error: null,
})
const setActive = () => {
    state.active = true
}

const setInactive = () => {
    state.active = false
}

const uploader = ref(null)

const emit = defineEmits(['update:modelValue'])

const uploadFile = async () => {
    state.loading = true
    state.error = null
    state.active = false

    // Bail if state.file is null
    if (!state.file) {
        state.loading = false
        return
    }

    // check file type 
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/svg']
    if (!allowedTypes.includes(state.file.type)) {
        state.error = t('file_type_not_supported')
        state.loading = false
        return
    }

    // check file size
    const maxSize = 1024 * 1024 * 10 // 10MB
    if (state.file.size > maxSize) {
        state.error = t('file_size_too_large')
        state.loading = false
        return
    }

    // upload file
    const formData = new FormData()
    formData.append('file', state.file)
    formData.append('action', 'wp_dark_mode_admin_upload_image')
    formData.append('security_key', wp_dark_mode_admin_json.security_key)

    const response = await fetch(wp_dark_mode_admin_json.url.ajax, {
        method: 'POST',
        body: formData,
    })
    const data = await response.json()

    state.loading = false
    if (data.success) {
        state.file = null
        url.value = data.data.url

        // emit event
        emit('update:modelValue', data.data.url)
    } else {

        state.error = data.data.message
    }
}

const catchFileInput = () => {
    state.file = uploader.value.files[0]
    uploadFile()
}

const catchFileDropper = (e) => {
    e.preventDefault()
    state.file = e.dataTransfer.files[0]
    uploadFile()
}
</script>

<template>
    <div>
        <div class="group relative flex flex-col bg-white rounded items-center h-32 w-full gap-3 justify-center">
            <!-- inner preview  -->
            <img class="w-16" :src="url" alt="">
            <!-- close  -->
            <a href="javascript:;" @click.prevent="url = null, emit('update:modelValue', '')" :title="t('delete_icon')"
                class="absolute right-2 top-2 text-transparent group-hover:text-red-600 hover:opacity-100 transition duration-75 active:scale-90">
                <svg class="fill-current w-5" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round"
                    stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="m20.015 6.506h-16v14.423c0 .591.448 1.071 1 1.071h14c.552 0 1-.48 1-1.071 0-3.905 0-14.423 0-14.423zm-5.75 2.494c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-4.5 0c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-.75-5v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-16.507c-.413 0-.747-.335-.747-.747s.334-.747.747-.747zm4.5 0v-.5h-3v.5z"
                        fill-rule="nonzero" />
                </svg>
            </a>
            <!-- overlay  -->
            <label v-if="!url"
                @dragover.prevent="setActive" 
                @dragleave.prevent="setInactive" 
                :dropZoneActive="true" :dropzone="true"
                @dragenter.prevent="setActive" 
                @drop.prevent="catchFileDropper"
                :class="{ 'ring ring-blue-500': state.active, 'hover:bg-gray-100': !url }"
                class="z-50 group flex flex-col gap-3 cursor-pointer items-center bg-white justify-center absolute top-0 left-0 w-full h-full">
                <svg v-if="!state.loading" class="w-4" viewBox="0 0 19 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M5.75 8.3125H3.875C2.3217 8.3125 1.0625 9.5717 1.0625 11.125V22.375C1.0625 23.9283 2.3217 25.1875 3.875 25.1875H15.125C16.6783 25.1875 17.9375 23.9283 17.9375 22.375V11.125C17.9375 9.5717 16.6783 8.3125 15.125 8.3125H13.25M13.25 4.5625L9.5 0.8125M9.5 0.8125L5.75 4.5625M9.5 0.8125L9.5 16.75"
                        stroke="#1F2937" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg v-if="state.loading" class="w-6 animate-spin" viewBox="0 0 31 30" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.15" fill-rule="evenodd" clip-rule="evenodd"
                        d="M15.5 25C21.0228 25 25.5 20.5228 25.5 15C25.5 9.47715 21.0228 5 15.5 5C9.97715 5 5.5 9.47715 5.5 15C5.5 20.5228 9.97715 25 15.5 25ZM15.5 27.5C22.4036 27.5 28 21.9036 28 15C28 8.09644 22.4036 2.5 15.5 2.5C8.59644 2.5 3 8.09644 3 15C3 21.9036 8.59644 27.5 15.5 27.5Z"
                        fill="#475569" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M15.5 5C9.97715 5 5.5 9.47715 5.5 15C5.5 20.5228 9.97715 25 15.5 25C16.1904 25 16.75 25.5596 16.75 26.25C16.75 26.9404 16.1904 27.5 15.5 27.5C8.59644 27.5 3 21.9036 3 15C3 8.09644 8.59644 2.5 15.5 2.5C22.4036 2.5 28 8.09644 28 15C28 15.6904 27.4404 16.25 26.75 16.25C26.0596 16.25 25.5 15.6904 25.5 15C25.5 9.47715 21.0228 5 15.5 5Z"
                        fill="url(#paint0_linear_1481_4316)" />
                    <defs>
                        <linearGradient id="paint0_linear_1481_4316" x1="15.5" y1="15" x2="15.5" y2="25"
                            gradientUnits="userSpaceOnUse">
                            <stop stop-color="#64748B" />
                            <stop offset="1" stop-color="#64748B" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
                <span class="text-xs text-gray-400 leading-4 font-normal">
                    {{ state.loading ? 'Uploading...' : 'Drag an icon or click here to upload' }}
                </span>
                <input ref="uploader" type="file" class="sr-only" @input="catchFileInput" accept="image/*">
            </label>
        </div>
    <Hints class="py-2 text-red-400 text-center">{{ state.error }}</Hints>
</div></template>