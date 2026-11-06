<script setup>
import { ref, onMounted } from 'vue';
import DarkModeStore from '@o/store'
const { modal, hideModal } = DarkModeStore()

const close = () => {
    if (modal.cancel) {
        modal.cancel()
    }
    hideModal()
}

const confirm = () => {
    if (modal.confirm) {
        modal.confirm()
    }
    hideModal()
}

const modalel = ref(null)
onMounted(() => {
    modalel.value.focus()
})

</script>

<template>
    
    <div tabindex="0" class="fixed z-[9999] top-0 left-0 w-full h-full flex items-center justify-center" ref="modalel"
        @keydown.escape.prevent="close">
        <div class="fixed top-0 left-0 w-full h-full bg-gray-800 opacity-25" @click.prevent="close"></div>
        <div class="bg-white rounded-xl shadow-xl p-5 z-50 flex flex-col gap-6 m-4 zoom-in" :class="{
            'w-full max-w-sm': modal.size === 'sm',
            'w-full max-w-md': modal.size === 'md',
            'w-full max-w-lg': modal.size === 'lg',
            'w-full max-w-xl': modal.size === 'xl',
            'w-full max-w-2xl': modal.size === '2xl',
            'w-fit': modal.size === 'fit',
            'w-full': modal.size === 'full',
            'bounce-in': modal.open,
            'bounce-out': !modal.open
        }">
            <!-- Heading  -->
            <div class="flex items-center justify-between" v-if="modal.title">
                <Heading bold :style="`color: ${modal.titleColor || 'black'} !important;`">{{ modal.title }}</Heading>
                <svg @click.prevent="close" class="fill-current w-4 cursor-pointer hover:text-red-500 transition"
                    viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L10 8.58579L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L11.4142 10L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L10 11.4142L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L8.58579 10L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289Z"
                        fill="#64748B" />
                </svg>
            </div>
            <!-- content  -->
            <div class="text-sm leading-6 text-gray-700" v-if="modal.message" v-html="modal.message">
            </div>
            <!-- buttons  -->
            <div class="flex items-center gap-3 justify-end font-semibold text-sm " v-if="modal.cancelText || modal.confirmText">
                <button @click.prevent="close" class="px-5 sm:whitespace-nowrap  bg-gray-100 text-gray-700 py-2 rounded-lg cursor-pointer transition hover:opacity-90 hover:bg-gray-200" :class="modal.cancelColor"
                :style="`background-color: ${modal.cancelBackground} !important; color: ${modal.cancelColor} !important;`"
                    v-if="modal.cancelText">{{ modal.cancelText }}</button>
                <button @click.prevent="confirm" class="px-5 sm:whitespace-nowrap py-2 rounded-lg cursor-pointer transition hover:opacity-90" :class="modal.confirmColor"
                :style="`background-color: ${modal.confirmBackground} !important; color: ${modal.confirmColor} !important;`"
                    v-if="modal.confirmText">{{ modal.confirmText }}</button>
            </div>
        </div>
</div></template>