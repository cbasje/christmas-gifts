import { ActionTree, GetterTree, MutationTree } from 'vuex/types';
import { RootState } from '.';

import axios from 'axios';

import { User } from '@/types/user';

interface UserState {
	ids: string[];
	entities: { [id: string]: User };
	currentUserId: string | null;
}

const state = (): UserState => ({
	ids: [],
	entities: {},
	currentUserId: null,
});

const getters: GetterTree<UserState, RootState> = {
	getAllUsers(state: UserState) {
		return state.ids.map((id: string) => state.entities[id]);
	},
	getUserEntities(state: UserState) {
		return state.entities;
	},
	getCurrentUserId(state: UserState) {
		return state.currentUserId;
	},
	getCurrentUser(state: UserState) {
		return (
			(state.currentUserId && state.entities[state.currentUserId]) || null
		);
	},
};

const actions: ActionTree<UserState, RootState> = {
	async loadUsers({ commit }) {
		if (process.env.NODE_ENV == 'development') {
			const data = [
				{
					id: '1',
					name: 'Recipient',
					password: 'rep123',
					color: '#CFDFFF',
					colorDark: '#102046',
				},
				{
					id: '2',
					name: 'Recipient2',
					password: 'rep23',
					color: '#D0F0FD',
					colorDark: '#04283F',
				},
				{
					id: '3',
					name: 'Recipient3',
					password: 'rep3',
					color: '#C1F5E9',
					colorDark: '#012524',
				},
			];
			commit('saveAllUsers', data);
			return;
		}

		const baseUrl = '/api';
		const url = baseUrl + '/get-users';

		const { data } = await axios.get<User[]>(url);
		commit('saveAllUsers', data);
	},
	async signIn({ commit, state }, password: string) {
		return new Promise<string>((resolve, reject) => {
			const result = state.ids.find((id: string) => {
				return state.entities[id].password == password;
			});
			if (result != undefined) {
				commit('saveCurrentUserId', result);
				resolve(result);
			} else reject();
		});
	},
};

const mutations: MutationTree<UserState> = {
	saveAllUsers(state: UserState, payload: User[]) {
		const loadedUsers = payload;

		const userIds = loadedUsers.map((user) => user.id);
		const userEntities = loadedUsers.reduce(
			(entities: { [id: string]: User }, user: User) => {
				return { ...entities, [user.id]: user };
			},
			{}
		);

		state.ids = userIds;
		state.entities = userEntities;
	},
	saveCurrentUserId(state: UserState, id: string) {
		state.currentUserId = id;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
