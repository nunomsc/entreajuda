<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Select } from '@components'
import useVisitor from '@stores/visitor'
const visitor = useVisitor()
import { useTranslation } from '../../composables/useTranslation'
const { t } = useTranslation()

const route = useRoute()

const select = ( ) => {
    visitor.updateChart()
}

// Watch for route changes to detect when we navigate back to Analytics
watch(() => route.path, (newPath) => {
    if (newPath && newPath.includes('analytics')) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            visitor.reinitChart()
        }, 150)
    }
})

onMounted(() => {
    // Initial chart render
    visitor.reinitChart()
})
</script>

<template>
    <div class="relative">
        <!-- main chart  -->
        <div class="flex justify-between items-center">
            <Heading>{{ t('wp_dark_mode_usage') }}</Heading>
            <div class="w-fit">
                <Select v-model="visitor.reportInterval" :options="visitor.reportIntervals" @select="select"></Select>
            </div>
        </div>
        <canvas ref="ctx" id="wp-dark-mode-chart" class="w-full max-w-xl mx-auto h-auto"></canvas>
    </div>
</template>
