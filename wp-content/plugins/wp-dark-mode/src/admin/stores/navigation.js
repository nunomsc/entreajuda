import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
 
// The grand WP Dark Mode Store
export default defineStore('useNavigation', () => {

	const isLocked = ref( ! wp_dark_mode_admin_json.is_ultimate )

	/**
	 * Temporary State to support the UI
	 */
	const state = reactive({
		sidebarCollapsed: localStorage.getItem('wp_dark_mode_sidebar_collapsed') === 'true',
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


	// export all the functions and variables 
	return {
		isLocked,
		state,
		setState,
		toggleSidebar,
	}
})