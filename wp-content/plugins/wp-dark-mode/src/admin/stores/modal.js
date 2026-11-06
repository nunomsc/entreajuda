import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

// The grand WP Dark Mode Store
export default defineStore('useModal', () => {

	const isLocked = ref( ! wp_dark_mode_admin_json.is_ultimate || true)

	const showProModal = () => {
		window.WPDarkModePromo.show()
	}

	/**
	 * In-plugin Popup Modal
	 */
	const defaultModalConfig = {
		open: false,
		color: 'primary',
		title: '',
		message: '',
		confirmText: '',
		cancelText: '',
		confirmColor: '#fff',
		confirmBackground: '#EF4444',

		cancelColor: '#0F172A',
		cancelBackground: '#F1F5F9',
		size: 'md',
		classes: '',
		closeButton: true,
		titleColor: 'black',
		confirm: () => { },
		cancel: () => { },
	}

	const modal = reactive({})

	// show modal
	const showModal = (data) => {
		const newData = Object.assign({}, defaultModalConfig, data)
		for (const key in newData) {
			modal[key] = newData[key]
		}
		modal.open = true
	}

	// hide modal
	const hideModal = () => {
		modal.open = false
	}


	// export all the functions and variables 
	return {
		isLocked,
		showProModal,
		modal,
		showModal,
		hideModal,
	}
})