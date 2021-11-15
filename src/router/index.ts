import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const Overview = () => import('@/pages/Overview.vue');
const WishList = () => import('@/pages/WishList.vue');
const Login = () => import('@/pages/Login.vue');

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
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
		path: "/:catchAll(.*)",
		redirect: '/'
	}
];

const router = createRouter({
	// history: createWebHashHistory(),
	history: createWebHistory(),
	routes,
});

import store from '../store';

router.beforeEach((to, from, next) => {
	const userId = localStorage.getItem('user');

	// const user = localStorage.getItem('user');
	// if (user != null) {
	// 	this.saveCurrentUserId(user);
	// 	this.selectQuery(user);
	// }
	if (userId == null && to.path != '/login') next({ path: '/login' });
	else {
		store.commit('users/saveCurrentUserId', userId);
		store.commit('giftItem/selectQuery', userId);
		next();
	}
});

export default router;
