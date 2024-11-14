import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {selectStory} from './story';
import {selectAuthUser} from './auth';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const userActivityAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export const userActivitySlice = createSlice({
	name: 'userActivity',
	initialState: userActivityAdapter.getInitialState({
		op: createOperations(),
		pages: null,
	}),
	reducers: {
		userActivityReceieved: (state, {payload}) => {
			userActivityAdapter.setAll(state, payload);
		},
		userActivityUpsertMany: (state, {payload}) => {
			userActivityAdapter.upsertMany(state, payload);
		},
		userActivityUpsertOne: (state, {payload}) => {
			userActivityAdapter.upsertOne(state, payload);
			state.total += 1;
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
	userActivityReceieved,
	userActivityUpsertMany,
	userActivityUpsertOne,
	gotPages,
	opStart,
	opEnd,
} = userActivitySlice.actions;

export const loadUserActivity = (params, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getActivity(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const {data, meta} = res;

	const action = !params?.pagination?.start ? userActivityReceieved : userActivityUpsertMany;

	return batchDispatch([
		action(data),
		gotPages({
			total: meta.pagination.total,
			totalNew: meta.pagination.totalNew,
			limit: meta.pagination.limit,
		}),
		opEnd({op}),
	]);
};

export const createUserActivity = payload => async (dispatch, getState) => {
	const state = getState();
	const {data} = selectAuthUser(state);
	const story = selectStory(state, payload.story);
	if (!data || !story) return null;

	const op = DEFAULT_OP.update;
	dispatch(opStart(op));
	const res = await api.createActivity(payload);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const actions = [opEnd({op})];

	res.id && actions.unshift(userActivityUpsertOne(res));
	batchDispatch(actions);
};

//SELECTORS

const userActivitySelector = userActivityAdapter.getSelectors(state => state.userActivity);

export const selectActivity = state => userActivitySelector.selectAll(state);
export const selectActivityIds = state => userActivitySelector.selectIds(state);

export default userActivitySlice.reducer;
