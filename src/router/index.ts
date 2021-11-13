import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const Category = () => import('@/pages/Category.vue');
const CategoryItem = () => import('@/pages/CategoryItem.vue');
const Contact = () => import('@/pages/Contact.vue');

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: 'work',
	},
	{
		path: '/:categoryId',
		component: Category,
	},
	{
		path: '/:categoryId/:projectId',
		component: CategoryItem,
	},
	{
		path: '/contact',
		component: Contact,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	// history: createWebHistory(),
	routes,
});

export default router;
