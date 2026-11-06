<script setup>
import DarkModeStore from '@o/store'

import { Card, Button } from '@components'
import { useTranslation } from '../../composables/useTranslation'

const { t } = useTranslation()
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
				title: t('invalid_file'),
				message: t('valid_file_msg'),
				confirmText: t('ok'),
				confirmBackground: '#2563EB'
			})

			return
		}

		const data = JSON.parse(e.target.result)

		// Bail, if file is not JSON
		if (typeof data !== 'object') {
			showModal({
				title: t('invalid_file'),
				message: t('valid_file_msg'),
				confirmText: t('ok'),
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
				title: t('confirm_import'),
				message: t('override_msg'),
				confirmText: t('import'),
				confirmBackground: 'blue',
				cancelText: t('cancel'),
				confirm: () => {
					setTimeout(async () => {
						const keys = Object.keys(data)
						keys.forEach(key => {
							options[key] = data[key]
						})

						await saveChanges()

						showModal({
							title: t('import_settings'),
							message: t('import_success'),
							confirmText: t('ok'),
							confirmBackground: '#2563EB'
						})
					}, 100)
				},
			})


			
		}

		// Validating the version
		if (data.version !== wp_dark_mode_admin_json.version) {
			showModal({
				title: t('version_mismatch'),
				message: t('version_incompatible'),
				confirmText: t('import_anyway'),
				cancelText: t('cancel'),
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
		title: t('reset_settings'),
		message: t('reset_confirm_msg'),
		confirmText: t('reset'),
		cancelText: t('cancel'),
		confirm: () => {
			setTimeout(() => {
				
				showModal({
					title: t('are_you_sure'),
					message: t('undo_msg'),
					confirmText: t('reset'),
					cancelText: t('cancel'),
					confirm: async () => {
						const keys = Object.keys(defaultOptions)
						keys.forEach(key => {
							options[key] = defaultOptions[key]
						})
						await saveChanges()

						setTimeout(() => {
							showModal({
								title: t('reset_settings'),
								message: t('reset_success'),
								confirmText: t('ok'),
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
	<section>
		<!-- utility tool  -->
		<Card borderless transparent class="w-full gap-8 max-w-xl [&>div]:w-full">
			<!-- Export settings  -->
			<div class="flex items-start  gap-5">
				<label class="text-sm font-medium whitespace-nowrap w-32">{{ t('export_settings') }}</label>
				<div class="flex flex-col gap-2  w-full">
					<div><Button @click.prevent="exportOptions">
						<span class="dashicons dashicons-upload"></span>
						{{ t('export') }}
					</Button></div>
					<span class="text-sm text-gray-500">{{ t('export_msg') }}</span>
				</div>
			</div>
			<!-- Import settings  -->
			<div class="flex items-start  gap-5">
				<label class="text-sm font-medium whitespace-nowrap w-32">{{ t('import_settings') }}</label>
				<div class="flex flex-col gap-2  w-full">
					<div><Button @click="$refs.importSettings.click()">
						<span class="dashicons dashicons-download"></span>
						<span>{{ t('import') }}</span>
					</Button>
					<input ref="importSettings" type="file" @input="importOptions" style="display:none"
						accept="application/JSON"></div>
					<span class="text-sm text-gray-500">{{ t('import_msg') }}</span>
				</div>
			</div>
			<!-- Reset settings  -->
			<div class="flex items-start  gap-5">
				<label class="text-sm font-medium whitespace-nowrap w-32">{{ t('reset_settings') }}</label>
				<div class="flex flex-col gap-2 w-full">
					<div><Button color="red" @click.prevent="resetOptions">
						<span class="dashicons dashicons-image-rotate w-4"></span>
						<span>{{ t('reset_settings') }}</span>
					</Button></div>
					<span class="text-sm text-gray-500">{{ t('reset_msg') }}</span>
				</div>
			</div>
		</Card>
	</section>
</template>