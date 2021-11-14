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
				filter = recipient.name.indexOf(query) === -1;
			});
			return filter;
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
					recipient: [
						{
							id: '1',
							name: 'Recipient',
							color: '#CFDFFF',
							colorDark: '#102046',
						},
					],
				},
				{
					id: '2',
					name: 'Gift2',
					notes: "Hallo, ik heb mooie cadeau's gekocht voor alle mensen in de familie. Er zijn natuurlijk veel dingen die ik heb gekocht, maar door moeilijke onderdelen zijn er interessante onderdelen.",
					price: '$50-70',
					link: 'https://www.etsy.com/listing/845176166/black-corset-renaissance-bodice-lace-up?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=historical+corset&ref=sr_gallery-4-12&variation0=1514586839,%20https://www.etsy.com/listing/71779680/civil-war-lined-working-corset-with?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=historical+corset&ref=sr_gallery-1-3&organic_search_click=1&variation0=663574723',
					recipient: [
						{
							id: '2',
							name: 'Recipient2',
							color: '#D0F0FD',
							colorDark: '#04283F',
						},
						{
							id: '3',
							name: 'Recipient3',
							color: '#C1F5E9',
							colorDark: '#012524',
						},
					],
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
		const baseUrl = '/api';
		const url = baseUrl + '/set-purchased';

		const body = {
			id: payload.item.id,
			purchased: payload.purchased,
		};

		const { data } = await axios.post<{ id: string; purchased: boolean }>(
			url,
			body
		);
		console.log(data);

		commit('savePurchased', data);
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
	savePurchased(
		state: GiftItemState,
		payload: { id: string; purchased: boolean }
	) {
		state.entities[payload.id].purchased = payload.purchased;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
