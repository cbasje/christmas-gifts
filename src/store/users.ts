import { ActionTree, GetterTree, MutationTree } from 'vuex/types';
import { RootState } from '.';

import { Group, User } from '@/types/user';
import apiService from '@/services/api.service';

interface UserState {
	ids: string[];
	entities: { [id: string]: User };
	groupIds: string[];
	groupEntities: { [id: string]: Group };
	currentUserId: string | null;
	currentGroupId: string | null;
}

const state = (): UserState => ({
	ids: [],
	entities: {},
	groupIds: [],
	groupEntities: {},
	currentUserId: null,
	currentGroupId: null,
});

const getters: GetterTree<UserState, RootState> = {
	getAllUsers(state: UserState) {
		return state.ids.map((id: string) => state.entities[id]);
	},
	getUserEntities(state: UserState) {
		return state.entities;
	},
	getAllGroups(state: UserState) {
		return state.groupIds.map((id: string) => state.groupEntities[id]);
	},
	getGroupEntities(state: UserState) {
		return state.groupEntities;
	},
	getCurrentUserId(state: UserState) {
		return state.currentUserId;
	},
	getCurrentUser(state: UserState) {
		return (
			(state.currentUserId && state.entities[state.currentUserId]) || null
		);
	},
	getCurrentGroupId(state: UserState) {
		return state.currentGroupId;
	},
	getCurrentGroup(state: UserState) {
		return (
			(state.currentGroupId &&
				state.groupEntities[state.currentGroupId]) ||
			null
		);
	},
};

const actions: ActionTree<UserState, RootState> = {
	async loadUsers({ commit }) {
		const { data } = await apiService.loadUsers();
		commit('saveAllUsers', data);
	},
	async loadGroups({ commit }) {
		const { data } = await apiService.loadGroups();
		commit('saveGroups', data);
	},
	async signIn({ commit, state }, password: string) {
		return new Promise<string>((resolve, reject) => {
			const result = state.ids.find((id: string) => {
				return state.entities[id].password == password;
			});
			if (result != undefined) {
				commit('saveCurrentUserId', result);

				const groups = state.entities[result].groups;
				if (groups) commit('saveCurrentGroupId', groups[0]);

				resolve(result);
			} else reject();
		});
	},
	async setGroupId({ commit, state }, name: string) {
		return new Promise<string>((resolve, reject) => {
			const result = state.groupIds.find((id: string) => {
				console.log(
					state.groupEntities[id].name.toUpperCase(),
					name.toUpperCase()
				);

				return (
					state.groupEntities[id].name.toUpperCase() ===
					name.toUpperCase()
				);
			});
			if (result != undefined) {
				commit('saveCurrentGroupId', result);
				resolve(result);
			} else reject(new Error('Not able to find the group.'));
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
	saveGroups(state: UserState, payload: Group[]) {
		const loadedGroups = payload;

		const groupIds = loadedGroups.map((group) => group.id);
		const groupEntities = loadedGroups.reduce(
			(entities: { [id: string]: Group }, group: Group) => {
				return { ...entities, [group.id]: group };
			},
			{}
		);

		state.groupIds = groupIds;
		state.groupEntities = groupEntities;
	},
	saveCurrentUserId(state: UserState, id: string) {
		state.currentUserId = id;
		localStorage.setItem('user', id);
	},
	saveCurrentGroupId(state: UserState, id: string) {
		state.currentGroupId = id;
		localStorage.setItem('group', id);
	},
	signOut(state: UserState) {
		state.currentUserId = null;
		state.currentGroupId = null;

		localStorage.removeItem('user');
		localStorage.removeItem('group');
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
