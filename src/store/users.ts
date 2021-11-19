import { ActionTree, GetterTree, MutationTree } from 'vuex/types';
import { RootState } from '.';

import { User } from '@/types/user';
import apiService from '@/services/api.service';

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
		const { data } = await apiService.loadUsers();
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
