<script setup>
import { Card, Toggle, Hints, Heading, Suggestions, Button, Alert, Icon } from '@components'
import { watch } from 'vue';
import DarkModeStore from '@o/store'
import { useTranslation } from '../../composables/useTranslation';

const { options, showModal, isLocked } = DarkModeStore()
const { t } = useTranslation();

watch(() => options.menu_switch_enabled, (val) => {

    if (val === true) return;

    if( isLocked ) return;

    showModal({
        title: t('menu_visibility_title'),
        message: t('menu_visibility_msg'),
        confirmText: t('confirm'),
        cancelText: t('cancel'),
        confirmBackground: '#ef4444',
        cancel: () => {
            options.menu_switch_enabled = true
        }
    })
})

const AdminMenuLink = wp_dark_mode_admin_json.url.admin + '/nav-menus.php?action=edit'
const gotToAdminMenu = () => {
    window.open(AdminMenuLink, '_blank')
}

</script>

<template>
    <Card transparent borderless>
        <Alert color="yellow" v-if="!options.frontend_enabled"> 
            <span v-html="t('menu_switch_unavailable_msg')"></span>
            <template #button>
                <RouterLink to="/frontend"><Button color="yellow"
                        class="text-xs whitespace-nowrap bg-[#F59E0B] border-[#F59E0B]"> {{ t('enable_frontend') }}
                        <Icon name="chevronRight" />
                    </Button></RouterLink>
            </template>
        </Alert>
        <Card class="gap-6" :disabled="!options.frontend_enabled">
            <Card transparent borderless locked class="w-fit">
                <Toggle v-model="options.menu_switch_enabled" locked>{{ t('display_switch_in_menu') }}</Toggle>
                <Hints locked>{{ t('display_switch_in_menu_hints') }}</Hints>
            </Card>
            <div class="flex flex-col gap-5 items-center justify-center" v-if="options.menu_switch_enabled">
                <img :src="DARK_MODE_IMAGE('/settings/menu-switch.gif')" alt="" class="w-full max-w-xl rounded">
                <Heading bold class="items-center gap-3 w-full max-w-lg text-center">{{ t('add_to_menus_title') }} 
                    <Hints> {{ t('add_to_menus_hints') }}</Hints>
                </Heading>
                <Button outline @click.prevent="gotToAdminMenu">{{ t('go_to_menu_settings') }} <svg class="fill-current w-5"
                        viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M7.20938 14.7698C6.92228 14.4713 6.93159 13.9965 7.23017 13.7094L11.1679 10L7.23017 6.29062C6.93159 6.00353 6.92228 5.52875 7.20938 5.23017C7.49647 4.93159 7.97125 4.92228 8.26983 5.20937L12.7698 9.45937C12.9169 9.60078 13 9.79599 13 10C13 10.204 12.9169 10.3992 12.7698 10.5406L8.26983 14.7906C7.97125 15.0777 7.49647 15.0684 7.20938 14.7698Z"
                            fill="#2563EB" />
                    </svg>
                </Button>
            </div>
        </Card>
        <Suggestions paths="shortcode, excludes, accessibility"></Suggestions>
    </Card>
</template>