import { createApp } from 'vue'
import MainApp from '@/notices/Main.vue'


// Global components
import Hints from '@c/Hints.vue'
import Heading from '@c/Heading.vue'
import Close from '@c/Close.vue'
import Button from '@c/Button.vue'
import Select from '@c/Select.vue'
import Row from '@c/Row.vue'

// Create app
const app = createApp( MainApp )


// Global components
app.component( 'Hints', Hints )
app.component( 'Heading', Heading )
app.component( 'Close', Close )
app.component( 'Button', Button )
app.component( 'Select', Select )
app.component( 'Row', Row )

// Mount
app.mount( '#wp-dark-mode-admin-notices' )