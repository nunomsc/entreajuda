<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { settingsPaths } from '@o/settings-routes'

import Modal from './Modal.vue'
import DarkModeStore from '@o/store'
const { modal } = DarkModeStore()


const initSubmenu = (index = 1) => {
    document.querySelectorAll('li.toplevel_page_wp-dark-mode .wp-submenu li').forEach(submenu => {
        submenu.classList.remove('current');
    });

    const target = document.querySelector(`li.toplevel_page_wp-dark-mode .wp-submenu li:nth-child(${index})`)
    if (target) target.classList.add('current');
}

// on route change  
onMounted(() => {
    useRouter().afterEach((to, from) => {

        let index = 1;

        // if route is in settings
        if (!settingsPaths.map(i => i.path).includes(to.fullPath)) {
            const hashes = [
                '/settings',
                '/get-started',
                '/social-share',
                '/tools',
                '/recommended-plugins',
            ];

            index = hashes.indexOf(to.fullPath) + 1;
        }

        initSubmenu(index + 1);
    })
})

</script>

<template>
    <div class="relative">
        <RouterView />
        <!-- modal  -->
        <transition name="smooth-open">
            <Modal v-if="modal.open"></Modal>
        </transition>
    </div>
</template>
