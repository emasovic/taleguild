import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const userActivityAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const userActivitySlice = createSlice({
	name: 'userActivity',
	initialState: userActivityAdapter.getInitialState({
		op: null,
		pages: null,
	}),
	reducers: {
		userActivityReceieved: (state, {payload}) => {
			userActivityAdapter.setAll(state, payload);
			state.op = null;
		},
		userActivityUpsertMany: (state, {payload}) => {
			userActivityAdapter.upsertMany(state, payload);
			state.op = null;
		},
		userActivityUpsertOne: (state, {payload}) => {
			userActivityAdapter.upsertOne(state, payload);
			state.op = null;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
		opStart: (state, {payload}) => {
			state.op = payload;
		},
		opEnd: state => {
			state.op = null;
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / 10);
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

export const loadUserActivity = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getActivity(params);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countActivity(countParams);
		if (countRes.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}

		dispatch(gotPages(countRes));
		return dispatch(userActivityReceieved(res));
	}

	return dispatch(userActivityUpsertMany(res));
};

export const createUserActivity = payload => async dispatch => {
	dispatch(opStart(DEFAULT_OP.update));
	const res = await api.createActivity(payload);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	return dispatch(userActivityUpsertOne(res));
};

//SELECTORS

const userActivitySelector = userActivityAdapter.getSelectors(state => state.userActivity);

export const selectActivity = state => userActivitySelector.selectAll(state);
export const selectActivityIds = state => userActivitySelector.selectIds(state);

export default userActivitySlice.reducer;
