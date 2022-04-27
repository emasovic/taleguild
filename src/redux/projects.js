import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const projectsAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const projectsSlice = createSlice({
	name: 'projects',
	initialState: projectsAdapter.getInitialState({op: createOperations(), pages: null, total: 0}),
	reducers: {
		projectsReceieved: (state, action) => {
			projectsAdapter.setAll(state, action.payload);
		},
		projectsUpsertMany: (state, action) => {
			projectsAdapter.upsertMany(state, action.payload);
		},
		projectsUpsertOne: (state, {payload}) => {
			projectsAdapter.upsertOne(state, payload);
			state.total += 1;
		},
		projectsRemoveOne: (state, {payload}) => {
			projectsAdapter.removeOne(state, payload.id);
			state.total -= 1;
		},
		opStart: (state, {payload}) => {
			state.op[payload] = startOperation();
		},
		opEnd: (state, {payload}) => {
			state.op[payload.op] = endOperation(payload.error);
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.total = payload.total;
		},
	},
});

export const {
	loadingStart,
	loadingEnd,
	projectsReceieved,
	projectsUpsertMany,
	projectsUpsertOne,
	projectsRemoveOne,
	gotPages,
	opStart,
	opEnd,
} = projectsSlice.actions;

export const loadProjects = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getProjects(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countProjects(countParams);
		if (countRes.error) {
			return batchDispatch([
				opEnd({op, error: countRes.error}),
				newToast({...Toast.error(countRes.error)}),
			]);
		}
		return batchDispatch([
			projectsReceieved(res),
			gotPages({total: countRes, limit: params._limit}),
			opEnd({op}),
		]);
	}
	return batchDispatch([projectsUpsertMany(res), opEnd({op})]);
};

export const createOrUpdateProject = payload => async (dispatch, getState) => {
	const op = payload.id ? DEFAULT_OP.update : DEFAULT_OP.create;
	dispatch(opStart(op));

	const res = payload.id ? await api.updateProject(payload.id) : await api.createProject(payload);

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const actions = [projectsUpsertOne(res), opEnd({op})];

	return batchDispatch(actions);
};

export const deleteProject = id => async dispatch => {
	const op = DEFAULT_OP.delete;
	dispatch(opStart(op));

	const res = await api.deleteProject(id);

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const actions = [projectsRemoveOne(id), opEnd({op})];

	return batchDispatch(actions);
};

//SELECTORS

const projectsSelector = projectsAdapter.getSelectors(state => state.projects);

export const selectProjects = state => projectsSelector.selectAll(state);

export const selectProjectIds = state => projectsSelector.selectIds(state);

export const selectProject = (state, id) => projectsSelector.selectById(state, id);

export default projectsSlice.reducer;
