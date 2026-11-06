import { ref, reactive, watch, onMounted } from 'vue'
import { defineStore } from 'pinia'

import Store from '@common/Store'
import Toast from '@stores/toast'
import API from './API'

// The grand WP Dark Mode Store
export default defineStore('DarkModeStore', () => {

	/**
	 * Unlocks everything in frontend 
	 */
	const isPro = ref(wp_dark_mode_admin_json.is_ultimate || false)
	const isLocked = ref( ! wp_dark_mode_admin_json.is_ultimate )

	const showProModal = () => {
		window.WPDarkModePromo.show()
	}

	/**
	 * Temporary State to support the UI
	 */
	const state = reactive({
		sidebarCollapsed: localStorage.getItem('wp_dark_mode_sidebar_collapsed') === 'true',
		aiGeneratorOpen: false,
		aiPaletteSelected: false,
		aiPresetNameError: false,
	})

	const setState = (key, value) => {
		state[key] = value
	}
	
	const toggleSidebar = ( value = null ) => {

		if (value !== null) {
			state.sidebarCollapsed = value
		} else {
			state.sidebarCollapsed = !state.sidebarCollapsed
		}

		// save to local storage
		localStorage.setItem('wp_dark_mode_sidebar_collapsed', state.sidebarCollapsed)
	}



	/**
	 * Options
	 */
	const lastSavedOptions = JSON.parse(JSON.stringify(wp_dark_mode_admin_json.options || {})) || {}

	const options = ref(wp_dark_mode_admin_json.options || {})


	// Admin switch reactivity.
	const updateAdminSwitcher = ( enabled = false ) => {
		const switcher = document.querySelector('.wp-dark-mode-admin-bar-switch .switch')
		
		if (!switcher) {
			return
		}

		if (enabled) {
			switcher.classList.remove('hidden')

			const isSaved = Store.get('admin') === 'true';

			if (isSaved) {
				WPDarkMode.activate()
				if ( DarkModeAuto ) {
					DarkModeAuto.enable();
				}
			}

		} else {
			switcher.classList.add('hidden')
			WPDarkMode.deactivate()
			if ( DarkModeAuto ) {
				DarkModeAuto.disable();
			}
		}
	}


	/**
	 * Color Presets 
	 */
	// Create a new preset with default values
	const createPreset = () => {
		const newIndex = (options.value.color_presets.length - wp_dark_mode_admin_json.predefined_presets.length) + 1

		options.value.color_presets.push({
			name: 'New Preset ' + newIndex,
		})

		options.value.color_preset_id = options.value.color_presets.length
		
	}



	/**
	 * Watch changes in Options and Presets
	 */
	watch(options.value, () => {
		// compare options with last saved options JSON string
		state.isChanged = JSON.stringify(options._rawValue) !== JSON.stringify(lastSavedOptions)
	}, { deep: true })









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


	// Show showModal for debug
	onMounted(() => {
		// showModal({
		// 	title: 'Hello World Modal Title',
		// 	message: 'This is a test message. Do you want to continue? This is a test message. Do you want to continue? This is a test message. Do you want to continue? This is a test message. Do you want to continue? This is a test message. Do you want to continue? ',
		// 	confirmText: 'Confirm',
		// 	confirmBackground: 'red',
		// 	cancelText: 'Cancel',
		// 	cancelColor: 'gray',
		// 	confirm: () => {
		// 		Log('Confirmed');
		// 	},
		// 	cancel: () => {
		// 		Log('Canceled');
		// 	},
		// })
	})


	/**
	 * Saving Mechanism
	  */

	const getSanitizedData = () => {

		const data = JSON.parse(JSON.stringify(options._rawValue))

		// all the blank array is nullable
		for (const key in data) {
			if (Array.isArray(data[key]) && data[key].length === 0) {
				data[key] = false
			}
		} 

		return data
	}

	const saveChanges = async () => {

		// Validate AI preset name if AI generator is open
		if (state.aiGeneratorOpen && state.aiPaletteSelected) {
			const currentPresetId = options.value.color_preset_id
			const currentPreset = options.value.color_presets[currentPresetId - 1]
			if (currentPreset && (!currentPreset.name || !currentPreset.name.trim())) {
				state.aiPresetNameError = true
				return false
			}
		}
		state.aiPresetNameError = false

		// set last saved options to current options one by one
		for (const key in options.value) {
			lastSavedOptions[key] = getSanitizedData()[key]
		}

		// Before saving
		beforeSave( getSanitizedData() )

		const response = await API.put('/settings', getSanitizedData())

		// Log('RESPONSE', response);
		// After saving
		afterSave(response)
	}

	// Discard Changes
	const discardChanges = () => {
		showModal({
			title: 'Discard all changes?',
			message: 'You are about to discard all unsaved changes. All of your settings will be reset to the point where you last saved. Are you sure you want to discard all changes?',
			confirmText: 'Yes, discard changes',
			cancelText: 'No, continue editing',
			width: '400px',
			confirm: () => {
				hideModal()
				// set state options to options one by one 
				for (const key in lastSavedOptions) {
					options.value[key] = JSON.parse(JSON.stringify(lastSavedOptions[key]))
				}

				setTimeout(() => {
					state.isChanged = false
				}, 50);
			},
		})
	}


	// Before Save
	const beforeSave = () => {
		// Reset the color presets menu
		options.value.color_presets = options.value.color_presets.map((preset) => {
			delete preset.menu
			return preset
		})

	}

	// After Save
	const afterSave = (response) => {

		// if ( ! response.success ) {
		// 	Toast.open('Failed to save the settings', 'error')
		// } 

		// Show success message
		Toast.open('Saved Successfully')

		state.isChanged = false

		updateAdminSwitcher(lastSavedOptions.admin_enabled)

	}








	// export all the functions and variables 
	return {
		isPro,
		isLocked,
		showProModal,
		state,
		setState,
		toggleSidebar,
		
		lastSavedOptions,
		options,
		createPreset,

		// modal mechanism
		modal,
		showModal,
		hideModal,

		// saving mechanism
		saveChanges,
		discardChanges,
	}
})