<script setup>
import { Hints, Heading, MultiSelect, SectionHead } from '@components'
import DarkModeStore from '@o/store'
import useContents from '@stores/contents'
import { getSlugColor } from '@o/helper'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
const { options } = DarkModeStore()
const $contents = useContents()
</script>

<template>
    <Row transparent gap="6"> <SectionHead class="text-lg"> {{ t('exclude_pages_posts') }} <template #description>
        {{ t('exclude_pages_posts_desc') }}</template>
        </SectionHead>

        <Row transparent>
            <Row inline transparent class="items-center" gap="2">
                <div class="text-sm font-normal text-gray-700">{{ t('exclude_post_type') }}</div>
                <span class="text-sm leading-5 font-normal px-3 py-1 rounded-full border-transparent"
                    v-for="(label, postType) in $contents.postTypes" :key="postType" :class="getSlugColor(postType)">{{ label
                    }}</span>
            </Row>
            <Row class="flex-col sm:flex-row" space>
                <Heading class="whitespace-nowrap">
                    <Row inline center>
                        <Row locked :ProBadge="false"  class="whitespace-nowrap">{{ t('exclude_pages_posts') }}</Row> <ProBadge />
                    </Row>
                </Heading>
                <Row class="w-full" locked>
                    <Row>
                        <MultiSelect :items="$contents.posts" group="type" :groups="$contents.postTypes"
                            :placeholder="t('enter_pages_posts_placeholder')"
                            v-model="options.excludes_posts" :disabled="options.excludes_posts_all" />
                        <Hints>{{ t('exclude_pages_posts_hints') }}</Hints>
                    </Row>
                    <Row inline class="pt-[10px] text-sm"><span class="font-semibold">{{ t('exclude_all') }}</span>
                        <Toggle v-model="options.excludes_posts_all">{{ t('except') }}</Toggle>
                    </Row>
                    <Row>
                        <MultiSelect :items="$contents.posts" group="type" :groups="$contents.postTypes"
                            :placeholder="t('enter_pages_posts_placeholder')"
                            v-model="options.excludes_posts_except" :disabled="!options.excludes_posts_all" />
                        <Hints>{{ t('exclude_pages_posts_only_on_selected_hints') }}</Hints>
                    </Row>
                </Row>
            </Row>
        </Row>
        <Row transparent>
            <Row inline transparent class="items-center justify-start" gap="2">
                <div class="text-sm font-normal text-gray-700">{{ t('exclude_taxonomy_type') }}</div>
                <span class="text-sm leading-5 font-normal px-3 py-1 rounded-full border-transparent"
                    v-for="(label, postType) in $contents.taxonomies" :key="postType" :class="getSlugColor(postType)">{{ label
                    }}</span>
            </Row>
            <Row class="flex-col sm:flex-row" space>
                <Heading class="whitespace-nowrap">
                    <Row inline center>
                        <Row locked :ProBadge="false"  class="whitespace-nowrap">{{ t('exclude_taxonomies') }}</Row> <ProBadge />
                    </Row>
                </Heading>
                <Row class="w-full" locked>
                    <MultiSelect :placeholder="t('enter_categories_tags_placeholder')" :items="$contents.terms" group="tax"
                        :groups="$contents.taxonomies" v-model="options.excludes_taxonomies"
                        :disabled="options.excludes_taxonomies_all" />
                    <Hints>{{ t('exclude_taxonomies_hints') }}</Hints>
                    <Row inline class="pt-[10px] text-sm"><strong>{{ t('exclude_all') }}</strong>
                        <Toggle v-model="options.excludes_taxonomies_all">{{ t('except') }}</Toggle>
                    </Row>
                    <MultiSelect :placeholder="t('enter_categories_tags_placeholder')" :items="$contents.terms" group="tax"
                        :groups="$contents.taxonomies" v-model="options.excludes_taxonomies_except"
                        :disabled="!options.excludes_taxonomies_all" />
                    <Hints>{{ t('exclude_pages_posts_only_on_selected_hints') }}</Hints>
                </Row>
            </Row>
        </Row>
    </Row>
</template>
