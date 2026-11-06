<script setup>
import DarkModeStore from '@o/store'
const { options, lastSavedOptions, saveChanges, showModal } = DarkModeStore()

const defaultOptions = {}
Object.keys(wp_dark_mode_admin_json.default).forEach(sectionKey => {
	const sectionValue = wp_dark_mode_admin_json.default[sectionKey]
	Object.keys(sectionValue).forEach(optionKey => {
		defaultOptions[sectionKey + '_' + optionKey] = sectionValue[optionKey].default
	})
})

const exportOptions = () => {

	// Adding validation
	lastSavedOptions.configuration = 'WPDarkMode'
	lastSavedOptions.version = wp_dark_mode_admin_json.version

	const data = JSON.stringify(lastSavedOptions, null, 2)

	const blob = new Blob([data], { type: 'application/json' })
	const a = document.createElement('a')
	a.href = URL.createObjectURL(blob)
	a.download = 'wp-dark-mode-settings-' + wp_dark_mode_admin_json.version + '.json'
	a.click()

}

const importOptions = (e) => {
	const file = e.target.files[0]

	// remove the file from the input
	e.target.value = ''

	const reader = new FileReader()
	reader.onload = (e) => {

		// Bail, if file is not JSON
		if (file.type !== 'application/json') {
			showModal({
				title: 'Invalid File',
				message: 'Please upload a valid file.',
				confirmText: 'Ok',
				confirmBackground: '#2563EB'
			})

			return
		}

		const data = JSON.parse(e.target.result)

		// Bail, if file is not JSON
		if (typeof data !== 'object') {
			showModal({
				title: 'Invalid File',
				message: 'Please upload a valid file.',
				confirmText: 'Ok',
				confirmBackground: '#2563EB'
			})

			return
		}

		// Validating the file
		if (data.configuration !== 'WPDarkMode') {
			showModal({
				title: 'Invalid File',
				message: 'Please upload a valid file.',
				confirmText: 'Ok',
				confirmBackground: '#2563EB'
			})

			return
		}

		const runImport = async () => {

			showModal({
				title: 'Are you sure want to import?',
				message: 'This will override all your current settings.',
				confirmText: 'Import',
				confirmBackground: 'blue',
				cancelText: 'Cancel',
				confirm: () => {
					setTimeout(async () => {
						const keys = Object.keys(data)
						keys.forEach(key => {
							options[key] = data[key]
						})

						await saveChanges()

						showModal({
							title: 'Import Settings',
							message: 'Settings imported successfully.',
							confirmText: 'Ok',
				confirmBackground: '#2563EB'
						})
					}, 100)
				},
			})


			
		}

		// Validating the version
		if (data.version !== wp_dark_mode_admin_json.version) {
			showModal({
				title: 'Version Mismatch',
				message: 'The version of the file you are trying to import is not compatible with the current version of WP Dark Mode.',
				confirmText: 'Import Anyway',
				cancelText: 'Cancel',
				confirm: runImport,
			})

			return
		}

		runImport()
	}
	reader.readAsText(file)
}


const resetOptions = () => {
	showModal({
		title: 'Reset Settings',
		message: 'Are you sure you want to reset all settings to default? We suggest you to export current settings before you reset the settings.',
		confirmText: 'Reset',
		cancelText: 'Cancel',
		confirm: () => {
			setTimeout(() => {
				
				showModal({
					title: 'Are you sure?',
					message: 'This action cannot be undone.',
					confirmText: 'Reset',
					cancelText: 'Cancel',
					confirm: async () => {
						const keys = Object.keys(defaultOptions)
						keys.forEach(key => {
							options[key] = defaultOptions[key]
						})
						await saveChanges()

						setTimeout(() => {
							showModal({
								title: 'Reset Settings',
								message: 'Settings reset successfully.',
								confirmText: 'Ok',
				confirmBackground: '#2563EB'
							})
						}, 100)
					},
				})
			}, 100)
		},
	})
}


</script>

<template>
	<div class="wp-dark-mode-admin-tools">
		<!-- utility ?Exporttitle  -->
		<div class="section-title">
			<span class="dashicons dashicons-admin-tools"> </span>
			<h3>WP Dark Mode Tools</h3>
		</div>
		<!-- utility tool  -->
		<div class="section-body">
			<!-- Export settings  -->
			<div class="__form-group">
				<label for="" class="__form-label">Export Settings</label>
				<div class="__form-content">
					<button class="button button-primary button-large" @click.prevent="exportOptions">
						<span class="dashicons dashicons-upload"></span>
						<span>Export</span>
					</button>
					<div class="__form-text">Export current settings as JSON file.</div>
				</div>
			</div>
			<!-- Import settings  -->
			<div class="__form-group">
				<label for="" class="__form-label">Import Settings</label>
				<div class="__form-content">
					<label for='wp-dark-mode-import-settings' class="button button-primary button-large">
						<input id='wp-dark-mode-import-settings' type="file" @input="importOptions" style="display:none"
							accept="application/JSON">
						<span class="dashicons dashicons-download"></span>
						<span>Import</span>
					</label>
					<div class="__form-text">Import settings from JSON file which is exported through WP Dark Mode.</div>
				</div>
			</div>
			<!-- Reset settings  -->
			<div class="__form-group">
				<label for="" class="__form-label">Reset Settings</label>
				<div class="__form-content">
					<button class="button button-danger button-large" @click.prevent="resetOptions">
						<span class="dashicons dashicons-image-rotate"></span>
						<span>Reset Settings</span>
					</button>
					<div class="__form-text">Reset all settings to default. We recommend to export current settings before
						you reset the settings.</div>
				</div>
			</div>
		</div>
	</div>
</template>