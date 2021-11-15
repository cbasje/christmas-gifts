import { ActionTree, GetterTree, MutationTree } from 'vuex/types';
import { RootState } from '.';

import axios from 'axios';

import { GiftItem, NewGiftItem } from '@/types/gift-item';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface GiftItemState {
	ids: string[];
	entities: { [id: string]: GiftItem };
	query: string | null;
	selectedId: string | null;
}

const state = (): GiftItemState => ({
	ids: [],
	entities: {},
	query: null,
	selectedId: null,
});

const getters: GetterTree<GiftItemState, RootState> = {
	getAllGiftItems(state: GiftItemState) {
		return state.ids.map((id: string) => state.entities[id]);
	},
	getSelectedGiftItem(state: GiftItemState) {
		return (state.selectedId && state.entities[state.selectedId]) || null;
	},
	getOverviewList(state: GiftItemState) {
		const allGiftItems = state.ids.map((id: string) => state.entities[id]);
		const query = state.query;

		if (!query) {
			return allGiftItems;
		}

		return allGiftItems.filter((item: GiftItem) => {
			return item.recipients.findIndex((rec) => rec == query) == -1;
		});
	},
	getWishList(state: GiftItemState) {
		const allGiftItems = state.ids.map((id: string) => state.entities[id]);
		const query = state.query;

		if (!query) {
			return allGiftItems;
		}

		return allGiftItems.filter((item: GiftItem) => {
			return item.recipients.findIndex((rec) => rec == query) !== -1;
		});
	},
};

const actions: ActionTree<GiftItemState, RootState> = {
	async loadGiftItems({ commit }) {
		const url = baseUrl + '/get-items';

		const { data } = await axios.get<GiftItem[]>(url);
		commit('saveAllGiftItems', data);
	},
	async togglePurchased(
		{ commit },
		payload: { item: GiftItem; purchased: boolean }
	) {
		commit('savePurchased', {
			id: payload.item.id,
			purchased: payload.purchased,
		});

		const url = baseUrl + '/set-purchased';

		const body = {
			id: payload.item.id,
			purchased: payload.purchased,
		};

		try {
			const { data } = await axios.post(url, JSON.stringify(body));
			commit('savePurchased', data);
		} catch (e) {
			console.error(e);
			commit('savePurchased', {
				id: payload.item.id,
				purchased: !payload.purchased,
			});
		}
	},
	async addItem({ commit }, item: NewGiftItem) {
		// FIXME
		const tempId = 'randomid';
		commit('saveNewItem', { id: tempId, ...item });

		const url = baseUrl + '/add-item';
		const axiosConfig = {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		};

		try {
			const { data } = await axios.post(
				url,
				JSON.stringify(item),
				axiosConfig
			);
			commit('saveNewItem', data);
		} catch (e) {
			console.error(e);
		}

		commit('saveRemoveItem', tempId);
	},
	async removeItem({ commit }, item: GiftItem) {
		const url = baseUrl + '/remove-item';

		try {
			const { data } = await axios.post<{ id: string }>(
				url,
				JSON.stringify(item)
			);
			commit('saveRemoveItem', data.id);
		} catch (e) {
			console.error(e);
		}
	},
};

const mutations: MutationTree<GiftItemState> = {
	saveAllGiftItems(state: GiftItemState, payload: GiftItem[]) {
		const loadedGiftItems = payload;

		const giftItemIds = loadedGiftItems.map((giftItem) => giftItem.id);
		const giftItemEntities = loadedGiftItems.reduce(
			(entities: { [id: string]: GiftItem }, giftItem: GiftItem) => {
				return { ...entities, [giftItem.id]: giftItem };
			},
			{}
		);

		state.ids = giftItemIds;
		state.entities = giftItemEntities;
	},
	selectQuery(state: GiftItemState, id: string) {
		state.query = id;
	},
	selectGiftItem(state: GiftItemState, id: string) {
		state.selectedId = id;
	},
	savePurchased(
		state: GiftItemState,
		payload: { id: string; purchased: boolean }
	) {
		state.entities[payload.id].purchased = payload.purchased;
	},
	saveNewItem(state: GiftItemState, item: GiftItem) {
		state.ids = [...state.ids, item.id];
		state.entities = {
			...state.entities,
			[item.id]: item,
		};
	},
	saveRemoveItem(state: GiftItemState, id: string) {
		const index = state.ids.indexOf(id);
		if (index != -1) state.ids.splice(index, 1);

		delete state.entities[id];
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
