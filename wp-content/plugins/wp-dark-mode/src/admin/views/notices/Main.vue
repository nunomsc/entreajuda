<script setup>
import { computed } from 'vue';
import RatingNotice from './RatingNotice.vue';
import UpgradeNotice from './UpgradeNotice.vue';
import AffiliateNotice from './AffiliateNotice.vue';

const showNotice = computed(() => {
    return wp_dark_mode_admin_json.additional.show_upgrade_notice || wp_dark_mode_admin_json.additional.show_affiliate_notice || wp_dark_mode_admin_json.additional.show_rating_notice;
});
</script>

<template>
    <!-- <div class="wp-dark-mode-admin-notices" v-if="showNotice">
        <UpgradeNotice />
        <AffiliateNotice />
        <RatingNotice />
    </div> -->
</template>