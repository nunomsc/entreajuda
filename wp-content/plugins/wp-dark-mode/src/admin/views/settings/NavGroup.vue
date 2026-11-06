<script setup>
import { defineProps, computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DarkModeStore from '@o/store';
import { useTranslation } from '../../composables/useTranslation';

const { state } = DarkModeStore()
const { t } = useTranslation();

const props = defineProps({
    group: {
        type: Object,
        default: () => { }
    },
    open: {
        type: Boolean,
        default: false
    }
})

const title = computed(() => {
    return props.group.title ? t(props.group.title) : ''
})
const paths = computed(() => {
    if (!props.group.paths) return []
    return Object.keys(props.group.paths).filter(i => !('hidden' in props.group.paths[i])).map(i => {
        return {
            path: i,
            name: t(props.group.paths[i].name)
        }
    })
})

const firstPath = computed(() => {
    return paths.value[0].path
})

const route = useRoute()

const isActive = (path => {
    let matchable = path ? [path] : paths ? paths.value.map(i => i.path) : []
    return matchable.includes(route.path.replace('/', '')) || matchable.forEach(i => {
        if (route.path.replace('/', '').includes(i)) return true
    })
})

const collapsed = computed(() => { 
    return state.sidebarCollapsed  && !state.isMobile
})

const isOpen = ref(isActive() || props.open)

onMounted(() => {
    setTimeout(() => {
        isOpen.value = isActive() || props.open
    }, 50)
})

</script>

<template>
    <div>
        <div v-if="!collapsed" class="wp-dark-mode-admin-sidebar-nav-container flex flex-col gal-1 dark:bg-[#2c3338] dark:text-white" 
            :class="{ 'bg-gray-50': isOpen || isActive() }">
            <div v-if="paths.length > 1" class="flex items-center justify-between cursor-pointer py-3 px-4 focus:ring rounded-lg focus:ring-blue-400 transition"
                @click.prevent="isOpen = !isOpen" tabindex="1">
                <div class="flex items-center gap-3">
                    <div v-html="props.group.icon"></div>
                    <h4 class="text-base leading-6 wp-dark-mode-white" :class="{ 'font-semibold': isActive() }" v-html="title">
                    </h4>
                </div>
                <svg class="fill-current w-2.5 text-gray-500 transition duration-100" :class="{ 'rotate-180': !isOpen }"
                    viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M0.230169 5.79062C0.528748 6.07772 1.00353 6.06841 1.29063 5.76983L5 1.83208L8.70938 5.76983C8.99647 6.06841 9.47125 6.07772 9.76983 5.79062C10.0684 5.50353 10.0777 5.02875 9.79063 4.73017L5.54063 0.230167C5.39922 0.0831084 5.20401 -9.53674e-07 5 -9.53674e-07C4.79599 -9.53674e-07 4.60078 0.0831084 4.45938 0.230167L0.209376 4.73017C-0.0777189 5.02875 -0.0684095 5.50353 0.230169 5.79062Z" />
                </svg>
            </div>
            <RouterLink v-else :to="paths[0].path"
                class="focus:outline-none flex items-center justify-between rounded-lg cursor-pointer py-3 px-4 hover:opacity-100  focus:ring focus:ring-blue-400 transition"
                @click.prevent="isOpen = !isOpen" :class="{
                    'bg-blue-100 text-blue-700 font-semibold wp-dark-mode-white': isActive(),
                    'text-gray-600 bg-transparent hover:bg-white wp-dark-mode-white': !isActive(),
                }" tabindex="1">
                <div class="flex items-center gap-3">
                    <div v-html="props.group.icon"></div>
                    <h4 class="text-base leading-6 wp-dark-mode-white" v-html="paths[0].name"></h4>
                </div>
            </RouterLink>
            <transition name="slide">
                <div class="flex flex-col pb-4 px-4 gap-1 w-full mt-2 focus:ring focus:ring-blue-400 transition" v-if="paths && paths.length > 1 && (isOpen )">
                    <RouterLink  tabindex="0" v-for="path in paths" :key="path.name" :to="path.path"
                    @click="state.showNavbar = false"
                        class="nav-item-child focus:outline-none "
                        :class="{
                            'active': isActive(path.path),
                            'inactive': !isActive(path.path),
                        }">{{ path.name }}</RouterLink>
                </div>
            </transition>
        </div>
        <RouterLink v-else :to="firstPath"  tabindex="1"  
            class="nav-item outline-none focus:outline-none my-4  focus:ring rounded-lg focus:ring-blue-400 transition"
            :class="{
                'bg-blue-100 text-blue-700 font-semibold': isActive(),
                'text-gray-600 bg-gray-50 hover:bg-white': !isActive(),
            }">
            <div v-html="props.group.icon"></div>
        </RouterLink>
    </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: all 0.1s ease;
}

.slide-enter,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.slide-enter-to,
.slide-leave {
    opacity: 1;
    transform: translateY(0);
}
</style>