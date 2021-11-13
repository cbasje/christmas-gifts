import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const Overview = () => import('@/pages/Overview.vue');
const OwnList = () => import('@/pages/OwnList.vue');
const Login = () => import('@/pages/Login.vue');

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: 'overview',
	},
	{
		path: '/overview',
		component: Overview,
	},
	{
		path: '/overview/:itemId',
		component: Overview,
	},
	{
		path: '/own-list',
		component: OwnList,
	},
	{
		path: '/own-list/:itemId',
		component: OwnList,
	},
	{
		path: '/login',
		component: Login,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	// history: createWebHistory(),
	routes,
});

export default router;
