<script setup>
import { Hints, Heading, MultiSelect, Alert, SectionHead } from '@components'
import DarkModeStore from '@o/store'
import useContents from '@stores/contents'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options } = DarkModeStore()
const $contents = useContents()

const isWCInstalled = wp_dark_mode_admin_json.wc.is_installed
const isWCActive = wp_dark_mode_admin_json.wc.is_active
</script>

<template>
    <Row transparent gap="6">
        <SectionHead  class="text-lg"> {{ t('exclude_woocommerce') }} <template #description>
             {{ t('exclude_woocommerce_desc') }}
            </template>
        </SectionHead>
        <Alert color="orange" v-if="!isWCInstalled || !isWCActive"> {{ isWCInstalled ? t('woocommerce_not_active') :
            t('woocommerce_not_installed') }}.  {{ isWCInstalled ? t('activate_woocommerce_hints') : t('install_woocommerce_hints') }}  </Alert>
        <Row class="flex-col sm:flex-row" space :disabled="!isWCInstalled || !isWCActive">
           
            <Heading class="whitespace-nowrap">
                <Row inline center>
                    <Row locked :ProBadge="false"  class="whitespace-nowrap">{{ t('exclude_wc_products') }}</Row> <ProBadge />
                </Row>
            </Heading>
            <Row class="w-full" locked>
                <MultiSelect :items="$contents.products" v-model="options.excludes_wc_products"
                    :placeholder="t('enter_wc_products_placeholder')" :disabled="options.excludes_wc_products_all" />
                <Hints>{{ t('exclude_wc_products_hints') }}</Hints>
                <Row inline class="pt-[10px] text-sm"><span class="font-semibold">{{ t('exclude_all') }}</span>
                    <Toggle v-model="options.excludes_wc_products_all">{{ t('except') }}</Toggle>
                </Row>
                <MultiSelect :items="$contents.products" v-model="options.excludes_wc_products_except"
                    :placeholder="t('enter_wc_products_placeholder')" :disabled="!options.excludes_wc_products_all" />
                <Hints>{{ t('exclude_wc_products_only_selected_hints') }}</Hints>
            </Row>
        </Row>
        <Row class="flex-col sm:flex-row" space :disabled="!isWCInstalled || !isWCActive">
       
            <Heading class="whitespace-nowrap">
                <Row inline center>
                    <Row locked :ProBadge="false"  class="whitespace-nowrap">{{ t('exclude_wc_categories') }}</Row> <ProBadge />
                </Row>
            </Heading>
            <Row class="w-full" locked>
                <MultiSelect :items="$contents.productCategories" v-model="options.excludes_wc_categories"
                    :placeholder="t('enter_wc_categories_placeholder')"
                    :disabled="options.excludes_wc_categories_all" />
                <Hints>{{ t('exclude_wc_categories_hints') }}</Hints>
                <Row inline class="pt-[10px] text-sm"><span class="font-semibold">{{ t('exclude_all') }}</span>
                    <Toggle v-model="options.excludes_wc_categories_all">{{ t('except') }}</Toggle>
                </Row>
                <MultiSelect :items="$contents.productCategories" v-model="options.excludes_wc_categories_except"
                    :placeholder="t('enter_wc_categories_placeholder')" :disabled="!options.excludes_wc_categories_all" />
                <Hints>{{ t('exclude_wc_categories_only_selected_hints') }}</Hints>
            </Row>
        </Row>
    </Row>
</template>
