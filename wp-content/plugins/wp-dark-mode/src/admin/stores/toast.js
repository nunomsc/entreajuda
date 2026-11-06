import { reactive, computed } from 'vue'

/**
 * Simple Toast Store
 */

const Toast = {

	// The state
	state: reactive({
		isOpen: false,
		type: 'success',
		message: 'Saved Successfully',
		timeout: null 
	}),

	// Open the toast
	open (data = {}, timer = 3000) {
		clearTimeout(Toast.timeout)
		Toast.state.isOpen = true
		Toast.state.message = data.message || data
		Toast.state.type = data.type || 'success'

		if (timer) {
			Toast.timeout = setTimeout(() => {
				Toast.close()
			}, timer)
		}
	},

	// Close the toast
	close () {
		clearTimeout(Toast.timeout)
		Toast.state.isOpen = false
		Toast.state.message = ''
	},

	// Computed
	message: computed(() => Toast.state.message),
	isOpen: computed(() => Toast.state.isOpen),
	type: computed(() => Toast.state.type),

}

export default Toast