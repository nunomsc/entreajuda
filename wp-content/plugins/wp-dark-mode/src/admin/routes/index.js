import { createRouter, createWebHashHistory } from 'vue-router';
import { settingsPaths } from '@o/settings-routes'


const router = () => createRouter(
	{
		history: createWebHashHistory(),
		routes: [
			{
				path: '/', component: () => import('@/settings/Layout.vue'), children: settingsPaths
			},
		]
	}
);

export default router;