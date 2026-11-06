<script setup>
import { computed } from 'vue';
import { useTranslation } from '../../composables/useTranslation';

const { t } = useTranslation();
const DARK_MODE_IMAGE = ImagePath => `${wp_dark_mode_admin_json.url.images}${ImagePath}`;

const Features = [
    t('f1'),
    t('f2'),
    t('f3'),
    t('f4'),
    t('f5'),
    t('f6'),
    t('f7'),
    t('f8'),
    t('f9'),
    t('f10'),
    t('f11'),
    t('f12')
];

const Free = 4;

const open = link => {
    window.open(link, '_blank');
}
const isUltimate = computed(() => [1, '1', true, 'true'].includes( wp_dark_mode_admin_json.is_ultimate ))

</script>

<template>
    <Row transparent gap="8">
        <Row gap="2" transparent class="text-center">
            <h2 class="font-semibold text-xl text-gray-800">{{ t('upgrade_to_ultimate') }}</h2>
            <Hints>{{ t('compare_hints') }}</Hints>
        </Row>

        <div class="flex justify-between  w-full max-w-6xl mx-auto bg-white shadow rounded-md overflow-hidden border border-gray-200">
          
            <!-- feature list column  -->
            <div class="flex flex-col flex-grow">

                <!-- header -->
                <div class="border border-gray-100 border-y-transparent px-2 md:px-6 h-20 flex md:pt-4 items-center md:items-start">
                    <h2 class="text-sm font-medium">{{ t('feature_list') }}</h2>
                </div>

                <!-- data  -->
                <div v-for="Feature in Features" class="flex items-center gap-2 px-2 md:px-6 h-14 md:h-12 border border-gray-100  border-l-transparent border-b-transparent last:border-b-gray-100 first:border-t-transparent">
                    <span class="hidden sm:inline-flex"><span class="inline-flex w-1.5 h-1.5 rounded-full bg-blue-500"></span></span>
                    <span class="text-sm font-li text-gray-700" v-html="Feature"></span>
                </div>


            </div>

            <!-- free plan column  -->
            <div class="flex flex-col flex-1">

                <!-- header  -->
                <div class="flex flex-col items-center justify-center gap-0.5 font-medium h-20 px-2 md:px-4 border border-gray-100 border-y-transparent border-l-transparent">
                    <span class="text-xs whitespace-nowrap hidden md:flex">{{ t('wp_dark_mode') }}</span>
                    <span class="text-sm md:text-base flex items-center gap-1 text-gray-700 font-semibold">{{ t('free') }} <span class="hidden md:flex">{{ t('plan') }}</span></span>
                </div>

                <!-- data  -->
                <div v-for="index in Features.length" class="flex items-center justify-center gap-2 px-2 md:px-6  h-14 md:h-12 border border-gray-100 border-x-transparent border-b-transparent last:border-b-gray-100 first:border-t-transparent">
                    <svg v-if="index <= Free" class="w-4" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="0.5" width="17" height="17" rx="8.5" stroke="url(#paint0_linear_2384_78469)"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2703 6.23798C14.5766 6.55528 14.5766 7.06972 14.2703 7.38702L9.08174 12.762C8.77545 13.0793 8.27885 13.0793 7.97256 12.762L4.72972 9.40265C4.42343 9.08535 4.42343 8.5709 4.72972 8.2536C5.03601 7.9363 5.53261 7.9363 5.83891 8.2536L8.52715 11.0385L13.1611 6.23798C13.4674 5.92067 13.964 5.92067 14.2703 6.23798Z" fill="url(#paint1_linear_2384_78469)"/>
                        <defs>
                        <linearGradient id="paint0_linear_2384_78469" x1="3.53722" y1="-0.68978" x2="14.8909" y2="14.3524" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#2B75CC"/>
                        <stop offset="1" stop-color="#1A50DD"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_2384_78469" x1="6.18734" y1="5.73175" x2="9.9801" y2="12.9102" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#2B75CC"/>
                        <stop offset="1" stop-color="#1A50DD"/>
                        </linearGradient>
                        </defs>
                    </svg>

                    <svg v-else class="w-4" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" fill="#FFEFF3" stroke="#FA628B"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.14665 5.14658C5.34216 4.95111 5.65911 4.95114 5.85458 5.14665L8.9994 8.29207L12.1455 5.14658C12.341 4.95111 12.6579 4.95114 12.8534 5.14665C13.0489 5.34216 13.0489 5.65911 12.8533 5.85458L9.70763 8.9997L12.8534 12.1455C13.0489 12.3409 13.0489 12.6579 12.8534 12.8534C12.6579 13.0489 12.3409 13.0489 12.1455 12.8534L9 9.70793L5.85455 12.8534C5.65906 13.0489 5.34211 13.0489 5.14662 12.8534C4.95113 12.6579 4.95113 12.3409 5.14662 12.1455L8.29177 9.0003L5.14658 5.85452C4.95111 5.65901 4.95114 5.34206 5.14665 5.14658Z" fill="#FA628B"/>
                        </svg>                        
                </div>

            </div>

            <!-- ultimate plan column -->
            <div class="flex flex-col flex-1">
                <!-- header  -->
                <div class="flex flex-col items-center justify-center gap-0.5 bg-gradient-to-t from-blue-700 rounded-tr-md to-blue-600 text-white font-medium h-20 px-2 md:px-4 border border-blue-600 border-y-transparent border-l-transparent">
                    <span class="text-xs whitespace-nowrap hidden md:flex">{{ t('wp_dark_mode') }}</span>
                    <span class="text-sm md:text-base font-semibold flex items-center gap-1">{{ t('ultimate') }} <span class="hidden md:flex">{{ t('plan') }}</span></span>
                </div>

                <!-- data  -->
                <div v-for="Feature in Features" class="flex items-center gap-2 justify-center pxx-2 md:px-6  h-14 md:h-12 border border-gray-100 border-b-transparent first:border-t-transparent border-r-transparent">
                    <svg class="w-4" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="18" height="18" rx="9" fill="url(#paint0_linear_2384_78417)"/>
                        <rect width="18" height="18" rx="9" fill="url(#paint1_linear_2384_78417)"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7703 6.23798C14.0766 6.55528 14.0766 7.06972 13.7703 7.38702L8.58174 12.762C8.27545 13.0793 7.77885 13.0793 7.47256 12.762L4.22972 9.40265C3.92343 9.08535 3.92343 8.5709 4.22972 8.2536C4.53601 7.9363 5.03261 7.9363 5.33891 8.2536L8.02715 11.0385L12.6611 6.23798C12.9674 5.92067 13.464 5.92067 13.7703 6.23798Z" fill="white"/>
                        <defs>
                        <linearGradient id="paint0_linear_2384_78417" x1="10.5" y1="-3.5" x2="20.585" y2="11.9263" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#C66AFE"/>
                        <stop offset="1" stop-color="#FF6BA7"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_2384_78417" x1="3.03722" y1="-0.68978" x2="14.3909" y2="14.3524" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#2B75CC"/>
                        <stop offset="1" stop-color="#1A50DD"/>
                        </linearGradient>
                        </defs>
                        </svg>
                        
                </div>


                <!-- upgrade button  -->
               <div class="hidden md:flex items-center justify-center h-24 border border-gray-100 ">
                <button class="wp-dark-mode-locked inline-flex px-10 py-3 whitespace-nowrap text-white bg-gradient-to-t from-blue-700 to-blue-500 rounded-full font-medium text-sm  transition hover:opacity-90">
                    {{ isUltimate ? t('current_plan') : t('upgrade_now') }}
                </button>
               </div>
            </div>
        </div>

        <!-- mobile upgrade button  -->
        <div class="flex md:hidden items-center justify-center">
            <button class="wp-dark-mode-locked inline-flex px-10 py-3 whitespace-nowrap text-white bg-gradient-to-t from-blue-700 to-blue-500 rounded-full font-medium text-sm  transition hover:opacity-90">
                {{ isUltimate ? t('current_plan') : t('upgrade_now') }}
            </button>
        </div>

        <!-- upgrade  -->

        <Row gap="5" transparent class="wp-dark-mode-ignore bg-black p-6 md:p-10 rounded-md text-white w-full max-w-7xl mx-auto bg-center bg-no-repeat bg-cover" :style="`background: url(${DARK_MODE_IMAGE('/get-started/upgrade-bg.png')});`">
            <span class="text-2xl sm:text-[30px] sm:leading-9 font-semibold w-full max-w-sm text-white whitespace-nowrap">{{ t('unsure_upgrade') }}</span>
            <div class="font-normal text-sm leading-5 w-full max-w-md">{{ t('unsure_upgrade_desc') }}</div>
            <div>
                <button @click="open('https://go.wppool.dev/0LP')" class="flex  text-base leading-6 font-medium items-center px-5 py-2 rounded bg-gradient-to-b from-[#FF6635] to-[#FF426F]">
                    {{ t('try_live_demo') }} <Icon name="chevron" class="rotate-[-90deg]" /></button>
            </div>
        </Row>


        <div class="my-3"></div>
    </Row>
</template>