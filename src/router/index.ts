import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const Overview = () => import('@/pages/Overview.vue');
const WishList = () => import('@/pages/WishList.vue');
const Login = () => import('@/pages/Login.vue');

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/overview',
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
		path: '/wish-list',
		component: WishList,
	},
	{
		path: '/wish-list/:itemId',
		component: WishList,
	},
	{
		path: '/login',
		component: Login,
	},
	{
		path: '/:catchAll(.*)',
		redirect: '/',
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	// history: createWebHistory(),
	routes,
});

import store from '../store';

router.beforeEach((to, from, next) => {
	const userId = localStorage.getItem('user');
	const groupId = localStorage.getItem('group');

	if (userId == null && to.path != '/login') next({ path: '/login' });
	else {
		store.commit('users/saveCurrentUserId', userId);
		store.commit('users/saveCurrentGroupId', groupId);
		store.commit('giftItem/saveCurrentUserId', userId);
		store.commit('giftItem/saveCurrentGroupId', groupId);
		next();
	}
});

export default router;
