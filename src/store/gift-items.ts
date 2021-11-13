import { ActionTree, GetterTree, MutationTree } from 'vuex/types';
import { RootState } from '.';

import axios from 'axios';

import { GiftItem } from '@/types/gift-item';

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
	getQueryResults(state: GiftItemState) {
		const allGiftItems = state.ids.map((id: string) => state.entities[id]);
		const query = state.query;

		if (!query) {
			return allGiftItems;
		}

		return allGiftItems.filter((giftItem: GiftItem) => {
			let filter = false;
			giftItem.recipient.forEach((recipient) => {
				filter = recipient.indexOf(query) === -1;
			});
			return filter;
		});
	},
};

const actions: ActionTree<GiftItemState, RootState> = {
	async loadGiftItems({ commit }) {
		const baseUrl = '/api';
		const url = baseUrl + '/get-items';

		const { data } = await axios.get<GiftItem[]>(url);

		console.log(data);
		commit('saveAllGiftItems', data);
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
	saveImage(
		state: GiftItemState,
		payload: { giftItem: GiftItem; url: string }
	) {
		state.entities[payload.giftItem.id].url = payload.url;
	},
	selectQuery(state: GiftItemState, id: string) {
		state.query = id;
	},
	selectGiftItem(state: GiftItemState, id: string) {
		state.selectedId = id;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
