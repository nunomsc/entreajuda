import { createRouter, createWebHashHistory } from 'vue-router';
import { settingsPaths } from '@o/settings-routes'


const router = () => createRouter(
	{
		history: createWebHashHistory(),
		routes: [
			{
				path: '/', component: () => import('@/settings/Layout.vue'), children: settingsPaths
			}, {
				path: '/settings/', component: () => import('@/settings/Layout.vue'), children: settingsPaths
			},
			{ path: '/get-started', component: () => import('@/GetStarted.vue') },
			{ path: '/social-share', component: () => import('@/SocialShare.vue') },
			{ path: '/tools', component: () => import('@/Tools.vue') },
			{ path: '/recommended-plugins', component: () => import('@/RecommendedPlugins.vue') },
			{ path: '/:pathMatch(.*)*', component: () => import('@/NotFound.vue'), name: 'NotFound' },
		]
	}
);

export default router;