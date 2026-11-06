import { createApp } from 'vue'
import { createPinia } from 'pinia';
import AnalyticsChart from '@views/DashboardWidget.vue'

const el = document.getElementById('wp-dark-mode-dashboard-widget');

if (el) {
	const app = createApp(AnalyticsChart)
	app.use(createPinia())
	app.mount(el)
}
