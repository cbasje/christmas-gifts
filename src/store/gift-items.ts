import { ActionTree, GetterTree, MutationTree } from 'vuex/types';
import { RootState } from '.';

import axios from 'axios';

import { GiftItem, NewGiftItem } from '@/types/gift-item';

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
		if (process.env.NODE_ENV == 'development') {
			const data = [
				{
					id: '1',
					name: 'Gift',
					notes: "Hallo, ik heb mooie cadeau's gekocht voor alle mensen in de familie. Er zijn natuurlijk veel dingen die ik heb gekocht, maar door moeilijke onderdelen zijn er interessante onderdelen.",
					price: '70-80, these are cheapest that look like they are worth anything :(',
					pic: [
						{
							url: 'https://images.unsplash.com/photo-1636949548377-1a21fb086b5a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
						},
					],
					recipients: ['2', '1'],
				},
				{
					id: '2',
					name: 'Gift2',
					notes: "Hallo, ik heb mooie cadeau's gekocht voor alle mensen in de familie. Er zijn natuurlijk veel dingen die ik heb gekocht, maar door moeilijke onderdelen zijn er interessante onderdelen. This one: [amazon.co.uk/gp/product/1350032700](https://www.amazon.co.uk/gp/product/1350032700).",
					price: '$50-70',
					link: 'https://www.etsy.com/listing/845176166/black-corset-renaissance-bodice-lace-up?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=historical+corset&ref=sr_gallery-4-12&variation0=1514586839,%20https://www.etsy.com/listing/71779680/civil-war-lined-working-corset-with?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=historical+corset&ref=sr_gallery-1-3&organic_search_click=1&variation0=663574723',
					recipients: ['2', '3'],
					purchased: true,
				},
				{
					id: '3',
					name: 'Gift3',
					price: '$50-70',
					link: 'https://www.etsy.com/listing/845176166/black-corset-renaissance-bodice-lace-up?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=historical+corset&ref=sr_gallery-4-12&variation0=1514586839,%20https://www.etsy.com/listing/71779680/civil-war-lined-working-corset-with?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=historical+corset&ref=sr_gallery-1-3&organic_search_click=1&variation0=663574723',
					recipients: ['3'],
					purchased: true,
				},
			];
			commit('saveAllGiftItems', data);
			return;
		}

		const baseUrl = '/api';
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

		const baseUrl = '/api';
		const url = baseUrl + '/set-purchased';

		const body = {
			id: payload.item.id,
			purchased: payload.purchased,
		};

		try {
			const { data } = await axios.post(url, body);
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

		const baseUrl = '/api';
		const url = baseUrl + '/add-item';

		try {
			const { data } = await axios.post(url, item);
			commit('saveNewItem', data);
		} catch (e) {
			console.error(e);
		}

		commit('saveRemoveItem', tempId);
	},
	async removeItem({ commit }, item: GiftItem) {
		const baseUrl = '/api';
		const url = baseUrl + '/remove-item';

		try {
			const { data } = await axios.post<{ id: string }>(url, item);
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
