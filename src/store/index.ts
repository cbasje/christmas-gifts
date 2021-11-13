import { createStore } from 'vuex';

import giftItemModule from './gift-items';

export const state = () => ({
	
});

export type RootState = typeof state;

const store = createStore({
	modules: {
		giftItem: giftItemModule,
	},
});

export default store;
