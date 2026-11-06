const { __ } = wp.i18n;

export const settingsRoutes = {
    controls: {
        title: __('Controls', 'wp-dark-mode'),
        icon: `<svg class="stroke-current w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M10.3428 3.94005C10.4332 3.39759 10.9026 3 11.4525 3H12.5465C13.0964 3 13.5658 3.39759 13.6562 3.94005L13.8052 4.83386C13.8759 5.25813 14.1888 5.59838 14.586 5.76332C14.9835 5.92832 15.4398 5.90629 15.79 5.65617L16.5275 5.12933C16.975 4.80969 17.5881 4.86042 17.9769 5.24929L18.7505 6.02284C19.1393 6.41171 19.1901 7.02472 18.8704 7.47223L18.3434 8.21007C18.0934 8.56012 18.0713 9.01633 18.2363 9.41363C18.4011 9.81078 18.7413 10.1236 19.1655 10.1943L20.0595 10.3433C20.6019 10.4337 20.9995 10.9031 20.9995 11.453V12.547C20.9995 13.0969 20.6019 13.5663 20.0595 13.6567L19.1656 13.8056C18.7414 13.8764 18.4011 14.1893 18.2362 14.5865C18.0712 14.9839 18.0932 15.4403 18.3433 15.7904L18.8701 16.5278C19.1897 16.9753 19.139 17.5884 18.7501 17.9772L17.9766 18.7508C17.5877 19.1396 16.9747 19.1904 16.5272 18.8707L15.7896 18.3439C15.4395 18.0938 14.9833 18.0718 14.5859 18.2367C14.1887 18.4016 13.8759 18.7418 13.8052 19.166L13.6562 20.0599C13.5658 20.6024 13.0964 21 12.5465 21H11.4525C10.9026 21 10.4332 20.6024 10.3428 20.0599L10.1939 19.1661C10.1232 18.7419 9.81023 18.4016 9.413 18.2367C9.01559 18.0717 8.55926 18.0937 8.20911 18.3438L7.47149 18.8707C7.02398 19.1904 6.41097 19.1396 6.0221 18.7507L5.24855 17.9772C4.85968 17.5883 4.80895 16.9753 5.1286 16.5278L5.65563 15.79C5.90567 15.4399 5.92772 14.9837 5.76277 14.5864C5.59788 14.1892 5.25771 13.8764 4.83353 13.8057L3.93956 13.6567C3.3971 13.5663 2.99951 13.0969 2.99951 12.547V11.453C2.99951 10.9031 3.3971 10.4337 3.93956 10.3433L4.83337 10.1944C5.25764 10.1236 5.5979 9.81071 5.76283 9.41347C5.92784 9.01605 5.9058 8.5597 5.65569 8.20954L5.12899 7.47216C4.80934 7.02465 4.86008 6.41164 5.24895 6.02277L6.0225 5.24922C6.41136 4.86036 7.02438 4.80962 7.47188 5.12927L8.20948 5.65613C8.55955 5.90618 9.01579 5.92822 9.41311 5.76326C9.81028 5.59837 10.1231 5.25819 10.1938 4.834L10.3428 3.94005Z"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path
            d="M15.0002 12C15.0002 13.6569 13.6571 15 12.0002 15C10.3434 15 9.00021 13.6569 9.00021 12C9.00021 10.3432 10.3434 9.00002 12.0002 9.00002C13.6571 9.00002 15.0002 10.3432 15.0002 12Z"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`,
        paths: {
            frontend: {
                name: __('Frontend Dark Mode', 'wp-dark-mode'),
                description: __('Settings to Control Dark Mode on your Frontend Website'),
                component: () => import('@/settings/Frontend.vue')
            },
            admin: {
                name: __('Admin Panel Dark Mode', 'wp-dark-mode'),
                description: __('Settings to Control Dark Mode on your WordPress Admin Panel'),
                component: () => import('@/settings/Admin.vue')
            }
        }
    },
    customization: {
        title: __('Customization', 'wp-dark-mode'),
        icon: ` <svg class="stroke-current w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M4.09835 19.9017C5.56282 21.3661 7.93719 21.3661 9.40165 19.9017L15.8033 13.5M6.75 21C4.67893 21 3 19.3211 3 17.25V4.125C3 3.50368 3.50368 3 4.125 3H9.375C9.99632 3 10.5 3.50368 10.5 4.125V8.1967M6.75 21C8.82107 21 10.5 19.3211 10.5 17.25V8.1967M6.75 21H19.875C20.4963 21 21 20.4963 21 19.875V14.625C21 14.0037 20.4963 13.5 19.875 13.5H15.8033M10.5 8.1967L13.3791 5.31757C13.8185 4.87823 14.5308 4.87823 14.9701 5.31757L18.6824 9.02988C19.1218 9.46922 19.1218 10.1815 18.6824 10.6209L15.8033 13.5M6.75 17.25H6.7575V17.2575H6.75V17.25Z"
            stroke="stroke-current" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`,
        paths: {
            switch: {
                name: __('Switch Settings', 'wp-dark-mode'),
                description: __('Configure the dark mode switch for your website'),
                component: () => import('@/settings/Switch.vue')
            },
            color: {
                name: __('Color Settings', 'wp-dark-mode'),
                description: __('Explore your options to get the best dark mode visual experience.'),
                component: () => import('@/settings/Color.vue'),
            },
            image: {
                name: __('Image Settings', 'wp-dark-mode'),
                description: 'Customize image appearance in Dark Mode',
                component: () => import('@/settings/Image.vue')
            },
            video: {
                name: __('Video Settings', 'wp-dark-mode'),
                description: __('Customize video appearance in Dark Mode'),
                component: () => import('@/settings/Video.vue')
            },
            animation: {
                name: __('Site Animation', 'wp-dark-mode'),
                description: __('Choose your page transition animation'),
                component: () => import('@/settings/Animation.vue')
            }
        }
    },
    advanced: {
        title: __('Advanced', 'wp-dark-mode'),
        icon: `<svg class="stroke-current w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M11.4194 15.1694L17.25 21C18.2855 22.0355 19.9645 22.0355 21 21C22.0355 19.9645 22.0355 18.2855 21 17.25L15.1233 11.3733M11.4194 15.1694L13.9155 12.1383C14.2315 11.7546 14.6542 11.5132 15.1233 11.3733M11.4194 15.1694L6.76432 20.8219C6.28037 21.4096 5.55897 21.75 4.79768 21.75C3.39064 21.75 2.25 20.6094 2.25 19.2023C2.25 18.441 2.59044 17.7196 3.1781 17.2357L10.0146 11.6056M15.1233 11.3733C15.6727 11.2094 16.2858 11.1848 16.8659 11.2338C16.9925 11.2445 17.1206 11.25 17.25 11.25C19.7353 11.25 21.75 9.23528 21.75 6.75C21.75 6.08973 21.6078 5.46268 21.3523 4.89779L18.0762 8.17397C16.9605 7.91785 16.0823 7.03963 15.8262 5.92397L19.1024 2.64774C18.5375 2.39223 17.9103 2.25 17.25 2.25C14.7647 2.25 12.75 4.26472 12.75 6.75C12.75 6.87938 12.7555 7.00749 12.7662 7.13411C12.8571 8.20956 12.6948 9.39841 11.8617 10.0845L11.7596 10.1686M10.0146 11.6056L5.90901 7.5H4.5L2.25 3.75L3.75 2.25L7.5 4.5V5.90901L11.7596 10.1686M10.0146 11.6056L11.7596 10.1686M18.375 18.375L15.75 15.75M4.86723 19.125H4.87473V19.1325H4.86723V19.125Z"
            stroke="stroke-current" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`,
        paths: {

            performance: {
                name: __('Performance', 'wp-dark-mode'),
                description: __('Configure performance settings.', 'wp-dark-mode'),
                component: () => import('@/settings/Performance.vue')
            },
            excludes: {
                name: __('Exclude Settings', 'wp-dark-mode'),
                description: __('Customize image appearance in Dark Mode', 'wp-dark-mode'),
                component: () => import('@/settings/Excludes.vue')
            },
            'custom-css': {
                name: __('Custom CSS', 'wp-dark-mode'),
                description: __('Custom CSS code to apply on dark mode or on both mode', 'wp-dark-mode'),
                component: () => import('@/settings/CustomCSS.vue')
            },
            accessibility: {
                name: __('Accessibility', 'wp-dark-mode'),
                description: __('Make your website more accessible for people with disabilities.', 'wp-dark-mode'),
                component: () => import('@/settings/Accessibility.vue')
            },
            shortcode: {
                name: __('Shortcode', 'wp-dark-mode'),
                description: __('Generate shortcodes for dark mode switches', 'wp-dark-mode'),
                component: () => import('@/settings/ShortCode.vue')
            },
            widget: {
                name: __('Switch Widget', 'wp-dark-mode'),
                description: __('Display dark mode switch using WordPress widget', 'wp-dark-mode'),
                component: () => import('@/settings/Widget.vue')
            }
        }
    },
    analytics: {
        title: __('Analytics', 'wp-dark-mode'),
        icon: `<svg class="stroke-current w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3 13.125C3 12.5037 3.50368 12 4.125 12H6.375C6.99632 12 7.5 12.5037 7.5 13.125V19.875C7.5 20.4963 6.99632 21 6.375 21H4.125C3.50368 21 3 20.4963 3 19.875V13.125Z"
            stroke="stroke-current" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path
            d="M9.75 8.625C9.75 8.00368 10.2537 7.5 10.875 7.5H13.125C13.7463 7.5 14.25 8.00368 14.25 8.625V19.875C14.25 20.4963 13.7463 21 13.125 21H10.875C10.2537 21 9.75 20.4963 9.75 19.875V8.625Z"
            stroke="stroke-current" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path
            d="M16.5 4.125C16.5 3.50368 17.0037 3 17.625 3H19.875C20.4963 3 21 3.50368 21 4.125V19.875C21 20.4963 20.4963 21 19.875 21H17.625C17.0037 21 16.5 20.4963 16.5 19.875V4.125Z"
            stroke="stroke-current" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`,
        paths: {
            analytics: {
                name: __('Analytics', 'wp-dark-mode'),
                description: __('Configure analytics settings.', 'wp-dark-mode'),
                component: () => import('@/settings/Analytics.vue')
            }
        }
    },
    aiModel: {
        title: __('AI Model', 'wp-dark-mode'),
        icon: `<svg class="fill-current w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" fill="currentColor"/>
    </svg>`,
        paths: {
            'ai-model': {
                name: __('AI Model', 'wp-dark-mode'),
                description: __('Configure AI model settings for theme generation', 'wp-dark-mode'),
                component: () => import('@/settings/AIModel.vue')
            }
        }
    },
    tools: {
        title: __('Tools', 'wp-dark-mode'),
        icon: `<svg class="stroke-current w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M11.4194 15.1694L17.25 21C18.2855 22.0355 19.9645 22.0355 21 21C22.0355 19.9645 22.0355 18.2855 21 17.25L15.1233 11.3733M11.4194 15.1694L13.9155 12.1383C14.2315 11.7546 14.6542 11.5132 15.1233 11.3733M11.4194 15.1694L6.76432 20.8219C6.28037 21.4096 5.55897 21.75 4.79768 21.75C3.39064 21.75 2.25 20.6094 2.25 19.2023C2.25 18.441 2.59044 17.7196 3.1781 17.2357L10.0146 11.6056M15.1233 11.3733C15.6727 11.2094 16.2858 11.1848 16.8659 11.2338C16.9925 11.2445 17.1206 11.25 17.25 11.25C19.7353 11.25 21.75 9.23528 21.75 6.75C21.75 6.08973 21.6078 5.46268 21.3523 4.89779L18.0762 8.17397C16.9605 7.91785 16.0823 7.03963 15.8262 5.92397L19.1024 2.64774C18.5375 2.39223 17.9103 2.25 17.25 2.25C14.7647 2.25 12.75 4.26472 12.75 6.75C12.75 6.87938 12.7555 7.00749 12.7662 7.13411C12.8571 8.20956 12.6948 9.39841 11.8617 10.0845L11.7596 10.1686M10.0146 11.6056L5.90901 7.5H4.5L2.25 3.75L3.75 2.25L7.5 4.5V5.90901L11.7596 10.1686M10.0146 11.6056L11.7596 10.1686M18.375 18.375L15.75 15.75M4.86723 19.125H4.87473V19.1325H4.86723V19.125Z"
            stroke="stroke-current" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`,
        paths: {
            tools: {
                name: __('Tools', 'wp-dark-mode'),
                description: '',
                component: () => import('@/settings/Tools.vue')
            }
        }
    }
};



// get all path: 'frontend', name, description 
export const settingsPaths = Object.values(settingsRoutes).reduce((acc, curr) => {
    // add path key 
    Object.keys(curr.paths).forEach(key => {
        curr.paths[key]  = {
            ...curr.paths[key],
            path: '/' + key
        }
    });

    return [...acc, ...Object.values(curr.paths)];
}, []);
