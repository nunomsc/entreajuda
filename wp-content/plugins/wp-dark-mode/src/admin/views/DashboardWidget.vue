<script setup>
import { ref } from 'vue'
import { Select } from '@components'
import useVisitor from '@stores/visitor'
const visitor = useVisitor()


const select = () => {
    visitor.updateChart()
}
</script>

<template>
    <div class="relative">
<!-- 
        <div class="wp-dark-mode-dashboard-widget-overlay">
            <div class="wp-dark-mode-dashboard-widget-overlay-inner">
                <div>View <strong>Dark Mode Usages</strong><br /> inside WordPress Dashboard <br />
                    <p>Upgrade to ultimate to get access to reports</p>
                </div>
                <button class="wp-dark-mode-locked"><svg width="11" height="14" viewBox="0 0 11 14" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8.45 5.05H3.25V3.75C3.25 3.23 3.445 2.775 3.835 2.385C4.615 1.605 5.85 1.605 6.565 2.385C6.825 2.645 6.955 2.97 7.085 3.295C7.15 3.62 7.54 3.815 7.865 3.75C8.19 3.685 8.45 3.295 8.32 2.97C8.19 2.385 7.865 1.865 7.475 1.475C6.89 0.825 6.045 0.5 5.2 0.5C3.38 0.5 1.95 1.93 1.95 3.75V5.05C0.845 5.05 0 5.895 0 7V11.55C0 12.655 0.845 13.5 1.95 13.5H8.45C9.555 13.5 10.4 12.655 10.4 11.55V7C10.4 5.895 9.555 5.05 8.45 5.05ZM5.85 10.25C5.85 10.64 5.59 10.9 5.2 10.9C4.81 10.9 4.55 10.64 4.55 10.25V8.3C4.55 7.91 4.81 7.65 5.2 7.65C5.59 7.65 5.85 7.91 5.85 8.3V10.25Z"
                            fill="white" />
                    </svg> Upgrade Now</button>
            </div>
        </div> -->

        <!-- main chart  -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0;">
            <h3>WP Dark Mode Usage</h3>
            <div class="w-fit">
                <select v-model="visitor.reportInterval" @change="select">
                    <option v-for="(label, opt) in visitor.reportIntervals" :value="opt">{{ label }}</option>
                </select>
            </div>
        </div>
        <canvas id="wp-dark-mode-chart" ref="ctx" class="w-full max-w-xl mx-auto h-full"></canvas>
    </div>
</template>
