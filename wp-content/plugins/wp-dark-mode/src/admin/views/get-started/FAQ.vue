<script setup>
import { FAQ } from '@components';
import { useTranslation } from '../../composables/useTranslation';
import UpgradeFooter from '@c/UpgradeFooter.vue';

const { t } = useTranslation();
</script>

<template>
    <Row transparent gap="8">
        <Row gap="2" transparent class="text-center">
            <h2 class="font-semibold text-xl text-gray-800">{{ t('frequently_asked_questions') }}</h2>
            <Hints>{{ t('faq_hints') }}</Hints>
        </Row>

        <Row transparent>
            <FAQ :title="t('q1')">
                {{ t('a1_desc') }} <a href="https://wppool.dev/docs/what-is-wp-dark-mode/" target="_blank">{{ t('learn_how_to_get_started') }}</a>
              </FAQ>
          
              <FAQ :title="t('q2')">
                {{ t('a2') }}
              </FAQ>
          
              <FAQ :title="t('q3')">
                {{ t('a3') }}
              </FAQ>
          
              <FAQ :title="t('q4')">
                {{ t('a4') }}
              </FAQ>
          
              <FAQ :title="t('q5')">
                {{ t('a5') }}
              </FAQ>
          
              <FAQ :title="t('q6')">
                {{ t('a6') }}
              </FAQ>
          
              <FAQ :title="t('q7')">
                {{ t('a7') }}
              </FAQ>
          
              <FAQ :title="t('q8')">
                {{ t('a8') }} <a href="https://wppool.dev/docs/what-is-wp-dark-mode/" target="_blank">{{ t('official_documentation') }}</a> {{ t('and') }} <a href="https://www.youtube.com/watch?v=Pmso8MJRpBM&list=PLd6WEu38CQSywIb9HqXtgREY16QCB7Qj2" target="_blank">{{ t('youtube_playlist') }}</a>.
              </FAQ>
          
              <FAQ :title="t('q9')">
                {{ t('a9_part1') }} <a href="http://wppool.dev/contact" rel="nofollow" target="_blank">{{ t('customer_support_team') }}</a> {{ t('a9_part2') }}
              </FAQ>
          
              <FAQ :title="t('q10')">
                {{ t('a10') }}
              </FAQ>
 
              <FAQ :title="t('q11')">
                {{ t('a11') }} <a href="http://wppool.dev/wp-dark-mode-pricing/" target="_blank">{{ t('pricing_page') }}</a>.
              </FAQ>
        </Row>

        <UpgradeFooter  v-if="isLocked" />
    </Row>
</template>