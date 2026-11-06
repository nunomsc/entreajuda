  
<script setup>
import { ref, computed, onMounted } from 'vue';
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation';

const { state, setState } = DarkModeStore()
const { t } = useTranslation();

const to = ref('support@wppool.dev')
const copied = ref('')

const Link = computed(() => {
    return {
        Gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${to.value}&su=&cc=&bcc=&body=`,
        Outlook: `https://outlook.office.com/owa/?path=/mail/action/compose&to=${to.value}&subject=&body=`,
        Yahoo: `https://compose.mail.yahoo.com/?to=${to.value}&subject=&cc=&bcc=&body=`,
    };
});

const copyEmail = async () => {
    await navigator.clipboard.writeText(to.value);
    copied.value = `<em class="text-green-600 hover:text-white">${t('copied_to_clipboard')}</em>`;
    setTimeout(() => {
        copied.value = "";
    }, 2000);
};

const Icon = computed(() => {
    return {
        Gmail: wp_dark_mode_admin_json.url.ultimate + "assets/images/icons/gmail.svg",
        Yahoo: wp_dark_mode_admin_json.url.ultimate + "assets/images//yahoo.svg",
        Outlook: wp_dark_mode_admin_json.url.ultimate + "assets/images//outlook.svg",
        Browser: wp_dark_mode_admin_json.url.ultimate + "assets/images//browser.svg",
        Copy: wp_dark_mode_admin_json.url.ultimate + "assets/images//copy.svg",
    };
});


const close = () => {
    setState('showMailTo', false)
}

onMounted(() => {
    setTimeout(() => {
        const el = document.querySelector('.mailto')
        el && el.focus()
    }, 100)
})

</script>

<template>
    <div class="fixed top-0 left-0 h-full w-full bg-slate-600 opacity-50"  @click.prevent="close" v-if="state.showMailTo"></div>
    <transition name="fade" v-if="state.showMailTo">
        <div tabindex="1" @keydown.esc.prevent="close()" class="
        mailto
          fixed
          z-50
          top-1/2
          left-1/2
          transform
          -translate-x-1/2 -translate-y-1/2
          w-full max-w-xs
          bg-slate-100
          shadow-xl
          rounded-md
        ">
            <div class="py-4 w-full flex items-center justify-between">
                <div class="w-6"></div>
                <Heading class="text-lg mb-0"> {{ t('compose_new_email') }} </Heading>
                <div @click.prevent="close" class="px-3 cursor-pointer opacity-30 hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 fill-current" viewBox="0 0 16 16">
                        <path
                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </div>
            </div>
            <div class="flex flex-col gap-1.5 p-3 pt-2 text-sm tracking-wide">
                <a class="
              flex
              items-center
              gap-2
              cursor-pointer
              text-slate-600
              px-4
              py-3
              bg-white
              rounded-sm
              hover:bg-blue-600 hover:text-slate-50
              transition
              duration-75
              font-medium
              tracking-wide
            " :href="Link.Gmail" target="_blank" rel="nofollow">
                    <img :src="Icon.Gmail" class="w-6" />
                    <span>{{ t('gmail_browser') }}</span>
                </a>
                <a class="
              flex
              items-center
              gap-2
              cursor-pointer
              text-slate-600
              px-4
              py-3
              bg-white
              rounded-sm
              hover:bg-blue-600 hover:text-slate-50
              transition
              duration-75
              font-medium
              tracking-wide
            " :href="Link.Outlook" target="_blank" rel="nofollow">
                    <img :src="Icon.Outlook" class="w-6" />
                    <span>{{ t('outlook_browser') }}</span>
                </a>
                <a class="
              flex
              items-center
              gap-2
              cursor-pointer
              text-slate-600
              px-4
              py-3
              bg-white
              rounded-sm
              hover:bg-blue-600 hover:text-slate-50
              transition
              duration-75
              font-medium
              tracking-wide
            " :href="Link.Yahoo" target="_blank" rel="nofollow">
                    <img :src="Icon.Yahoo" class="w-6" />
                    <span>{{ t('yahoo_browser') }}</span>
                </a>
                <a class="
              flex
              items-center
              gap-2
              cursor-pointer
              text-slate-600
              px-4
              py-3
              bg-white
              rounded-sm
              hover:bg-blue-600 hover:text-slate-50
              transition
              duration-75
              font-medium
              tracking-wide
            " :href="`mailto:${mail}`">
                    <img :src="Icon.Browser" class="w-6" />
                    <span>{{ t('default_app_browser') }}</span>
                </a>
                <div class="
              flex
              items-center
              gap-2
              cursor-pointer
              text-slate-600
              px-4
              py-3
              bg-white
              rounded-sm
              hover:bg-blue-600 hover:text-slate-50
              transition
              duration-75
              font-medium
              tracking-wide
            " @click.prevent="copyEmail">
                    <img :src="Icon.Copy" class="w-6" />
                    <div class="text-center" v-html="copied || to"></div>
                </div>
            </div>
        </div>
    </transition>
</template>
  
