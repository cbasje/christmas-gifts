import { ActionTree, GetterTree, MutationTree } from 'vuex/types';
import { RootState } from '.';

import { supabase } from '../supabase';

import { Project, ProjectDetail } from '@/types/project';

interface ProjectState {
	ids: string[];
	entities: { [id: string]: Project };
	detailIds: string[];
	detailEntities: { [id: string]: ProjectDetail };
	category: string | null;
	selectedId: string | null;
}

const state = (): ProjectState => ({
	ids: [],
	entities: {},
	detailIds: [],
	detailEntities: {},
	category: null,
	selectedId: null,
});

const getters: GetterTree<ProjectState, RootState> = {
	getAllProjects(state: ProjectState) {
		return state.ids.map((id: string) => state.entities[id]);
	},
	getSelectedProject(state: ProjectState) {
		return (state.selectedId && state.entities[state.selectedId]) || null;
	},
	getSelectedProjectDetail(state: ProjectState) {
		return (
			(state.selectedId && state.detailEntities[state.selectedId]) || null
		);
	},
	getProjectsFromCategory(state: ProjectState) {
		const allProjects = state.ids.map((id: string) => state.entities[id]);
		const category = state.category;

		if (!category) {
			return allProjects;
		}

		return allProjects.filter(
			(project: Project) => project.categories.title === category
		);
	},
};

const actions: ActionTree<ProjectState, RootState> = {
	async loadProjects({ commit, dispatch }) {
		const { body, error } = await supabase
			.from<Project>('projects')
			.select(`
				*,
				categories (
					id,
					title
			  	)
			`)
			.order('date', { ascending: false });

		if (body == null) return;

		body.forEach((project: Project) => {
			dispatch('loadImage', project);
		});
		commit('saveAllProjects', body);
	},
	async loadImage({ commit }, project: Project) {
		const { data, error } = await supabase.storage
			.from('images')
			.getPublicUrl(project.image);

		if (data == null) return;
		commit('saveImage', { project, url: data.publicURL });
	},
	async loadSelectedProject({ commit, getters }) {
		commit('saveSelectedProject', getters.getSelectedProject);
	},
	// async loadProjects({ commit }) {
	// 	const response = await apiService.getProjectList();
	// 	commit('saveAllProjects', response.data);
	// },
	// async loadSelectedProject({ commit, state }) {
	// 	const response = await apiService.getProjectDetail(state.selectedId);
	// 	commit('saveSelectedProject', response.data);
	// },
};

const mutations: MutationTree<ProjectState> = {
	saveAllProjects(state: ProjectState, payload: Project[]) {
		const loadedProjects = payload;

		const projectIds = loadedProjects.map((project) => project.id);
		const projectEntities = loadedProjects.reduce(
			(entities: { [id: string]: Project }, project: Project) => {
				return { ...entities, [project.id]: project };
			},
			{}
		);

		state.ids = projectIds;
		state.entities = projectEntities;
	},
	saveImage(state: ProjectState, payload: { project: Project; url: string }) {
		state.entities[payload.project.id].url = payload.url;
	},
	saveSelectedProject(state: ProjectState, payload: ProjectDetail) {
		const project = payload;

		state.detailIds = [...state.detailIds, project.id];
		state.detailEntities = {
			...state.detailEntities,
			[project.id]: project,
		};
	},
	selectCategory(state: ProjectState, id: string) {
		state.category = id;
	},
	selectProject(state: ProjectState, id: string) {
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
