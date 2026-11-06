import { createApp } from 'vue'
import MainApp from './views/Main.vue'
import { createPinia } from 'pinia'
import router from '@o/router.js'

import './other/get-started.js'

// Global components
import Row from '@c/Row.vue'
import Card from '@c/Card.vue'
import Toggle from '@c/Toggle.vue'
import Hints from '@c/Hints.vue'
import Heading from '@c/Heading.vue'
import Suggestions from '@c/Suggestions.vue'
import UpgradeFooter from '@c/UpgradeFooter.vue'
import Close from '@c/Close.vue'
import ProBadge from '@c/ProBadge.vue'

// Internationalization 
const { __ } = wp.i18n;

// Create app
const app = createApp( MainApp )

// Plugins
app.use( createPinia() )
app.use( router() )


// Global components
app.component( 'Row', Row )
app.component( 'Card', Card )
// app.component( 'Button', Button )
app.component( 'Toggle', Toggle )
app.component( 'Hints', Hints )
app.component( 'Heading', Heading )
app.component( 'Suggestions', Suggestions )
app.component( 'UpgradeFooter', UpgradeFooter )
app.component( 'Close', Close )
app.component( 'ProBadge', ProBadge )

// Mount
app.mount( '#wp-dark-mode-admin' )

// Global properties
app.config.globalProperties.DARK_MODE_IMAGE = ImagePath => {
    return `${wp_dark_mode_admin_json.url.images}${ImagePath}`
}

// Default options.
app.config.globalProperties.$default = wp_dark_mode_admin_json.default

// Internationalization
app.config.globalProperties.__ = __
