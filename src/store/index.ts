import { createStore } from 'vuex';

import projectModule from './projects';

export const state = () => ({
	
});

export type RootState = typeof state;

const store = createStore({
	modules: {
		projects: projectModule,
	},
});

export default store;
