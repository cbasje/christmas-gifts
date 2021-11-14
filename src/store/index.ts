import { createStore } from 'vuex';

import giftItemModule from './gift-items';
import usersModule from './users';

export const state = () => ({});

export type RootState = typeof state;

const store = createStore({
	modules: {
		giftItem: giftItemModule,
		users: usersModule,
	},
});

export default store;
