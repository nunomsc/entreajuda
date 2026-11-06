import { ref, onMounted, computed } from 'vue'
import API from '@admin/other/API'
import { Chart } from 'chart.js/auto'
import { defineStore } from 'pinia'
import { useTranslation } from '@admin/composables/useTranslation'

// The grand WP Dark Mode Store
export default defineStore('useVisitor', () => {
	const { t } = useTranslation()

	const isLocked = ![true, 1, 'true', '1'].includes(wp_dark_mode_admin_json.is_ultimate)

	const reportInterval = ref(1)
	const reportIntervals = computed(() => ({
		1: t('last_24_hours'),
		7: t('last_7_days'),
		30: t('last_30_days'),
		365: t('last_1_year'),
	}))

	const chart = ref(null)
	const visitors = ref([])
	const isDummy = ref(false)
	const reinitTimer = ref(null)

	const labels = computed(() => {
		switch (Number(reportInterval.value)) {
			case 1:
			default:
				return [
					t('12_am'), t('1_am'), t('2_am'), t('3_am'), t('4_am'), t('5_am'), t('6_am'), t('7_am'), t('8_am'),
					t('9_am'), t('10_am'), t('11_am'), t('12_pm'), t('1_pm'), t('2_pm'), t('3_pm'), t('4_pm'),
					t('5_pm'), t('6_pm'), t('7_pm'), t('8_pm'), t('9_pm'), t('10_pm'), t('11_pm')
				]
			case 7:
				// Return Sunday, Monday, Tuesday, etc 
				const days = []
				const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
				for (let i = 0; i < 7; i++) {
					const date = new Date(Date.now() - (i * 24 * 60 * 60 * 1000))
					days.push(t(dayKeys[date.getDay()]))
				}

				return days.reverse()
			case 30:
				// Return 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, etc
				const days30 = []
				for (let i = 0; i < 30; i++) {
					days30.push(new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).getDate())
				}

				return days30.reverse()
			case 365:
				// Return Jan, Feb, Mar, etc
				const months = []
				const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
				for (let i = 0; i < 12; i++) {
					const date = new Date(Date.now() - (i * 30 * 24 * 60 * 60 * 1000))
					months.push(t(monthKeys[date.getMonth()]))
				}

				return months.reverse()
		}
	})

	const calculateVisitedData = (mode = 'any') => {
		switch (Number(reportInterval.value)) {
			case 1:
			default:
				// Return 00 AM to 23 PM with filtered visitors length in that hour
				const hours = []
				for (let i = 0; i < 24; i++) {
					hours.push(visitors.value ? visitors.value?.filter(visitor => {
						const date = new Date(visitor.created_at)
						return date.getHours() === i && (mode === 'any' || visitor.mode === mode)
					}).length : 0)
				}

				return hours
			case 7:
				// Return Sunday, Monday, Tuesday, etc with filtered visitors length in that day
				const days = []
				for (let i = 0; i < 7; i++) {
					days.push(visitors.value ? visitors.value.filter(visitor => {
						const date = new Date(visitor.created_at)
						return date.getDay() === i && (mode === 'any' || visitor.mode === mode)
					}).length : 0)
				}

				return days

			case 30:
				// Return 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, etc with filtered visitors length in that day
				const days30 = []
				for (let i = 0; i < 30; i++) {
					days30.push(visitors.value ? visitors.value.filter(visitor => {
						const date = new Date(visitor.created_at)
						return date.getDate() === i && (mode === 'any' || visitor.mode === mode)
					}).length : 0)
				}

				return days30

			case 365:
				// Return Jan, Feb, Mar, etc with filtered visitors length in that month
				const months = []
				for (let i = 0; i < 12; i++) {
					months.push(visitors.value ? visitors.value.filter(visitor => {
						const date = new Date(visitor.created_at)
						return date.getMonth() === i && (mode === 'any' || visitor.mode === mode)
					}).length : 0)
				}

				return months
		}
	}

	const allVisitors = computed(() => {
		return calculateVisitedData('any')
	})

	const darkModeUsers = computed(() => {
		return calculateVisitedData('dark')
	})

	const chartData = computed(() => {
		return {
			labels: labels.value,
			datasets: [
				{
					label: `${t('dark_mode_users')} (${darkModeUsers.value.reduce((a, b) => a + b, 0)})`,
					data: darkModeUsers.value,
					fill: false,
					tension: 0.1
				},
				{
					label: `${t('total_visitors')} (${visitors.value.length})`,
					data: allVisitors.value,
					fill: false,
					tension: 0.1
				}]
		}
	})

	const destroyChartForCanvas = (canvas) => {
		if (!canvas) return

		// Chart.js keeps a registry per-canvas; destroy that instance first.
		const existing = Chart.getChart(canvas)
		if (existing) {
			existing.destroy()
		}

		// Also destroy our stored reference (in case it points to a different instance)
		if (chart.value) {
			try {
				chart.value.destroy()
			} catch (e) {
				// ignore
			}
			chart.value = null
		}

		// Clear any residual pixels to avoid "ghost" drawings after reinit
		const ctx2d = canvas.getContext?.('2d')
		if (ctx2d) {
			ctx2d.clearRect(0, 0, canvas.width, canvas.height)
		}
	}

	const drawChart = (canvas) => {
		if (!canvas) return
		const ctx2d = canvas.getContext?.('2d')
		if (!ctx2d) return

		chart.value = new Chart(ctx2d, {
			type: 'line',
			data: chartData.value,
		})
	}

	const updateChart = () => {

		const canvas = document.querySelector('#wp-dark-mode-chart')
		destroyChartForCanvas(canvas)
		drawChart(canvas)
	}

	const loadVisitors = async () => {
		API.get('visitors').then(response => {
			visitors.value = response.data
		}).catch(error => {
			// If error then show dummy data
			isDummy.value = true
		}).finally(() => {
			const canvas = document.querySelector('#wp-dark-mode-chart')
			destroyChartForCanvas(canvas)
			drawChart(canvas)
		})
	}

	onMounted(() => {
		loadVisitors()
	})

	const reinitChart = () => {
		// Debounce: tab switching can trigger multiple signals (route + repaint)
		if (reinitTimer.value) {
			clearTimeout(reinitTimer.value)
		}

		// Wait for DOM to be ready and visible
		reinitTimer.value = setTimeout(() => {
			reinitTimer.value = null

			const canvas = document.querySelector('#wp-dark-mode-chart')
			if (!canvas) return

			// offsetParent is null when display:none; also guard zero-size canvas
			const isVisible = canvas.offsetParent !== null
			const hasSize = (canvas.clientWidth || 0) > 0 && (canvas.clientHeight || 0) > 0

			if (!isVisible || !hasSize) return

			destroyChartForCanvas(canvas)
			drawChart(canvas)
		}, 120)
	}

	// export all the functions and variables 
	return {
		isLocked,
		reportInterval,
		reportIntervals,
		updateChart,
		loadVisitors,
		reinitChart
	}
})