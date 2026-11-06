<script setup>
import { ref } from 'vue'
import { Close } from '@components'
import API from '@o/api';
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const showNotice = ref(wp_dark_mode_admin_json.additional.show_affiliate_notice)

const hideNotice = async () => {
    showNotice.value = false

    const response = await API.post('/notice', {
        notice: 'affiliate',
        remind: 'never'
    })

    // update the notice
    wp_dark_mode_admin_json.additional.show_affiliate_notice = false

    
}


</script>

<template>
    <div v-if="showNotice" class="wp-dark-mode-notice">
        
        <!-- rating notice  -->
        <div class="wp-dark-mode-notice-wrapper">
            
            <!-- close  -->
            <Close @click="hideNotice" />
        
        <!-- logo  -->
            <div class="notice-logo">
                <div>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.9994 7.99199e-06C16.0909 -0.003487 12.2671 1.13939 9.00161 3.28714C5.73607 5.4349 3.17212 8.49321 1.6272 12.0835C0.0822806 15.6737 -0.375775 19.6382 0.309752 23.4861C0.995279 27.3341 2.79428 30.8965 5.48403 33.7323L4.6148 40H19.9994C25.3037 40 30.3908 37.8929 34.1415 34.1421C37.8923 30.3914 39.9994 25.3043 39.9994 20C39.9994 14.6957 37.8923 9.6086 34.1415 5.85787C30.3908 2.10714 25.3037 7.99199e-06 19.9994 7.99199e-06Z" fill="#CFB8F7"/>
                        <path d="M35.5887 7.48803C31.9038 4.5234 27.287 2.96167 22.5591 3.08054C17.8311 3.1994 13.2986 4.99116 9.76736 8.13722C6.23612 11.2833 3.93506 15.5797 3.27332 20.2626C2.61159 24.9455 3.63207 29.7113 6.15332 33.7126L4.61486 40.0003H19.9995C23.7697 40.0026 27.4637 38.9386 30.655 36.931C33.8463 34.9233 36.4046 32.0541 38.0347 28.6544C39.6648 25.2548 40.3001 21.4634 39.8673 17.7181C39.4345 13.9728 37.9512 10.4263 35.5887 7.48803Z" fill="#9660F1"/>
                        <path d="M18.461 15.3841V10.7687C18.461 9.54463 18.9473 8.37069 19.8128 7.50514C20.6784 6.63958 21.8523 6.15332 23.0764 6.15332C23.4844 6.15332 23.8757 6.31541 24.1643 6.60393C24.4528 6.89244 24.6149 7.28376 24.6149 7.69178V10.7687C24.6149 12.4008 25.2632 13.9661 26.4173 15.1201C27.5714 16.2742 29.1366 16.9226 30.7687 16.9226V27.6918H26.1533L24.4287 29.4164C24.0001 29.8452 23.4911 30.1853 22.931 30.4174C22.3708 30.6494 21.7704 30.7688 21.1641 30.7687H12.3072C11.4911 30.7687 10.7085 30.4445 10.1315 29.8675C9.55443 29.2905 9.23026 28.5078 9.23026 27.6918V18.461C9.23026 17.645 9.55443 16.8623 10.1315 16.2853C10.7085 15.7083 11.4911 15.3841 12.3072 15.3841H18.461Z" fill="#F9E9DC"/>
                        <path d="M24.4271 29.4166L26.1533 27.692H30.7687V16.9228C29.1366 16.9228 27.5713 16.2744 26.4173 15.1204C25.2632 13.9663 24.6148 12.401 24.6148 10.7689V9.23047C23.7988 9.23047 23.0162 9.55464 22.4391 10.1317C21.8621 10.7087 21.5379 11.4913 21.5379 12.3074V18.4612H13.8456C13.4376 18.4612 13.0463 18.6233 12.7577 18.9118C12.4692 19.2004 12.3071 19.5917 12.3071 19.9997V30.7689H21.1641C22.388 30.7687 23.5618 30.2822 24.4271 29.4166Z" fill="#F4D9C1"/>
                    </svg>  
                </div>
            </div>
            <!-- content  -->
            <div class="notice-content">
                <div class="flex items-center justify-between gap-3">
                    <div class="text-gray-700  leading-7 text-center sm:text-left">
                        {{ t('affiliate_text') }}
                    </div>
                </div>
                
                <div class="flex flex-col gap-0 ">
                    <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 font-semibold">

                        <a href="https://go.wppool.dev/Tfej" @click="hideNotice()"  style="border: 1px solid" target="_blank" class="wp-dark-mode-flex items-center gap-2 text-sm bg-transparent whitespace-nowrap text-[#7C3AED] px-4 py-2 rounded-lg  border ring-purple-500 hover:bg-purple-100 transition duration-100 hover:opacity-100 text-center no-underline"  @mouseleave="cursorOn = false">
                            {{ t('affiliate_program') }}
                        </a>
                        <a href="https://go.wppool.dev/zfrO" @click="hideNotice()"  style="border: 1px solid" target="_blank" class="wp-dark-mode-flex items-center gap-2 text-sm uppercase no-underline bg-[#7C3AED] text-white px-4 py-2 rounded-lg border border-purple-500  transition duration-100 whitespace-nowrap  text-center"  @mouseleave="cursorOn = false">
                            {{ t('influencer_program') }} 
                            <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 4.5C-1.81059e-08 4.08579 0.335786 3.75 0.75 3.75L13.3401 3.75L11.2397 1.7996C10.9361 1.51775 10.9186 1.0432 11.2004 0.739665C11.4823 0.436132 11.9568 0.418556 12.2603 0.700408L15.7603 3.95041C15.9132 4.09232 16 4.29145 16 4.5C16 4.70855 15.9132 4.90769 15.7603 5.0496L12.2603 8.2996C11.9568 8.58145 11.4823 8.56387 11.2004 8.26034C10.9186 7.95681 10.9361 7.48226 11.2397 7.20041L13.3401 5.25L0.75 5.25C0.335786 5.25 1.81059e-08 4.91422 0 4.5Z" fill="white"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>
te>