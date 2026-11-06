<script setup>
import { ref } from 'vue'
import { Close } from '@components'
import API from '@o/api';
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const showNotice = ref(wp_dark_mode_admin_json.additional.show_upgrade_notice)

const hideNotice = async () => {
    showNotice.value = false

    const response = await API.post('/notice', {
        notice: 'upgrade',
        remind: 'never'
    })

    // update the notice
    wp_dark_mode_admin_json.additional.show_upgrade_notice = false

    
}

const isUltimate = [1, '1', true, 'true'].includes(wp_dark_mode_admin_json.is_ultimate)
</script>

<template>
    <div v-if="showNotice && !isUltimate" class="wp-dark-mode-notice">

        <!-- rating notice  -->
        <div class="wp-dark-mode-notice-wrapper upgrade-notice">
            <!-- close  -->
            <Close @click="hideNotice"></Close>
            <!-- logo  -->
            <div class="notice-logo">
                <div>
                    <svg width="47" height="38" viewBox="0 0 47 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.3524 38L0 12.0936L8.11266 0H38.2321L46.3291 12.0705L23.3524 38Z" fill="#FF3997"/>
                        <path d="M23.3582 37.9934L46.329 12.0705L38.2321 0H23.3582V37.9934Z" fill="#D6298C"/>
                        <path d="M0 12.0938L23.3524 38.0001L46.264 12.1445L0 12.0938Z" fill="#FF5CA8"/>
                        <path d="M23.358 12.1191V37.9933L46.264 12.1442L23.358 12.1191Z" fill="#FF3997"/>
                        <path d="M23.3523 38.0002L13.7462 12.1445H32.6386L23.3523 38.0002Z" fill="#FF3997"/>
                        <path d="M32.6387 12.1443H13.7462L23.3586 0L32.6387 12.1443Z" fill="#D6298C"/>
                        <path d="M0 12.0936L13.7463 12.1443L8.11265 0L0 12.0936Z" fill="#D6298C"/>
                        <path d="M46.3849 12.0936L32.6387 12.1443L38.2724 0L46.3849 12.0936Z" fill="#FF5CA8"/>
                        <path d="M23.3582 12.1445V37.9841L32.6388 12.1445H23.3582Z" fill="#D6298C"/>
                        <path d="M23.3582 0.000976562V12.1443H32.6388L23.3582 0.000976562Z" fill="#BF1B81"/>
                        <path d="M46.385 12.0936L32.6388 12.1443L38.2725 0L46.385 12.0936Z" fill="#BF1B81"/>
                    </svg>
                </div>
            </div>
            <!-- content  -->
            <div class="notice-content">
                <div class="notice-header">
                    <div class="text-gray-700  leading-7 text-base" v-html="t('ultimate_features')">
                    </div>
                </div>
                
                <div class="notice-text">
                    <div class="flex flex-col sm:flex-row gap-2">
                        <a href="https://go.wppool.dev/LaSV" target="_blank" class="no-underline wp-dark-mode-flex items-center gap-2 text-sm uppercase bg-pink-500 text-white px-4 py-2 rounded-lg border border-pink-500  transition duration-100  hover:opacity-100"  style="border: 1px solid"  @mouseleave="cursorOn = false">
                            {{ t('upgrade_now') }} <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 4.5C-1.81059e-08 4.08579 0.335786 3.75 0.75 3.75L13.3401 3.75L11.2397 1.7996C10.9361 1.51775 10.9186 1.0432 11.2004 0.739665C11.4823 0.436132 11.9568 0.418556 12.2603 0.700408L15.7603 3.95041C15.9132 4.09232 16 4.29145 16 4.5C16 4.70855 15.9132 4.90769 15.7603 5.0496L12.2603 8.2996C11.9568 8.58145 11.4823 8.56387 11.2004 8.26034C10.9186 7.95681 10.9361 7.48226 11.2397 7.20041L13.3401 5.25L0.75 5.25C0.335786 5.25 1.81059e-08 4.91422 0 4.5Z" fill="white"/>
                                </svg>
                        </a>
                        <a href="/wp-admin/admin.php?page=wp-dark-mode-get-started#/compare" class="no-underline wp-dark-mode-flex items-center gap-2 text-sm bg-transparent text-pink-600 px-4 py-2 rounded-lg  border border-pink-500 hover:bg-pink-100 transition duration-100 hover:opacity-100" style="border: 1px solid"  @mouseleave="cursorOn = false">
                            {{ t('learn_more') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.upgrade-notice2 {
    display: flex;
    width: calc( 100% - 40px );
}
</style>

<style scoped>
.upgrade-notice2 {
    display: flex;
    width: calc( 100% - 40px );
}
</style>