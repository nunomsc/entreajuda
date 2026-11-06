import { createApp } from 'vue'
import MainApp from '@/get-started/Main.vue'
import { createRouter, createWebHashHistory } from 'vue-router';

// Global components
import Row from '@c/Row.vue'
import Heading from '@c/Heading.vue'
import Hints from '@c/Hints.vue'

(() => {
    // Bail, if #wp-dark-mode-get-started not  exists
    if( !document.getElementById( 'wp-dark-mode-get-started' ) ) return

    // Create router
    const router = createRouter(
        {
            history: createWebHashHistory(),
            routes: [
                { path: '/', component: () => import('@/get-started/GetInTouch.vue') },
                { path: '/gutenberg', component: () => import('@/get-started/Gutenberg.vue') },
                { path: '/elementor', component: () => import('@/get-started/Elementor.vue') },
                { path: '/faq', component: () => import('@/get-started/FAQ.vue') },
                { path: '/compare', component: () => import('@/get-started/Compare.vue') },
                { path: '/:pathMatch(.*)*', component: () => import('@/get-started/GetInTouch.vue') },
            ]
        }
    );

    // Create app
    const app = createApp( MainApp )

    // Plugins
    // app.use( createPinia() )
    app.use( router )

    // Mount
    app.mount( '#wp-dark-mode-get-started' )

    // Global components
    app.component( 'Row', Row )
    app.component( 'Heading', Heading )
    app.component( 'Hints', Hints )


    // Global properties
    app.config.globalProperties.DARK_MODE_IMAGE = ImagePath => {
        return `${wp_dark_mode_admin_json.url.images}${ImagePath}`
    }

    app.config.globalProperties.isLocked = !wp_dark_mode_admin_json.is_ultimate

})()
