/**
 * WP Dark Mode Social Share - Admin Settings Screen
 * Migrated from Alpine.js to Vue 3 + Pinia, matching the conventions used by the
 * rest of the admin app (src/admin/). See ai-docs/social-share-vue-migration/.
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './upgrade';
import App from './admin/App.vue';
import { vTooltip } from './admin/tooltip-directive';
import { vEditable } from './admin/editable-directive';

const app = createApp( App );

app.use( createPinia() );
app.directive( 'tooltip', vTooltip );
app.directive( 'editable', vEditable );

app.mount( '#wp-dark-mode-social-share' );
